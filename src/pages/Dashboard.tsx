import { 
  ArrowUpRight, 
  Clock, 
  Calendar, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Users,
  Target,
  Plus
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDashboard } from "../hooks/useDashboard";
import GanttChart from "../components/GanttChart";
import { formatDate, getStatusInfo, calculateProjectProgress, formatCurrency } from "../lib/utils";

const Dashboard = () => {
  const { dashboardData, loading } = useDashboard();

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  const { stats, recentProjects, upcomingEvents } = dashboardData;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Visão geral dos seus projetos e lançamentos
          </p>
        </div>
        <Link
          to="/calculadora"
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus size={18} />
          Novo Lançamento
          <ArrowUpRight size={16} />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.ativo}
            </span>
          </div>
          <h3 className="font-semibold text-blue-900 dark:text-blue-100">Projetos Ativos</h3>
          <p className="text-sm text-blue-600 dark:text-blue-400">Em andamento</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.concluido}
            </span>
          </div>
          <h3 className="font-semibold text-green-900 dark:text-green-100">Concluídos</h3>
          <p className="text-sm text-green-600 dark:text-green-400">Este mês</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {stats.overdue}
            </span>
          </div>
          <h3 className="font-semibold text-orange-900 dark:text-orange-100">Atrasados</h3>
          <p className="text-sm text-orange-600 dark:text-orange-400">Requer atenção</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {stats.upcoming}
            </span>
          </div>
          <h3 className="font-semibold text-purple-900 dark:text-purple-100">Próximos</h3>
          <p className="text-sm text-purple-600 dark:text-purple-400">30 dias</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Timeline Chart */}
        <div className="xl:col-span-2">
          <div className="bg-card border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Cronograma de Projetos</h2>
              <Link 
                to="/projetos" 
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Ver todos
              </Link>
            </div>
            <GanttChart projects={recentProjects.slice(0, 5)} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <div className="bg-card border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Próximos Eventos</h3>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
            
            {upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map((project) => {
                  const { color, label } = getStatusInfo(project.status);
                  const progress = calculateProjectProgress(project.phases);

                  return (
                    <Link
                      key={project.id}
                      to={`/projetos/${project.id}`}
                      className="block p-4 rounded-lg border hover:border-primary/50 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm truncate">{project.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full border ${color}`}>
                          {label}
                        </span>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-2">
                        {project.client || "Sem cliente"}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {formatDate(new Date(project.eventDate), "dd/MM/yyyy")}
                        </span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      
                      <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                        <div 
                          className="bg-primary rounded-full h-1.5 transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Nenhum evento próximo</p>
                <Link
                  to="/calculadora"
                  className="text-sm text-primary hover:text-primary/80 transition-colors mt-2 inline-block"
                >
                  Criar primeiro projeto
                </Link>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Estatísticas Rápidas</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Esta semana</span>
                </div>
                <span className="font-medium">{stats.thisWeek}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Este mês</span>
                </div>
                <span className="font-medium">{stats.thisMonth}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Total</span>
                </div>
                <span className="font-medium">{stats.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-card border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Projetos Recentes</h2>
          <Link 
            to="/projetos" 
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Ver todos
          </Link>
        </div>

        {recentProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentProjects.map((project) => {
              const { color, label } = getStatusInfo(project.status);
              const progress = calculateProjectProgress(project.phases);

              return (
                <Link
                  key={project.id}
                  to={`/projetos/${project.id}`}
                  className="block p-4 rounded-lg border hover:border-primary/50 transition-all duration-200 hover:shadow-md group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full border ${color}`}>
                      {label}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {project.client || "Sem cliente"}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      Evento: {formatDate(new Date(project.eventDate), "dd/MM")}
                    </span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  
                  {project.budget && (
                    <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-2">
                      {formatCurrency(project.budget)}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-2">Nenhum projeto encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Comece criando seu primeiro projeto de lançamento
            </p>
            <Link
              to="/calculadora"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
            >
              <Plus size={16} />
              Criar Projeto
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;