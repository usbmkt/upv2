import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";

const Layout = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthModal />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex flex-col flex-1 lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        
        <footer className="border-t bg-card px-4 lg:px-6 py-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>Launch Master</span>
              <span>&copy; {new Date().getFullYear()}</span>
            </div>
            <div className="flex items-center gap-4 mt-2 sm:mt-0">
              <span>Versão 2.0</span>
              <span>•</span>
              <span>Feito com ❤️ no Brasil</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;