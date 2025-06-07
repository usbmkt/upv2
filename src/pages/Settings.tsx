import { useState } from "react";
import { 
  Save, 
  RotateCcw, 
  User, 
  Bell, 
  Palette, 
  Globe, 
  Clock,
  Shield,
  Download,
  Trash2,
  Settings as SettingsIcon
} from "lucide-react";
import { useSettings } from "../hooks/useSettings";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { toast } from "sonner";
import { defaultPhases } from "../lib/utils";

const Settings = () => {
  const { settings, loading, updateSettings, resetSettings } = useSettings();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("geral");
  const [formData, setFormData] = useState({
    theme: theme,
    language: "pt-BR",
    timezone: "America/Sao_Paulo",
    notificationsEnabled: true,
    emailNotifications: true,
    defaultPhaseDurations: defaultPhases
  });

  // Update form data when settings load
  useState(() => {
    if (settings) {
      setFormData({
        theme: settings.theme,
        language: settings.language,
        timezone: settings.timezone,
        notificationsEnabled: settings.notificationsEnabled,
        emailNotifications: settings.emailNotifications,
        defaultPhaseDurations: settings.defaultPhaseDurations
      });
    }
  });

  const handleSave = async () => {
    const success = await updateSettings(formData);
    if (success && formData.theme !== theme) {
      setTheme(formData.theme);
    }
  };

  const handleReset = async () => {
    if (confirm("Tem certeza que deseja restaurar todas as configurações para o padrão?")) {
      const success = await resetSettings();
      if (success) {
        setFormData({
          theme: "system",
          language: "pt-BR",
          timezone: "America/Sao_Paulo",
          notificationsEnabled: true,
          emailNotifications: true,
          defaultPhaseDurations: defaultPhases
        });
        setTheme("system");
      }
    }
  };

  const updatePhaseDay = (phaseKey: string, days: number) => {
    setFormData(prev => ({
      ...prev,
      defaultPhaseDurations: {
        ...prev.defaultPhaseDurations,
        [phaseKey]: {
          ...prev.defaultPhaseDurations[phaseKey],
          days: Math.max(1, days)
        }
      }
    }));
  };

  const tabs = [
    { id: "geral", label: "Geral", icon: <SettingsIcon className="h-4 w-4" /> },
    { id: "aparencia", label: "Aparência", icon: <Palette className="h-4 w-4" /> },
    { id: "notificacoes", label: "Notificações", icon: <Bell className="h-4 w-4" /> },
    { id: "fases", label: "Fases Padrão", icon: <Clock className="h-4 w-4" /> },
    { id: "conta", label: "Conta", icon: <User className="h-4 w-4" /> },
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-48"></div>
        <div className="h-96 bg-muted rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground mt-1">
            Personalize sua experiência no Launch Master
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Restaurar Padrão
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-colors"
          >
            <Save className="h-4 w-4" />
            Salvar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-card border rounded-xl p-6">
            {/* Geral Tab */}
            {activeTab === "geral" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Configurações Gerais</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Idioma</label>
                      <select
                        value={formData.language}
                        onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                        className="w-full p-3 border rounded-lg bg-background"
                      >
                        <option value="pt-BR">Português (Brasil)</option>
                        <option value="en-US">English (US)</option>
                        <option value="es-ES">Español</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Fuso Horário</label>
                      <select
                        value={formData.timezone}
                        onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                        className="w-full p-3 border rounded-lg bg-background"
                      >
                        <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                        <option value="America/New_York">Nova York (GMT-5)</option>
                        <option value="Europe/London">Londres (GMT+0)</option>
                        <option value="Asia/Tokyo">Tóquio (GMT+9)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Aparência Tab */}
            {activeTab === "aparencia" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Aparência</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Tema</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: "light", label: "Claro", preview: "bg-white border-2" },
                          { value: "dark", label: "Escuro", preview: "bg-gray-900 border-2" },
                          { value: "system", label: "Sistema", preview: "bg-gradient-to-r from-white to-gray-900 border-2" }
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setFormData(prev => ({ ...prev, theme: option.value as any }))}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              formData.theme === option.value
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <div className={`w-full h-12 rounded mb-2 ${option.preview}`}></div>
                            <p className="text-sm font-medium">{option.label}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notificações Tab */}
            {activeTab === "notificacoes" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Notificações</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Notificações do Sistema</h4>
                        <p className="text-sm text-muted-foreground">
                          Receber notificações sobre atualizações de projetos
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.notificationsEnabled}
                          onChange={(e) => setFormData(prev => ({ ...prev, notificationsEnabled: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Notificações por Email</h4>
                        <p className="text-sm text-muted-foreground">
                          Receber emails sobre prazos e marcos importantes
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.emailNotifications}
                          onChange={(e) => setFormData(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Fases Padrão Tab */}
            {activeTab === "fases" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Durações Padrão das Fases</h3>
                  <p className="text-muted-foreground mb-6">
                    Configure a duração padrão para cada fase dos seus projetos
                  </p>
                  
                  <div className="space-y-4">
                    {Object.entries(formData.defaultPhaseDurations).map(([key, phase]) => (
                      <div key={key} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: phase.color }}
                        />
                        <div className="flex-1">
                          <label className="block text-sm font-medium">{phase.name}</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            value={phase.days}
                            onChange={(e) => updatePhaseDay(key, parseInt(e.target.value) || 1)}
                            className="w-20 p-2 border rounded bg-background text-center"
                          />
                          <span className="text-sm text-muted-foreground">dias</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Conta Tab */}
            {activeTab === "conta" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Informações da Conta</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground text-xl font-bold">
                          {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <h4 className="font-medium">{user?.email?.split('@')[0] || 'Usuário'}</h4>
                          <p className="text-sm text-muted-foreground">{user?.email}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Membro desde {new Date().toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button className="flex items-center gap-2 p-4 border rounded-lg hover:bg-muted transition-colors">
                        <Download className="h-4 w-4" />
                        Exportar Dados
                      </button>
                      
                      <button className="flex items-center gap-2 p-4 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20 transition-colors">
                        <Trash2 className="h-4 w-4" />
                        Excluir Conta
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">Segurança</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Autenticação de dois fatores</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Desabilitado</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;