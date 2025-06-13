import { Link } from "react-router-dom"
import { AuthForm } from "../components/auth-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center mb-8">
          <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center mr-2">
            <div className="h-6 w-6 rounded-full bg-purple-600"></div>
          </div>
          <h1 className="text-3xl font-bold text-center">Snipy</h1>
        </Link>
        <AuthForm />
      </div>
    </div>
  )
}
