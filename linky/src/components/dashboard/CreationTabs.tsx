import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import type { ReactNode } from "react"

interface TabContent {
    value: string
    label: string
    content: ReactNode
}

interface CreationTabsProps {
    tabs: TabContent[]
    defaultValue?: string
}

export function CreationTabs({ tabs, defaultValue }: CreationTabsProps) {
    return (
        <Card className="bg-gray-900/60 backdrop-blur-sm border-gray-800">
            <CardHeader className="pb-4">
                <CardTitle>Create New</CardTitle>
                <CardDescription>Shorten a URL, create a link tree, or generate a password</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <Tabs defaultValue={defaultValue || tabs[0].value} className="w-full">
                    <div className="relative mb-4 md:overflow-x-hidden">
                        <TabsList className="grid w-full min-w-[350px] grid-cols-3 mr-6 overflow-x-auto rounded-lg bg-gray-800/50 backdrop-blur-sm border-gray-700">
                            {tabs.map((tab) => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className="data-[state=active]:bg-purple-600 whitespace-nowrap text-xs sm:text-base"
                                >
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    {tabs.map((tab) => (
                        <TabsContent key={tab.value} value={tab.value} className="mt-0">
                            <div className="pt-2">
                                {tab.content}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </CardContent>
        </Card>
    )
}