import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { Project, ProjectStatus } from '../types/project';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      // Fetch projects separately
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      // Fetch phases separately
      const { data: phasesData, error: phasesError } = await supabase
        .from('phases')
        .select('*');

      if (phasesError) throw phasesError;

      // Group phases by project_id
      const phasesByProject = phasesData.reduce((acc: any, phase: any) => {
        if (!acc[phase.project_id]) {
          acc[phase.project_id] = [];
        }
        acc[phase.project_id].push(phase);
        return acc;
      }, {});

      // Combine projects with their phases
      const formattedProjects = projectsData.map(p => ({
        id: p.id,
        name: p.name,
        client: p.client || undefined,
        description: p.description || undefined,
        eventDate: new Date(p.event_date),
        status: p.status as ProjectStatus,
        createdAt: new Date(p.created_at),
        priority: (p as any).priority || 'media',
        budget: (p as any).budget || undefined,
        team: (p as any).team || [],
        tags: (p as any).tags || [],
        phases: (phasesByProject[p.id] || []).reduce((acc: any, phase: any) => {
          acc[phase.name] = {
            start: new Date(phase.start_date),
            end: new Date(phase.end_date)
          };
          return acc;
        }, {})
      }));

      setProjects(formattedProjects);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      toast.error('Falha ao carregar projetos');
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (project: Omit<Project, 'id' | 'createdAt'>): Promise<string> => {
    try {
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert({
          name: project.name,
          client: project.client,
          description: project.description,
          event_date: project.eventDate.toISOString(),
          status: project.status,
          priority: project.priority || 'media',
          budget: project.budget,
          team: project.team || [],
          tags: project.tags || []
        })
        .select()
        .single();

      if (projectError) throw projectError;

      const phaseInserts = Object.entries(project.phases).map(([name, phase]) => ({
        project_id: projectData.id,
        name,
        start_date: phase.start.toISOString(),
        end_date: phase.end.toISOString(),
        duration: Math.ceil((phase.end.getTime() - phase.start.getTime()) / (1000 * 60 * 60 * 24))
      }));

      const { error: phasesError } = await supabase
        .from('phases')
        .insert(phaseInserts);

      if (phasesError) throw phasesError;

      await loadProjects();
      toast.success('Projeto criado com sucesso!');
      return projectData.id;
    } catch (error) {
      console.error('Erro ao adicionar projeto:', error);
      toast.error('Falha ao criar projeto');
      throw error;
    }
  };

  const updateProject = async (id: string, updatedProject: Partial<Project>): Promise<boolean> => {
    try {
      const updateData: any = {};
      
      if (updatedProject.name !== undefined) updateData.name = updatedProject.name;
      if (updatedProject.client !== undefined) updateData.client = updatedProject.client;
      if (updatedProject.description !== undefined) updateData.description = updatedProject.description;
      if (updatedProject.eventDate !== undefined) updateData.event_date = updatedProject.eventDate.toISOString();
      if (updatedProject.status !== undefined) updateData.status = updatedProject.status;
      if (updatedProject.priority !== undefined) updateData.priority = updatedProject.priority;
      if (updatedProject.budget !== undefined) updateData.budget = updatedProject.budget;
      if (updatedProject.team !== undefined) updateData.team = updatedProject.team;
      if (updatedProject.tags !== undefined) updateData.tags = updatedProject.tags;

      const { error: projectError } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', id);

      if (projectError) throw projectError;

      if (updatedProject.phases) {
        // Delete existing phases
        await supabase
          .from('phases')
          .delete()
          .eq('project_id', id);

        // Insert new phases
        const phaseInserts = Object.entries(updatedProject.phases).map(([name, phase]) => ({
          project_id: id,
          name,
          start_date: phase.start.toISOString(),
          end_date: phase.end.toISOString(),
          duration: Math.ceil((phase.end.getTime() - phase.start.getTime()) / (1000 * 60 * 60 * 24))
        }));

        const { error: phasesError } = await supabase
          .from('phases')
          .insert(phaseInserts);

        if (phasesError) throw phasesError;
      }

      await loadProjects();
      toast.success('Projeto atualizado com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      toast.error('Falha ao atualizar projeto');
      return false;
    }
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadProjects();
      toast.success('Projeto excluído com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao excluir projeto:', error);
      toast.error('Falha ao excluir projeto');
      return false;
    }
  };

  const duplicateProject = async (id: string): Promise<string | null> => {
    try {
      const project = projects.find(p => p.id === id);
      if (!project) throw new Error('Projeto não encontrado');

      const duplicatedProject = {
        ...project,
        name: `${project.name} (Cópia)`,
        status: 'planejamento' as ProjectStatus,
        eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      };

      delete (duplicatedProject as any).id;
      delete (duplicatedProject as any).createdAt;

      return await addProject(duplicatedProject);
    } catch (error) {
      console.error('Erro ao duplicar projeto:', error);
      toast.error('Falha ao duplicar projeto');
      return null;
    }
  };

  const getProject = (id: string): Project | undefined => {
    return projects.find(project => project.id === id);
  };

  const getProjectsByStatus = (status: ProjectStatus): Project[] => {
    return projects.filter(project => project.status === status);
  };

  const searchProjects = (query: string): Project[] => {
    const lowercaseQuery = query.toLowerCase();
    return projects.filter(project =>
      project.name.toLowerCase().includes(lowercaseQuery) ||
      (project.client && project.client.toLowerCase().includes(lowercaseQuery)) ||
      (project.description && project.description.toLowerCase().includes(lowercaseQuery)) ||
      (project.tags && project.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)))
    );
  };

  return {
    projects,
    loading,
    addProject,
    updateProject,
    deleteProject,
    duplicateProject,
    getProject,
    getProjectsByStatus,
    searchProjects,
    refreshProjects: loadProjects
  };
};