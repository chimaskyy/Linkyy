import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { ExternalLink, Trash2, Clock, Pencil } from "lucide-react"
import { supabase } from "../../lib/supabase"
import { useAuth } from "../../contexts/auth-context"
import { formatDate } from "../../lib/utils"
import DashboardLayout from "../../components/dashboard-layout"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import { LoadingSpinner } from "../../components/LoadingSpinner"
interface LinkTree {
  id: string
  user_id: string
  username: string
  title: string
  theme: string
  links: string[]
  description: string
  created_at: string
}

export default function LinkTreesPage() {
  const { user } = useAuth()
  const [linkTrees, setLinkTrees] = useState<LinkTree[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchLinkTrees = async () => {
      if (!user) return

      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("link_trees")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error

        setLinkTrees(data || [])
      } catch (error) {
        console.error("Error fetching link trees:", error)
        toast.error("Failed to load link trees")
      } finally {
        setLoading(false)
      }
    }

    fetchLinkTrees()
  }, [user])

  const deleteLinkTree = async (id: string) => {
    if (!user) return

    try {
      setDeletingId(id)

      // First delete all links associated with this link tree
      const { error: linksError } = await supabase
        .from("tree_links")
        .delete()
        .eq("id", id)

      if (linksError) throw linksError

      // Then delete the link tree itself
      const { error } = await supabase
        .from("link_trees")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)

      if (error) throw error

      setLinkTrees(prev => prev.filter(tree => tree.id !== id))
      toast.success("Link tree has been deleted successfully")
    } catch (error) {
      console.log("Error deleting link tree:", error)
      toast.error("Failed to delete link tree")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <DashboardLayout>
      <main className="space-y-8">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Link Trees</h1>
          <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
            <Link to="/new-link-tree">Create New</Link>
          </Button>
        </header>

        <section aria-labelledby="link-trees-heading">
          {loading ? (
            <div
              className="flex justify-center py-8"
              aria-live="polite"
              aria-busy={loading}
            >
              <div
                className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"
                role="status"
              >
                <LoadingSpinner />
              </div>
            </div>
          ) : linkTrees.length > 0 ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              role="list"
            >
              {linkTrees.map((tree) => (
                <Card
                  key={tree.id}
                  className="bg-gray-900/60 backdrop-blur-sm border-gray-800"
                  role="listitem"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">
                        <span className="sr-only">Username: </span>
                        @{tree.username}
                      </CardTitle>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-red-400 hover:bg-transparent"
                        onClick={() => deleteLinkTree(tree.id)}
                        disabled={deletingId === tree.id}
                        aria-label={`Delete link tree ${tree.title}`}
                      >
                        {deletingId === tree.id ? (
                          <Clock className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <CardDescription>
                      {tree.title || "No title"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-400">
                      <span className="sr-only">Created: </span>
                      {formatDate(tree.created_at)}
                    </p>
                    <p className="text-sm text-gray-400">
                      <span className="sr-only">Theme: </span>
                      {tree.theme || "Default theme"}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between gap-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="border-gray-700 text-gray-200 hover:bg-gray-800 flex-1"
                    >
                      <Link
                        to={`/linktree/${tree.id}`}
                        aria-label={`Edit ${tree.title}`}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="border-gray-700 text-gray-200 hover:bg-gray-800 flex-1"
                    >
                      <Link
                        to={`/t/${tree.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${tree.title}`}
                      >
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
                <Button
                  asChild
                  className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Link to="/new-link-tree">
                    Create Your First Link Tree
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </DashboardLayout>
  )
}