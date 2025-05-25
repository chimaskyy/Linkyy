// import {
//     Globe,
//     Instagram,
//     Twitter,
//     Youtube,
//     Facebook,
//     Linkedin,
//     Github,
//     Mail,
// } from "lucide-react"
// import { useEffect, useState } from "react"
// import { useParams, useNavigate, Link } from "react-router-dom"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
// import { Button } from "../../components/ui/button"
// import { Input } from "../../components/ui/input"
// import { Textarea } from "../../components/ui/textarea"
// import { Label } from "../../components/ui/label"
// import { Trash2, Plus, Grip, ExternalLink, ArrowLeft } from "lucide-react"
// import { useToast } from "../../hooks/use-toast"
// import { supabase } from "../../lib/supabase"
// import { useAuth } from "../../contexts/auth-context"
// import DashboardLayout from "../../components/dashboard-layout"

// interface LinkTreeLink {
//     id?: string
//     title: string
//     url: string
//     icon: string
//     position: number
//     tree_id?: string
// }

// interface LinkTree {
//     id: string
//     user_id: string
//     username: string
//     title: string | null
//     bio: string | null
//     theme: string
//     avatar_url: string | null
//     created_at: string
// }

// const iconOptions = [
//     { value: "globe", label: "Website", icon: <Globe className="h-4 w-4" /> },
//     { value: "instagram", label: "Instagram", icon: <Instagram className="h-4 w-4" /> },
//     { value: "twitter", label: "Twitter", icon: <Twitter className="h-4 w-4" /> },
//     { value: "youtube", label: "YouTube", icon: <Youtube className="h-4 w-4" /> },
//     { value: "facebook", label: "Facebook", icon: <Facebook className="h-4 w-4" /> },
//     { value: "linkedin", label: "LinkedIn", icon: <Linkedin className="h-4 w-4" /> },
//     { value: "github", label: "GitHub", icon: <Github className="h-4 w-4" /> },
//     { value: "mail", label: "Email", icon: <Mail className="h-4 w-4" /> },
//   ]

// export default function EditLinkTreePage() {
//     const { id } = useParams<{ id: string }>()
//     const navigate = useNavigate()
//     const { toast } = useToast()
//     const { user } = useAuth()
//     const [loading, setLoading] = useState(true)
//     const [saving, setSaving] = useState(false)
//     const [linkTree, setLinkTree] = useState<LinkTree | null>(null)
//     const [links, setLinks] = useState<LinkTreeLink[]>([])

//     // Form state
//     const [title, setTitle] = useState("")
//     const [bio, setBio] = useState("")
//     const [theme, setTheme] = useState("dark")
//     const [username, setUsername] = useState("")

//     useEffect(() => {
//         const fetchLinkTree = async () => {
//             if (!id || !user) return

//             try {
//                 // Fetch the link tree
//                 const { data: linkTreeData, error: linkTreeError } = await supabase
//                     .from("link_trees")
//                     .select("*")
//                     .eq("id", id)
//                     .eq("user_id", user.id)
//                     .single()

//                 if (linkTreeError) throw linkTreeError

//                 if (!linkTreeData) {
//                     toast({
//                         title: "Error",
//                         description: "Link tree not found",
//                         variant: "destructive",
//                     })
//                     navigate("/dashboard/linktrees")
//                     return
//                 }

//                 setLinkTree(linkTreeData)
//                 setTitle(linkTreeData.title || "")
//                 setBio(linkTreeData.bio || "")
//                 setTheme(linkTreeData.theme || "dark")
//                 setUsername(linkTreeData.username || "")

//                 // Fetch the links
//                 const { data: linksData, error: linksError } = await supabase
//                     .from("tree_links")
//                     .select("*")
//                     .eq("tree_id", id)
//                     .order("position", { ascending: true })

//                 if (linksError) throw linksError

