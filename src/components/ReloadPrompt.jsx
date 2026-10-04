// src/components/ReloadPrompt.jsx
import { useRegisterSW } from 'virtual:pwa-register/react'

export default function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      // فحص التحديثات كل ساعة (اختياري)
      if (r) {
        setInterval(async () => {
          if (!(!r.installing && navigator)) return
          if ('connection' in navigator && !navigator.onLine) return
          const resp = await fetch(swUrl, {
            cache: 'no-store',
            headers: { cache: 'no-store' },
          })
          if (resp?.status === 200) await r.update()
        }, 60 * 60 * 1000)
      }
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  if (!offlineReady && !needRefresh) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        padding: '12px 16px',
        background: '#0f172a',
        color: 'white',
        borderRadius: 8,
        zIndex: 9999,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        fontFamily: 'system-ui',
      }}
    >
      {offlineReady && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>✅ التطبيق جاهز للعمل دون اتصال</span>
          <button onClick={close}>✕</button>
        </div>

      )}
      {needRefresh && (
        <div>
          <div style={{ marginBottom: 8 }}>🔄 يوجد إصدار جديد</div>
          <button onClick={() => updateServiceWorker(true)}>تحديث</button>
          <button onClick={close} style={{ marginInlineStart: 8 }}>
            لاحقًا
          </button>
        </div>
      )}
    </div>
  )
}