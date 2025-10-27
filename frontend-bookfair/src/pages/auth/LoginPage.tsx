import React, { useEffect, useState, useCallback, useContext, createContext } from "react"
import { useNavigate, Link, useSearchParams } from "react-router-dom"
import { Outlet } from "react-router-dom" // Included for completeness but not used in this specific component

// --- Mocking External Dependencies for Runnability ---

// 1. Mocking the Auth Context and useAuth hook
// This mock is extended to include a 'login' function.
interface User {
  id: string
  email: string
  name: string
  role: "publisher" | "organizer"
  companyName?: string
}

const mockUserPublisher: User = { id: "pub-1", email: "pub@test.com", name: "Mock Publisher", role: "publisher" }
const mockUserOrganizer: User = { id: "org-1", email: "org@test.com", name: "Mock Organizer", role: "organizer" }

function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(
    async (email: string, password: string, role: "publisher" | "organizer") => {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 800)) // Simulate network delay
      setIsLoading(false)

      if (password === "password123") {
        const mockUser = role === "publisher" ? mockUserPublisher : mockUserOrganizer
        setUser(mockUser)
        // Note: In a real app, this would receive real user data from the backend
      } else {
        throw new Error("Invalid credentials")
      }
    },
    [],
  )

  return { user, isLoading, login }
}

// 2. Mocking react-router-dom hooks/components (simpler versions)
const useNavigateMock = () => {
  return (path: string) => {
    console.log(`[NAVIGATE] Simulated navigation to: ${path}`)
    // In a real app, this changes the route
  }
}
const useNavigateReal = useNavigate || useNavigateMock;


// Mock useSearchParams: Returns a tuple like the real hook, but with a mock URLSearchParams.
const useSearchParamsMock = () => {
  const searchParamsInstance = new URLSearchParams(window.location.search);
  const setUrlSearchParams = (params: URLSearchParams | Record<string, string>) => {
    console.log('[SET URL SEARCH PARAMS] Mock called with:', params);
    // In a real app, this would update the URL
  };
  // Return a tuple: [URLSearchParams, SetURLSearchParams]
  return [searchParamsInstance, setUrlSearchParams];
}
const useSearchParamsReal = useSearchParams || useSearchParamsMock;


// Mock Link component using an anchor tag for simulation
// Re-exported from react-router-dom if available, otherwise mocked
const LinkMock = ({ to, children, className }: { to: string, children: React.ReactNode, className: string }) => (
  <a href={to} className={className} onClick={(e) => {
    e.preventDefault();
    console.log(`[LINK] Clicked on ${to}`);
  }}>
    {children}
  </a>
);
const LinkComponent = Link || LinkMock;


// 3. Mocking the Shadcn/UI components

// Mock Button component
const Button = ({ children, type = "button", disabled = false, className = "", onClick }: { children: React.ReactNode, type?: "submit" | "button", disabled?: boolean, className?: string, onClick?: (e: React.FormEvent) => void }) => {
  const baseClasses = "px-4 py-2 font-semibold rounded-lg transition-all duration-200 shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed";
  
  return (
    <button type={type} disabled={disabled} className={`${baseClasses} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

// Mock Input component
const Input = ({ type = "text", placeholder = "", value, onChange, required }: { type: string, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, required?: boolean }) => {
  const classes = "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors";
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={classes}
    />
  );
};


// --- Main Component: LoginPage ---

export default function LoginPage() {
  // Destructure to get the URLSearchParams object
  const [searchParams] = useSearchParamsReal()
  const navigate = useNavigateReal()
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  
  // Get role from URL params, defaulting to 'publisher'
  // Use the .get() method on the URLSearchParams object
  const role = (searchParams.get("role") as "publisher" | "organizer") || "publisher"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Simple validation
    if (!email || !password) {
        setError("Email and password are required.");
        return;
    }
    
    try {
      // Use the email and password state variables directly
      await login(email, password, role)
      // Use navigate() from react-router-dom instead of router.push()
      navigate(role === "publisher" ? "/publisher/dashboard" : "/organizer/dashboard")
    } catch (err) {
      // Catch error from mock login function
      setError(err instanceof Error ? err.message : "An unknown login error occurred.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-[Inter]">
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
            <label htmlFor="email" className="text-sm font-medium text-gray-700 block">Email Address</label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 block">Password</label>
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
            <LinkComponent to="/auth/signup" className="text-indigo-600 hover:text-indigo-800 hover:underline font-semibold">
              Sign up
            </LinkComponent>
          </p>
          <LinkComponent to="/" className="text-sm text-gray-500 hover:text-indigo-600 hover:underline block">
            ← Back to home
          </LinkComponent>
        </div>
        
      </div>
    </div>
  )
}
