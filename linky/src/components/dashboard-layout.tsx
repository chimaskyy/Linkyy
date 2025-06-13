"use client"

import type React from "react"
import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Link2, ExternalLink, LayoutDashboard, LogOut, User, Key, Menu, X, QrCode } from "lucide-react"
import { useAuth } from "../contexts/auth-context"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user,  signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate("/")
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black text-white">
      <div className="flex flex-col md:flex-row h-screen">
        {/* Mobile Header */}
        <header className="md:hidden border-b border-gray-800 bg-gray-900/60 backdrop-blur-sm p-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                <div className="h-6 w-6 rounded-full bg-purple-900"></div>
              </div>
              <span className="text-xl font-bold">Linky</span>
            </Link>
            <button onClick={toggleMobileMenu} className="p-2 rounded-md hover:bg-gray-800">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && <div className="fixed inset-0 bg-black/80 z-10 md:hidden" onClick={closeMobileMenu}></div>}

        {/* Sidebar - Desktop and Mobile */}
        <div
          className={`
            ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
            md:translate-x-0 transition-transform duration-200 ease-in-out
            fixed md:relative z-20 md:z-auto
            w-64 h-[calc(100vh-64px)] md:h-screen top-16 md:top-0
            border-r border-gray-800 bg-gray-900/90 backdrop-blur-sm p-4
            overflow-y-auto
          `}
        >
          <div className="flex items-center mb-8 hidden md:flex">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                <div className="h-6 w-6 rounded-full bg-purple-900"></div>
              </div>
              <span className="text-xl font-bold">Linky</span>
            </Link>
          </div>

          <nav className="space-y-2">
            <Link
              to="/dashboard"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive("/dashboard") ? "bg-purple-900 text-white" : "hover:bg-gray-800 text-gray-300 hover:text-white"
                }`}
              onClick={closeMobileMenu}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/urls"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive("/dashboard/urls")
                  ? "bg-purple-900 text-white"
                  : "hover:bg-gray-800 text-gray-300 hover:text-white"
                }`}
              onClick={closeMobileMenu}
            >
              <Link2 className="h-5 w-5" />
              <span>My URLs</span>
            </Link>
            <Link
              to="/linktrees"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive("/dashboard/linktrees")
                  ? "bg-purple-900 text-white"
                  : "hover:bg-gray-800 text-gray-300 hover:text-white"
                }`}
              onClick={closeMobileMenu}
            >
              <ExternalLink className="h-5 w-5" />
              <span>My Link Trees</span>
            </Link>
            <Link
              to="/passwords"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive("/dashboard/passwords")
                  ? "bg-purple-900 text-white"
                  : "hover:bg-gray-800 text-gray-300 hover:text-white"
                }`}
              onClick={closeMobileMenu}
            >
              <Key className="h-5 w-5" />
              <span>My Passwords</span>
            </Link>
            <Link
              to="/qr-codes"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive("/dashboard/passwords")
                ? "bg-purple-900 text-white"
                : "hover:bg-gray-800 text-gray-300 hover:text-white"
                }`}
              onClick={closeMobileMenu}
            >
              <QrCode className="h-5 w-5" />
              <span>My Qr Codes</span>
            </Link>
            <Link
              to="/profile"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive("/dashboard/profile")
                  ? "bg-purple-900 text-white"
                  : "hover:bg-gray-800 text-gray-300 hover:text-white"
                }`}
              onClick={closeMobileMenu}
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Link>
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full border-gray-700 text-gray-200 hover:bg-gray-800 hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          {/* Desktop Header */}
          <header className="hidden md:block border-b border-gray-800 bg-gray-900/60 backdrop-blur-sm p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">
                {isActive("/dashboard") && "Dashboard"}
                {isActive("/urls") && "My URLs"}
                {isActive("/linktrees") && "My Link Trees"}
                {isActive("/passwords") && "My Passwords"}
                {isActive("/profile") && "Profile"}
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400">{user?.email?.split("@")[0]}</span>
              </div>
            </div>
          </header>

          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
