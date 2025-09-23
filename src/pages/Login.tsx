import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PrimaryActionButton } from '@/components/ui/primary-action-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ForgotPasswordDialog } from '@/components/auth/ForgotPasswordDialog';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, loading, user } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await signIn(email, password);
    
    if (!error) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center items-center gap-2 text-2xl font-bold text-primary mb-2">
            <FileText className="h-8 w-8" />
            <span>Smart Termos</span>
          </div>
          <p className="text-neutral-600">Sistema de geração de documentos</p>
        </div>
        
        <div className="bg-white p-8 rounded-lg border border-neutral-200 shadow-soft">
          <h1 className="text-xl font-semibold text-neutral-900 mb-6">Entrar na sua conta</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <button 
                  type="button"
                  onClick={() => setIsForgotPasswordOpen(true)}
                  className="text-xs text-primary hover:text-primary-highlight transition-colors"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <label
                htmlFor="remember"
                className="text-sm text-neutral-600 cursor-pointer"
              >
                Lembrar-me
              </label>
            </div>
            
            <PrimaryActionButton 
              type="submit" 
              className="w-full"
              isLoading={loading}
              loadingText="Entrando..."
              disabled={!email || !password}
            >
              Entrar
            </PrimaryActionButton>

          </form>
          
          <div className="mt-6 pt-6 border-t border-neutral-200 text-center">
            <p className="text-sm text-neutral-600">
              Não tem uma conta?{" "}
              <Link to="/register" className="text-primary hover:text-primary-highlight font-medium">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
        
        <p className="mt-6 text-center text-xs text-muted-foreground">
          &copy; 2025 Smart Termos. Todos os direitos reservados.
        </p>
      </div>
      
      <ForgotPasswordDialog 
        open={isForgotPasswordOpen}
        onOpenChange={setIsForgotPasswordOpen}
      />
    </div>
  );
};
