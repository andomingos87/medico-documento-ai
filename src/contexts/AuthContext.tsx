import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  resendConfirmation: (email: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle auth events
        if (event === 'SIGNED_OUT') {
          toast({
            title: "Logout realizado",
            description: "Você foi desconectado com sucesso.",
          });
        } else if (event === 'PASSWORD_RECOVERY') {
          toast({
            title: "Email de recuperação enviado",
            description: "Verifique sua caixa de entrada.",
          });
        }
      }
    );

    // THEN check for existing session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        toast({
          title: "Erro no login",
          description: getErrorMessage(error),
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta!",
        });
      }
      
      return { error };
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
      return { error: authError };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/confirm-email`
        }
      });
      
      if (error) {
        toast({
          title: "Erro no cadastro",
          description: getErrorMessage(error),
          variant: "destructive",
        });
      } else {
        toast({
          title: "Cadastro realizado!",
          description: "Verifique seu email para confirmar sua conta.",
        });
      }
      
      return { error };
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Erro no cadastro",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
      return { error: authError };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Erro ao sair",
          description: "Não foi possível fazer logout. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Erro ao sair",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const redirectUrl = `${window.location.origin}/login`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      
      if (error) {
        toast({
          title: "Erro ao enviar email",
          description: getErrorMessage(error),
          variant: "destructive",
        });
      } else {
        toast({
          title: "Email enviado!",
          description: "Verifique sua caixa de entrada para redefinir sua senha.",
        });
      }
      
      return { error };
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Erro ao enviar email",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
      return { error: authError };
    }
  };

  const resendConfirmation = async (email: string) => {
    try {
      const redirectUrl = `${window.location.origin}/confirm-email`;
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      
      if (error) {
        toast({
          title: "Erro ao reenviar email",
          description: getErrorMessage(error),
          variant: "destructive",
        });
      } else {
        toast({
          title: "Email reenviado!",
          description: "Verifique sua caixa de entrada para confirmar sua conta.",
        });
      }
      
      return { error };
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Erro ao reenviar email",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
      return { error: authError };
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    resendConfirmation,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Helper function to translate error messages
const getErrorMessage = (error: AuthError): string => {
  // Check for specific error codes first
  if (error.message?.includes('Invalid login credentials')) {
    return 'Email ou senha incorretos. Verifique suas credenciais e tente novamente.';
  }
  
  if (error.message?.includes('Email not confirmed')) {
    return 'Email não confirmado. Verifique sua caixa de entrada e clique no link de confirmação.';
  }
  
  if (error.message?.includes('User already registered')) {
    return 'Este email já está cadastrado. Tente fazer login ou use outro email.';
  }
  
  if (error.message?.includes('Password should be at least 6 characters')) {
    return 'A senha deve ter pelo menos 6 caracteres.';
  }
  
  if (error.message?.includes('Invalid email')) {
    return 'Email inválido. Verifique o formato do email.';
  }
  
  if (error.message?.includes('Signup is disabled')) {
    return 'Cadastro desabilitado temporariamente. Tente novamente mais tarde.';
  }
  
  if (error.message?.includes('Too many requests')) {
    return 'Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.';
  }
  
  if (error.message?.includes('Invalid email or password')) {
    return 'Email ou senha incorretos. Verifique suas credenciais.';
  }
  
  if (error.message?.includes('User not found')) {
    return 'Usuário não encontrado. Verifique o email ou cadastre-se.';
  }
  
  // Return the original message if no specific translation found
  return error.message || 'Ocorreu um erro inesperado. Tente novamente.';
};