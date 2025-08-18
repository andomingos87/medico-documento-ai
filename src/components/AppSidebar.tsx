
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { FileText, Home, Settings, Menu, FileSignature, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

type SidebarLinkProps = {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

const SidebarLink = ({ to, icon: Icon, children, className, onClick }: SidebarLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 relative",
        isActive 
          ? "text-primary bg-primary/10 border-l-4 border-primary shadow-soft" 
          : "text-neutral-700 hover:text-primary-highlight hover:bg-primary/5 hover:scale-105",
        className
      )}
      onClick={onClick}
    >
      <Icon size={18} className={cn(isActive ? "text-primary" : "text-neutral-500 group-hover:text-primary-highlight")} />
      <span>{children}</span>
    </Link>
  );
};

type AppSidebarProps = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

export const AppSidebar = ({ isSidebarOpen, toggleSidebar }: AppSidebarProps) => {
  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 z-30 h-full w-64 bg-white border-r border-neutral-200 transition-transform duration-300 lg:transform-none",
          isSidebarOpen ? "transform-none" : "-translate-x-full",
          "flex flex-col"
        )}
      >
        {/* Sidebar header */}
        <div className="h-16 flex items-center px-4 border-b border-neutral-200">
          <div className="flex items-center gap-2 text-xl font-semibold text-primary">
            <FileText size={24} className="text-primary" />
            <span>Smart Termos</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-auto lg:hidden" 
            onClick={toggleSidebar}
          >
            <Menu size={18} />
          </Button>
        </div>

        {/* Sidebar content */}
        <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto scrollbar-hidden">
          <SidebarLink to="/dashboard" icon={Home}>
            Dashboard
          </SidebarLink>
          <SidebarLink to="/pacientes" icon={Users}>
            Pacientes
          </SidebarLink>
          <SidebarLink to="/documentos" icon={FileText}>
            Documentos
          </SidebarLink>
          <SidebarLink to="/assinaturas" icon={FileSignature}>
            Assinaturas
          </SidebarLink>
          <SidebarLink to="/configuracoes" icon={Settings}>
            Configurações
          </SidebarLink>
        </div>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-neutral-200">
          <div className="bg-primary/10 text-primary rounded-md p-3 text-xs border border-primary/20">
            <p className="font-medium">Plano Pro</p>
            <p className="text-primary/80 mt-1">200 docs/mês disponíveis</p>
          </div>
        </div>
      </aside>
    </>
  );
};
