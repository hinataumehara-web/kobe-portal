/**
 * 端末固有の AES-GCM 鍵を IndexedDB に保管するヘルパー。
 *
 * 用途:
 *   ユーザーの DEK を「同じブラウザでは再ログイン不要」にするため、
 *   端末固有鍵で DEK をラップして localStorage に保管する。
 *
 * セキュリティ性質:
 *   - extractable: false で生成するため subtle.exportKey はできない
 *   - 同一オリジン内の JS からのみ wrapKey/unwrapKey で利用可能
 *   - 端末のファイルシステムを直接読まれた場合、IndexedDB の中身は
 *     技術上は読まれうるが、CryptoKey は素のバイト列としては取り出せない
 *   - 「端末を奪われたら負け」というレベルの保護。Supabase 管理者には
 *     依然として中身は見えない
 */

const DB_NAME    = 'portal-secure'
const DB_VERSION = 1
const STORE      = 'keys'
const KEY_NAME   = 'device-dek-wrap'

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB が利用できません'))
      return
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE)
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror   = () => reject(req.error)
  })
}

async function idbGet(name) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).get(name)
    req.onsuccess = () => resolve(req.result ?? null)
    req.onerror   = () => reject(req.error)
  })
}

async function idbPut(name, value) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(value, name)
    tx.oncomplete = () => resolve()
    tx.onerror    = () => reject(tx.error)
  })
}

async function idbDelete(name) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete(name)
    tx.oncomplete = () => resolve()
    tx.onerror    = () => reject(tx.error)
  })
}

/**
 * 端末鍵を取得(なければ生成して保存)。
 * @returns {Promise<CryptoKey>}
 */
export async function getOrCreateDeviceKey() {
  const existing = await idbGet(KEY_NAME)
  if (existing) return existing

  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    false, // extractable: false
    ['wrapKey', 'unwrapKey', 'encrypt', 'decrypt']
  )
  await idbPut(KEY_NAME, key)
  return key
}

/**
 * 端末鍵を削除(別ユーザーが使い始める時など)。
 */
export async function clearDeviceKey() {
  try { await idbDelete(KEY_NAME) } catch { /* idempotent */ }
}
