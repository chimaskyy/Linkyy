"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { ExternalLink, Trash2, Search, Clock, Edit, Pencil } from "lucide-react"
import { useToast } from "../../hooks/use-toast"
import { supabase } from "../../lib/supabase"
import { useAuth } from "../../contexts/auth-context"
import { formatDate } from "../../lib/utils"
import { LinkTreeForm } from "../../components/link-tree-form"
import DashboardLayout from "../../components/dashboard-layout"
import { Link } from "react-router-dom"

interface LinkTree {
  id: string
  user_id: string
  username: string
  title: string
  theme: string
  links: string[]
  link_tree_id: string
  link_tree_name: string
  link_tree_username: string
  link_tree_description: string
  description: string
  created_at: string
}

export default function LinkTreesPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [linkTrees, setLinkTrees] = useState<LinkTree[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLinkTrees = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from("link_trees")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error

        setLinkTrees(data || [])
      } catch (error) {
        console.error("Error fetching link trees:", error)
        toast({
          title: "Error",
          description: "Failed to load link trees",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchLinkTrees()
  }, [user, toast])

  const deleteLinkTree = async (id: string) => {
    if (!user) return

    try {
      // First delete all links associated with this link tree
      const { error: linksError } = await supabase.from("links").delete().eq("link_tree_id", id)

      if (linksError) throw linksError

      // Then delete the link tree itself
      const { error } = await supabase.from("link_trees").delete().eq("id", id).eq("user_id", user.id)

      if (error) throw error

      setLinkTrees((prev) => prev.filter((tree) => tree.id !== id))
      toast({
        title: "Link tree deleted",
        description: "Link tree has been deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting link tree:", error)
      toast({
        title: "Error",
        description: "Failed to delete link tree",
        variant: "destructive",
      })
    }
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">My Link Trees</h1>
          <Button asChild className="bg-purple-600 hover:bg-purple-700">
            <Link to="/dashboard">Create New</Link>
          </Button>
        </div>
          
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : linkTrees.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {linkTrees.map((tree) => (
                    <Card key={tree.id} className="bg-gray-900/60 backdrop-blur-sm border-gray-800">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-lg">@{tree.username}</CardTitle>
                          <form
                            action={async () => {
                              await deleteLinkTree(tree.id)
                            }}
                          >
                            <Button
                              type="submit"
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-red-400 hover:bg-transparent"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </form>
                        </div>
                        <CardDescription>{tree.title || "No title"}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-400">Created: {formatDate(tree.created_at)}</p>
                        <p className="text-sm text-gray-400">Theme: {tree.theme}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button asChild variant="outline" size="sm" className="border-gray-700 text-gray-200 hover:bg-gray-800">
                          <Link to={`/linktree/${tree.id}`}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm" className="border-gray-700 text-gray-200 hover:bg-gray-800">
                          <Link to={`/${tree.username}`} target="_blank">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
            ) : (
                <Card className="bg-gray-900/60 backdrop-blur-sm border-gray-800">
                  <CardContent className="pt-6 text-center">
                    <p className="text-gray-400">You haven't created any link trees yet.</p>
                    <Button asChild className="mt-4 bg-purple-600 hover:bg-purple-700">
                      <Link to="/dashboard">Create Your First Link Tree</Link>
                    </Button>
                  </CardContent>
                </Card>
            )}
          </CardContent>
        
      </div>
    </DashboardLayout>
  )
}
