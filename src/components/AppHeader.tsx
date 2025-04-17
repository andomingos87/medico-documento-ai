
import React, { useState } from 'react';
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
import { Bell, Menu, User, LogOut, Settings, FileText } from 'lucide-react';
import { NewDocumentDialog } from '@/components/signatures/NewDocumentDialog';
import { cn } from '@/lib/utils';

// Helper to get the title based on current route
const getRouteTitle = (pathname: string) => {
  switch (pathname) {
    case '/dashboard':
      return 'Dashboard';
    case '/documentos':
      return 'Documentos';
    case '/assinaturas':
      return 'Assinaturas';
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
  const title = getRouteTitle(location.pathname);
  const [isNewDocumentDialogOpen, setIsNewDocumentDialogOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-neutral-200 sticky top-0 z-10">
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
          <h1 className="text-xl font-semibold text-neutral-900">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          {location.pathname === '/assinaturas' && (
            <Button 
              className="bg-medico-600 hover:bg-medico-700 mr-2"
              onClick={() => setIsNewDocumentDialogOpen(true)}
            >
              <FileText className="mr-2 h-4 w-4" />
              Novo Termo de Consentimento
            </Button>
          )}
          
          <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-neutral-700">
            <Bell size={18} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="Foto do perfil" />
                  <AvatarFallback className="bg-medico-100 text-medico-700">DR</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Dr. Ricardo Silva</p>
                  <p className="text-xs leading-none text-neutral-500">dr.ricardo@exemplo.com.br</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Meu Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <NewDocumentDialog
        isOpen={isNewDocumentDialogOpen}
        onOpenChange={setIsNewDocumentDialogOpen}
        onSubmit={(values) => {
          // This will be handled by the useDocuments hook in the Signatures page
        }}
        isGenerating={false}
      />
    </header>
  );
};
