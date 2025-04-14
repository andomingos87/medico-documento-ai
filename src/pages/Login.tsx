
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Lock } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulando autenticação
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center items-center gap-2 text-2xl font-bold text-medico-700 mb-2">
            <FileText className="h-8 w-8" />
            <span>MedicoDoc</span>
          </div>
          <p className="text-neutral-600">Sistema de geração de documentos médicos</p>
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
                <a href="#" className="text-xs text-medico-600 hover:text-medico-700">
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
            
            <Button 
              type="submit" 
              className="w-full bg-medico-600 hover:bg-medico-700"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-neutral-200 text-center">
            <p className="text-sm text-neutral-600">
              Não tem uma conta?{" "}
              <a href="#" className="text-medico-600 hover:text-medico-700 font-medium">
                Cadastre-se
              </a>
            </p>
          </div>
        </div>
        
        <p className="mt-6 text-center text-xs text-neutral-500">
          &copy; 2025 MedicoDoc. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};
