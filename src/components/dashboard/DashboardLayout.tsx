import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Sun, Moon } from "lucide-react";
import Logo from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";

interface DashboardLayoutProps {
  onLogout: () => void;
  children: React.ReactNode;
}

const DashboardLayout = ({ onLogout, children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Load user session
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      }
    };

    fetchUser();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });

    // Load theme from localStorage or system preference
    const savedTheme = localStorage.getItem("theme");
    if (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  // Fjern evt. # og alt efter i navnet
  const displayName =
    user?.user_metadata?.name?.split("#")[0] || user?.email || "";

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm py-4 dark:bg-gray-900">
        <div className="container-custom flex justify-between items-center">
          {/* Venstre: Logo */}
          <div onClick={() => navigate("/")} className="cursor-pointer">
            <Logo />
          </div>

          {/* Højre: Tema-toggle + Brugerinfo + Logout */}
          <div className="flex items-center space-x-6">
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle theme"
              className="p-2 rounded-md bg-trioguard hover:bg-trioguard/90 text-white transition"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user && (
              <div className="flex items-center space-x-2">
                <img
                  src={
                    user.user_metadata?.avatar_url ||
                    user.user_metadata?.picture
                  }
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-medium text-trioguard-dark dark:text-trioguard-light">
                  {displayName}
                </span>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center text-trioguard-dark hover:text-trioguard transition-colors"
            >
              <LogOut size={20} className="mr-2" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow bg-trioguard-bg dark:bg-gray-800 transition-colors">
        <div className="container-custom py-8">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
