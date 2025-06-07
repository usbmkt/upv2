import { format, addDays, subDays, isAfter, isBefore, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PhaseConfig, PhaseData, ProjectStatus } from '../types/project';

/**
 * Utility for combining class names
 */
export function cn(...classes: (string | undefined | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format a date to a human-readable string in Portuguese
 */
export const formatDate = (date: Date, formatStr: string = 'dd \'de\' MMMM \'de\' yyyy'): string => {
  return format(date, formatStr, { locale: ptBR });
};

/**
 * Calculate the number of days between two dates, inclusive
 */
export const getDaysDifference = (start: Date, end: Date): number => {
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

/**
 * Default phases for launch projects in Portuguese
 */
export const defaultPhases: { [key: string]: PhaseConfig } = {
  planejamento: { name: "Planejamento", days: 30, color: '#3B82F6' },
  aquisicao: { name: "Aquisição", days: 21, color: '#10B981' },
  aquecimento: { name: "Aquecimento", days: 7, color: '#F59E0B' },
  evento: { name: "Evento", days: 3, color: '#8B5CF6' },
  carrinho: { name: "Carrinho Aberto", days: 7, color: '#EC4899' },
  recuperacao: { name: "Recuperação", days: 14, color: '#F97316' },
  downsell: { name: "Downsell", days: 7, color: '#EF4444' },
  debriefing: { name: "Debriefing", days: 7, color: '#6B7280' }
};

/**
 * Project templates for different types of launches
 */
export const projectTemplates = {
  lancamento_produto: {
    name: "Lançamento de Produto",
    description: "Template padrão para lançamento de produtos digitais",
    phases: {
      planejamento: { name: "Planejamento Estratégico", days: 45, color: '#3B82F6' },
      pre_lancamento: { name: "Pré-lançamento", days: 30, color: '#10B981' },
      aquecimento: { name: "Aquecimento", days: 14, color: '#F59E0B' },
      lancamento: { name: "Lançamento", days: 7, color: '#8B5CF6' },
      pos_lancamento: { name: "Pós-lançamento", days: 14, color: '#EC4899' }
    }
  },
  evento_online: {
    name: "Evento Online",
    description: "Template para webinars e eventos virtuais",
    phases: {
      planejamento: { name: "Planejamento", days: 21, color: '#3B82F6' },
      promocao: { name: "Promoção", days: 14, color: '#10B981' },
      aquecimento: { name: "Aquecimento", days: 7, color: '#F59E0B' },
      evento: { name: "Evento", days: 1, color: '#8B5CF6' },
      follow_up: { name: "Follow-up", days: 7, color: '#EC4899' }
    }
  },
  campanha_marketing: {
    name: "Campanha de Marketing",
    description: "Template para campanhas publicitárias",
    phases: {
      pesquisa: { name: "Pesquisa e Análise", days: 14, color: '#3B82F6' },
      criacao: { name: "Criação de Conteúdo", days: 21, color: '#10B981' },
      teste: { name: "Testes A/B", days: 7, color: '#F59E0B' },
      lancamento: { name: "Lançamento", days: 30, color: '#8B5CF6' },
      otimizacao: { name: "Otimização", days: 14, color: '#EC4899' }
    }
  }
};

/**
 * Calculate phases dates based on event date and phase durations
 */
export const calculatePhaseDates = (
  eventDate: Date,
  phases: { [key: string]: PhaseConfig }
): { [key: string]: PhaseData } => {
  const calculatedPhases: { [key: string]: PhaseData } = {};
  let currentDate = new Date(eventDate);

  // Calculate phases retroactively
  const phaseEntries = Object.entries(phases).reverse();
  
  phaseEntries.forEach(([key, phase], index) => {
    if (index === 0) {
      // For the event phase (usually the first in reversed array)
      const endDate = new Date(currentDate);
      const startDate = subDays(endDate, phase.days - 1);
      calculatedPhases[key] = { start: startDate, end: endDate };
      currentDate = subDays(startDate, 1);
    } else {
      const endDate = new Date(currentDate);
      const startDate = subDays(endDate, phase.days - 1);
      calculatedPhases[key] = { start: startDate, end: endDate };
      currentDate = subDays(startDate, 1);
    }
  });

  // Reorder to match original phase order
  const orderedPhases: { [key: string]: PhaseData } = {};
  Object.keys(phases).forEach(key => {
    if (calculatedPhases[key]) {
      orderedPhases[key] = calculatedPhases[key];
    }
  });

  return orderedPhases;
};

/**
 * Get color for a specific phase
 */
export const getPhaseColor = (phaseKey: string): string => {
  const phaseColors: { [key: string]: string } = {
    planejamento: '#3B82F6',
    aquisicao: '#10B981',
    aquecimento: '#F59E0B',
    evento: '#8B5CF6',
    carrinho: '#EC4899',
    recuperacao: '#F97316',
    downsell: '#EF4444',
    debriefing: '#6B7280',
    // New phases
    pre_lancamento: '#10B981',
    lancamento: '#8B5CF6',
    pos_lancamento: '#EC4899',
    promocao: '#10B981',
    follow_up: '#EC4899',
    pesquisa: '#3B82F6',
    criacao: '#10B981',
    teste: '#F59E0B',
    otimizacao: '#EC4899'
  };

  return phaseColors[phaseKey] || '#6B7280';
};

/**
 * Get the status label and color in Portuguese
 */
export const getStatusInfo = (status: ProjectStatus) => {
  const statusMap: Record<ProjectStatus, { label: string, color: string, bgColor: string }> = {
    planejamento: { 
      label: 'Planejamento', 
      color: 'text-blue-700 dark:text-blue-300',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800'
    },
    ativo: { 
      label: 'Ativo', 
      color: 'text-green-700 dark:text-green-300',
      bgColor: 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800'
    },
    concluido: { 
      label: 'Concluído', 
      color: 'text-gray-700 dark:text-gray-300',
      bgColor: 'bg-gray-100 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700'
    },
    pausado: { 
      label: 'Pausado', 
      color: 'text-yellow-700 dark:text-yellow-300',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800'
    },
    cancelado: { 
      label: 'Cancelado', 
      color: 'text-red-700 dark:text-red-300',
      bgColor: 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800'
    }
  };

  return statusMap[status] || { 
    label: status, 
    color: 'text-gray-700 dark:text-gray-300',
    bgColor: 'bg-gray-100 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700'
  };
};

/**
 * Get priority info
 */
export const getPriorityInfo = (priority: string) => {
  const priorityMap: Record<string, { label: string, color: string, bgColor: string }> = {
    baixa: { 
      label: 'Baixa', 
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-50 dark:bg-gray-800/50'
    },
    media: { 
      label: 'Média', 
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    alta: { 
      label: 'Alta', 
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    },
    critica: { 
      label: 'Crítica', 
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    }
  };

  return priorityMap[priority] || priorityMap.media;
};

/**
 * Format currency in Brazilian Real
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
};

/**
 * Calculate project progress based on current date and phases
 */
export const calculateProjectProgress = (phases: { [key: string]: PhaseData }): number => {
  const now = new Date();
  const phaseEntries = Object.entries(phases);
  
  if (phaseEntries.length === 0) return 0;
  
  const sortedPhases = phaseEntries.sort((a, b) => 
    new Date(a[1].start).getTime() - new Date(b[1].start).getTime()
  );
  
  const projectStart = new Date(sortedPhases[0][1].start);
  const projectEnd = new Date(sortedPhases[sortedPhases.length - 1][1].end);
  
  if (isBefore(now, projectStart)) return 0;
  if (isAfter(now, projectEnd)) return 100;
  
  const totalDuration = projectEnd.getTime() - projectStart.getTime();
  const elapsed = now.getTime() - projectStart.getTime();
  
  return Math.round((elapsed / totalDuration) * 100);
};

/**
 * Get projects for current week
 */
export const getProjectsThisWeek = (projects: any[]): any[] => {
  const weekStart = startOfWeek(new Date(), { locale: ptBR });
  const weekEnd = endOfWeek(new Date(), { locale: ptBR });
  
  return projects.filter(project => {
    const eventDate = new Date(project.eventDate);
    return eventDate >= weekStart && eventDate <= weekEnd;
  });
};

/**
 * Get projects for current month
 */
export const getProjectsThisMonth = (projects: any[]): any[] => {
  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());
  
  return projects.filter(project => {
    const eventDate = new Date(project.eventDate);
    return eventDate >= monthStart && eventDate <= monthEnd;
  });
};

/**
 * Get overdue projects
 */
export const getOverdueProjects = (projects: any[]): any[] => {
  const now = new Date();
  
  return projects.filter(project => {
    const eventDate = new Date(project.eventDate);
    return isBefore(eventDate, now) && project.status !== 'concluido';
  });
};

/**
 * Get upcoming projects (next 30 days)
 */
export const getUpcomingProjects = (projects: any[]): any[] => {
  const now = new Date();
  const thirtyDaysFromNow = addDays(now, 30);
  
  return projects.filter(project => {
    const eventDate = new Date(project.eventDate);
    return isAfter(eventDate, now) && isBefore(eventDate, thirtyDaysFromNow);
  });
};

/**
 * Generate random color for tags
 */
export const generateTagColor = (tag: string): string => {
  const colors = [
    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
    'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  ];
  
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Debounce function for search
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Export project data to CSV
 */
export const exportToCSV = (projects: any[], filename: string = 'projetos.csv') => {
  const headers = [
    'Nome',
    'Cliente',
    'Status',
    'Data do Evento',
    'Prioridade',
    'Orçamento',
    'Progresso',
    'Criado em'
  ];
  
  const csvContent = [
    headers.join(','),
    ...projects.map(project => [
      `"${project.name}"`,
      `"${project.client || ''}"`,
      `"${getStatusInfo(project.status).label}"`,
      `"${formatDate(new Date(project.eventDate))}"`,
      `"${project.priority ? getPriorityInfo(project.priority).label : ''}"`,
      `"${project.budget ? formatCurrency(project.budget) : ''}"`,
      `"${calculateProjectProgress(project.phases)}%"`,
      `"${formatDate(new Date(project.createdAt))}"`
    ].join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};