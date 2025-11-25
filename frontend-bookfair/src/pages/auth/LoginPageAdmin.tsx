import React, { useEffect, useState, useCallback } from "react"
import { useNavigate, Link, useSearchParams } from "react-router-dom"

interface User {
  id: string
  email: string
  name: string
  role: "publisher" | "organizer"
  companyName?: string
}

const mockUserPublisher: User = {
  id: "pub-1",
  email: "pub@test.com",
  name: "Mock Publisher",
  role: "publisher",
}
const mockUserOrganizer: User = {
  id: "org-1",
  email: "org@test.com",
  name: "Mock Organizer",
  role: "organizer",
}

function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(
    async (email: string, password: string, role: "publisher" | "organizer") => {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 800))
      setIsLoading(false)

      if (password === "password123") {
        const mockUser = role === "publisher" ? mockUserPublisher : mockUserOrganizer
        setUser(mockUser)
      } else {
        throw new Error("Invalid credentials")
      }
    },
    [],
  )

  return { user, isLoading, login }
}

// 🔹 Button component (with gradient + hover)
const Button = ({
  children,
  type = "button",
  disabled = false,
  className = "",
  onClick,
}: {
  children: React.ReactNode
  type?: "submit" | "button"
  disabled?: boolean
  className?: string
  onClick?: (e: React.FormEvent) => void
}) => {
  const baseClasses =
    "px-4 py-2 font-semibold rounded-lg transition-all duration-300 shadow-md text-white disabled:opacity-50 disabled:cursor-not-allowed"
  const gradient =
    "bg-[linear-gradient(90deg,#0f056d_0%,#13e2e2_100%)] hover:opacity-90 hover:scale-[1.02]"

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${gradient} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

const Input = ({
  type = "text",
  placeholder = "",
  value,
  onChange,
  required,
}: {
  type: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
}) => {
  const classes =
    "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={classes}
    />
  )
}

// --- MAIN LOGIN PAGE ---
export default function LoginPageAdmin() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const role = (searchParams.get("role") as "publisher" | "organizer") || "publisher"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Email and password are required.")
      return
    }

    try {
      await login(email, password, role)
      navigate("/admin")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown login error occurred.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-[Calibri]">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-xl rounded-2xl border border-gray-100 transform transition-transform duration-300 hover:shadow-2xl">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Welcome Back</h1>
          <p className="text-md text-gray-500 font-medium">
           
        Login to the portal
          
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium shadow-sm">
              <p className="font-bold mb-1">Login Failed</p>
              {error}
            </div>
          )}

          <div className="space-y-3">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
              Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full text-lg py-3 mt-2" disabled={isLoading}>
            {isLoading ? "Authenticating..." : "Sign In"}
          </Button>
        </form>

        
      </div>
    </div>
  )
}
