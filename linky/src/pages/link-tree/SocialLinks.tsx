import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Plus } from "lucide-react"
import { LinkItem } from "./LinkItem"

interface LinkTreeLink {
    id?: string
    title: string
    url: string
    icon: string
    position: number
    tree_id?: string
}

interface LinksManagerProps {
    links: LinkTreeLink[]
    onAddLink: () => void
    onUpdateLink: (index: number, field: keyof LinkTreeLink, value: string) => void
    onRemoveLink: (index: number) => void
    onMoveLink: (fromIndex: number, toIndex: number) => void
}

export function SocialLinks({ links, onAddLink, onUpdateLink, onRemoveLink, onMoveLink }: LinksManagerProps) {
    return (
        <Card className="bg-gray-900/60 backdrop-blur-sm border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Links</CardTitle>
                    <CardDescription>Add links to your social profiles or websites</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {links.map((link, index) => (
                        <LinkItem
                            key={index}
                            link={link}
                            index={index}
                            onUpdate={onUpdateLink}
                            onRemove={onRemoveLink}
                            onMoveUp={(index) => onMoveLink(index, index - 1)}
                            onMoveDown={(index) => onMoveLink(index, index + 1)}
                            canMoveUp={index > 0}
                            canMoveDown={index < links.length - 1}
                        />
                    ))}
                </div>
                <Button type="button" onClick={onAddLink} className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Link
                </Button>
            </CardContent>
        </Card>
    )
}
