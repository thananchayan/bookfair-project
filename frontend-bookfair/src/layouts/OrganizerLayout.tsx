import React, { useEffect, useState, useCallback, useContext, createContext } from "react"
import { Outlet } from "react-router-dom" ;




const mockUser = { id: "admin-1", email: "admin@cbf.com", name: "Organizer Admin", role: "organizer" }
const AuthContext = createContext(null);


type User = {
  id: string;
  email: string;
  name: string;
  role: string;
} | null;

function useAuth() {
  const [user, setUser] = useState<User>(null); 
  const [isLoading, setIsLoading] = useState(true); 

  const logout = useCallback(() => {
    setUser(null);
  }, []);


  useEffect(() => {
 
    const timer = setTimeout(() => {
      setUser(mockUser); 
      setIsLoading(false);
    }, 1000); 

    return () => clearTimeout(timer); 
  }, []);

  return { user, isLoading, logout };
}

const useNavigate = (): ((path: string) => void) => { 
   const [currentPath, setCurrentPath] = useState("/organizer/dashboard");

  const navigate = (path: string) => { 
    console.log(`[NAVIGATE] Simulated navigation to: ${path}`);
    setCurrentPath(path);
  }
  return navigate;
};


interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}
const Link = ({ href, children, className }: LinkProps) => (
  <a href={href} className={className} onClick={(e) => {
    e.preventDefault();
    console.log(`[LINK] Clicked on ${href}`);
     }}>
    {children}
  </a>
);


const MockOutlet = () => (
    <div className="border border-dashed p-8 mt-4 rounded-lg bg-gray-50 text-gray-600 text-center">
       <p className="font-semibold text-lg">
            <Outlet />
        </p>
        <p className="mt-2 text-sm italic">
            (Content from nested route will appear here)
        </p>
    </div>
);


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


export function OrganizerLayout() {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {

    if (!user || user.role !== "organizer") {
  
      navigate("/auth/login?role=organizer");
    }
  }, [user, navigate]); 


  if (isLoading || !user || user.role !== "organizer") {

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <p className="text-xl font-medium text-gray-500">Checking credentials...</p>
        </div>
    );
  }

  
  return (
 
    <div className="min-h-screen bg-gray-50 font-[Inter]">
   
      <nav className="border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/organizer/dashboard" className="text-2xl font-extrabold text-indigo-600 tracking-tight">
              CBF Admin
            </Link>
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

     
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block">
                Logged in as: <span className="font-semibold">{user.name}</span> {/* Access user.name safely */}
                </span>
                <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
      
                navigate("/");
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>


      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Organizer Portal</h1>

        <MockOutlet />
      </main>


      <footer className="w-full text-center py-4 text-xs text-gray-400 border-t mt-12">
        CBF Admin &copy; 2024 - Mock Environment
      </footer>
    </div>
  )
}

export default OrganizerLayout;
