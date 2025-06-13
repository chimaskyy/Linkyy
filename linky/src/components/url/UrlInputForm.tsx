// components/UrlInputForm.tsx
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Link2 } from "lucide-react"
import { useAuth } from "../../contexts/auth-context"
import { useNavigate } from "react-router-dom"

interface UrlInputFormProps {
    url: string
    title: string
    isLoading: boolean
    theme?: 'light' | 'dark'
    requireTitle?: boolean
    buttonVariant?: 'default' | 'purple' | 'outline'
    onUrlChange: (value: string) => void
    onTitleChange: (value: string) => void
    onSubmit: (e: React.FormEvent) => void
}
export const UrlInputForm = ({
    url,
    title,
    isLoading,
    theme = 'light',
    requireTitle = false,
    buttonVariant = 'purple',
    onUrlChange,
    onTitleChange,
    onSubmit
}: UrlInputFormProps) => {

    const { user } = useAuth()
    const navigate = useNavigate()

    const handleNavigation = () => {
        if (!user) {
           
            navigate("/login")
            return
        }
        
    }

    const inputClasses = theme === 'dark'
        ? "bg-gray-800/50 border-gray-700 text-gray-200 focus:border-purple-500 focus:ring-purple-500"
        : "bg-gray-50 border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500"

    const buttonClasses = {
        default: "",
        purple: theme === 'dark'
            ? "bg-purple-900 hover:opacity-80 text-white"
            : "bg-purple-900 hover:opacity-80 text-white",
        outline: theme === 'dark'
            ? "border-gray-700 text-gray-200 hover:bg-gray-700"
            : "border-gray-300 text-gray-700 hover:bg-gray-200"
    }

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Input
                        type="text"
                        placeholder={requireTitle ? "Link title (eg. My Website)" : "Link title (optional)"}
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        className={`${inputClasses} h-12 w-full`}
                        aria-required={requireTitle}
                        aria-label="Link title"
                    />
                </div>
                <div className="flex flex-col sm:flex-row items-center">
                    <div className="relative flex-grow mb-3 sm:mb-0 w-full">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            <Link2 className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <Input
                            type="url"
                            placeholder="Paste your link"
                            value={url}
                            onChange={(e) => onUrlChange(e.target.value)}
                            className={`${inputClasses} pl-10 h-12 w-full`}
                            aria-required="true"
                            aria-label="URL to shorten"
                        />
                    </div>
                    <Button
                        type="submit"
                        className={`${buttonClasses[buttonVariant]} h-12 px-6 w-full sm:w-auto`}
                        disabled={isLoading}
                    onClick={handleNavigation}
                    aria-label="Shorten link"
                        aria-busy={isLoading}
                    >
                        {isLoading ? "Shortening..." : "Shorten link"}
                    </Button>
                </div>
            </div>
        </form>
    )
}