//                 setLinks(linksData || [])
//             } catch (error) {
//                 console.error("Error fetching link tree:", error)
//                 toast({
//                     title: "Error",
//                     description: "Failed to load link tree",
//                     variant: "destructive",
//                 })
//                 navigate("/dashboard/linktrees")
//             } finally {
//                 setLoading(false)
//             }
//         }

//         fetchLinkTree()
//     }, [id, user, toast, navigate])

//     const addLink = () => {
//         setLinks([
//             ...links,
//             {
//                 title: "",
//                 url: "",
//                 icon: "external",
//                 position: links.length,
//             },
//         ])
//     }

//     const updateLink = (index: number, field: keyof LinkTreeLink, value: string) => {
//         const updatedLinks = [...links]
//         updatedLinks[index] = { ...updatedLinks[index], [field]: value }
//         setLinks(updatedLinks)
//     }

//     const removeLink = (index: number) => {
//         setLinks(links.filter((_, i) => i !== index))
//     }

//     const moveLink = (fromIndex: number, toIndex: number) => {
//         if (toIndex < 0 || toIndex >= links.length) return

//         const updatedLinks = [...links]
//         const [movedItem] = updatedLinks.splice(fromIndex, 1)
//         updatedLinks.splice(toIndex, 0, movedItem)

//         // Update positions
//         const reorderedLinks = updatedLinks.map((link, index) => ({
//             ...link,
//             position: index,
//         }))

//         setLinks(reorderedLinks)
//     }

//     const saveLinkTree = async () => {
//         if (!user || !linkTree) return

//         setSaving(true)

//         try {
//             // Update link tree
//             const { error: updateError } = await supabase
//                 .from("link_trees")
//                 .update({
//                     title,
//                     bio,
//                     theme,
//                     username,
//                 })
//                 .eq("id", id)
//                 .eq("user_id", user.id)

//             if (updateError) throw updateError

//             // Handle links - first delete existing links
//             const { error: deleteError } = await supabase.from("tree_links").delete().eq("tree_id", id)

//             if (deleteError) throw deleteError

//             // Then insert new links
//             if (links.length > 0) {
//                 const linksToInsert = links.map((link, index) => ({
//                     tree_id: id,
//                     title: link.title,
//                     url: link.url,
//                     icon: link.icon,
//                     position: index,
//                 }))

//                 const { error: insertError } = await supabase.from("tree_links").insert(linksToInsert)

//                 if (insertError) throw insertError
//             }

//             toast({
//                 title: "Success",
//                 description: "Link tree updated successfully",
//             })
//         } catch (error) {
//             console.error("Error saving link tree:", error)
//             toast({
//                 title: "Error",
//                 description: "Failed to save link tree",
//                 variant: "destructive",
//             })
//         } finally {
//             setSaving(false)
//         }
//     }

//     if (loading) {
//         return (
//             <DashboardLayout>
//                 <div className="flex justify-center py-8">
//                     <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
//                 </div>
//             </DashboardLayout>
//         )
//     }

//     return (
//         <DashboardLayout>
//             {/* <div className="space-y-8">
//                 <div className="flex items-center gap-4">
//                     <Button asChild variant="outline" size="sm" className="border-gray-700 text-gray-200 hover:bg-gray-800">
//                         <Link to="/dashboard/linktrees">
//                             <ArrowLeft className="h-4 w-4 mr-2" />
//                             Back
//                         </Link>
//                     </Button>
//                     <h1 className="text-2xl font-bold">Edit Link Tree</h1>
//                 </div>

