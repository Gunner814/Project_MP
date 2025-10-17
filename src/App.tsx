import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

// Components
import Navigation from './components/Navigation'

// Pages
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import CPFCalculator from './pages/CPFCalculator'
import TimelinePage from './pages/TimelinePage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-bg-primary text-text-primary">
          {/* Navigation */}
          <Navigation />

          {/* Main Content */}
          <div className="relative z-10">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/calculators/cpf" element={<CPFCalculator />} />

              {/* Main routes */}
              <Route path="/timeline" element={<TimelinePage />} />
              <Route path="/housing" element={<ComingSoon title="HDB/Property Planner" />} />
              <Route path="/vehicle" element={<ComingSoon title="Car & COE Calculator" />} />
              <Route path="/investments" element={<ComingSoon title="Investment Tracker" />} />
              <Route path="/family" element={<ComingSoon title="Family Planning" />} />
            </Routes>
          </div>

          <Toaster
            position="bottom-right"
            toastOptions={{
              className: 'font-semibold',
              style: {
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '2px solid var(--accent-primary)',
              },
            }}
          />
        </div>
      </Router>
    </QueryClientProvider>
  )
}

// Temporary Coming Soon component for unfinished pages
function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-accent-primary mb-4">
          {title}
        </h1>
        <p className="text-xl font-semibold text-accent-warning">
          Coming Soon! 🚧
        </p>
        <p className="mt-4 text-text-secondary">
          This feature is under development
        </p>
      </div>
    </div>
  )
}

export default App