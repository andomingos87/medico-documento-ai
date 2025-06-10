import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText } from 'lucide-react';
import { supabase } from '../supabaseClient';

export const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    const { error } = await supabase.auth.signUp({ email, password });
    setIsLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Cadastro realizado! Verifique seu email para confirmar.');
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center items-center gap-2 text-2xl font-bold text-medico-700 mb-2">
            <FileText className="h-8 w-8" />
            <span>Smart Termos</span>
          </div>
          <p className="text-neutral-600">Sistema de geração de documentos</p>
        </div>
        <div className="bg-white p-8 rounded-lg border border-neutral-200 shadow-soft">
          <h1 className="text-xl font-semibold text-neutral-900 mb-6">Criar conta</h1>
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
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-medico-600 hover:bg-medico-700" disabled={isLoading}>
              {isLoading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
            {error && <div className="text-red-600 text-sm text-center mt-2">{error}</div>}
            {success && <div className="text-green-600 text-sm text-center mt-2">{success}</div>}
          </form>
          <div className="mt-6 pt-6 border-t border-neutral-200 text-center">
            <p className="text-sm text-neutral-600">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-medico-600 hover:text-medico-700 font-medium">
                Entrar
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
