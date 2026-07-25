import { lazy, Suspense } from 'react'

const isSignalPage = window.location.pathname.replace(/\/+$/, '').endsWith('/signal')
const Page = isSignalPage ? lazy(() => import('./SignalRoute.tsx')) : lazy(() => import('./App.tsx'))

export default function RootRoute() {
  return (
    <Suspense
      fallback={
        <div
          role="status"
          style={{
            display: 'grid',
            minHeight: '100svh',
            placeItems: 'center',
            background: '#100c0a',
            color: '#f4efe5',
            font: '700 0.72rem/1.4 system-ui, sans-serif',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          {isSignalPage ? 'Tuning the Crema signal…' : 'Loading Crema…'}
        </div>
      }
    >
      <Page />
    </Suspense>
  )
}
