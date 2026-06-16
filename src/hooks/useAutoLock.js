import { useEffect, useRef } from 'react'

/**
 * 自動ロックフック
 *
 * 動作:
 *   - 一定時間ユーザー操作がないと lock() を呼ぶ(タイムアウト)
 *   - バックグラウンドから戻ってきたとき、期限切れなら即ロック
 *
 * タブ閉じ時は lock() を呼ばない。これにより端末キャッシュ(localStorage)に
 * ラップ済 DEK が残り、同じブラウザで再訪すればパスフレーズなしで解錠される。
 *
 * 「操作」の検知対象:
 *   mousemove, keydown, click, touchstart, scroll
 *
 * @param {() => void} lock        - useAuth().lock を渡す
 * @param {object} [opts]
 * @param {number}  [opts.idleMs=3600000]   - 無操作タイムアウト(既定60分)
 * @param {boolean} [opts.enabled=true]     - false でフック自体を無効化
 * @param {(remainingMs:number)=>void} [opts.onTick] - 任意: 残り時間通知(警告UI用)
 */
export function useAutoLock(lock, { idleMs = 60 * 60 * 1000, enabled = true, onTick } = {}) {
  const timerRef    = useRef(null)
  const expiresRef  = useRef(0)
  const lockRef     = useRef(lock)
  const onTickRef   = useRef(onTick)

  // 最新の lock / onTick を ref に保持(再購読を避けるため)
  lockRef.current   = lock
  onTickRef.current = onTick

  useEffect(() => {
    if (!enabled) return

    function fire() {
      lockRef.current?.()
    }

    function reset() {
      if (timerRef.current) clearTimeout(timerRef.current)
      expiresRef.current = Date.now() + idleMs
      timerRef.current = setTimeout(fire, idleMs)
      onTickRef.current?.(idleMs)
    }

    function onActivity() {
      reset()
    }

    function onVisibility() {
      // バックグラウンド復帰時に「ロックすべきだったか」を確認
      if (document.visibilityState === 'visible') {
        if (Date.now() >= expiresRef.current) fire()
        else reset()
      }
    }

    const events = ['mousemove', 'keydown', 'click', 'touchstart', 'scroll']
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }))
    document.addEventListener('visibilitychange', onVisibility)

    reset()

    return () => {
      events.forEach((e) => window.removeEventListener(e, onActivity))
      document.removeEventListener('visibilitychange', onVisibility)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [enabled, idleMs])
}
