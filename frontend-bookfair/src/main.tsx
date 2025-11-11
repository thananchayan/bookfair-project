import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'

import { AuthProvider } from './lib/auth-context'

// Layouts
import PublisherLayout from './layouts/PublisherLayout'

// Pages
import App from './App'
import SignupPage, { LoginPage } from './pages/auth/SignupPage'
import PublisherDashboard from './pages/publisher/PublisherDashboard'

// Define your routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/auth/login',
    element: <LoginPage />,
  },
  {
    path: '/auth/signup',
    element: <SignupPage />,
  },
  {
    path: '/publisher',
    element: <PublisherLayout />,
    children: [
      {
        path: 'dashboard',
        element: <PublisherDashboard />,
      },
    ],
  },
])

// ✅ The important part: wrap your RouterProvider with AuthProvider
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
)
