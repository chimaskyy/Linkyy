
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { useAuth } from '../contexts/auth-context'

function Header() {

    const {user} = useAuth()
  return (
      <header className="relative z-10 border-b border-gray-800 bg-black/30 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                      <Link to="/" className="flex items-center space-x-2">
                          <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                              <div className="h-6 w-6 rounded-full bg-purple-600"></div>
                          </div>
                          <span className="text-xl font-bold">Snipy</span>
                      </Link>
                  </div>

                  <div className="flex items-center space-x-3">
                      {user ? (
                          <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
                              <Link to="/dashboard">Dashboard</Link>
                          </Button>
                      ) : (
                          <>
                              <Button
                                  asChild
                                  variant="outline"
                                  className="hidden sm:inline-flex border-gray-700 text-gray-200 hover:bg-gray-800 hover:text-white"
                              >
                                  <Link to="/login">Login</Link>
                              </Button>
                              <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
                                  <Link to="/register">Register</Link>
                              </Button>
                          </>
                      )}
                  </div>
              </div>
          </div>
      </header>
  )
}

export default Header