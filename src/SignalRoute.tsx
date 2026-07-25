import { lazy, Suspense } from 'react'
import './signal-route.css'

const SignalPage = lazy(() => import('./SignalPage.tsx'))

export default function SignalRoute() {
  return (
    <Suspense
      fallback={
        <div className="signal-route-loading" role="status">
          Tuning the Crema signal…
        </div>
      }
    >
      <SignalPage />
    </Suspense>
  )
}
