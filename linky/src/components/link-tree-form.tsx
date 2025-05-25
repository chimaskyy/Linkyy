"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { ExternalLink, Check, Plus, Trash2, Grip } from "lucide-react"
import { useToast } from "../hooks/use-toast"
import { supabase } from "../lib/supabase"
import { useAuth } from "../contexts/auth-context"
import { useNavigate } from "react-router-dom"

interface LinkTreeLink {
    title: string
    url: string
    icon: string
    position: number
}

export function LinkTreeForm() {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [title, setTitle] = useState("")
    const [bio, setBio] = useState("")
    const [theme, setTheme] = useState("dark")
    const [links, setLinks] = useState<LinkTreeLink[]>([{ title: "", url: "", icon: "external", position: 0 }])
    const [isLoading, setIsLoading] = useState(false)
    const [treeUrl, setTreeUrl] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)
    const { toast } = useToast()
    const { user } = useAuth()

    const addLink = () => {
        setLinks([...links, { title: "", url: "", icon: "external", position: links.length }])
    }

    const updateLink = (index: number, field: keyof LinkTreeLink, value: string) => {
        const updatedLinks = [...links]
        updatedLinks[index] = { ...updatedLinks[index], [field]: value }
        setLinks(updatedLinks)
    }

    const removeLink = (index: number) => {
        if (links.length === 1) {
            // Keep at least one link
            setLinks([{ title: "", url: "", icon: "external", position: 0 }])
        } else {
            setLinks(links.filter((_, i) => i !== index))
        }
    }

    const moveLink = (fromIndex: number, toIndex: number) => {
        if (toIndex < 0 || toIndex >= links.length) return

        const updatedLinks = [...links]
        const [movedItem] = updatedLinks.splice(fromIndex, 1)
        updatedLinks.splice(toIndex, 0, movedItem)

        // Update positions
        const reorderedLinks = updatedLinks.map((link, index) => ({
            ...link,
            position: index,
        }))

        setLinks(reorderedLinks)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!username) {
            toast({
                title: "Error",
                description: "Please enter a username",
                variant: "destructive",
            })
            return
        }

        // Validate username (alphanumeric and underscores only)
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            toast({
                title: "Invalid Username",
                description: "Username can only contain letters, numbers, and underscores",
                variant: "destructive",
            })
            return
        }

        if (!user) {
            toast({
                title: "Error",
                description: "You must be logged in to create a link tree",
                variant: "destructive",
            })
            return
        }

        setIsLoading(true)

        try {
            // Check if username is already taken
            const { data: existingTree } = await supabase.from("link_trees").select("id").eq("username", username).single()

            if (existingTree) {
                toast({
                    title: "Error",
                    description: "Username is already taken",
                    variant: "destructive",
                })
                setIsLoading(false)
                return
            }

            // Create the link tree
            const { data: linkTreeData, error: linkTreeError } = await supabase
                .from("link_trees")
                .insert({
                    user_id: user.id,
                    username,
                    title,
                    bio,
                    theme,
                })
                .select()
                .single()

            if (linkTreeError) throw linkTreeError

            // Add links if provided
            const validLinks = links.filter((link) => link.title && link.url)

            if (validLinks.length > 0) {
                const linksToInsert = validLinks.map((link, index) => ({
                    tree_id: linkTreeData.id,
                    title: link.title,
                    url: link.url,
                    icon: link.icon,
                    position: index,
                }))

                const { error: linksError } = await supabase.from("tree_links").insert(linksToInsert)

                if (linksError) throw linksError
            }

            const baseUrl = window.location.origin
            setTreeUrl(`${baseUrl}/${username}`)

            toast({
                title: "Success!",
                description: "Your link tree has been created",
            })

            // Navigate to the edit page for the new link tree
            navigate(`/linktrees`)
        } catch (error) {
            console.error("Error creating link tree:", error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create link tree",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const copyToClipboard = () => {
        if (treeUrl) {
            navigator.clipboard.writeText(treeUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
            toast({
                title: "Copied!",
                description: "Link tree URL copied to clipboard",
            })
        }
    }

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="bg-gray-900/60 backdrop-blur-sm border-gray-800">
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>Set up your link tree details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username (required)</Label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                    <ExternalLink className="h-5 w-5" />
                                </div>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="pl-10 bg-gray-800/50 border-gray-700 text-white h-12 w-full focus:border-purple-500 focus:ring-purple-500"
                                    required
                                />
                            </div>
                            <p className="text-xs text-gray-400">
                                Your link tree will be available at {window.location.origin}/{username}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                type="text"
                                placeholder="Your name or brand"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="bg-gray-800/50 border-gray-700 text-white"
                            />
                        </div>

                        {/* <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                placeholder="A short description about you"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="bg-gray-800/50 border-gray-700 text-white"
                            />
                        </div> */}

                        <div className="space-y-2">
                            <Label htmlFor="theme">Theme</Label>
                            <select
                                id="theme"
                                value={theme}
                                onChange={(e) => setTheme(e.target.value)}
                                className="w-full bg-gray-800/50 border-gray-700 text-white rounded-md p-2"
                            >
                                <option value="dark">Dark</option>
                                <option value="light">Light</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gray-900/60 backdrop-blur-sm border-gray-800">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Links</CardTitle>
                            <CardDescription>Add links to your social profiles or websites</CardDescription>
                        </div>
                        <Button type="button" onClick={addLink} className="bg-purple-600 hover:bg-purple-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Link
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {links.map((link, index) => (
                                <div key={index} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            <button
                                                type="button"
                                                className="mr-2 cursor-move text-gray-400 hover:text-white"
                                                aria-label="Drag to reorder"
                                            >
                                                <Grip className="h-5 w-5" />
                                            </button>
                                            <span className="font-medium">Link {index + 1}</span>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeLink(index)}
                                            className="text-gray-400 hover:text-red-400 hover:bg-transparent"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor={`link-title-${index}`}>Title</Label>
                                            <Input
                                                id={`link-title-${index}`}
                                                value={link.title}
                                                onChange={(e) => updateLink(index, "title", e.target.value)}
                                                className="bg-gray-800 border-gray-700 text-white"
                                                placeholder="Link title"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor={`link-url-${index}`}>URL</Label>
                                            <Input
                                                id={`link-url-${index}`}
                                                value={link.url}
                                                onChange={(e) => updateLink(index, "url", e.target.value)}
                                                className="bg-gray-800 border-gray-700 text-white"
                                                placeholder="https://example.com"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor={`link-icon-${index}`}>Icon</Label>
                                            <select
                                                id={`link-icon-${index}`}
                                                value={link.icon}
                                                onChange={(e) => updateLink(index, "icon", e.target.value)}
                                                className="w-full bg-gray-800 border-gray-700 text-white rounded-md p-2"
                                            >
                                                <option value="external">Default</option>
                                                <option value="instagram">Instagram</option>
                                                <option value="twitter">Twitter</option>
                                                <option value="youtube">YouTube</option>
                                                <option value="facebook">Facebook</option>
                                                <option value="linkedin">LinkedIn</option>
                                                <option value="github">GitHub</option>
                                                <option value="globe">Website</option>
                                                <option value="mail">Email</option>
                                            </select>
                                        </div>

                                        <div className="flex justify-between">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => moveLink(index, index - 1)}
                                                disabled={index === 0}
                                                className="border-gray-700 text-gray-200 hover:bg-gray-700"
                                            >
                                                Move Up
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => moveLink(index, index + 1)}
                                                disabled={index === links.length - 1}
                                                className="border-gray-700 text-gray-200 hover:bg-gray-700"
                                            >
                                                Move Down
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white h-12 px-6 w-full"
                    disabled={isLoading}
                >
                    {isLoading ? "Creating..." : "Create Link Tree"}
                </Button>
            </form>

            {treeUrl && (
                <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700 flex flex-col sm:flex-row items-center justify-between">
                    <div className="mb-3 sm:mb-0 truncate max-w-full sm:max-w-[70%]">
                        <p className="text-sm text-gray-400">Your link tree URL:</p>
                        <a
                            href={treeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300 truncate block"
                        >
                            {treeUrl}
                        </a>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        className="border-gray-700 text-gray-200 hover:bg-gray-700"
                        onClick={copyToClipboard}
                    >
                        {copied ? <Check className="h-4 w-4 mr-2" /> : <ExternalLink className="h-4 w-4 mr-2" />}
                        {copied ? "Copied" : "Copy"}
                    </Button>
                </div>
            )}
        </div>
    )
}
