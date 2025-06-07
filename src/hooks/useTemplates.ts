import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { ProjectTemplate } from '../types/project';
import { useAuth } from '../context/AuthContext';

export const useTemplates = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<ProjectTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, [user]);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('project_templates')
        .select('*')
        .or(`user_id.eq.${user?.id},is_public.eq.true`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTemplates = data.map(t => ({
        id: t.id,
        name: t.name,
        description: t.description || undefined,
        phases: t.phases as any,
        isPublic: t.is_public,
        createdAt: new Date(t.created_at)
      }));

      setTemplates(formattedTemplates);
    } catch (error) {
      console.error('Erro ao carregar templates:', error);
      toast.error('Falha ao carregar templates');
    } finally {
      setLoading(false);
    }
  };

  const addTemplate = async (template: Omit<ProjectTemplate, 'id' | 'createdAt'>): Promise<string | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('project_templates')
        .insert({
          user_id: user.id,
          name: template.name,
          description: template.description,
          phases: template.phases,
          is_public: template.isPublic
        })
        .select()
        .single();

      if (error) throw error;

      await loadTemplates();
      toast.success('Template criado com sucesso!');
      return data.id;
    } catch (error) {
      console.error('Erro ao criar template:', error);
      toast.error('Falha ao criar template');
      return null;
    }
  };

  const updateTemplate = async (id: string, updatedTemplate: Partial<ProjectTemplate>): Promise<boolean> => {
    try {
      const updateData: any = {};
      
      if (updatedTemplate.name !== undefined) updateData.name = updatedTemplate.name;
      if (updatedTemplate.description !== undefined) updateData.description = updatedTemplate.description;
      if (updatedTemplate.phases !== undefined) updateData.phases = updatedTemplate.phases;
      if (updatedTemplate.isPublic !== undefined) updateData.is_public = updatedTemplate.isPublic;

      const { error } = await supabase
        .from('project_templates')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      await loadTemplates();
      toast.success('Template atualizado com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao atualizar template:', error);
      toast.error('Falha ao atualizar template');
      return false;
    }
  };

  const deleteTemplate = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('project_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadTemplates();
      toast.success('Template excluído com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao excluir template:', error);
      toast.error('Falha ao excluir template');
      return false;
    }
  };

  const getTemplate = (id: string): ProjectTemplate | undefined => {
    return templates.find(template => template.id === id);
  };

  return {
    templates,
    loading,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplate,
    refreshTemplates: loadTemplates
  };
};