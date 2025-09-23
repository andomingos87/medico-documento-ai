import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const EmailConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, resendConfirmation } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const checkConfirmation = async () => {
      try {
        // Check if user is already confirmed
        if (user?.email_confirmed_at) {
          setStatus('success');
          setMessage('Seu email foi confirmado com sucesso!');
          setTimeout(() => navigate('/dashboard'), 2000);
          return;
        }

        // Check URL parameters for confirmation
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        
        if (token && type === 'signup') {
          setStatus('success');
          setMessage('Email confirmado com sucesso! Redirecionando...');
          setTimeout(() => navigate('/dashboard'), 2000);
        } else {
          // If no token, show a message asking to check email
          setStatus('error');
          setMessage('Aguardando confirmação do email. Verifique sua caixa de entrada e clique no link de confirmação.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Erro ao confirmar email. Tente novamente.');
      }
    };

    checkConfirmation();
  }, [user, searchParams, navigate]);

  const handleResendEmail = async () => {
    if (!email.trim()) {
      setMessage('Por favor, digite seu email.');
      return;
    }
    
    const { error } = await resendConfirmation(email);
    if (!error) {
      setMessage('Email de confirmação reenviado! Verifique sua caixa de entrada.');
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
          <p className="text-neutral-600">Confirmação de Email</p>
        </div>
        
        <div className="bg-white p-8 rounded-lg border border-neutral-200 shadow-soft text-center">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <h1 className="text-xl font-semibold text-neutral-900 mb-2">
                Verificando confirmação...
              </h1>
              <p className="text-neutral-600">
                Aguarde enquanto verificamos sua confirmação de email.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h1 className="text-xl font-semibold text-neutral-900 mb-2">
                Email Confirmado!
              </h1>
              <p className="text-neutral-600 mb-6">
                {message}
              </p>
              <Button 
                onClick={() => navigate('/dashboard')}
                className="w-full"
              >
                Ir para o Dashboard
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <Mail className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h1 className="text-xl font-semibold text-neutral-900 mb-2">
                Confirme seu Email
              </h1>
              <p className="text-neutral-600 mb-6">
                {message}
              </p>
              <div className="space-y-4">
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
                <div className="space-y-3">
                  <Button 
                    onClick={handleResendEmail}
                    className="w-full"
                    variant="outline"
                    disabled={!email.trim()}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Reenviar Email
                  </Button>
                  <Button 
                    onClick={() => navigate('/login')}
                    className="w-full"
                  >
                    Ir para Login
                  </Button>
                </div>
              </div>
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