//                 <Card className="bg-gray-900/60 backdrop-blur-sm border-gray-800">
//                     <CardHeader>
//                         <CardTitle>Basic Information</CardTitle>
//                         <CardDescription>Update your link tree details</CardDescription>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                         <div className="space-y-2">
//                             <Label htmlFor="username">Username</Label>
//                             <Input
//                                 id="username"
//                                 value={username}
//                                 onChange={(e) => setUsername(e.target.value)}
//                                 className="bg-gray-800/50 border-gray-700 text-white"
//                             />
//                             <p className="text-xs text-gray-400">
//                                 Your link tree will be available at {window.location.origin}/t/{username}
//                             </p>
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="title">Title</Label>
//                             <Input
//                                 id="title"
//                                 value={title}
//                                 placeholder="Your name or brand"
//                                 onChange={(e) => setTitle(e.target.value)}
//                                 className="bg-gray-800/50 border-gray-700"
//                             />
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="bio">Bio</Label>
//                             <Textarea
//                                 id="bio"
//                                 value={bio}
//                                 onChange={(e) => setBio(e.target.value)}
//                                 className="bg-gray-800/50 border-gray-700 text-white"
//                                 placeholder="A short description about you"
//                             />
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="theme">Theme</Label>
//                             <select
//                                 id="theme"
//                                 value={theme}
//                                 onChange={(e) => setTheme(e.target.value)}
//                                 className="w-full bg-gray-800/50 border-gray-700 text-white rounded-md p-2"
//                             >
//                                 <option value="dark">Dark</option>
//                                 <option value="light">Light</option>
//                             </select>
//                         </div>
//                     </CardContent>
//                 </Card>

//                 <Card className="bg-gray-900/60 backdrop-blur-sm border-gray-800">
//                 <CardHeader>
//               <CardTitle>Links</CardTitle>
//               <CardDescription>Manage the links in your link tree</CardDescription>
//             </CardHeader>
//                     <CardContent>
//                         {links.length === 0 ? (
//                             <div className="text-center py-8">
//                                 <p className="text-gray-400 mb-4">No links added yet</p>
//                                 <Button onClick={addLink} className="bg-purple-600 hover:bg-purple-700">
//                                     <Plus className="h-4 w-4 mr-2" />
//                                     Add Your First Link
//                                 </Button>
//                             </div>
//                         ) : (
//                             <div className="space-y-4">
//                                 {links.map((link, index) => (
//                                     <div key={index} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
//                                         <div className="flex items-center justify-between mb-4">
//                                             <div className="flex items-center">
//                                                 <button
//                                                     type="button"
//                                                     className="mr-2 cursor-move text-gray-400 hover:text-white"
//                                                     aria-label="Drag to reorder"
//                                                 >
//                                                     <Grip className="h-5 w-5" />
//                                                 </button>
//                                                 <span className="font-medium">Link {index + 1}</span>
//                                             </div>
//                                             <Button
//                                                 variant="ghost"
//                                                 size="sm"
//                                                 onClick={() => removeLink(index)}
//                                                 className="text-gray-400 hover:text-red-400 hover:bg-transparent"
//                                             >
//                                                 <Trash2 className="h-4 w-4" />
//                                             </Button>
//                                         </div>

//                                         <div className="space-y-4">
//                                             <div className="space-y-2">
//                                                 <Label htmlFor={`link-title-${index}`}>Title</Label>
//                                                 <Input
//                                                     id={`link-title-${index}`}
//                                                     value={link.title}
//                                                     onChange={(e) => updateLink(index, "title", e.target.value)}
//                                                     className="bg-gray-800 border-gray-700 text-white"
//                                                     placeholder="Link title"
//                                                 />
//                                             </div>

//                                             <div className="space-y-2">
//                                                 <Label htmlFor={`link-url-${index}`}>URL</Label>
//                                                 <Input
//                                                     id={`link-url-${index}`}
//                                                     value={link.url}
//                                                     onChange={(e) => updateLink(index, "url", e.target.value)}
//                                                     className="bg-gray-800 border-gray-700 text-white"
//                                                     placeholder="https://example.com"
//                                                 />
//                                             </div>

