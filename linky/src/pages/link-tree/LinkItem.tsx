"use client"

import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Trash2, Grip } from "lucide-react"
import { iconOptions } from "./Icons"

interface LinkTreeLink {
    id?: string
    title: string
    url: string
    icon: string
    position: number
    tree_id?: string
}

interface LinkItemProps {
    link: LinkTreeLink
    index: number
    onUpdate: (index: number, field: keyof LinkTreeLink, value: string) => void
    onRemove: (index: number) => void
    onMoveUp: (index: number) => void
    onMoveDown: (index: number) => void
    canMoveUp: boolean
    canMoveDown: boolean
}

export function LinkItem({
    link,
    index,
    onUpdate,
    onRemove,
    onMoveUp,
    onMoveDown,
    canMoveUp,
    canMoveDown,
}: LinkItemProps) {
    return (
        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <button
                        type="button"
                        className="mr-2 cursor-move text-gray-400 hover:text-white"
                        aria-label="Drag to reorder"
                    >
                        <Grip className="h-5 w-5" />
                    </button>
                    <span className="font-medium">Link {index + 1}</span>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(index)}
                    className="text-gray-400 hover:text-red-400 hover:bg-transparent"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor={`link-title-${index}`}>Title</Label>
                    <Input
                        id={`link-title-${index}`}
                        value={link.title}
                        onChange={(e) => onUpdate(index, "title", e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="Link title"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor={`link-url-${index}`}>URL</Label>
                    <Input
                        id={`link-url-${index}`}
                        value={link.url}
                        onChange={(e) => onUpdate(index, "url", e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="https://example.com"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor={`link-icon-${index}`}>Icon</Label>
                    <select
                        id={`link-icon-${index}`}
                        value={link.icon}
                        onChange={(e) => onUpdate(index, "icon", e.target.value)}
                        className="w-full bg-gray-800 border-gray-700 text-white rounded-md p-2"
                    >
                        {iconOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onMoveUp(index)}
                        disabled={!canMoveUp}
                        className="border-gray-700 text-gray-200 hover:bg-gray-700"
                    >
                        Move Up
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onMoveDown(index)}
                        disabled={!canMoveDown}
                        className="border-gray-700 text-gray-200 hover:bg-gray-700"
                    >
                        Move Down
                    </Button>
                </div>
            </div>
        </div>
    )
}
