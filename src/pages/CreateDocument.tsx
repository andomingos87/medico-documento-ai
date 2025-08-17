
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PrimaryActionButton } from '@/components/ui/primary-action-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

// Dados específicos para procedimentos estéticos
const ESPECIALIDADES = [
  "Estética Avançada",
  "Dermatologia",
  "Cirurgia Plástica",
  "Medicina Estética",
  "Biomedicina Estética",
  "Harmonização Facial",
  "Odontologia Estética",
];

const PROCEDIMENTOS_ESTETICOS = [
  "Toxina Botulínica (Botox)",
  "Preenchimento Facial",
  "Fios de PDO",
  "Bioestimulador de Colágeno",
  "Skinbooster",
  "Peeling Químico",
  "Laser",
  "Radiofrequência",
  "Harmonização Facial Completa",
  "Microagulhamento",
  "HIFU",
  "Carboxiterapia",
  "Preenchimento Labial",
];

export const CreateDocument = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientName: '',
    specialty: '',
    documentType: '',
    procedureArea: '',
    customInstructions: '',
  });
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleGenerateDocument = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!formData.patientName || !formData.specialty || !formData.documentType) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsGenerating(true);

    // Simulando a geração do documento com IA
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedContent(
        generateMockConsentForm(
          formData.patientName,
          formData.specialty,
          formData.documentType,
          formData.procedureArea,
          formData.customInstructions
        )
      );
      toast.success('Termo de consentimento gerado com sucesso!');
    }, 2500);
  };

  const handleSaveDocument = () => {
    if (!generatedContent) {
      toast.error('Gere o conteúdo do termo primeiro.');
      return;
    }

    setIsSaving(true);

    // Simulando o salvamento
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Termo de consentimento salvo com sucesso!');
      navigate('/documentos');
    }, 1500);
  };

  // Função para gerar termo de consentimento fictício com base nos inputs
  const generateMockConsentForm = (
    patientName: string,
    specialty: string,
    procedureType: string,
    procedureArea: string,
    customInstructions: string
  ) => {
    const currentDate = new Date().toLocaleDateString('pt-BR');
    const areaText = procedureArea ? `na região de ${procedureArea}` : '';
    
    let content = `TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO\nPROCEDIMENTO: ${procedureType.toUpperCase()} ${areaText}\n\nEu, ${patientName}, inscrito(a) no CPF sob o n° XXX.XXX.XXX-XX, declaro para os devidos fins que fui informado(a) de forma clara, objetiva e compreensível pelo(a) profissional da área de ${specialty} sobre todos os detalhes referentes ao procedimento de ${procedureType} ${areaText} ao qual serei submetido(a).`;
    
    // Adicionar conteúdo específico baseado no tipo de procedimento
    switch (procedureType) {
      case 'Toxina Botulínica (Botox)':
        content += `\n\nFui informado(a) que:\n\n1. A Toxina Botulínica é utilizada para relaxamento muscular temporário, diminuindo rugas dinâmicas e linhas de expressão;\n\n2. O resultado do procedimento é temporário, durando em média de 3 a 6 meses, sendo necessária nova aplicação para manutenção dos resultados;\n\n3. Possíveis efeitos colaterais incluem: dor leve no local da aplicação, edema (inchaço), eritema (vermelhidão), equimose (hematoma), assimetria temporária, ptose palpebral (queda da pálpebra), cefaleia (dor de cabeça);\n\n4. O resultado final poderá ser observado entre 7 a 15 dias após a aplicação;\n\n5. Devo seguir rigorosamente as recomendações pós-procedimento para evitar complicações, tais como não massagear a área tratada, não deitar e não praticar atividades físicas nas primeiras 24 horas.`;
        break;
      case 'Preenchimento Facial':
        content += `\n\nFui informado(a) que:\n\n1. O Preenchimento Facial é realizado com ácido hialurônico injetável para restaurar volumes, corrigir linhas, rugas e melhorar o contorno facial;\n\n2. O resultado do procedimento é temporário, durando em média de 6 a 18 meses, dependendo da área tratada e do produto utilizado;\n\n3. Possíveis efeitos colaterais incluem: dor, edema (inchaço), eritema (vermelhidão), equimose (hematoma), assimetria temporária, nódulos ou irregularidades palpáveis;\n\n4. Em raros casos podem ocorrer complicações mais graves como necrose tecidual e oclusão vascular;\n\n5. O resultado final poderá ser observado após a resolução do edema inicial, aproximadamente 7 a 14 dias;\n\n6. Devo seguir rigorosamente as recomendações pós-procedimento, evitando exposição solar intensa, saunas, atividade física e consumo de álcool nas primeiras 24-48 horas.`;
        break;
      case 'Fios de PDO':
        content += `\n\nFui informado(a) que:\n\n1. Os Fios de PDO (polidioxanona) são inseridos na pele para promover sustentação, estimulação de colágeno e melhora na firmeza cutânea;\n\n2. O resultado do procedimento é temporário, com duração média de 8 a 12 meses, variando conforme a resposta individual;\n\n3. Possíveis efeitos colaterais incluem: dor, edema (inchaço), hematomas, sensibilidade local, assimetria, ondulações ou irregularidades temporárias visíveis ou palpáveis;\n\n4. Em raros casos, pode ocorrer extrusão (expulsão) dos fios, infecção local ou reação alérgica;\n\n5. O resultado final poderá ser observado após a resolução completa do edema, aproximadamente 15 a 30 dias;\n\n6. Devo seguir rigorosamente as recomendações pós-procedimento, evitando movimentos excessivos da face, massagens na área, exposição solar intensa e atividades físicas nas primeiras 72 horas.`;
        break;
      default:
        content += `\n\nFui informado(a) que:\n\n1. Este procedimento possui características específicas que me foram explicadas detalhadamente;\n\n2. Existem possíveis efeitos colaterais e complicações associados ao procedimento que me foram claramente informados;\n\n3. O resultado final poderá ser observado após o período de recuperação completa;\n\n4. Devo seguir rigorosamente todas as recomendações pré e pós-procedimento para garantir o melhor resultado possível e evitar complicações.`;
    }

    // Adicionar instruções personalizadas se existirem
    if (customInstructions) {
      content += `\n\nInformações adicionais específicas: ${customInstructions}`;
    }

    // Finalização padrão do termo
    content += `\n\nDeclaro também que todas as minhas dúvidas foram esclarecidas e que fui orientado(a) sobre os cuidados pré e pós-procedimento que devo seguir para obter o melhor resultado possível.\n\nReconheço que não há garantia absoluta sobre o resultado final esperado, pois depende de fatores individuais como resposta biológica, hábitos de vida e seguimento das orientações profissionais.\n\nPor meio deste documento, declaro meu consentimento livre e esclarecido para a realização do procedimento descrito acima, assumindo a responsabilidade e os riscos pelos eventuais efeitos deste.\n\n${currentDate}\n\n\n________________________________\n${patientName}\nCPF: XXX.XXX.XXX-XX\n\n\n________________________________\nProfissional Responsável\nRegistro Profissional`;

    return content;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">Criar Termo de Consentimento</h1>
      <p className="text-neutral-500">Gere termos de consentimento personalizados para procedimentos estéticos</p>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Procedimento</CardTitle>
            <CardDescription>
              Preencha os dados para gerar o termo automaticamente com IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerateDocument} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Nome do Paciente</Label>
                <Input
                  id="patientName"
                  name="patientName"
                  placeholder="Nome completo do paciente"
                  value={formData.patientName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialty">Especialidade</Label>
                <Select
                  value={formData.specialty}
                  onValueChange={(value) => handleSelectChange('specialty', value)}
                >
                  <SelectTrigger id="specialty">
                    <SelectValue placeholder="Selecione a especialidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {ESPECIALIDADES.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="documentType">Tipo de Procedimento</Label>
                <Select
                  value={formData.documentType}
                  onValueChange={(value) => handleSelectChange('documentType', value)}
                >
                  <SelectTrigger id="documentType">
                    <SelectValue placeholder="Selecione o procedimento" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROCEDIMENTOS_ESTETICOS.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="procedureArea">Área de Aplicação (opcional)</Label>
                <Input
                  id="procedureArea"
                  name="procedureArea"
                  placeholder="Ex: face, lábios, região periocular..."
                  value={formData.procedureArea}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customInstructions">Observações Específicas (opcional)</Label>
                <Textarea
                  id="customInstructions"
                  name="customInstructions"
                  placeholder="Adicione informações particulares sobre este paciente ou procedimento..."
                  value={formData.customInstructions}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
              
              <PrimaryActionButton
                type="submit"
                className="w-full mt-2"
                isLoading={isGenerating}
                loadingText="Gerando Termo..."
                icon={<Sparkles className="h-4 w-4" />}
              >
                Gerar Termo com IA
              </PrimaryActionButton>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pré-visualização do Termo</CardTitle>
            <CardDescription>
              Texto gerado pela IA com base nas informações fornecidas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-neutral-50 border border-neutral-200 rounded-md p-4 h-[400px] overflow-y-auto font-mono text-sm whitespace-pre-wrap">
              {generatedContent || "O conteúdo do termo de consentimento será exibido aqui após a geração."}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              variant="outline"
              className="mr-2"
              disabled={!generatedContent || isSaving}
              onClick={() => setGeneratedContent('')}
            >
              Limpar
            </Button>
            <PrimaryActionButton
              disabled={!generatedContent}
              isLoading={isSaving}
              loadingText="Salvando..."
              onClick={handleSaveDocument}
            >
              Salvar Termo
            </PrimaryActionButton>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
