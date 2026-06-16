/**
 * クライアントサイド暗号化ユーティリティ
 *
 * 設計:
 *   - AES-GCM 256bit で対称暗号化
 *   - 鍵はユーザーのパスフレーズから PBKDF2 (200k iterations, SHA-256) で派生
 *   - 暗号文の先頭 12 byte は IV、残りが ciphertext+tag
 *   - 派生用の salt はユーザーごとに 1 度生成し profiles テーブルに保存
 *
 * 重要:
 *   - 派生した CryptoKey は extractable: false で生成し、外部に書き出さない
 *   - sessionStorage には鍵そのものではなく "ロック解除済みフラグ" のみ置き、
 *     鍵オブジェクトはモジュールスコープのメモリに保持する
 *   - パスフレーズを忘れた場合は復号不能。リカバリーコード機能で二重ラップする
 *     ことを推奨(本ファイルではコア API のみ提供)
 */

const PBKDF2_ITERATIONS = 200_000
const KEY_LENGTH = 256
const IV_LENGTH = 12

const enc = new TextEncoder()
const dec = new TextDecoder()

/* ---------- 鍵派生 ---------- */

/**
 * パスフレーズと salt から AES-GCM 鍵を派生する
 * @param {string} passphrase
 * @param {Uint8Array} salt - 16 byte 推奨
 * @returns {Promise<CryptoKey>}
 */
export async function deriveKey(passphrase, salt) {
  if (!passphrase) throw new Error('passphrase が空です')
  if (!(salt instanceof Uint8Array) || salt.length < 16) {
    throw new Error('salt は 16 byte 以上の Uint8Array で指定してください')
  }

  const baseKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: KEY_LENGTH },
    false, // extractable: false — メモリ外への書き出し禁止
    ['encrypt', 'decrypt', 'wrapKey', 'unwrapKey'] // KEK としても使えるようにする
  )
}

/**
 * KEK(Key Encryption Key) を派生する。deriveKey の別名。
 * 「これは KEK である」というコード上の意図を明確にするためのエイリアス。
 */
export async function deriveKEK(passphrase, salt) {
  return deriveKey(passphrase, salt)
}

/**
 * ランダムな DEK(Data Encryption Key) を生成する。
 * extractable: true にしておくことで wrapKey/unwrapKey の対象にできる。
 */
export async function generateDEK() {
  return crypto.subtle.generateKey(
    { name: 'AES-GCM', length: KEY_LENGTH },
    true,
    ['encrypt', 'decrypt']
  )
}

/**
 * DEK を KEK でラップする。
 * 戻り値は IV(12) + wrapped_ciphertext+tag を連結した Uint8Array。
 *
 * @param {CryptoKey} dek
 * @param {CryptoKey} kek
 * @returns {Promise<Uint8Array>}
 */
export async function wrapDEK(dek, kek) {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH))
  const wrapped = await crypto.subtle.wrapKey('raw', dek, kek, { name: 'AES-GCM', iv })
  const combined = new Uint8Array(IV_LENGTH + wrapped.byteLength)
  combined.set(iv, 0)
  combined.set(new Uint8Array(wrapped), IV_LENGTH)
  return combined
}

/**
 * wrapDEK の出力を復号して DEK CryptoKey に戻す。
 *
 * @param {Uint8Array} bytes
 * @param {CryptoKey} kek
 * @returns {Promise<CryptoKey>}
 */
export async function unwrapDEK(bytes, kek) {
  if (!(bytes instanceof Uint8Array)) bytes = new Uint8Array(bytes)
  if (bytes.length < IV_LENGTH + 1) throw new Error('ラップされた DEK が短すぎます')

  const iv = bytes.slice(0, IV_LENGTH)
  const wrapped = bytes.slice(IV_LENGTH)
  return crypto.subtle.unwrapKey(
    'raw',
    wrapped,
    kek,
    { name: 'AES-GCM', iv },
    { name: 'AES-GCM', length: KEY_LENGTH },
    true,  // 後で再ラップ(パスフレーズ変更時)できるよう extractable
    ['encrypt', 'decrypt']
  )
}

/* ---------- リカバリーコード ---------- */

// Crockford-ish base32(視認性のため 0,1,O,I を除外)
const RECOVERY_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ' // 32 chars (5 bits)

