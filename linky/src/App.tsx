"use client"

import type React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/auth-context"
import { Toaster } from "react-hot-toast"
import HomePage from "./pages/home/Home"
import LoginPage from "./pages/login"
import DashboardPage from "./pages/dashboard"
import UrlsPage from "./pages/dashboard/urls"
import LinkTreesPage from "./pages/dashboard/LinkTreePage"
import ProfilePage from "./pages/dashboard/profile"
import PasswordsPage from "./pages/dashboard/passwords"
import ShortUrlRedirect from "./pages/short-url-redirect"
import LinkTreePage from "./pages/link-tree"
import LinkTreeForm from "./pages/link-tree/CreateTree"
import CreateQrCode from "./pages/qr-code/CreateQrCode"
import { useAuth } from "./contexts/auth-context"
import QRCodesPage from "./pages/dashboard/QrCode"
// import EditLinkTreePage from "./pages/dashboard/editLinkTree"
// import NewLinkTreePage from "./components/link-tree-form"


// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<LoginPage />} />
      <Route path="/new-link-tree" element={<LinkTreeForm />} />
      <Route path="/:code" element={<ShortUrlRedirect />} />
      <Route path="/tree/:username" element={<LinkTreePage />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/urls"
        element={
          <ProtectedRoute>
            <UrlsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/linktrees"
        element={
          <ProtectedRoute>
            <LinkTreesPage />
           </ProtectedRoute>
        }
      />
      <Route
        path="/qr-codes"
        element={
          <ProtectedRoute>
            <QRCodesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/qr-code-generator"
        element={
          <ProtectedRoute>
            <CreateQrCode />
          </ProtectedRoute>
        }
      />

      <Route
        path="/linktree/:id"
        element={
          <ProtectedRoute>
            <LinkTreeForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/passwords"
        element={
          <ProtectedRoute>
            <PasswordsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <AuthProvider>
          <AppRoutes />
      </AuthProvider>
    </Router>
  )
}

export default App
