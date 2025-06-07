import { Menu, Bell, Search, User, Settings, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <header className="h-16 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-40">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden sm:block">
            <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Launch Master
            </h1>
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar projetos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg bg-background/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          <button className="p-2 rounded-md hover:bg-muted transition-colors relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
          </button>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground text-sm font-medium">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="hidden sm:block text-sm font-medium">
                {user?.email?.split('@')[0] || 'Usuário'}
              </span>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-card border rounded-lg shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b">
                  <p className="text-sm font-medium">{user?.email?.split('@')[0] || 'Usuário'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                
                <Link
                  to="/configuracoes"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  Configurações
                </Link>
                
                <Link
                  to="/perfil"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Perfil
                </Link>
                
                <hr className="my-2" />
                
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors w-full text-left text-red-600 dark:text-red-400"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;