/**
 * 約 100 bit のエントロピーを持つリカバリーコードを生成する。
 * 形式: XXXXX-XXXXX-XXXXX-XXXXX (5文字 × 4 グループ = 20文字)
 *
 * @returns {string}
 */
export function generateRecoveryCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(13)) // 13 * 8 = 104 bits
  let bits = 0
  let bitCount = 0
  let out = ''
  for (let i = 0; i < bytes.length && out.length < 20; i++) {
    bits = (bits << 8) | bytes[i]
    bitCount += 8
    while (bitCount >= 5 && out.length < 20) {
      bitCount -= 5
      const idx = (bits >> bitCount) & 0x1f
      out += RECOVERY_ALPHABET[idx]
    }
  }
  return `${out.slice(0, 5)}-${out.slice(5, 10)}-${out.slice(10, 15)}-${out.slice(15, 20)}`
}

/**
 * ユーザー入力されたリカバリーコードを正規化する。
 * 大文字化 / 区切り文字や空白の除去 / 紛らわしい文字 O→0,I→1 は許容しない方針
 * (アルファベットに含まれないため自然に拒否される)。
 *
 * @param {string} input
 * @returns {string} 区切りなし大文字、20文字想定
 */
export function normalizeRecoveryCode(input) {
  return String(input ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '')
}

/**
 * 新規ユーザー用に 16 byte の salt を生成する
 * @returns {Uint8Array}
 */
export function generateSalt() {
  return crypto.getRandomValues(new Uint8Array(16))
}

/* ---------- 暗号化 / 復号 ---------- */

/**
 * 任意の JSON シリアライズ可能オブジェクトを暗号化する
 * 戻り値は IV(12) + ciphertext+tag を連結した Uint8Array
 *
 * @param {CryptoKey} key
 * @param {*} obj
 * @returns {Promise<Uint8Array>}
 */
export async function encryptJSON(key, obj) {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH))
  const plaintext = enc.encode(JSON.stringify(obj))
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    plaintext
  )

  const combined = new Uint8Array(IV_LENGTH + ciphertext.byteLength)
  combined.set(iv, 0)
  combined.set(new Uint8Array(ciphertext), IV_LENGTH)
  return combined
}

/**
 * encryptJSON の出力を復号して元のオブジェクトを返す
 *
 * @param {CryptoKey} key
 * @param {Uint8Array} bytes
 * @returns {Promise<any>}
 */
export async function decryptJSON(key, bytes) {
  if (!(bytes instanceof Uint8Array)) bytes = new Uint8Array(bytes)
  if (bytes.length < IV_LENGTH + 1) throw new Error('暗号文が短すぎます')

  const iv = bytes.slice(0, IV_LENGTH)
  const ciphertext = bytes.slice(IV_LENGTH)
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  )
  return JSON.parse(dec.decode(plaintext))
}

/* ---------- Supabase bytea との相互変換 ---------- */

/**
 * Supabase の bytea カラムは select 時に "\\xDEADBEEF..." 形式の hex 文字列で
 * 返るため、Uint8Array に戻すヘルパー。insert 時は Uint8Array をそのまま
 * 渡せば supabase-js が自動で bytea にシリアライズする。
 *
 * @param {string | Uint8Array | ArrayBuffer | null | undefined} value
 * @returns {Uint8Array}
 */
export function toBytes(value) {
  if (value == null) return new Uint8Array()
  if (value instanceof Uint8Array) return value
  if (value instanceof ArrayBuffer) return new Uint8Array(value)
  if (typeof value === 'string') {
    // "\\x..." prefix を除去
    const hex = value.startsWith('\\x') ? value.slice(2) : value
    if (hex.length % 2 !== 0) throw new Error('不正な hex 文字列です')
    const out = new Uint8Array(hex.length / 2)
    for (let i = 0; i < out.length; i++) {
      out[i] = parseInt(hex.substr(i * 2, 2), 16)
    }
    return out
  }
  // base64 など想定外の形式
  throw new Error(`bytea の形式を判別できません: ${typeof value}`)
}

/**
 * Uint8Array を Supabase bytea として insert 可能な形式に変換する。
 * supabase-js v2 は Uint8Array を直接 bytea に流せるため、通常は不要。
 * 明示的に hex 文字列にしたい場合のみ使用。
 *
 * @param {Uint8Array} bytes
 * @returns {string}
 */
export function bytesToHex(bytes) {
  return (
    '\\x' +
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  )
}
