import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { ExternalLink } from "lucide-react"
import { Link } from "react-router-dom"
import { iconOptions } from "./Icons"

interface LinkTreeLink {
    title: string
    url: string
    icon: string
}

interface LinkTreePreviewProps {
    username: string
    title: string
    bio: string
    theme: string
    avatarUrl: string | null
    links: LinkTreeLink[]
    isEditing: boolean
}

export function LinkTreePreview({ username, title, bio, theme, avatarUrl, links, isEditing }: LinkTreePreviewProps) {
    const validLinks = links.filter((l) => l.title && l.url)

    return (
        <Card className="bg-gray-900/60 backdrop-blur-sm border-gray-800 sticky top-6">
            <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                    {isEditing ? (
                        <Link
                            to={`/tree/${username}`}
                            target="_blank"
                            className="text-purple-400 hover:text-purple-300 flex items-center"
                        >
                            View live page
                            <ExternalLink className="h-3 w-3 ml-1" />
                        </Link>
                    ) : (
                        "Save your link tree to view it live"
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className={`rounded-lg overflow-hidden ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"} p-4`}>
                    <div className="flex flex-col items-center">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl || "/placeholder.svg"}
                                alt="Avatar"
                                className="h-16 w-16 rounded-full object-cover mb-4"
                            />
                        ) : (
                            <div className="h-16 w-16 rounded-full bg-purple-600 mb-4 flex items-center justify-center text-white font-bold">
                                {username ? username.charAt(0).toUpperCase() : "?"}
                            </div>
                        )}

                        <h3 className={`text-lg font-bold mb-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                            @{username || "username"}
                        </h3>

                        {title && (
                            <p className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>{title}</p>
                        )}

                        {bio && (
                            <p className={`text-xs text-center mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                {bio}
                            </p>
                        )}

                        <div className="w-full mt-4 space-y-2">
                            {validLinks.length > 0 ? (
                                validLinks.map((link, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900 border border-gray-200"
                                            }`}
                                    >
                                        {iconOptions.find((i) => i.value === link.icon)?.icon || <ExternalLink className="h-4 w-4" />}
                                        <span className="text-sm">{link.title}</span>
                                    </div>
                                ))
                            ) : (
                                <p className={`text-xs text-center py-2 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                                    No links added yet
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
