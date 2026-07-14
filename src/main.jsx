import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorPage from './components/ErrorPage'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary FallbackComponent={ErrorPage}>

  <App />
  </ErrorBoundary>
)
