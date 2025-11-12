import React, { useEffect, useState, useCallback } from "react"
import { useNavigate, Link, useSearchParams } from "react-router-dom"

// --- Mocking External Dependencies for Runnability ---
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

  const login = useCallback(async (email: string, password: string, role: "publisher" | "organizer") => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsLoading(false)

    if (password === "password123") {
      const mockUser = role === "publisher" ? mockUserPublisher : mockUserOrganizer
      setUser(mockUser)
    } else {
      throw new Error("Invalid credentials")
    }
  }, [])

  const signup = useCallback(
    async (email: string, password: string, name: string, companyName: string, role: "publisher" | "organizer") => {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsLoading(false)

      if (email.includes("error")) {
        throw new Error("Email already in use")
      }

      const newUser: User = {
        id: `new-${role}-${Math.random().toFixed(4).substring(2)}`,
        email,
        name,
        role,
        ...(role === "publisher" && { companyName }),
      }

      console.log("[MOCK SIGNUP SUCCESS]", newUser)
      setUser(newUser)
    },
    []
  )

  return { user, isLoading, login, signup }
}

// --- Mock react-router-dom hooks/components ---
const useNavigateMock = () => {
  return (path: string) => {
    console.log(`[NAVIGATE] Simulated navigation to: ${path}`)
  }
}
const useNavigateReal = useNavigate || useNavigateMock

const useSearchParamsMock = () => {
  const [searchParams] = useState(new URLSearchParams(window.location.search))
  return {
    get: (key: string) => {
      return searchParams.get(key) || "publisher"
    },
  }
}
const useSearchParamsReal = useSearchParams || useSearchParamsMock

const LinkMock = ({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className: string
}) => (
  <a
    href={href}
    className={className}
    onClick={(e) => {
      e.preventDefault()
      console.log(`[LINK] Clicked on ${href}`)
    }}
  >
    {children}
  </a>
)
const LinkComponent = Link || LinkMock

// --- Button Component (Gradient + Calibri) ---
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
    "px-4 py-2 font-semibold rounded-lg transition-all duration-200 shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
  const gradientBackground = "bg-[linear-gradient(90deg,#0f056d_0%,#13e2e2_100%)] hover:opacity-90"
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${gradientBackground} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

// --- Input Component ---
const Input = ({
  type = "text",
  placeholder = "",
  value,
  name = "",
  onChange,
  required,
}: {
  type: string
  placeholder: string
  value: string
  name?: string
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
      name={name}
      onChange={onChange}
      required={required}
      className={classes}
    />
  )
}

// --- LOGIN PAGE ---
export function LoginPage() {
  const searchParams = useSearchParamsReal()
  const navigate = useNavigateReal()
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const role = (searchParams[0]?.get?.("role") as "publisher" | "organizer") || "publisher"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Email and password are required.")
      return
    }

    try {
      await login(email, password, role)
      navigate(role === "publisher" ? "/publisher/dashboard" : "/organizer/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown login error occurred.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-[Calibri]">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-xl rounded-xl border border-gray-100 transform transition-transform duration-300 hover:shadow-2xl">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-extrabold text-gray-800">Welcome Back</h1>
          <p className="text-md text-gray-500 font-medium">
            {role === "publisher" ? "Publisher Portal Login" : "Organizer Admin Login"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium transition-opacity duration-300 shadow-md">
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

          <Button type="submit" className="w-full text-lg py-3" disabled={isLoading}>
            {isLoading ? "Authenticating..." : "Sign In"}
          </Button>
        </form>

        <div className="text-center space-y-3 pt-2">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <LinkComponent
              to="/auth/signup"
              className="text-indigo-600 hover:text-indigo-800 hover:underline font-semibold"
            >
              Sign up
            </LinkComponent>
          </p>
          <LinkComponent
            to="/"
            className="text-sm text-gray-500 hover:text-indigo-600 hover:underline block"
          >
            ← Back to home
          </LinkComponent>
        </div>
      </div>
    </div>
  )
}

// --- SIGNUP PAGE (Account Type Removed) ---
export default function SignupPage() {
  const navigate = useNavigateReal()
  const { signup, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    companyName: "",
  })
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.")
      return
    }

    try {
      await signup(formData.email, formData.password, formData.name, formData.companyName, "publisher")
      navigate("/publisher/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-[Calibri]">
      <div className="max-w-lg w-full space-y-8 p-8 bg-white shadow-2xl rounded-xl border border-gray-100">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-extrabold text-gray-800">Create Account</h1>
          <p className="text-md text-gray-500 font-medium">
            Join the Colombo International Book Fair Community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium shadow-md">
              <p className="font-bold mb-1">Signup Error</p>
              {error}
            </div>
          )}

          <div className="space-y-3">
            <label htmlFor="name" className="text-sm font-medium text-gray-700 block">
              Full Name
            </label>
            <Input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="companyName" className="text-sm font-medium text-gray-700 block">
              Company Name
            </label>
            <Input
              type="text"
              name="companyName"
              placeholder="Your Publishing Company"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
              Email
            </label>
            <Input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
              Password
            </label>
            <Input
              type="password"
              name="password"
              placeholder="•••••••• (Min 8 characters)"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 block">
              Confirm Password
            </label>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" className="w-full text-lg py-3" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <div className="text-center space-y-3 pt-2">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <LinkComponent
              to="/login"
              className="text-indigo-600 hover:text-indigo-800 hover:underline font-semibold"
            >
              Sign in
            </LinkComponent>
          </p>
          <LinkComponent
            to="/"
            className="text-sm text-gray-500 hover:text-indigo-600 hover:underline block"
          >
            ← Back to home
          </LinkComponent>
        </div>
      </div>
    </div>
  )
}
