import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from '@/pages/LoginPage'
import { SelectionPage } from '@/pages/SelectionPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { ThankYouPage } from '@/pages/ThankYouPage'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from '@/ErrorFallback'

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/selection" element={<SelectionPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App