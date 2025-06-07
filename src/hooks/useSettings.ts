import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { UserSettings } from '../types/project';
import { useAuth } from '../context/AuthContext';
import { defaultPhases } from '../lib/utils';

export const useSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings({
          id: data.id,
          userId: data.user_id,
          theme: data.theme as 'light' | 'dark' | 'system',
          language: data.language,
          timezone: data.timezone,
          notificationsEnabled: data.notifications_enabled,
          emailNotifications: data.email_notifications,
          defaultPhaseDurations: data.default_phase_durations as any || defaultPhases,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at)
        });
      } else {
        // Create default settings
        await createDefaultSettings();
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast.error('Falha ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const createDefaultSettings = async () => {
    if (!user) return;

    const defaultSettings = {
      user_id: user.id,
      theme: 'system',
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo',
      notifications_enabled: true,
      email_notifications: true,
      default_phase_durations: defaultPhases
    };

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .insert(defaultSettings)
        .select()
        .single();

      if (error) throw error;

      setSettings({
        id: data.id,
        userId: data.user_id,
        theme: data.theme as 'light' | 'dark' | 'system',
        language: data.language,
        timezone: data.timezone,
        notificationsEnabled: data.notifications_enabled,
        emailNotifications: data.email_notifications,
        defaultPhaseDurations: data.default_phase_durations as any,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      });
    } catch (error) {
      console.error('Erro ao criar configurações padrão:', error);
    }
  };

  const updateSettings = async (updatedSettings: Partial<UserSettings>): Promise<boolean> => {
    if (!user || !settings) return false;

    try {
      const updateData: any = {};
      
      if (updatedSettings.theme !== undefined) updateData.theme = updatedSettings.theme;
      if (updatedSettings.language !== undefined) updateData.language = updatedSettings.language;
      if (updatedSettings.timezone !== undefined) updateData.timezone = updatedSettings.timezone;
      if (updatedSettings.notificationsEnabled !== undefined) updateData.notifications_enabled = updatedSettings.notificationsEnabled;
      if (updatedSettings.emailNotifications !== undefined) updateData.email_notifications = updatedSettings.emailNotifications;
      if (updatedSettings.defaultPhaseDurations !== undefined) updateData.default_phase_durations = updatedSettings.defaultPhaseDurations;
      
      updateData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('user_settings')
        .update(updateData)
        .eq('id', settings.id);

      if (error) throw error;

      setSettings(prev => prev ? { ...prev, ...updatedSettings, updatedAt: new Date() } : null);
      toast.success('Configurações atualizadas com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      toast.error('Falha ao atualizar configurações');
      return false;
    }
  };

  const resetSettings = async (): Promise<boolean> => {
    if (!user || !settings) return false;

    try {
      const defaultSettings = {
        theme: 'system',
        language: 'pt-BR',
        timezone: 'America/Sao_Paulo',
        notifications_enabled: true,
        email_notifications: true,
        default_phase_durations: defaultPhases,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('user_settings')
        .update(defaultSettings)
        .eq('id', settings.id);

      if (error) throw error;

      await loadSettings();
      toast.success('Configurações restauradas para o padrão!');
      return true;
    } catch (error) {
      console.error('Erro ao restaurar configurações:', error);
      toast.error('Falha ao restaurar configurações');
      return false;
    }
  };

  return {
    settings,
    loading,
    updateSettings,
    resetSettings,
    refreshSettings: loadSettings
  };
};