//                                             <div className="space-y-2">
//                                                 <Label htmlFor={`link-icon-${index}`}>Icon</Label>
//                                                 <select
//                                                     id={`link-icon-${index}`}
//                                                     value={link.icon}
//                                                     onChange={(e) => updateLink(index, "icon", e.target.value)}
//                                                     className="w-full bg-gray-800 border-gray-700 text-white rounded-md p-2"
//                                                 >
//                                                     <option value="external">Default</option>
//                                                     <option value="instagram">Instagram</option>
//                                                     <option value="twitter">Twitter</option>
//                                                     <option value="youtube">YouTube</option>
//                                                     <option value="facebook">Facebook</option>
//                                                     <option value="linkedin">LinkedIn</option>
//                                                     <option value="github">GitHub</option>
//                                                     <option value="globe">Website</option>
//                                                     <option value="mail">Email</option>
//                                                 </select>
//                                             </div>

//                                             <div className="flex justify-between">
//                                                 <Button
//                                                     variant="outline"
//                                                     size="sm"
//                                                     onClick={() => moveLink(index, index - 1)}
//                                                     disabled={index === 0}
//                                                     className="border-gray-700 text-gray-200 hover:bg-gray-700"
//                                                 >
//                                                     Move Up
//                                                 </Button>
//                                                 <Button
//                                                     variant="outline"
//                                                     size="sm"
//                                                     onClick={() => moveLink(index, index + 1)}
//                                                     disabled={index === links.length - 1}
//                                                     className="border-gray-700 text-gray-200 hover:bg-gray-700"
//                                                 >
//                                                     Move Down
//                                                 </Button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </CardContent>
//                 </Card>

//                 <div className="flex justify-between items-center">
//                     <Button
//                         variant="outline"
//                         onClick={() => navigate(`/t/${username}`)}
//                         target="_blank"
//                         className="border-gray-700 text-gray-200 hover:bg-gray-800"
//                     >
//                         <ExternalLink className="h-4 w-4 mr-2" />
//                         Preview
//                     </Button>
//                     <Button onClick={saveLinkTree} disabled={saving} className="bg-purple-600 hover:bg-purple-700">
//                         {saving ? "Saving..." : "Save Changes"}
//                     </Button>
//                 </div>
//             </div> */}

//             <div className="space-y-6">
//                 <div className="flex items-center gap-4">
//                     <Button asChild variant="outline" size="sm" className="border-gray-700 text-gray-200 hover:bg-gray-800">
//                         <Link to="/dashboard/linktrees">
//                             <ArrowLeft className="h-4 w-4 mr-2" />
//                             Back
//                         </Link>
//                     </Button>
//                     <h1 className="text-2xl font-bold">Edit Link Tree</h1>
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                     <div className="lg:col-span-2 space-y-6">
//                         {/* Link Tree Settings */}
//                         <Card className="bg-gray-900/60 backdrop-blur-sm border-gray-800">
//                             <CardHeader>
//                                 <CardTitle>Link Tree Settings</CardTitle>
//                                 <CardDescription>Update your link tree information</CardDescription>
//                             </CardHeader>
//                             <CardContent className="space-y-4">
//                                 <div className="space-y-2">
//                                     <Label htmlFor="username">Username</Label>
//                                     <Input
//                                         id="username"
//                                         value={username}
//                                         onChange={(e) => setUsername(e.target.value)}
//                                         className="bg-gray-800/50 border-gray-700 text-white"
//                                     />
//                                     <p className="text-xs text-gray-400">
//                                         Your link tree will be available at {window.location.origin}/t/{username}
//                                     </p>
//                                 </div>
//                                 <div className="space-y-2">
//                                     <Label htmlFor="title">Title</Label>
//                                     <Input
//                                         id="title"
//                                         value={title}
//                                         placeholder="Your name or brand"
//                                         onChange={(e) => setTitle(e.target.value)}
//                                         className="bg-gray-800/50 border-gray-700"
//                                     />
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="bio">Bio</Label>
//                                     <Textarea
//                                         id="bio"
//                                         value={bio}
//                                         onChange={(e) => setBio(e.target.value)}
//                                         className="bg-gray-800/50 border-gray-700 text-white"
//                                         placeholder="A short description about you"
//                                     />
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="theme">Theme</Label>
//                                     <select
//                                         id="theme"
//                                         value={theme}
//                                         onChange={(e) => setTheme(e.target.value)}
//                                         className="w-full bg-gray-800/50 border-gray-700 text-white rounded-md p-2"
//                                     >
//                                         <option value="dark">Dark</option>
//                                         <option value="light">Light</option>
//                                     </select>
//                                 </div>
//                             </CardContent>
//                         </Card>

