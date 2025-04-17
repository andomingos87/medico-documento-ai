
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  TabletSmartphone, 
  PenTool, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  User 
} from 'lucide-react';

export const BenefitsCard = () => {
  return (
    <Card className="lg:col-span-3 bg-gradient-to-br from-medico-50 to-blue-50 border-neutral-200">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BenefitItem
            icon={<TabletSmartphone className="h-6 w-6 text-medico-600" />}
            title="Experiência Mobile"
            description="Interface otimizada para tablets, facilitando o uso em consultórios e clínicas"
            bgColor="bg-medico-100"
            textColor="text-medico-600"
          />
          
          <BenefitItem
            icon={<PenTool className="h-6 w-6 text-green-600" />}
            title="Assinatura Digital"
            description="Pacientes assinam documentos diretamente no tablet com validação legal"
            bgColor="bg-green-100"
            textColor="text-green-600"
          />
          
          <BenefitItem
            icon={<Send className="h-6 w-6 text-blue-600" />}
            title="Envio Automático"
            description="Documentos enviados automaticamente por e-mail ou WhatsApp"
            bgColor="bg-blue-100"
            textColor="text-blue-600"
          />
          
          <BenefitItem
            icon={<Sparkles className="h-6 w-6 text-purple-600" />}
            title="IA Integrada"
            description="Geração automática de termos personalizados por tipo de procedimento"
            bgColor="bg-purple-100"
            textColor="text-purple-600"
          />
          
          <BenefitItem
            icon={<ShieldCheck className="h-6 w-6 text-amber-600" />}
            title="Segurança LGPD"
            description="Armazenamento seguro e criptografado, em conformidade com a LGPD"
            bgColor="bg-amber-100"
            textColor="text-amber-600"
          />
          
          <BenefitItem
            icon={<User className="h-6 w-6 text-rose-600" />}
            title="Multiusuário"
            description="Diferentes níveis de acesso para cada profissional da clínica"
            bgColor="bg-rose-100"
            textColor="text-rose-600"
          />
        </div>
      </CardContent>
    </Card>
  );
};

interface BenefitItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  textColor: string;
}

const BenefitItem = ({ icon, title, description, bgColor, textColor }: BenefitItemProps) => (
  <div className="flex items-start space-x-4">
    <div className={`${bgColor} p-3 rounded-lg`}>
      {icon}
    </div>
    <div>
      <h3 className="font-medium text-neutral-900">{title}</h3>
      <p className="text-sm text-neutral-600 mt-1">
        {description}
      </p>
    </div>
  </div>
);
