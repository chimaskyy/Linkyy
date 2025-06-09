import Shorten from "./Shorten"
import Password from "./Password"
import LinkTree from "./LinkTree"
import Header from "../../components/Header"
// import { Button } from "../../components/ui/button"
export default function HomePage() {

    return (
        <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black text-white overflow-hidden relative">
            {/* Stars background effect */}
            <div className="absolute inset-0 z-0">
                {Array.from({ length: 100 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white"
                        style={{
                            width: Math.random() * 2 + "px",
                            height: Math.random() * 2 + "px",
                            top: Math.random() * 100 + "%",
                            left: Math.random() * 100 + "%",
                            opacity: Math.random() * 0.5 + 0.3,
                        }}
                    />
                ))}
            </div>

            {/* Navigation */}
            <Header />

            {/* Hero Section */}
            <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 lg:pt-32 text-center">
                <div className="max-w-3xl mx-auto">
                    <p className="text-xs sm:text-sm tracking-widest text-purple-400 mb-4">YOUR LINK MANAGEMENT SOLUTION</p>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight  font-['Poppins']">
                        Simplify your online presence
                    </h1>
                    <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
                        Linky is your all-in-one tool for shortening URLs, creating beautiful link trees, and generating secure passwords.
                        Manage your links effortlessly and enhance your online presence.
                    </p>
                </div>

                {/* Features Section */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* URL Shortener Feature */}
                    <Shorten />

                    {/* Link Tree Feature */}
                    <LinkTree />

                    {/* Password Generator Feature */}
                    <Password />
                </div>

{/* how it works */}
                <div className="mt-32 max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">How It Works</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Linky makes it simple to manage your online presence with powerful yet easy-to-use tools.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
                            <div className="text-purple-400 mb-4">1</div>
                            <h3 className="text-xl font-bold mb-3">Create an account</h3>
                            <p className="text-gray-400">
                                Sign up in seconds to access all features and save your work.
                            </p>
                        </div>
                        <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
                            <div className="text-purple-400 mb-4">2</div>
                            <h3 className="text-xl font-bold mb-3">Choose your tool</h3>
                            <p className="text-gray-400">
                                Select between URL shortening, creating a beautiful link tree, or generating secure passwords.
                            </p>
                        </div>
                        <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
                            <div className="text-purple-400 mb-4">3</div>
                            <h3 className="text-xl font-bold mb-3">Customize and share</h3>
                            <p className="text-gray-400">
                                Personalize your links and share them with the world. Track clicks and manage your links effortlessly.
                            </p>
                        </div>
                        <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
                            <div className="text-purple-400 mb-4">4</div>
                            <h3 className="text-xl font-bold mb-3">Track and manage</h3>
                            <p className="text-gray-400">
                                Monitor the performance of your links and make adjustments as needed.
                            </p>
                        </div>
                        <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
                            <div className="text-purple-400 mb-4">5</div>
                            <h3 className="text-xl font-bold mb-3">Stay secured</h3>
                            <p className="text-gray-400">
                                Use our password generator to create strong, unique passwords for all your accounts.
                            </p>
                            
                        </div>
                        {/* <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
                            <div className="text-purple-400 mb-4">6</div>
                            <h3 className="text-xl font-bold mb-3">Enjoy seamless updates</h3>
                            <p className="text-gray-400">
                                Easily update your link tree or URLs anytime, ensuring your audience always has the latest information.
                            </p>
                        </div> */}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-gray-800 mt-32 py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                                <div className="h-6 w-6 rounded-full bg-purple-600"></div>
                            </div>
                            <span className="text-xl font-bold">Linky</span>
                        </div>
                    </div>
                    <div className="mt-8 text-center md:text-left text-gray-500 text-sm">
                        © {new Date().getFullYear()} Linky. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    )
}