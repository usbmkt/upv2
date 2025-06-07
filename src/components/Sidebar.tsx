import { NavLink } from "react-router-dom";
import { LayoutDashboard, Calculator, Calendar, Settings, FolderOpen, BookTemplate as Template, BarChart3, X, Rocket } from "lucide-react";
import { cn } from "../lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navItems = [
    {
      to: "/dashboard",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      description: "Visão geral dos projetos"
    },
    {
      to: "/calculadora",
      icon: <Calculator size={20} />,
      label: "Calculadora",
      description: "Calcular cronogramas"
    },
    {
      to: "/projetos",
      icon: <Calendar size={20} />,
      label: "Projetos",
      description: "Gerenciar lançamentos"
    },
    {
      to: "/templates",
      icon: <Template size={20} />,
      label: "Templates",
      description: "Modelos de projeto"
    },
    {
      to: "/relatorios",
      icon: <BarChart3 size={20} />,
      label: "Relatórios",
      description: "Análises e métricas"
    },
    {
      to: "/configuracoes",
      icon: <Settings size={20} />,
      label: "Configurações",
      description: "Preferências do sistema"
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-64 bg-card border-r z-50 transform transition-transform duration-200 ease-in-out",
        "lg:translate-x-0 lg:static lg:z-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <Rocket className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Launch Master</h2>
                <p className="text-xs text-muted-foreground">Gestão de Lançamentos</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "hover:bg-muted/70 hover:translate-x-1"
                      )
                    }
                  >
                    <div className="flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{item.label}</div>
                      <div className="text-xs opacity-70 truncate">
                        {item.description}
                      </div>
                    </div>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-medium">
                  <FolderOpen className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Projetos Ativos</p>
                  <p className="text-xs text-muted-foreground">Gerencie seus lançamentos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;