//                         {/* Links */}
//                         <Card className="bg-gray-900/60 backdrop-blur-sm border-gray-800">
//                             <CardHeader>
//                                 <CardTitle>Links</CardTitle>
//                                 <CardDescription>Manage the links in your link tree</CardDescription>
//                             </CardHeader>
//                             <CardContent className="space-y-4">
//                                 {links && links.length > 0 ? (
//                                     <div className="space-y-3">
//                                         {links.map((link) => (
//                                             <div key={link.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
//                                                 <div className="flex items-center gap-3">
//                                                     <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
//                                                         {iconOptions.find((i) => i.value === link.icon)?.icon || <Globe className="h-4 w-4" />}
//                                                     </div>
//                                                     <div>
//                                                         <p className="font-medium">{link.title}</p>
//                                                         <p className="text-sm text-gray-400 truncate max-w-xs">{link.url}</p>
//                                                     </div>
//                                                 </div>
//                                                 <Button
//                                                     variant="ghost"
//                                                     size="sm"
//                                                     onClick={() => removeLink(link.id)}
//                                                     className="text-gray-400 hover:text-red-400 hover:bg-transparent"
//                                                 >
//                                                     <Trash2 className="h-4 w-4" />
//                                                 </Button>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 ) : (
//                                     <p className="text-center text-gray-400 py-4">No links added yet</p>
//                                 )}

//                                 <Card className="bg-gray-800/50 border-gray-700">
//                                     <CardHeader>
//                                         <CardTitle className="text-lg">Add New Link</CardTitle>
//                                     </CardHeader>
//                                     <CardContent>
//                                         <form action={addLink} className="space-y-4">
//                                             <div className="space-y-2">
//                                                 <Label htmlFor="title">Link Title</Label>
//                                                 <Input
//                                                     id="title"
//                                                     name="title"
//                                                     placeholder="My Website"
//                                                     required
//                                                     className="bg-gray-700/50 border-gray-600"
//                                                 />
//                                             </div>
//                                             <div className="space-y-2">
//                                                 <Label htmlFor="url">URL</Label>
//                                                 <Input
//                                                     id="url"
//                                                     name="url"
//                                                     placeholder="https://example.com"
//                                                     required
//                                                     className="bg-gray-700/50 border-gray-600"
//                                                 />
//                                             </div>
//                                             <div className="space-y-2">
//                                                 <Label htmlFor="icon">Icon</Label>
//                                                 <select
//                                                     id="icon"
//                                                     name="icon"
//                                                     className="w-full rounded-md bg-gray-700/50 border-gray-600 text-white p-2"
//                                                 >
//                                                     {iconOptions.map((option) => (
//                                                         <option key={option.value} value={option.value}>
//                                                             {option.label}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </div>
//                                             <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
//                                                 <Plus className="h-4 w-4 mr-2" />
//                                                 Add Link
//                                             </Button>
//                                         </form>
//                                     </CardContent>
//                                 </Card>
//                             </CardContent>
//                         </Card>
//                     </div>

