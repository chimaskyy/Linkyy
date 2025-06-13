import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Link2, ExternalLink, Clock, Key, QrCode } from "lucide-react"
import { formatDate } from "../../lib/utils"
import { supabase } from "../../lib/supabase"
import { useAuth } from "../../contexts/auth-context"
import DashboardLayout from "../../components/dashboard-layout"
import { LoadingSpinner } from "../../components/LoadingSpinner"
import { StatsCard } from "../../components/dashboard/StatsCard"
import { RecentItemsCard } from "../../components/dashboard/RecentItemCard"

export default function DashboardPage() {
  const { user } = useAuth()
  const [urlCount, setUrlCount] = useState(0)
  const [linkTreeCount, setLinkTreeCount] = useState(0)
  const [passwordCount, setPasswordCount] = useState(0)
  const [qrCodeCount, setQrCodeCount] = useState(0)
  // const [totalClickCount, setTotalClickCount] = useState(0)
  const [recentUrls, setRecentUrls] = useState<unknown[]>([])
  const [recentLinkTrees, setRecentLinkTrees] = useState<unknown[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        // Get URL count
        const { count: urlCountData } = await supabase
          .from("urls")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)

        setUrlCount(urlCountData || 0)

        // Get link tree count
        const { count: linkTreeCountData } = await supabase
          .from("link_trees")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)

        setLinkTreeCount(linkTreeCountData || 0)

        // Get password count
        const { count: passwordCountData } = await supabase
          .from("passwords")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)

        setPasswordCount(passwordCountData || 0)

        // get qr code count
        const { count: qrCodeCountData } = await supabase
          .from("qr_codes")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)

        setQrCodeCount(qrCodeCountData || 0)

        // Get total clicks
        // const { data: totalClicks } = await supabase.from("urls").select("clicks").eq("user_id", user.id)

        // const totalClicksCount = totalClicks?.reduce((sum, url) => sum + (url.clicks || 0), 0) || 0
        // setTotalClickCount(totalClicksCount)

        // Get recent URLs
        const { data: recentUrlsData } = await supabase
          .from("urls")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5)

        setRecentUrls(recentUrlsData || [])

        // Get recent link trees
        const { data: recentLinkTreesData } = await supabase
          .from("link_trees")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3)

        setRecentLinkTrees(recentLinkTreesData || [])
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    )
  }

  type UrlItem = {
    id: string
    title?: string
    created_at: string
    clicks: number
    short_code: string
  }

  const renderUrlItem = (url: UrlItem) => (
    <div key={url.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
      <div className="truncate mr-4">
        <p className="font-medium truncate">{url.title || "Untitled Link"}</p>
        <div className="flex items-center text-xs text-gray-400">
          <Clock className="h-3 w-3 mr-1" />
          <span>{formatDate(url.created_at)}</span>
          <span className="mx-2">•</span>
          <span className="bg-purple-600/20 text-purple-400 px-1.5 py-0.5 rounded-sm">
            {url.clicks} clicks
          </span>
        </div>
      </div>
      <div className="flex items-center">
        <Link
          to={`/${url.short_code}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-purple-400 hover:text-purple-300 flex items-center"
        >
          {url.short_code}
          <ExternalLink className="h-3 w-3 ml-1" />
        </Link>
      </div>
    </div>
  )

  type LinkTreeItem = {
    id: string
    username: string
    title?: string
    created_at?: string
  }

  const renderLinkTreeItem = (tree: LinkTreeItem) => (
    <div key={tree.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
      <div>
        <p className="font-medium">@{tree.username}</p>
        <p className="text-xs text-gray-400">{tree.title || "No title"}</p>
      </div>
      <Link
        to={`/tree/${tree.username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-purple-400 hover:text-purple-300 flex items-center"
      >
        View
        <ExternalLink className="h-3 w-3 ml-1" />
      </Link>
    </div>
  )

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            icon={<Link2 className="h-5 w-5 mr-2 text-purple-400" />}
           
            value={urlCount || 0}
            description="Total URLs"
          />
          <StatsCard
            icon={<ExternalLink className="h-5 w-5 mr-2 text-purple-400" />}
            
            value={linkTreeCount || 0}
            description="Total Link Trees"
          />
          <StatsCard
            icon={<Key className="h-5 w-5 mr-2 text-purple-400" />}
           
            value={passwordCount || 0}
            description="Saved Passwords"
          />
          <StatsCard
            icon={<QrCode className="h-5 w-5 mr-2 text-purple-400" />}
            
            value={qrCodeCount || 0}
            description="Generated QR Codes"
          />
          {/* <StatsCard
            icon={<BarChart className="h-5 w-5 mr-2 text-purple-400" />}
            
            value={totalClickCount}
            description="Total Clicks"
          /> */}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentItemsCard
            title="Recent URLs"
            description="Your recently created short links"
            viewAllLink="/urls"
            items={recentUrls}
            emptyMessage="No URLs created yet"
            renderItem={renderUrlItem}
          />
          <RecentItemsCard
            title="Recent Link Trees"
            description="Your recently created link trees"
            viewAllLink="/linktrees"
            items={recentLinkTrees}
            emptyMessage="No link trees created yet"
            renderItem={renderLinkTreeItem}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}