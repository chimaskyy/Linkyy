
import { Button } from '../../components/ui/button'
import { ChevronRight } from 'lucide-react'
import { useAuth } from '../../contexts/auth-context'
import { useNavigate } from 'react-router-dom'

function Password() {

    const { user } = useAuth()
    const navigate = useNavigate()
    const handleGetStarted = (path: string) => {

        if (user) {
            navigate(`/${path}`)
        } else {
            navigate("/login")
        }
    }
  return (
        <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800 shadow-xl">
            <div className="h-12 w-12 rounded-lg bg-purple-600/20 flex items-center justify-center text-purple-400 mb-4">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Password Generator</h3>
            <p className="text-gray-400 mb-4">
                Create strong, unique passwords for all your accounts with customizable complexity.
            </p>

            <ul className="space-y-2 text-left mb-6">
                <li className="flex items-center gap-2 text-sm text-gray-300">
                    <ChevronRight className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                    <span>Customizable password complexity</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                    <ChevronRight className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                    <span>Organize passwords with tags</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                    <ChevronRight className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                    <span>Password securly encrypted</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                    <ChevronRight className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                    <span>Copy password in one click</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                    <ChevronRight className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                    <span>Create an account to access your passwords from anywhere</span>
                </li>
            </ul>
            <div className="text-sm text-purple-400 mb-4">
                Save passwords securely by creating an account.
            </div>
            <Button
                className="w-full bg-purple-600 hover:bg-purple-700 mt-4"
                onClick={() => handleGetStarted("passwords")}
            >
                Get Started
            </Button>
        </div>
    )
}

export default Password