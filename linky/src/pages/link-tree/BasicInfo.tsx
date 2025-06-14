import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { ExternalLink } from "lucide-react"

interface BasicInfoFormProps {
    username: string
    title: string
    theme: string
    onUsernameChange: (value: string) => void
    onTitleChange: (value: string) => void
    onThemeChange: (value: string) => void
}

export function BasicInfoForm({
    username,
    title,
    theme,
    onUsernameChange,
    onTitleChange,
    onThemeChange,
}: BasicInfoFormProps) {
    return (
        <Card className="bg-gray-900/60 backdrop-blur-sm border-gray-800">
            <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Set up your link tree details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="username">Username (required)</Label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            <ExternalLink className="h-5 w-5" />
                        </div>
                        <Input
                            id="username"
                            type="text"
                            placeholder="Your username"
                            value={username}
                            onChange={(e) => onUsernameChange(e.target.value)}
                            className="pl-10 bg-gray-800/50 border-gray-700 text-white h-12 w-full focus:border-purple-500 focus:ring-purple-500"
                            required
                        />
                    </div>
                    <p className="text-xs text-gray-400">
                        Your link tree will be available at {window.location.origin}/t/{username}
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        type="text"
                        placeholder="Your name or brand"
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        className="bg-gray-800/50 border-gray-700 text-white"
                    />
                </div>

                {/* <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                        id="bio"
                        placeholder="A short description about you"
                        value={bio}
                        onChange={(e) => onBioChange(e.target.value)}
                        className="bg-gray-800/50 border-gray-700 text-white"
                    />
                </div> */}

                <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <select
                        id="theme"
                        value={theme}
                        onChange={(e) => onThemeChange(e.target.value)}
                        className="w-full bg-gray-800/50 border-gray-700 text-white rounded-md p-2"
                    >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                    </select>
                </div>
            </CardContent>
        </Card>
    )
}