//                     {/* Preview */}
//                     <div className="lg:col-span-1">
//                         <Card className="bg-gray-900/60 backdrop-blur-sm border-gray-800 sticky top-6">
//                             <CardHeader>
//                                 <CardTitle>Preview</CardTitle>
//                                 <CardDescription>
//                                     <Link
//                                         to={`/t/${username}`}
//                                         target="_blank"
//                                         className="text-purple-400 hover:text-purple-300 flex items-center"
//                                     >
//                                         View live page
//                                         <ExternalLink className="h-3 w-3 ml-1" />
//                                     </Link>
//                                 </CardDescription>
//                             </CardHeader>
//                             <CardContent>
//                                 <div
//                                     className={`rounded-lg overflow-hidden ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"} p-4`}
//                                 >
//                                     <div className="flex flex-col items-center">
//                                         <div className="h-16 w-16 rounded-full bg-purple-600 mb-4"></div>
//                                         <h3
//                                             className={`text-lg font-bold mb-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
//                                         >
//                                             @{username}
//                                         </h3>
//                                         {title && (
//                                             <p
//                                                 className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
//                                             >
//                                                 {title}
//                                             </p>
//                                         )}
//                                         {bio && (
//                                             <p
//                                                 className={`text-xs text-center mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
//                                             >
//                                                 {bio}
//                                             </p>
//                                         )}

//                                         <div className="w-full mt-4 space-y-2">
//                                             {links &&
//                                                 links.map((link) => (
//                                                     <div
//                                                         key={link.id}
//                                                         className={`flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg ${theme === "dark"
//                                                                 ? "bg-gray-800 text-white"
//                                                                 : "bg-white text-gray-900 border border-gray-200"
//                                                             }`}
//                                                     >
//                                                         {iconOptions.find((i) => i.value === link.icon)?.icon || <Globe className="h-4 w-4" />}
//                                                         <span className="text-sm">{link.title}</span>
//                                                     </div>
//                                                 ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     </div>
//                 </div>
//             </div>
//         </DashboardLayout>
//     )
// }


import {
    Globe,
    Instagram,
    Twitter,
    Youtube,
    Facebook,
    Linkedin,
    Github,
    Mail,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Label } from "../../components/ui/label"
import { Trash2, Plus, ExternalLink, ArrowLeft } from "lucide-react"
import { useToast } from "../../hooks/use-toast"
import { supabase } from "../../lib/supabase"
import { useAuth } from "../../contexts/auth-context"
import DashboardLayout from "../../components/dashboard-layout"

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

const iconOptions = [
    { value: "globe", label: "Website", icon: <Globe className="h-4 w-4" /> },
    { value: "instagram", label: "Instagram", icon: <Instagram className="h-4 w-4" /> },
    { value: "twitter", label: "Twitter", icon: <Twitter className="h-4 w-4" /> },
    { value: "youtube", label: "YouTube", icon: <Youtube className="h-4 w-4" /> },
    { value: "facebook", label: "Facebook", icon: <Facebook className="h-4 w-4" /> },
    { value: "linkedin", label: "LinkedIn", icon: <Linkedin className="h-4 w-4" /> },
    { value: "github", label: "GitHub", icon: <Github className="h-4 w-4" /> },
    { value: "mail", label: "Email", icon: <Mail className="h-4 w-4" /> },
]

