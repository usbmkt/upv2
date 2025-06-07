import { useState } from "react";
import { User, Mail, Calendar, Edit, Save, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../lib/utils";

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.email?.split('@')[0] || '',
    bio: '',
    company: '',
    location: '',
    website: ''
  });

  const handleSave = () => {
    // TODO: Implement profile update
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data
    setFormData({
      displayName: user?.email?.split('@')[0] || '',
      bio: '',
      company: '',
      location: '',
      website: ''
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Perfil</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas informações pessoais
          </p>
        </div>
        
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-colors"
          >
            <Edit size={16} />
            Editar Perfil
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
            >
              <X size={16} />
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-colors"
            >
              <Save size={16} />
              Salvar
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-card border rounded-xl p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground text-3xl font-bold mx-auto mb-4">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            
            {isEditing ? (
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                className="text-xl font-bold text-center w-full bg-transparent border-b border-muted-foreground/20 focus:border-primary outline-none mb-2"
              />
            ) : (
              <h2 className="text-xl font-bold mb-2">{formData.displayName}</h2>
            )}
            
            <p className="text-muted-foreground mb-4">{user?.email}</p>
            
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Membro desde {formatDate(new Date(), 'MMMM \'de\' yyyy')}</span>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="bg-card border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-6">Informações Pessoais</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome de Exibição</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                      className="w-full p-3 border rounded-lg bg-background"
                    />
                  ) : (
                    <p className="p-3 bg-muted/30 rounded-lg">{formData.displayName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user?.email}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className="w-full p-3 border rounded-lg bg-background resize-none"
                    placeholder="Conte um pouco sobre você..."
                  />
                ) : (
                  <p className="p-3 bg-muted/30 rounded-lg min-h-[80px]">
                    {formData.bio || 'Nenhuma bio adicionada'}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Empresa</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full p-3 border rounded-lg bg-background"
                      placeholder="Nome da empresa"
                    />
                  ) : (
                    <p className="p-3 bg-muted/30 rounded-lg">
                      {formData.company || 'Não informado'}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Localização</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full p-3 border rounded-lg bg-background"
                      placeholder="Cidade, Estado"
                    />
                  ) : (
                    <p className="p-3 bg-muted/30 rounded-lg">
                      {formData.location || 'Não informado'}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Website</label>
                {isEditing ? (
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full p-3 border rounded-lg bg-background"
                    placeholder="https://seusite.com"
                  />
                ) : (
                  <p className="p-3 bg-muted/30 rounded-lg">
                    {formData.website ? (
                      <a 
                        href={formData.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {formData.website}
                      </a>
                    ) : (
                      'Não informado'
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Account Stats */}
          <div className="bg-card border rounded-xl p-6 mt-6">
            <h3 className="text-lg font-semibold mb-6">Estatísticas da Conta</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">0</div>
                <div className="text-sm text-muted-foreground">Projetos Criados</div>
              </div>
              
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">0</div>
                <div className="text-sm text-muted-foreground">Projetos Concluídos</div>
              </div>
              
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">0</div>
                <div className="text-sm text-muted-foreground">Templates Criados</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;