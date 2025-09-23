import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'ready'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          setStatus('error');
          setMessage('Erro ao verificar sessão. Tente novamente.');
          return;
        }

        if (!session) {
          setStatus('error');
          setMessage('Link inválido ou expirado. Solicite um novo link de redefinição.');
          return;
        }

        setStatus('ready');
        setMessage('Digite sua nova senha abaixo.');
      } catch (error) {
        setStatus('error');
        setMessage('Erro inesperado. Tente novamente.');
      }
    };

    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage('As senhas não coincidem.');
      return;
    }
    
    if (password.length < 6) {
      setMessage('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setMessage('Erro ao redefinir senha. Tente novamente.');
        return;
      }

      setStatus('success');
      setMessage('Senha redefinida com sucesso! Redirecionando para o login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      setMessage('Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = password && confirmPassword && password === confirmPassword && password.length >= 6;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center items-center gap-2 text-2xl font-bold text-primary mb-2">
            <FileText className="h-8 w-8" />
            <span>Smart Termos</span>
          </div>
          <p className="text-neutral-600">Redefinir senha</p>
        </div>
        
        <div className="bg-white p-8 rounded-lg border border-neutral-200 shadow-soft">
          {status === 'loading' && (
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <h1 className="text-xl font-semibold text-neutral-900">
                Verificando link...
              </h1>
              <p className="text-neutral-600">
                Aguarde enquanto verificamos seu link de redefinição.
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <h1 className="text-xl font-semibold text-neutral-900">
                Erro na Redefinição
              </h1>
              <p className="text-neutral-600 mb-6">
                {message}
              </p>
              <Button 
                onClick={() => navigate('/login')}
                className="w-full"
              >
                Voltar ao Login
              </Button>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <h1 className="text-xl font-semibold text-neutral-900">
                Senha Redefinida!
              </h1>
              <p className="text-neutral-600 mb-6">
                {message}
              </p>
              <Button 
                onClick={() => navigate('/login')}
                className="w-full"
              >
                Ir para Login
              </Button>
            </div>
          )}

          {status === 'ready' && (
            <>
              <h1 className="text-xl font-semibold text-neutral-900 mb-6">Redefinir senha</h1>
              <p className="text-neutral-600 mb-6">{message}</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Nova Senha</Label>
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
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
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

                {message && status === 'ready' && (
                  <p className="text-sm text-destructive">{message}</p>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={!isFormValid || isLoading}
                >
                  {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
                </Button>
              </form>
            </>
          )}
        </div>
        
        <p className="mt-6 text-center text-xs text-muted-foreground">
          &copy; 2025 Smart Termos. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};
