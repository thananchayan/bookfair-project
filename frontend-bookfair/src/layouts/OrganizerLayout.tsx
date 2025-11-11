import React, { useEffect, useState, useCallback, useContext, createContext } from "react"
import { Outlet } from "react-router-dom" // Use Outlet for nested routes

// --- Mocking External Dependencies for Runnability ---

// 1. Mocking the Auth Context (from previous turn's structure)
const mockUser = { id: "admin-1", email: "admin@cbf.com", name: "Organizer Admin", role: "organizer" }
const AuthContext = createContext(null);

// Define the User type
type User = {
  id: string;
  email: string;
  name: string;
  role: string;
} | null;

function useAuth() {
  const [user, setUser] = useState<User>(null); // Initialize user state to null with explicit type
  const [isLoading, setIsLoading] = useState(true); // Start loading

  const logout = useCallback(() => {
    setUser(null); // This is fine as the state is initialized to null
  }, []);

  // Simulate fetching user data
  useEffect(() => {
    // In a real app, you would fetch user data here
    // For this mock, we'll set the user after a short delay
    const timer = setTimeout(() => {
      setUser(mockUser); // Set the user to the mock user
      setIsLoading(false);
    }, 1000); // Simulate a 1-second loading time

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  return { user, isLoading, logout };
}

// 2. Mocking react-router-dom hooks/components
// In a real app, Link, Outlet, and useNavigate would be imported from 'react-router-dom'
const useNavigate = (): ((path: string) => void) => { // Explicit type for useNavigate
  // In a real app, this would navigate. Here, we just log.
  const [currentPath, setCurrentPath] = useState("/organizer/dashboard");

  const navigate = (path: string) => { // Explicit type for navigate parameter
    console.log(`[NAVIGATE] Simulated navigation to: ${path}`);
    setCurrentPath(path);
  }
  return navigate;
};

// Mock Link component using an anchor tag for simulation
interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}
const Link = ({ href, children, className }: LinkProps) => (
  <a href={href} className={className} onClick={(e) => {
    e.preventDefault();
    console.log(`[LINK] Clicked on ${href}`);
    // In a real router setup, clicking this link updates the URL without a full page reload.
  }}>
    {children}
  </a>
);

// Mock Outlet component
const MockOutlet = () => (
    <div className="border border-dashed p-8 mt-4 rounded-lg bg-gray-50 text-gray-600 text-center">
        {/* This represents where the child route component (e.g., Dashboard or Reservations) would be rendered */}
        <p className="font-semibold text-lg">
            <Outlet />
        </p>
        <p className="mt-2 text-sm italic">
            (Content from nested route will appear here)
        </p>
    </div>
);


// 3. Mocking the Shadcn/UI Button component
interface ButtonProps {
  children: React.ReactNode;
  variant?: "default" | "outline";
  size?: "default" | "sm";
  onClick: () => void;
}
const Button = ({ children, variant = "default", size = "default", onClick }: ButtonProps) => {
  let styleClasses = "px-4 py-2 font-semibold rounded-lg transition-colors duration-200 ";

  if (variant === "outline") {
    styleClasses += "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 shadow-sm";
  } else {
    styleClasses += "bg-indigo-600 text-white hover:bg-indigo-700 shadow";
  }

  return (
    <button className={styleClasses} onClick={onClick}>
      {children}
    </button>
  );
};

// --- Main Component ---

/**
 * OrganizerLayout component for a standard React application.
 * Replaces Next.js routing with react-router-dom features.
 * Renders the navigation bar and authentication guard for the "organizer" role.
 * Renders nested routes via <Outlet />.
 */
export function OrganizerLayout() {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  // 1. Authentication Check and Redirection
  useEffect(() => {
    // If user is null or not an organizer, redirect to login
    if (!user || user.role !== "organizer") {
      // Use navigate() from react-router-dom instead of router.push()
      navigate("/auth/login?role=organizer");
    }
  }, [user, navigate]); // Depend on user and navigate

  // 2. Prevent rendering layout if user is not authorized/loaded
  // Check for isLoading as well to ensure data has been fetched
  if (isLoading || !user || user.role !== "organizer") {
    // Return a simple loading state or null while redirecting
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <p className="text-xl font-medium text-gray-500">Checking credentials...</p>
        </div>
    );
  }

  // 3. Render the protected layout
  return (
    // Tailwind classes are assumed to be available
    <div className="min-h-screen bg-gray-50 font-[Inter]">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/organizer/dashboard" className="text-2xl font-extrabold text-indigo-600 tracking-tight">
              CBF Admin
            </Link>
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex gap-6">
              <Link href="/organizer/dashboard" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
                Dashboard
              </Link>
              <Link href="/organizer/reservations" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
                Reservations
              </Link>
              <Link href="/organizer/stalls" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
                Stalls
              </Link>
              <Link href="/organizer/publishers" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
                Publishers
              </Link>
            </div>
          </div>

          {/* User Info and Logout */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block">
                Logged in as: <span className="font-semibold">{user.name}</span> {/* Access user.name safely */}
                </span>
                <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
                // Navigate to the home page after logging out
                navigate("/");
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Organizer Portal</h1>
        {/* IMPORTANT: Replace {children} with <MockOutlet /> or <Outlet /> */}
        <MockOutlet />
      </main>

      {/* Footer (Optional) */}
      <footer className="w-full text-center py-4 text-xs text-gray-400 border-t mt-12">
        CBF Admin &copy; 2024 - Mock Environment
      </footer>
    </div>
  )
}

// In a real Vite app, you would export the component above and define your routing structure in App.tsx
// e.g., <Route path="organizer" element={<OrganizerLayout />}>
//          <Route path="dashboard" element={<Dashboard />} />
//        </Route>

// Exporting the main component as a default (if desired, but named export is cleaner in React)
export default OrganizerLayout;
