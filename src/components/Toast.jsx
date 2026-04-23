import { useState, useCallback } from 'react'

/**
 * トースト通知の hook
 * @returns {{ toasts, showToast }}
 */
export function useToast() {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'error') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  return { toasts, showToast }
}

/**
 * トースト表示コンポーネント(画面右下固定)
 */
export function ToastContainer({ toasts }) {
  return (
    <div className="fixed bottom-20 md:bottom-4 right-4 flex flex-col gap-2 z-50">
      {toasts.map(({ id, message, type }) => (
        <div
          key={id}
          className={`rounded-lg px-4 py-3 text-sm text-white shadow-lg max-w-xs ${
            type === 'error'   ? 'bg-red-600' :
            type === 'success' ? 'bg-green-700' :
            'bg-gray-700'
          }`}
        >
          {message}
        </div>
      ))}
    </div>
  )
}
