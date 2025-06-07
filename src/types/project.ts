export type PhaseConfig = {
  name: string;
  days: number;
  color?: string;
};

export type PhaseData = {
  start: Date;
  end: Date;
};

export type ProjectStatus = 'planejamento' | 'ativo' | 'concluido' | 'pausado' | 'cancelado';

export interface Project {
  id: string;
  name: string;
  client?: string;
  description?: string;
  eventDate: Date;
  phases: {
    [key: string]: PhaseData;
  };
  createdAt: Date;
  status: ProjectStatus;
  priority?: 'baixa' | 'media' | 'alta' | 'critica';
  budget?: number;
  team?: string[];
  tags?: string[];
}

export interface LaunchCalculatorResult {
  launchModel: string;
  eventDate: Date;
  phases: {
    [key: string]: PhaseData;
  };
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description?: string;
  phases: { [key: string]: PhaseConfig };
  isPublic: boolean;
  createdAt: Date;
}

export interface UserSettings {
  id: string;
  userId: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  defaultPhaseDurations: { [key: string]: PhaseConfig };
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectStats {
  total: number;
  ativo: number;
  planejamento: number;
  concluido: number;
  pausado: number;
  cancelado: number;
  thisMonth: number;
  thisWeek: number;
  overdue: number;
  upcoming: number;
}

export interface DashboardData {
  stats: ProjectStats;
  recentProjects: Project[];
  upcomingEvents: Project[];
  teamActivity: any[];
  notifications: any[];
}