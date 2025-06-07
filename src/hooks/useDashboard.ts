import { useState, useEffect } from 'react';
import { useProjects } from './useProjects';
import { DashboardData, ProjectStats } from '../types/project';
import { 
  getProjectsThisWeek, 
  getProjectsThisMonth, 
  getOverdueProjects, 
  getUpcomingProjects 
} from '../lib/utils';

export const useDashboard = () => {
  const { projects, loading } = useProjects();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    if (!loading && projects.length >= 0) {
      calculateDashboardData();
    }
  }, [projects, loading]);

  const calculateDashboardData = () => {
    const stats: ProjectStats = {
      total: projects.length,
      ativo: projects.filter(p => p.status === 'ativo').length,
      planejamento: projects.filter(p => p.status === 'planejamento').length,
      concluido: projects.filter(p => p.status === 'concluido').length,
      pausado: projects.filter(p => p.status === 'pausado').length,
      cancelado: projects.filter(p => p.status === 'cancelado').length,
      thisMonth: getProjectsThisMonth(projects).length,
      thisWeek: getProjectsThisWeek(projects).length,
      overdue: getOverdueProjects(projects).length,
      upcoming: getUpcomingProjects(projects).length
    };

    const recentProjects = [...projects]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    const upcomingEvents = getUpcomingProjects(projects)
      .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
      .slice(0, 5);

    setDashboardData({
      stats,
      recentProjects,
      upcomingEvents,
      teamActivity: [], // TODO: Implement team activity
      notifications: [] // TODO: Implement notifications
    });
  };

  return {
    dashboardData,
    loading
  };
};