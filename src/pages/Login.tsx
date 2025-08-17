import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PrimaryActionButton } from '@/components/ui/primary-action-button';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Lock } from 'lucide-react';

import { supabase } from '../supabaseClient';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);
    if (error) {
      setError(error.message);
    } else {
      navigate('/dashboard');
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
                <a href="#" className="text-xs text-primary hover:text-primary-highlight">
                  Esqueceu a senha?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
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
              isLoading={isLoading}
              loadingText="Entrando..."
            >
              Entrar
            </PrimaryActionButton>
            {error && (
              <div className="text-red-600 text-sm text-center mt-2">{error}</div>
            )}

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
        
        <p className="mt-6 text-center text-xs text-neutral-500">
          &copy; 2025 Smart Termos. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};
