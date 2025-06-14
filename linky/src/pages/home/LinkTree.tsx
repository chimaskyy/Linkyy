import type React from "react"
import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import toast from "react-hot-toast"
import { supabase } from "../../lib/supabase"
import { useAuth } from "../../contexts/auth-context"
import { ExternalLink, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

const SimpleLinkTreeForm = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [title, setTitle] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [treeUrl, setTreeUrl] = useState<string | null>(null)
    const [createdTreeId, setCreatedTreeId] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!username) {
            toast.error("Please enter a username")
            return
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            toast.error("Username can only contain letters, numbers, and underscores")
            return
        }

        if (!user) {
            navigate("/login")
            return
        }

        setIsLoading(true)

        try {
            // Check if username is available
            const { data: existingTree } = await supabase.from("link_trees").select("id").eq("username", username).single()

            if (existingTree) {
                toast.error("Username is already taken")
                setIsLoading(false)
                return
            }

            // Create the link tree
            const { data, error } = await supabase
                .from("link_trees")
                .insert({
                    user_id: user.id,
                    username,
                    title: title || "My Link Tree",
                    bio: "",
                    theme: "dark",
                })
                .select()
                .single()

            if (error) throw error

            const baseUrl = window.location.origin
            setTreeUrl(`${baseUrl}/t/${username}`)
            setCreatedTreeId(data.id) // Store the created tree ID

            toast.success("Your link tree has been created")
        } catch (error) {
            console.error("Error creating link tree:", error)
            toast.error(error instanceof Error ? error.message : "Failed to create link tree")
        } finally {
            setIsLoading(false)
        }
    }

    const goToCustomize = () => {
        if (createdTreeId) {
            navigate(`/linktree/${createdTreeId}`)
        } else {
            toast.error("Tree ID not found")
        }
    }

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username" className="text-gray-700 font-medium">
                            Choose your username
                        </Label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                <ExternalLink className="h-5 w-5" />
                            </div>
                            <Input
                                id="username"
                                type="text"
                                placeholder="your-username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="pl-10 bg-gray-50 border-gray-300 text-gray-900 h-12 w-full focus:border-purple-500 focus:ring-purple-500"
                            />
                        </div>
                        <p className="text-xs text-gray-500">Your link tree will be available at {window.location.origin}/t/{username}</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-gray-700 font-medium">
                            Display name
                        </Label>
                        <Input
                            id="title"
                            type="text"
                            placeholder="Your Title or Brand eg 'Web Developer'"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-gray-50 border-gray-300 text-gray-900 h-12 w-full focus:border-purple-500 focus:ring-purple-500"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="bg-purple-900 hover:opacity-80 text-white h-12 px-6 w-full rounded-lg font-medium"
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating..." : "Create your link tree"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </form>

            {treeUrl && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-green-800">Your link tree is ready!</p>
                            <a
                                href={treeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:text-green-700 truncate block text-sm"
                            >
                                {treeUrl}
                            </a>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={goToCustomize}
                            >
                                Customize
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SimpleLinkTreeForm