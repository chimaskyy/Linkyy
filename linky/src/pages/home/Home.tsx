import { useState, useCallback, useMemo, lazy, Suspense, useEffect } from "react"
import { Link } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { useAuth } from "../../contexts/auth-context"
import { Link2, Key, ExternalLink, QrCode } from "lucide-react"
import Header from "../../components/Header"
import StarsBackground from "./Star"
// Lazy load heavy components
const UrlShortenerForm = lazy(() => import("../../components/url/UrlShortenerForm"))
const PasswordGeneratorForm = lazy(() => import("../../components/password/PasswordGenerator"))
const SimpleLinkTreeForm = lazy(() => import("./LinkTree"))
const QRCodeGeneratorForm = lazy(() => import("../qr-code/QrCodeForm"))

interface TabConfig {
    value: string
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    label: string
    title: string
    description: string
    requiresAuth?: boolean // Add this property to mark tabs that require authentication
}

interface FormProps {
    [key: string]: unknown
}

type TabValue = string

interface TabValueChangeHandler {
    (value: string): void
}

// Loading component for suspense fallback
const FormLoader = () => (
    <div className="flex items-center justify-center py-8" role="status" aria-label="Loading form">
        <div className="animate-pulse flex flex-col items-center space-y-4">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
            <div className="h-12 bg-gray-200 rounded w-full max-w-md"></div>
            <div className="h-10 bg-gray-200 rounded w-24"></div>
        </div>
        <span className="sr-only">Loading form content</span>
    </div>
)

const Logo = ({ className = "" }) => (
    <div className={`flex items-center space-x-2 ${className}`}>
        <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center" aria-hidden="true">
            <div className="h-6 w-6 rounded-full bg-purple-600"></div>
        </div>
        <span className="text-xl font-bold">Linky</span>
    </div>
)

// Tab configuration 
const TAB_CONFIG: TabConfig[] = [
    {
        value: "shorten",
        icon: Link2,
        label: "Short link",
        title: "Shorten a long link",
        description: "Create a shorter and easy to remember link.",
    },
    {
        value: "password",
        icon: Key,
        label: "Password",
        title: "Generate secure password",
        description: "Create strong, unique passwords for your accounts.",
    },
    {
        value: "linktree",
        icon: ExternalLink,
        label: "Link Tree",
        title: "Create your link tree",
        description: "Showcase all your important links in one place.",
        requiresAuth: true, 
    },
    {
        value: "qr-code",
        icon: QrCode,
        label: "QR Code",
        title: "Generate QR Code",
        description: "Create a QR code for any link or text.",
    },
]

export default function HomePage() {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState("shorten")

    // Filter tabs based on authentication status
    const availableTabs = useMemo(() => {
        return TAB_CONFIG.filter(tab => !tab.requiresAuth || user)
    }, [user])

    // Reset active tab if it's no longer available (e.g., user logs out while on Link Tree tab)
    useEffect(() => {
        const isActiveTabAvailable = availableTabs.some(tab => tab.value === activeTab)
        if (!isActiveTabAvailable) {
            setActiveTab("shorten") // Default to first available tab
        }
    }, [availableTabs, activeTab])

    const handleTabChange: TabValueChangeHandler = useCallback((value) => {
        setActiveTab(value)
    }, [])

    // const currentTabConfig = useMemo(() =>
    //     availableTabs.find(tab => tab.value === activeTab)
    //     , [availableTabs, activeTab])

    const renderTabContent = useCallback((tabValue: TabValue) => {
        const config: TabConfig | undefined = availableTabs.find(tab => tab.value === tabValue)
        if (!config) return null

        let FormComponent: React.ComponentType<FormProps>
        let formProps: FormProps = {}

        switch (tabValue) {
            case "shorten":
                FormComponent = UrlShortenerForm
                formProps = {
                    theme: "light",
                    buttonVariant: "purple",
                    requireTitle: true,
                }
                break
            case "password":
                FormComponent = PasswordGeneratorForm
                break
            case "linktree":
                FormComponent = SimpleLinkTreeForm
                break
            case "qr-code":
                FormComponent = QRCodeGeneratorForm
                formProps = { theme: "light" }
                break
            default:
                return null
        }

        return (
            <TabsContent value={tabValue} className="mt-0">
                <div className="space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {config.title}
                        </h2>
                        <p className="text-gray-600">
                            {config.description}
                        </p>
                    </div>
                    <Suspense fallback={<FormLoader />}>
                        <FormComponent {...formProps} />
                    </Suspense>
                </div>
            </TabsContent>
        )
    }, [availableTabs])

    return (
        <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black text-white overflow-hidden relative">
            <StarsBackground />
            {/* Navigation */}

            <Header />

            {/* Hero Section */}
            <main id="main-content" className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 lg:pt-32">
                <div className="max-w-4xl mx-auto">
                    {/* Hero Text */}
                    <section className="text-center mb-16">
                        <p className="text-xs sm:text-sm tracking-widest text-purple-400 mb-4 uppercase" role="doc-subtitle">
                            Your link management solution
                        </p>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                            Simplify your online presence
                        </h1>
                        <p className="text-gray-400 text-sm md:text-lg mb-10 max-w-2xl mx-auto">
                            Linky is your all-in-one tool for shortening URLs, creating beautiful link trees, and generating secure
                            passwords. Manage your links effortlessly and enhance your online presence.
                        </p>
                    </section>

                    {/* Main Tabs Interface */}
                    <section className="bg-white rounded-3xl p-8 shadow-2xl max-w-3xl mx-auto" aria-label="Link management tools">
                        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                            {/* Tab Navigation */}
                            <div className="flex justify-center mb-8">
                                <TabsList
                                    className="w-full max-w-md md:max-w-xl flex flex-row gap-4 bg-gray-100 p-1 rounded-xl"
                                    aria-label="Tool selection"
                                >
                                    {availableTabs.map(({ value, icon: Icon, label }) => (
                                        <TabsTrigger
                                            key={value}
                                            value={value}
                                            className="flex items-center gap-2 data-[state=active]:bg-purple-900 data-[state=active]:shadow-sm rounded-lg py-1 md:py-2 px-4 text-gray-700 data-[state=active]:text-white focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                                            aria-label={`${label} tool`}
                                        >
                                            <Icon className="h-4 w-4" aria-hidden="true" />
                                            <span className="hidden sm:inline">{label}</span>
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </div>

                            {/* Tab Content */}
                            {availableTabs.map(({ value }) => renderTabContent(value))}
                        </Tabs>

                        {/* Login prompt for non-authenticated users */}
                        {!user && (
                            <aside className="mt-8 p-4 bg-purple-50 rounded-lg border border-purple-200" role="complementary">
                                <p className="text-center text-purple-800">
                                    <Link
                                        to="/login"
                                        className="font-bold underline focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded"
                                    >
                                        Sign in
                                    </Link>{" "}
                                    to save your work and access all features including Link Tree, or{" "}
                                    <Link
                                        to="/register"
                                        className="font-bold underline focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded"
                                    >
                                        Create an account
                                    </Link>
                                    .
                                </p>
                            </aside>
                        )}
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-gray-800 mt-32 py-12" role="contentinfo">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <Logo />
                        <div className="mt-8 md:mt-0 text-center md:text-left text-gray-500 text-sm">
                            <p>© {new Date().getFullYear()} Linky. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}