import { lazy, Suspense } from 'react'

const SignalPage = lazy(() => import('./SignalPage.tsx'))

export default function SignalRoute() {
  return (
    <Suspense fallback={null}>
      <SignalPage />
    </Suspense>
  )
}
