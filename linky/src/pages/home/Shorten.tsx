
import { Button } from '../../components/ui/button'
import { ChevronRight, Globe } from 'lucide-react'
import { useAuth } from '../../contexts/auth-context'
import { useNavigate } from 'react-router-dom'

function Shorten() {

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
                <Globe className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">URL Shortener</h3>
            <p className="text-gray-400 mb-6">
                Long URLs are difficult to share and remember. Linky URL shortener creates branded links that
                are perfect for social media, email campaigns, and more.
            </p>
            <ul className="space-y-2 mb-6 text-left">
                <li className="flex items-center gap-2 text-sm text-gray-300">
                    <ChevronRight className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                    <span>Custom short links with your own keywords</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                    <ChevronRight className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                    <span>Easy to remember and share</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                    <ChevronRight className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                    <span>Detailed click analytics and tracking</span>
                </li>

                <li className="flex items-center gap-2 text-sm text-gray-300">
                    <ChevronRight className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                    <span>Track clicks and engagement</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300 white-space-nowrap">
                    <ChevronRight className="h-5 w-5 text-purple-400 shrink-0 mt-0.5 " />
                    <span>Create and manage links in one place</span>
                </li>
            </ul>
            <div className="text-sm text-purple-400 mb-4">
                Save your links by creating an account to access them anytime.
            </div>
            <Button
                className="w-full bg-purple-600 hover:bg-purple-700 mt-4"
                onClick={() => handleGetStarted("urls")}
            >
                Get Started
            </Button>
        </div>
    )
}

export default Shorten