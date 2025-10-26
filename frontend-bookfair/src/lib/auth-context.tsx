import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode, // Import ReactNode as type
} from "react"

interface User {
  id: string
  email: string
  name: string
  role: "publisher" | "organizer"
  companyName?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (
    email: string,
    role: "publisher" | "organizer",
  ) => Promise<void>
  signup: (
    email: string,
    name: string,
    companyName: string,
    role: "publisher" | "organizer",
  ) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) { // Use ReactNode
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(
    async (email: string, role: "publisher" | "organizer") => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))
        setUser({
          id: "1",
          email,
          name: email.split("@")[0],
          role,
          companyName: role === "publisher" ? "Sample Publisher" : undefined,
        })
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const signup = useCallback(
  async (
    email: string,
    name: string,
    companyName: string,
    role: "publisher" | "organizer",
  ) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      setUser({
        id: "1",
        email,
        name,
        role,
        companyName: role === "publisher" ? companyName : undefined,
      })
    } finally {
      setIsLoading(false)
    }
  },
  [],
)

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}