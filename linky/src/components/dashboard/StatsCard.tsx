import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { ReactNode } from "react"

interface StatsCardProps {
    icon: ReactNode
    title: string
    value: number | string
    description: string
}

export function StatsCard({ icon, title, value, description }: StatsCardProps) {
    return (
        <Card className="bg-gray-900/60 backdrop-blur-sm border-gray-800">
            <CardHeader className="pb-2">
                <CardDescription>{description}</CardDescription>
                <CardTitle className="text-2xl flex items-center">
                    {icon}
                    {value}
                </CardTitle>
            </CardHeader>
        </Card>
    )
}