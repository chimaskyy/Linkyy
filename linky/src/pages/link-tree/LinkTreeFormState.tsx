import {  useState } from "react"
import { useToast } from "../../hooks/use-toast"
import { supabase } from "../../lib/supabase"
import { useAuth } from "../../contexts/auth-context"
import {  useParams } from "react-router-dom"
import type { LinkTree, LinkTreeLink } from "../../type/types"


const LinkTreeFormState = () => {
    const { id } = useParams<{ id: string }>()
    const { toast } = useToast()
    const { user } = useAuth()
    const [loading] = useState(!!id)
    const [saving, setSaving] = useState(false)
    const [linkTree, setLinkTree] = useState<LinkTree | null>(null)
    const [links, setLinks] = useState<LinkTreeLink[]>([])
    const [treeUrl, setTreeUrl] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    // Form state
    const [username, setUsername] = useState("")
    const [title, setTitle] = useState("")
    const [bio, setBio] = useState("")
    const [theme, setTheme] = useState("dark")
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

    const clearDraft = () => {
        if (user) sessionStorage.removeItem(`linktree-${user.id}`);
    };

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
                setTreeUrl(`${window.location.origin}/tree/${username}`)
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
            clearDraft()

            toast({
                title: "Success!",
                description: `Link tree has been ${id ? "updated" : "created"}`,
            })
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

    return {
        loading,
        saving,
        linkTree,
        links,
        username,
        title,
        bio,
        theme,
        avatarUrl,
        treeUrl,
        copied,
        setUsername,
        setTitle,
        setBio,
        setTheme,
        setAvatarUrl,
        addLink,
        updateLink,
        removeLink,
        moveLink,
        saveLinkTree,
        copyToClipboard,
    }
}

export default LinkTreeFormState;