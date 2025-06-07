import { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Download,
  Filter,
  PieChart,
  Activity,
  Target,
  Clock,
  DollarSign
} from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import { 
  formatDate, 
  getStatusInfo, 
  calculateProjectProgress, 
  formatCurrency,
  exportToCSV,
  getProjectsThisMonth,
  getProjectsThisWeek,
  getOverdueProjects
} from "../lib/utils";

const Reports = () => {
  const { projects, loading } = useProjects();
  const [dateRange, setDateRange] = useState("thisMonth");
  const [statusFilter, setStatusFilter] = useState("all");

  // Calculate statistics
  const stats = {
    total: projects.length,
    ativo: projects.filter(p => p.status === 'ativo').length,
    concluido: projects.filter(p => p.status === 'concluido').length,
    planejamento: projects.filter(p => p.status === 'planejamento').length,
    thisMonth: getProjectsThisMonth(projects).length,
    thisWeek: getProjectsThisWeek(projects).length,
    overdue: getOverdueProjects(projects).length,
    avgProgress: projects.length > 0 
      ? Math.round(projects.reduce((acc, p) => acc + calculateProjectProgress(p.phases), 0) / projects.length)
      : 0,
    totalBudget: projects.reduce((acc, p) => acc + (p.budget || 0), 0)
  };

  // Status distribution for pie chart
  const statusDistribution = [
    { name: 'Ativo', value: stats.ativo, color: '#10B981' },
    { name: 'Planejamento', value: stats.planejamento, color: '#3B82F6' },
    { name: 'Concluído', value: stats.concluido, color: '#6B7280' },
    { name: 'Pausado', value: projects.filter(p => p.status === 'pausado').length, color: '#F59E0B' },
    { name: 'Cancelado', value: projects.filter(p => p.status === 'cancelado').length, color: '#EF4444' }
  ];

  // Monthly project creation trend
  const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthProjects = projects.filter(p => {
      const projectDate = new Date(p.createdAt);
      return projectDate.getMonth() === date.getMonth() && 
             projectDate.getFullYear() === date.getFullYear();
    });
    return {
      month: formatDate(date, 'MMM'),
      count: monthProjects.length
    };
  }).reverse();

  const handleExport = () => {
    exportToCSV(projects, `relatorio-projetos-${formatDate(new Date(), 'yyyy-MM-dd')}.csv`);
  };

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Relatórios e Análises</h1>
          <p className="text-muted-foreground mt-1">
            Insights detalhados sobre seus projetos e performance
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-background"
          >
            <option value="thisWeek">Esta semana</option>
            <option value="thisMonth">Este mês</option>
            <option value="last3Months">Últimos 3 meses</option>
            <option value="thisYear">Este ano</option>
          </select>
          
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-colors"
          >
            <Download size={16} />
            Exportar
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.total}
            </span>
          </div>
          <h3 className="font-semibold text-blue-900 dark:text-blue-100">Total de Projetos</h3>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            +{stats.thisMonth} este mês
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.avgProgress}%
            </span>
          </div>
          <h3 className="font-semibold text-green-900 dark:text-green-100">Progresso Médio</h3>
          <p className="text-sm text-green-600 dark:text-green-400">
            Todos os projetos
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {stats.ativo}
            </span>
          </div>
          <h3 className="font-semibold text-purple-900 dark:text-purple-100">Projetos Ativos</h3>
          <p className="text-sm text-purple-600 dark:text-purple-400">
            Em andamento
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
              {formatCurrency(stats.totalBudget)}
            </span>
          </div>
          <h3 className="font-semibold text-orange-900 dark:text-orange-100">Orçamento Total</h3>
          <p className="text-sm text-orange-600 dark:text-orange-400">
            Todos os projetos
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Distribution */}
        <div className="bg-card border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-6">Distribuição por Status</h3>
          <div className="space-y-4">
            {statusDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{item.value}</span>
                  <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-300"
                      style={{ 
                        backgroundColor: item.color,
                        width: `${stats.total > 0 ? (item.value / stats.total) * 100 : 0}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-card border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-6">Tendência Mensal</h3>
          <div className="space-y-4">
            {monthlyTrend.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.month}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{item.count}</span>
                  <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.max(...monthlyTrend.map(t => t.count)) > 0 
                          ? (item.count / Math.max(...monthlyTrend.map(t => t.count))) * 100 
                          : 0}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-card border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Detalhes dos Projetos</h3>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1 border rounded bg-background text-sm"
            >
              <option value="all">Todos os status</option>
              <option value="ativo">Ativo</option>
              <option value="planejamento">Planejamento</option>
              <option value="concluido">Concluído</option>
              <option value="pausado">Pausado</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">Projeto</th>
                <th className="text-left py-3 px-4 font-medium">Cliente</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">Progresso</th>
                <th className="text-left py-3 px-4 font-medium">Data do Evento</th>
                <th className="text-left py-3 px-4 font-medium">Orçamento</th>
              </tr>
            </thead>
            <tbody>
              {projects
                .filter(p => statusFilter === 'all' || p.status === statusFilter)
                .slice(0, 10)
                .map((project) => {
                  const { color, label } = getStatusInfo(project.status);
                  const progress = calculateProjectProgress(project.phases);

                  return (
                    <tr key={project.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{project.name}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {project.description || 'Sem descrição'}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {project.client || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full border ${color}`}>
                          {label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{progress}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {formatDate(new Date(project.eventDate), 'dd/MM/yyyy')}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium">
                        {project.budget ? formatCurrency(project.budget) : '-'}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {projects.length > 10 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Mostrando 10 de {projects.length} projetos
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;