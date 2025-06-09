import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "../../components/ui/button"
import { useToast } from "../../hooks/use-toast"
import { supabase } from "../../lib/supabase"
import { useAuth } from "../../contexts/auth-context"
import { Link, useNavigate, useParams } from "react-router-dom"
import DashboardLayout from "../../components/dashboard-layout"
import { ArrowLeft, Check, ExternalLink } from "lucide-react"
import { BasicInfoForm } from "./BasicInfo"
import { AvatarUpload } from "./AvatarUpload"
import { SocialLinks } from "./SocialLinks"
import { LinkTreePreview } from "./TreePreview"

interface LinkTreeLink {
    id?: string
    title: string
    url: string
    icon: string
    position: number
    tree_id?: string
}

interface LinkTree {
    id: string
    user_id: string
    username: string
    title: string | null
    bio: string | null
    theme: string
    avatar_url: string | null
    created_at: string
}

const LinkTreeForm = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { toast } = useToast()
    const { user } = useAuth()
    const [loading, setLoading] = useState(!!id)
    const [saving, setSaving] = useState(false)
    const [linkTree, setLinkTree] = useState<LinkTree | null>(null)
    const [links, setLinks] = useState<LinkTreeLink[]>([])

    // Form state
    const [username, setUsername] = useState("")
    const [title, setTitle] = useState("")
    const [bio, setBio] = useState("")
    const [theme, setTheme] = useState("dark")
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const [treeUrl, setTreeUrl] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (!id) {
            setLinks([{ title: "", url: "", icon: "external", position: 0 }])
            return
        }

        const fetchLinkTree = async () => {
            if (!user) return

            try {
                const { data: linkTreeData, error: linkTreeError } = await supabase
                    .from("link_trees")
                    .select("*")
                    .eq("id", id)
                    .eq("user_id", user.id)
                    .single()

                if (linkTreeError) throw linkTreeError

                if (!linkTreeData) {
                    toast({
                        title: "Error",
                        description: "Link tree not found",
                        variant: "destructive",
                    })
                    navigate("/dashboard/linktrees")
                    return
                }

                setLinkTree(linkTreeData)
                setTitle(linkTreeData.title || "")
                setBio(linkTreeData.bio || "")
                setTheme(linkTreeData.theme || "dark")
                setUsername(linkTreeData.username || "")
                setAvatarUrl(linkTreeData.avatar_url)
                setTreeUrl(`${window.location.origin}/t/${linkTreeData.username}`)

                const { data: linksData, error: linksError } = await supabase
                    .from("tree_links")
                    .select("*")
                    .eq("tree_id", id)
                    .order("position", { ascending: true })

                if (linksError) throw linksError

                setLinks(linksData?.length ? linksData : [{ title: "", url: "", icon: "external", position: 0 }])
            } catch (error) {
                console.error("Error fetching link tree:", error)
                toast({
                    title: "Error",
                    description: "Failed to load link tree",
                    variant: "destructive",
                })
                navigate("/dashboard/linktrees")
            } finally {
                setLoading(false)
            }
        }

        fetchLinkTree()
    }, [id, user, toast, navigate])

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

        const reorderedLinks = updatedLinks.map((link, index) => ({
            ...link,
            position: index,
        }))

        setLinks(reorderedLinks)
    }

    const saveLinkTree = async (e?: React.FormEvent) => {
        e?.preventDefault()

        if (!username) {
            toast({
                title: "Error",
                description: "Please enter a username",
                variant: "destructive",
            })
            return
        }

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

        setSaving(true)

        try {
            if (!id || (linkTree && username !== linkTree.username)) {
                const { data: existingTree } = await supabase
                    .from("link_trees")
                    .select("id")
                    .eq("username", username)
                    .neq("id", id || "")
                    .single()

                if (existingTree) {
                    toast({
                        title: "Error",
                        description: "Username is already taken",
                        variant: "destructive",
                    })
                    setSaving(false)
                    return
                }
            }

            let linkTreeId = id

            if (!linkTreeId) {
                const { data, error } = await supabase
                    .from("link_trees")
                    .insert({
                        user_id: user.id,
                        username,
                        title,
                        bio,
                        theme,
                        avatar_url: avatarUrl,
                    })
                    .select()
                    .single()

                if (error) throw error

                linkTreeId = data.id
                setLinkTree(data)
                setTreeUrl(`${window.location.origin}/t/${username}`)
            } else {
                const { error } = await supabase
                    .from("link_trees")
                    .update({
                        username,
                        title,
                        bio,
                        theme,
                        avatar_url: avatarUrl,
                    })
                    .eq("id", linkTreeId)
                    .eq("user_id", user.id)

                if (error) throw error
            }

            if (linkTreeId) {
                if (id) {
                    await supabase.from("tree_links").delete().eq("tree_id", linkTreeId)
                }

                const validLinks = links.filter((link) => link.title && link.url)

                if (validLinks.length > 0) {
                    const linksToSave = validLinks.map((link, index) => ({
                        title: link.title,
                        url: link.url,
                        icon: link.icon,
                        position: index,
                        tree_id: linkTreeId,
                    }))

                    const { error } = await supabase.from("tree_links").insert(linksToSave)

                    if (error) throw error
                }
            }

            toast({
                title: "Success!",
                description: `Link tree has been ${id ? "updated" : "created"}`,
            })

            if (!id) {
                navigate(`/dashboard/linktrees/${linkTreeId}`)
            }
        } catch (error) {
            console.error("Error saving link tree:", error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : `Failed to ${id ? "update" : "create"} link tree`,
                variant: "destructive",
            })
        } finally {
            setSaving(false)
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

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center  gap-4">
                    <Button asChild variant="outline" size="sm" className="border-gray-700 text-gray-200 hover:bg-gray-800  ">
                        <Link to="/linktrees">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold ml-6 md:ml-12">{id ? "Edit Link Tree" : "Create Link Tree"}</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <AvatarUpload avatarUrl={avatarUrl} onAvatarChange={setAvatarUrl} username={username} />

                        <BasicInfoForm
                            username={username}
                            title={title}
                            bio={bio}
                            theme={theme}
                            onUsernameChange={setUsername}
                            onTitleChange={setTitle}
                            onBioChange={setBio}
                            onThemeChange={setTheme}
                        />


                        <SocialLinks
                            links={links}
                            onAddLink={addLink}
                            onUpdateLink={updateLink}
                            onRemoveLink={removeLink}
                            onMoveLink={moveLink}
                        />

                        <Button
                            type="button"
                            onClick={saveLinkTree}
                            className="bg-purple-600 hover:bg-purple-700 text-white h-12 px-6 w-full"
                            disabled={saving}
                        >
                            {saving ? (id ? "Saving..." : "Creating...") : id ? "Save Changes" : "Create Link Tree"}
                        </Button>

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

                    <div className="lg:col-span-1">
                        <LinkTreePreview
                            username={username}
                            title={title}
                            bio={bio}
                            theme={theme}
                            avatarUrl={avatarUrl}
                            links={links}
                            isEditing={!!id}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
export default LinkTreeForm
