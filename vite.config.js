// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // استراتيجية التحديث:
      // 'prompt' → نُظهر للمستخدم "يوجد تحديث"
      // 'autoUpdate' → يُحدّث نفسه بصمت
      registerType: 'prompt',

      // أصول إضافية تُنسخ كما هي (اختياري)
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],

      // ===== الـ Manifest =====
      manifest: {
        name: 'Git Learning Project',
        short_name: 'GitLearn',
        description: 'تعلّم Git بطريقة تفاعلية',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',       // الأهم: يفتح بدون شريط المتصفح
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        shortcuts: [
          {
            name: 'الدروس',
            url: '/lessons',
            description: 'افتح قائمة الدروس',
          },
        ],
      },

      // ===== Service Worker (Workbox) =====
      workbox: {
        // ما الذي يُخزّن مسبقًا في install (Pre-caching)
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],

        // نظّف الملفات القديمة عند activate
        cleanupOutdatedCaches: true,

        // استراتيجيات runtime للطلبات التي لا تنتمي لـ app shell
        runtimeCaching: [
          {
            // مثال: صور خارجية
            urlPattern: /^https:\/\/images\.example\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'external-images',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 يومًا
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // مثال: API
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
        ],
      },

      // حتى تستطيع اختبار الـ SW في `vite dev`
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
    preview: { // tp allow vite react project to open from a internal browser after run the project with cloudflare
    allowedHosts: ['.trycloudflare.com'],
  },
})