export default function EditLinkTreePage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { toast } = useToast()
    const { user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [linkTree, setLinkTree] = useState<LinkTree | null>(null)
    const [links, setLinks] = useState<LinkTreeLink[]>([])

    // Form state
    const [title, setTitle] = useState("")
    const [bio, setBio] = useState("")
    const [theme, setTheme] = useState("dark")
    const [username, setUsername] = useState("")
    const [newLink, setNewLink] = useState({
        title: "",
        url: "",
        icon: "globe"
    })

    useEffect(() => {
        const fetchLinkTree = async () => {
            if (!id || !user) return

            try {
                // Fetch the link tree
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
                    navigate("/linktrees")
                    return
                }

                setLinkTree(linkTreeData)
                setTitle(linkTreeData.title || "")
                setBio(linkTreeData.bio || "")
                setTheme(linkTreeData.theme || "dark")
                setUsername(linkTreeData.username || "")

                // Fetch the links
                const { data: linksData, error: linksError } = await supabase
                    .from("tree_links")
                    .select("*")
                    .eq("tree_id", id)
                    .order("position", { ascending: true })

                if (linksError) throw linksError

                setLinks(linksData || [])
            } catch (error) {
                console.error("Error fetching link tree:", error)
                toast({
                    title: "Error",
                    description: "Failed to load link tree",
                    variant: "destructive",
                })
                navigate("/linktrees")
            } finally {
                setLoading(false)
            }
        }

        fetchLinkTree()
    }, [id, user, toast, navigate])

    const addLink = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!newLink.title || !newLink.url) {
            toast({
                title: "Error",
                description: "Please fill in all link fields",
                variant: "destructive",
            })
            return
        }

        const linkToAdd = {
            ...newLink,
            position: links.length
        }

        try {
            if (id) {
                // If we have an ID, save to database immediately
                const { data, error } = await supabase
                    .from("tree_links")
                    .insert({
                        ...linkToAdd,
                        tree_id: id
                    })
                    .select()
                    .single()

                if (error) throw error

                setLinks([...links, data])
            } else {
                // For new link trees not yet saved
                setLinks([...links, linkToAdd])
            }

            setNewLink({
                title: "",
                url: "",
                icon: "globe"
            })

            toast({
                title: "Success",
                description: "Link added successfully",
            })
        } catch (error) {
            console.error("Error adding link:", error)
            toast({
                title: "Error",
                description: "Failed to add link",
                variant: "destructive",
            })
        }
    }

    const removeLink = async (linkId: string) => {
        try {
            if (id) {
                // Delete from database if link tree exists
                const { error } = await supabase
                    .from("tree_links")
                    .delete()
                    .eq("id", linkId)

                if (error) throw error
            }

            setLinks(links.filter(link => link.id !== linkId))
            toast({
                title: "Success",
                description: "Link removed successfully",
            })
        } catch (error) {
            console.error("Error removing link:", error)
            toast({
                title: "Error",
                description: "Failed to remove link",
                variant: "destructive",
            })
        }
    }

    const saveLinkTree = async () => {
        if (!user) return

        setSaving(true)

        try {
            let linkTreeId = id

            // Create or update link tree
            if (!linkTreeId) {
                // Create new link tree
                const { data, error } = await supabase
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

                if (error) throw error

                linkTreeId = data.id
                setLinkTree(data)
            } else {
                // Update existing link tree
                const { error } = await supabase
                    .from("link_trees")
                    .update({
                        username,
                        title,
                        bio,
                        theme,
                    })
                    .eq("id", linkTreeId)
                    .eq("user_id", user.id)

                if (error) throw error
            }

            // Save links if we have an ID
            if (linkTreeId) {
                // First delete existing links (if updating)
                if (id) {
                    await supabase
                        .from("tree_links")
                        .delete()
                        .eq("tree_id", linkTreeId)
                }

                // Then insert current links with proper positions
                if (links.length > 0) {
                    const linksToSave = links.map((link, index) => ({
                        title: link.title,
                        url: link.url,
                        icon: link.icon,
                        position: index,
                        tree_id: linkTreeId
                    }))

                    const { error } = await supabase
                        .from("tree_links")
                        .insert(linksToSave)

                    if (error) throw error
                }
            }

            toast({
                title: "Success",
                description: "Link tree saved successfully",
            })

            // If this was a new link tree, redirect to edit page
            if (!id) {
                navigate(`/linktree/${linkTreeId}`)
            }
        } catch (error) {
            console.error("Error saving link tree:", error)
            toast({
                title: "Error",
                description: "Failed to save link tree",
                variant: "destructive",
            })
        } finally {
            setSaving(false)
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
            <div className="space-y-6 ">
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="sm" className="border-gray-700 text-gray-200 hover:bg-gray-800">
                        <Link to="/dashboard/linktrees">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">{id ? "Edit Link Tree" : "Create Link Tree"}</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Link Tree Settings */}
                        <Card className="bg-gray-900/60 backdrop-blur-sm border-gray-800">
                            <CardHeader>
                                <CardTitle>Link Tree Settings</CardTitle>
                                <CardDescription>Update your link tree information</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="bg-gray-800/50 border-gray-700 text-white"
                                    />
                                    <p className="text-xs text-gray-400">
                                        Your link tree will be available at {window.location.origin}/t/{username}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={title}
                                        placeholder="Your name or brand"
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="bg-gray-800/50 border-gray-700"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        className="bg-gray-800/50 border-gray-700 text-white"
                                        placeholder="A short description about you"
                                    />
                                </div>

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

                        {/* Links */}
                        <Card className="bg-gray-900/60 backdrop-blur-sm border-gray-800">
                            <CardHeader>
                                <CardTitle>Links</CardTitle>
                                <CardDescription>Manage the links in your link tree</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {links && links.length > 0 ? (
                                    <div className="space-y-3">
                                        {links.map((link) => (
                                            <div key={link.id || link.url} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                                                        {iconOptions.find((i) => i.value === link.icon)?.icon || <Globe className="h-4 w-4" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{link.title}</p>
                                                        <p className="text-sm text-gray-400 truncate max-w-xs">{link.url}</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => link.id ? removeLink(link.id) : setLinks(links.filter(l => l.url !== link.url))}
                                                    className="text-gray-400 hover:text-red-400 hover:bg-transparent"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-400 py-4">No links added yet</p>
                                )}

                                <Card className="bg-gray-800/50 border-gray-700">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Add New Link</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={addLink} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="title">Link Title</Label>
                                                <Input
                                                    id="title"
                                                    name="title"
                                                    placeholder="My Website"
                                                    required
                                                    value={newLink.title}
                                                    onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                                                    className="bg-gray-700/50 border-gray-600"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="url">URL</Label>
                                                <Input
                                                    id="url"
                                                    name="url"
                                                    placeholder="https://example.com"
                                                    required
                                                    value={newLink.url}
                                                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                                                    className="bg-gray-700/50 border-gray-600"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="icon">Icon</Label>
                                                <select
                                                    id="icon"
                                                    name="icon"
                                                    value={newLink.icon}
                                                    onChange={(e) => setNewLink({ ...newLink, icon: e.target.value })}
                                                    className="w-full rounded-md bg-gray-700/50 border-gray-600 text-white p-2"
                                                >
                                                    {iconOptions.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Link
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Preview */}
                    <div className="lg:col-span-1">
                        <Card className="bg-gray-900/60 backdrop-blur-sm border-gray-800 sticky top-6">
                            <CardHeader>
                                <CardTitle>Preview</CardTitle>
                                <CardDescription>
                                    {id ? (
                                        <Link
                                            to={`/${username}`}
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
                                <div
                                    className={`rounded-lg overflow-hidden ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"} p-4`}
                                >
                                    <div className="flex flex-col items-center">
                                        <div className="h-16 w-16 rounded-full bg-purple-600 mb-4"></div>
                                        <h3
                                            className={`text-lg font-bold mb-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                                        >
                                            @{username || "username"}
                                        </h3>
                                        {title && (
                                            <p
                                                className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                                            >
                                                {title}
                                            </p>
                                        )}
                                        {bio && (
                                            <p
                                                className={`text-xs text-center mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                                            >
                                                {bio}
                                            </p>
                                        )}

                                        <div className="w-full mt-4 space-y-2">
                                            {links.length > 0 ? (
                                                links.map((link) => (
                                                    <div
                                                        key={link.id || link.url}
                                                        className={`flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg ${theme === "dark"
                                                            ? "bg-gray-800 text-white"
                                                            : "bg-white text-gray-900 border border-gray-200"
                                                            }`}
                                                    >
                                                        {iconOptions.find((i) => i.value === link.icon)?.icon || <Globe className="h-4 w-4" />}
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
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button
                        onClick={saveLinkTree}
                        disabled={saving}
                        className="bg-purple-600 hover:bg-purple-700"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>
        </DashboardLayout>
    )
}