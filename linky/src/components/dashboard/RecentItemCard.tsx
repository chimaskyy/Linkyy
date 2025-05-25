import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Link } from "react-router-dom"
import { ReactNode } from "react"

interface RecentItemsCardProps {
    title: string
    description: string
    viewAllLink: string
    items: any[]
    emptyMessage: string
    renderItem: (item: any) => ReactNode
}

export function RecentItemsCard({
    title,
    description,
    viewAllLink,
    items,
    emptyMessage,
    renderItem
}: RecentItemsCardProps) {
    return (
        <Card className="bg-gray-900/60 backdrop-blur-sm border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
                <Link to={viewAllLink} className="text-sm text-purple-400 hover:text-purple-300">
                    View all
                </Link>
            </CardHeader>
            <CardContent>
                {items && items.length > 0 ? (
                    <div className="space-y-3">
                        {items.map((item) => renderItem(item))}
                    </div>
                ) : (
                    <p className="text-center text-gray-400 py-4">{emptyMessage}</p>
                )}
            </CardContent>
        </Card>
    )
}