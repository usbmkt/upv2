import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Rocket } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const AuthModal = () => {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
        toast.success("Login realizado com sucesso!");
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error("As senhas não coincidem");
          return;
        }
        if (formData.password.length < 6) {
          toast.error("A senha deve ter pelo menos 6 caracteres");
          return;
        }
        await signUp(formData.email, formData.password);
        toast.success("Conta criada com sucesso!");
      }
    } catch (error: any) {
      console.error("Erro de autenticação:", error);
      
      if (error.message?.includes("Invalid login credentials")) {
        toast.error("Email ou senha incorretos");
      } else if (error.message?.includes("User already registered")) {
        toast.error("Este email já está cadastrado");
      } else if (error.message?.includes("Password should be at least 6 characters")) {
        toast.error("A senha deve ter pelo menos 6 caracteres");
      } else {
        toast.error(isLogin ? "Erro ao fazer login" : "Erro ao criar conta");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 mb-4">
            <Rocket className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Launch Master
          </h1>
          <p className="text-muted-foreground mt-2">
            {isLogin ? "Entre na sua conta" : "Crie sua conta"}
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-card border rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field (only for signup) */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirmar Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <User className="h-4 w-4" />
                  {isLogin ? "Entrar" : "Criar Conta"}
                </>
              )}
            </button>
          </form>

          {/* Toggle Auth Mode */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-primary hover:text-primary/80 font-medium transition-colors"
              >
                {isLogin ? "Criar conta" : "Fazer login"}
              </button>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <Calculator className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Calculadora de Cronogramas</p>
          </div>
          <div className="p-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Gestão de Projetos</p>
          </div>
          <div className="p-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Relatórios Detalhados</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;