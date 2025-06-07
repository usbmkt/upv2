import { useState } from "react";
import { Plus, Search, Copy, Edit, Trash2, Eye, Download } from "lucide-react";
import { useTemplates } from "../hooks/useTemplates";
import { projectTemplates } from "../lib/utils";
import { ProjectTemplate } from "../types/project";

const Templates = () => {
  const { templates, loading, addTemplate, deleteTemplate } = useTemplates();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (template.description && template.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateFromBuiltIn = async (templateKey: string) => {
    const builtInTemplate = projectTemplates[templateKey as keyof typeof projectTemplates];
    if (builtInTemplate) {
      await addTemplate({
        name: builtInTemplate.name,
        description: builtInTemplate.description,
        phases: builtInTemplate.phases,
        isPublic: false
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-muted rounded-lg"></div>
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
          <h1 className="text-3xl font-bold">Templates de Projeto</h1>
          <p className="text-muted-foreground mt-1">
            Modelos pré-configurados para acelerar a criação de projetos
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Novo Template
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 py-2 pr-4 border rounded-lg bg-background"
        />
      </div>

      {/* Built-in Templates */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Templates Padrão</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(projectTemplates).map(([key, template]) => (
            <div key={key} className="bg-card border rounded-xl p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {template.description}
                  </p>
                </div>
                <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                  Padrão
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm font-medium">Fases incluídas:</p>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(template.phases).map(([phaseKey, phase]) => (
                    <span
                      key={phaseKey}
                      className="text-xs px-2 py-1 rounded-full border"
                      style={{ 
                        backgroundColor: `${phase.color}20`,
                        borderColor: phase.color,
                        color: phase.color
                      }}
                    >
                      {phase.name} ({phase.days}d)
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCreateFromBuiltIn(key)}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-1"
                >
                  <Copy size={14} />
                  Usar Template
                </button>
                <button className="p-2 border rounded-lg hover:bg-muted transition-colors">
                  <Eye size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Templates */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Meus Templates</h2>
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="bg-card border rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{template.name}</h3>
                    {template.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {template.description}
                      </p>
                    )}
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    template.isPublic 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300'
                  }`}>
                    {template.isPublic ? 'Público' : 'Privado'}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm font-medium">Fases incluídas:</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(template.phases).map(([phaseKey, phase]) => (
                      <span
                        key={phaseKey}
                        className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                      >
                        {phase.name} ({phase.days}d)
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-1">
                    <Copy size={14} />
                    Usar
                  </button>
                  <button className="p-2 border rounded-lg hover:bg-muted transition-colors">
                    <Edit size={14} />
                  </button>
                  <button 
                    onClick={() => deleteTemplate(template.id)}
                    className="p-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-xl">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-2">Nenhum template personalizado</h3>
            <p className="text-muted-foreground mb-4">
              Crie templates personalizados para reutilizar em futuros projetos
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
            >
              <Plus size={16} />
              Criar Template
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Templates;