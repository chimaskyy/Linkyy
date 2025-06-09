
import { Button } from '../../components/ui/button'
import { ChevronRight} from 'lucide-react'
import { useAuth } from '../../contexts/auth-context'
import { useNavigate } from 'react-router-dom'

function LinkTree() {

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
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Link Tree</h3>
            <p className="text-gray-400 mb-4">
                Showcase all your important links in one place. Perfect for social media bios and creators.
            </p>
            <ul className="space-y-2 text-left mb-6">
                <li className="flex items-center gap-2 text-sm text-gray-300">
                    <ChevronRight className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                    <span>Customizable themes and layouts</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                    <ChevronRight className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                    <span>Track clicks on each link in your tree</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                    <ChevronRight className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                    <span>Create an account to update your link tree anytime</span>
                </li>
            </ul>
            <div className="text-sm text-purple-400 mb-4">
                Create an account to save and edit your link tree anytime.
            </div>
            <Button
                className="w-full bg-purple-600 hover:bg-purple-700 mt-4"
                onClick={() => handleGetStarted("new-link-tree")}
            >
                Get Started
            </Button>
        </div>
    )
}

export default LinkTree