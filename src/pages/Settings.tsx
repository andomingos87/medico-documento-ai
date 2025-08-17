
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PrimaryActionButton } from '@/components/ui/primary-action-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export const Settings = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Dados fictícios para perfil
  const [profileData, setProfileData] = useState({
    name: 'Dr. Ricardo Silva',
    email: 'dr.ricardo@exemplo.com.br',
    specialty: 'Clínica Geral',
    crm: 'CRM 12345 SP',
    bio: 'Médico generalista com 10 anos de experiência e especialista em medicina preventiva.',
    phone: '(11) 98765-4321',
  });
  
  // Dados fictícios para configurações de IA
  const [aiSettings, setAiSettings] = useState({
    model: 'gpt-4',
    temperature: '0.7',
    useSpecialty: true,
    includeMedicalTerms: true,
    customPrompt: 'Atue como um profissional médico especialista criando documentos médicos precisos e concisos.',
  });
  
  // Dados fictícios para integrações
  const [integrationSettings, setIntegrationSettings] = useState({
    openaiApiKey: '••••••••••••••••••••••••••••••••',
    docusignEnabled: false,
    docusignApiKey: '',
    driveEnabled: true,
    driveApiKey: '••••••••••••••••••••••••••••••••',
  });
  
  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };
  
  const handleAIChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAiSettings({
      ...aiSettings,
      [name]: value,
    });
  };
  
  const handleAIToggleChange = (name: string, checked: boolean) => {
    setAiSettings({
      ...aiSettings,
      [name]: checked,
    });
  };
  
  const handleAISelectChange = (name: string, value: string) => {
    setAiSettings({
      ...aiSettings,
      [name]: value,
    });
  };
  
  const handleIntegrationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setIntegrationSettings({
      ...integrationSettings,
      [name]: value,
    });
  };
  
  const handleIntegrationToggleChange = (name: string, checked: boolean) => {
    setIntegrationSettings({
      ...integrationSettings,
      [name]: checked,
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulando salvamento
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Configurações salvas com sucesso!');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">Configurações</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="ai">Preferências IA</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>
                Gerencie suas informações pessoais e profissionais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="specialty">Especialidade</Label>
                  <Input
                    id="specialty"
                    name="specialty"
                    value={profileData.specialty}
                    onChange={handleProfileChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="crm">CRM</Label>
                  <Input
                    id="crm"
                    name="crm"
                    value={profileData.crm}
                    onChange={handleProfileChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={profileData.bio}
                  onChange={handleProfileChange}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Segurança da Conta</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline">Alterar Senha</Button>
                  <Button variant="outline">Ativar Autenticação em Dois Fatores</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <PrimaryActionButton
                type="submit"
                onClick={handleSubmit}
                isLoading={isLoading}
                loadingText="Salvando..."
              >
                Salvar Alterações
              </PrimaryActionButton>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de IA</CardTitle>
              <CardDescription>
                Personalize como a IA gera seus documentos médicos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model">Modelo de IA</Label>
                  <Select
                    value={aiSettings.model}
                    onValueChange={(value) => handleAISelectChange('model', value)}
                  >
                    <SelectTrigger id="model">
                      <SelectValue placeholder="Selecione o modelo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
                      <SelectItem value="gpt-4">GPT-4 (Recomendado)</SelectItem>
                      <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperatura</Label>
                  <Select
                    value={aiSettings.temperature}
                    onValueChange={(value) => handleAISelectChange('temperature', value)}
                  >
                    <SelectTrigger id="temperature">
                      <SelectValue placeholder="Selecione a temperatura" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.3">0.3 (Mais preciso)</SelectItem>
                      <SelectItem value="0.5">0.5</SelectItem>
                      <SelectItem value="0.7">0.7 (Equilibrado)</SelectItem>
                      <SelectItem value="0.9">0.9 (Mais criativo)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customPrompt">Prompt Personalizado</Label>
                <Textarea
                  id="customPrompt"
                  name="customPrompt"
                  rows={4}
                  value={aiSettings.customPrompt}
                  onChange={handleAIChange}
                  placeholder="Instrução personalizada para geração de documentos médicos..."
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Essas instruções serão enviadas para a IA junto com as informações do documento.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Características Adicionais</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="useSpecialty">Incluir terminologia da especialidade</Label>
                    <p className="text-xs text-neutral-500">
                      A IA usará termos específicos da sua especialidade médica.
                    </p>
                  </div>
                  <Switch
                    id="useSpecialty"
                    checked={aiSettings.useSpecialty}
                    onCheckedChange={(checked) => handleAIToggleChange('useSpecialty', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="includeMedicalTerms">Incluir códigos CID</Label>
                    <p className="text-xs text-neutral-500">
                      A IA incluirá automaticamente códigos CID relevantes nos documentos.
                    </p>
                  </div>
                  <Switch
                    id="includeMedicalTerms"
                    checked={aiSettings.includeMedicalTerms}
                    onCheckedChange={(checked) => handleAIToggleChange('includeMedicalTerms', checked)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <PrimaryActionButton
                type="submit"
                onClick={handleSubmit}
                isLoading={isLoading}
                loadingText="Salvando..."
              >
                Salvar Preferências
              </PrimaryActionButton>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integrações</CardTitle>
              <CardDescription>
                Conecte serviços externos para expandir as funcionalidades da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">OpenAI</h3>
                <div className="space-y-2">
                  <Label htmlFor="openaiApiKey">Chave de API da OpenAI</Label>
                  <div className="flex">
                    <Input
                      id="openaiApiKey"
                      name="openaiApiKey"
                      type="password"
                      value={integrationSettings.openaiApiKey}
                      onChange={handleIntegrationChange}
                      className="rounded-r-none"
                    />
                    <Button variant="outline" className="rounded-l-none border-l-0">
                      Atualizar
                    </Button>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Necessária para a geração de documentos com IA.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">DocuSign</h3>
                    <p className="text-xs text-neutral-500">
                      Integração para assinatura digital de documentos.
                    </p>
                  </div>
                  <Switch
                    checked={integrationSettings.docusignEnabled}
                    onCheckedChange={(checked) => handleIntegrationToggleChange('docusignEnabled', checked)}
                  />
                </div>
                
                {integrationSettings.docusignEnabled && (
                  <div className="space-y-2 pl-6 border-l-2 border-neutral-200">
                    <Label htmlFor="docusignApiKey">Chave de API da DocuSign</Label>
                    <Input
                      id="docusignApiKey"
                      name="docusignApiKey"
                      type="password"
                      value={integrationSettings.docusignApiKey}
                      onChange={handleIntegrationChange}
                      placeholder="Insira sua chave de API"
                    />
                    <Button variant="outline" size="sm" className="mt-2">
                      Configurar DocuSign
                    </Button>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Google Drive</h3>
                    <p className="text-xs text-neutral-500">
                      Salve e compartilhe documentos diretamente no Google Drive.
                    </p>
                  </div>
                  <Switch
                    checked={integrationSettings.driveEnabled}
                    onCheckedChange={(checked) => handleIntegrationToggleChange('driveEnabled', checked)}
                  />
                </div>
                
                {integrationSettings.driveEnabled && (
                  <div className="space-y-2 pl-6 border-l-2 border-neutral-200">
                    <Label htmlFor="driveApiKey">Configuração do Google Drive</Label>
                    <div className="flex">
                      <Input
                        id="driveApiKey"
                        name="driveApiKey"
                        type="password"
                        value={integrationSettings.driveApiKey}
                        onChange={handleIntegrationChange}
                        className="rounded-r-none"
                      />
                      <Button variant="outline" className="rounded-l-none border-l-0">
                        Atualizar
                      </Button>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">
                      Testar Conexão
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <PrimaryActionButton
                type="submit"
                onClick={handleSubmit}
                isLoading={isLoading}
                loadingText="Salvando..."
              >
                Salvar Integrações
              </PrimaryActionButton>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
