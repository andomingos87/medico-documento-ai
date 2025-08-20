import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, Menu, User, LogOut, Settings, Stethoscope, Star } from 'lucide-react';
import { NewAnamnesisDialog } from '@/components/anamneses/NewAnamnesisDialog';
import { cn } from '@/lib/utils';
import { useAnamneses } from '@/hooks/useAnamneses';
import { UpgradePlanButton } from '@/components/UpgradePlanButton';

// Helper to get the title based on current route
const getRouteTitle = (pathname: string) => {
  switch (pathname) {
    case '/dashboard':
      return 'Dashboard';
    case '/documentos':
      return 'Documentos';
    case '/assinaturas':
      return 'Assinaturas';
    case '/profissionais':
      return 'Profissionais';
    case '/tarefas':
      return 'Tarefas';
    case '/perfil':
      return 'Meu Perfil';
    case '/configuracoes':
      return 'Configurações';
    default:
      return 'Dashboard';
  }
};

type AppHeaderProps = {
  toggleSidebar: () => void;
};

export const AppHeader = ({ toggleSidebar }: AppHeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const title = getRouteTitle(location.pathname);
  const [isNewAnamnesisDialogOpen, setIsNewAnamnesisDialogOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { createItemAsync } = useAnamneses();

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || '';
  const userEmail = user?.email || '';

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-background border-b border-border sticky top-0 z-10">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden" 
            onClick={toggleSidebar}
          >
            <Menu size={20} />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          <UpgradePlanButton />
          
          <Button 
            variant="highlight"
            className="mr-2 shadow-glow"
            onClick={() => setIsNewAnamnesisDialogOpen(true)}
          >
            <Stethoscope className="mr-2 h-4 w-4" />
            Nova Anamnese
          </Button>
          
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Bell size={18} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="Foto do perfil" />
                  <AvatarFallback className="bg-primary/10 text-primary">DR</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {userName ? userName : userEmail}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userEmail}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/perfil')}>
                <User className="mr-2 h-4 w-4" />
                <span>Meu Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive cursor-pointer"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <NewAnamnesisDialog
        open={isNewAnamnesisDialogOpen}
        onOpenChange={setIsNewAnamnesisDialogOpen}
        onSubmit={async (values) => {
          try {
            await createItemAsync(values);
            setIsNewAnamnesisDialogOpen(false);
            navigate('/anamneses');
          } catch (e) {
            // erros já são tratados pelo hook via toast
          }
        }}
      />
    </header>
  );
};
