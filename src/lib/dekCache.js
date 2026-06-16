/**
 * DEK のブラウザキャッシュ層。
 *
 * 仕組み:
 *   - 端末鍵(deviceKey.js, IndexedDB に保存) で DEK をラップ
 *   - ラップ済バイト列を localStorage に保存(user_id でスコープ)
 *   - 再ロード時に localStorage → IDB の順で参照し、DEK を再構築
 *
 * TTL:
 *   既定 30 日。期限切れキャッシュは自動破棄される。
 *
 * クリアタイミング:
 *   - 明示的ログアウト
 *   - 自動ロック(無操作タイムアウト)
 *   - パスフレーズ変更/リセット時(useAuth 側で呼ぶ)
 */

import { getOrCreateDeviceKey } from './deviceKey.js'

const TTL_MS    = 30 * 24 * 60 * 60 * 1000 // 30日
const IV_LENGTH = 12
const PREFIX    = 'portal:dek:'

/* ---------- localStorage key ---------- */
const storageKey = (userId) => `${PREFIX}${userId}`

/* ---------- base64 helpers ---------- */
function bytesToB64(bytes) {
  let s = ''
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i])
  return btoa(s)
}
function b64ToBytes(b64) {
  const s = atob(b64)
  const out = new Uint8Array(s.length)
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i)
  return out
}

/**
 * DEK を端末鍵でラップして localStorage に保存
 *
 * @param {string} userId
 * @param {CryptoKey} dek - extractable: true の AES-GCM 鍵
 */
export async function cacheDEK(userId, dek) {
  if (!userId || !dek) return
  try {
    const deviceKey = await getOrCreateDeviceKey()
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH))
    const wrapped = await crypto.subtle.wrapKey('raw', dek, deviceKey, {
      name: 'AES-GCM', iv,
    })
    const payload = {
      v: 1,
      iv: bytesToB64(iv),
      wrapped: bytesToB64(new Uint8Array(wrapped)),
      expiresAt: Date.now() + TTL_MS,
    }
    localStorage.setItem(storageKey(userId), JSON.stringify(payload))
  } catch (e) {
    // IndexedDB がプライベートブラウジングで使えないことがある等は無視
    console.warn('DEK キャッシュ保存に失敗(動作には影響なし):', e)
  }
}

/**
 * localStorage + 端末鍵から DEK を取り戻す。
 * 期限切れ・存在しない・端末鍵がない場合は null。
 *
 * @param {string} userId
 * @returns {Promise<CryptoKey | null>}
 */
export async function restoreDEK(userId) {
  if (!userId) return null
  const raw = localStorage.getItem(storageKey(userId))
  if (!raw) return null

  let payload
  try { payload = JSON.parse(raw) } catch { return null }

  if (!payload || payload.v !== 1) return null
  if (payload.expiresAt && payload.expiresAt < Date.now()) {
    localStorage.removeItem(storageKey(userId))
    return null
  }

  try {
    const deviceKey = await getOrCreateDeviceKey()
    const iv      = b64ToBytes(payload.iv)
    const wrapped = b64ToBytes(payload.wrapped)
    return await crypto.subtle.unwrapKey(
      'raw',
      wrapped,
      deviceKey,
      { name: 'AES-GCM', iv },
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    )
  } catch {
    // 端末鍵を失った/書き換えられた等 → キャッシュは無効なので消す
    localStorage.removeItem(storageKey(userId))
    return null
  }
}

/**
 * 特定ユーザーのキャッシュを削除
 */
export function clearCachedDEK(userId) {
  if (!userId) return
  localStorage.removeItem(storageKey(userId))
}

/**
 * 全ユーザーのキャッシュを削除(任意)
 */
export function clearAllCachedDEK() {
  const keys = []
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k && k.startsWith(PREFIX)) keys.push(k)
  }
  keys.forEach((k) => localStorage.removeItem(k))
}
