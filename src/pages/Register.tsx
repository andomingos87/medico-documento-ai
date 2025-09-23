import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PrimaryActionButton } from '@/components/ui/primary-action-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signUp, loading, user } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return;
    }
    
    if (password.length < 6) {
      return;
    }

    const { error } = await signUp(email, password);
    
    if (!error) {
      // Clear form data and show success state
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setIsSuccess(true);
      
      // Redirect to confirmation page after showing success
      setTimeout(() => navigate('/confirm-email'), 2000);
    }
  };

  const isFormValid = email && password && confirmPassword && password === confirmPassword && password.length >= 6;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center items-center gap-2 text-2xl font-bold text-primary mb-2">
            <FileText className="h-8 w-8" />
            <span>Smart Termos</span>
          </div>
          <p className="text-muted-foreground">Sistema de geração de documentos</p>
        </div>
        <div className="bg-card p-8 rounded-lg border border-border shadow-soft">
          <h1 className="text-xl font-semibold text-card-foreground mb-6">Criar conta</h1>
          
          {isSuccess ? (
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <h2 className="text-lg font-semibold text-card-foreground">
                Cadastro realizado com sucesso!
              </h2>
              <p className="text-muted-foreground">
                Verifique seu email e clique no link de confirmação para ativar sua conta.
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecionando para a página de confirmação...
              </p>
            </div>
          ) : (
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
              <Label htmlFor="password">Senha</Label>
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
              {password && password.length < 6 && (
                <p className="text-xs text-destructive">A senha deve ter pelo menos 6 caracteres</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-destructive">As senhas não coincidem</p>
              )}
            </div>
              <PrimaryActionButton 
                type="submit" 
                className="w-full"
                isLoading={loading}
                loadingText="Cadastrando..."
                disabled={!isFormValid}
              >
                Cadastrar
              </PrimaryActionButton>
            </form>
          )}
          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-primary hover:text-primary-highlight font-medium transition-colors">
                Entrar
              </Link>
            </p>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          &copy; 2025 Smart Termos. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};
