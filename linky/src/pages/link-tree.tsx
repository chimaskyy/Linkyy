"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { Instagram, Twitter, Youtube, Facebook, Linkedin, Github, Globe, Mail, ExternalLink } from "lucide-react"

const iconMap: Record<string, React.ReactNode> = {
  instagram: <Instagram className="h-5 w-5" />,
  twitter: <Twitter className="h-5 w-5" />,
  youtube: <Youtube className="h-5 w-5" />,
  facebook: <Facebook className="h-5 w-5" />,
  linkedin: <Linkedin className="h-5 w-5" />,
  github: <Github className="h-5 w-5" />,
  globe: <Globe className="h-5 w-5" />,
  mail: <Mail className="h-5 w-5" />,
  external: <ExternalLink className="h-5 w-5" />,
}

export default function LinkTreePage() {
  const { username } = useParams<{ username: string }>()
  const [linkTree, setLinkTree] = useState<any | null>(null)
  const [links, setLinks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLinkTree = async () => {
      if (!username) return

      try {
        // Fetch the link tree
        const { data: linkTreeData, error: linkTreeError } = await supabase
          .from("link_trees")
          .select("*")
          .eq("username", username)
          .single()

        if (linkTreeError || !linkTreeData) {
          setError("Link tree not found")
          setLoading(false)
          return
        }

        setLinkTree(linkTreeData)

        // Fetch the links
        const { data: linksData } = await supabase
          .from("tree_links")
          .select("*")
          .eq("tree_id", linkTreeData.id)
          .order("position", { ascending: true })

        setLinks(linksData || [])
      } catch (error) {
        console.error("Error fetching link tree:", error)
        setError("An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchLinkTree()
  }, [username])

  const incrementLinkClick = async (linkId: string) => {
    try {
      await supabase
        .from("tree_links")
        .update({ clicks: links.find((l) => l.id === linkId)?.clicks + 1 || 1 })
        .eq("id", linkId)
    } catch (error) {
      console.error("Error incrementing link click:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (error || !linkTree) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-lg mb-4">{error || "Link tree not found"}</p>
          <Link to="/" className="text-purple-400 hover:text-purple-300">
            Go to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen ${linkTree.theme === "dark" ? "bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black" : "bg-gray-100"} flex flex-col items-center py-10 px-4`}
    >
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          {linkTree.avatar_url ? (
            <img
              src={linkTree.avatar_url || "/placeholder.svg"}
              alt={linkTree.username}
              className="w-24 h-24 rounded-full object-cover mb-4"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-purple-600 mb-4 flex items-center justify-center text-white text-2xl font-bold">
              {linkTree.username.charAt(0).toUpperCase()}
            </div>
          )}

          <h1 className={`text-2xl font-bold ${linkTree.theme === "dark" ? "text-white" : "text-gray-900"}`}>
            @{linkTree.username}
          </h1>

          {linkTree.title && (
            <h2 className={`text-lg font-medium mt-1 ${linkTree.theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              {linkTree.title}
            </h2>
          )}

          {linkTree.bio && (
            <p className={`text-center mt-2 ${linkTree.theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              {linkTree.bio}
            </p>
          )}
        </div>

        <div className="space-y-3 w-full">
          {links &&
            links.map((link) => {
              const icon = link.icon && iconMap[link.icon] ? iconMap[link.icon] : iconMap.external

              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg transition-colors ${
                    linkTree.theme === "dark"
                      ? "bg-gray-800 hover:bg-gray-700 text-white"
                      : "bg-white hover:bg-gray-100 text-gray-900 border border-gray-200"
                  }`}
                  onClick={() => incrementLinkClick(link.id)}
                >
                  {icon}
                  <span>{link.title}</span>
                </a>
              )
            })}
        </div>

        <div className="mt-10 text-center">
          <p className={`text-sm ${linkTree.theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
            Powered by{" "}
            <Link to="/" className="text-purple-500 hover:text-purple-400">
              Linky
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
