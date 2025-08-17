
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { PrimaryActionButton } from '@/components/ui/primary-action-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Sparkles, User, Stethoscope, Calendar, FileText } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { PatientCombobox } from '@/components/patients/PatientCombobox';

// Tipos de procedimentos disponíveis
export const PROCEDURE_TYPES = [
  { id: 'botox', name: 'Toxina Botulínica (Botox)' },
  { id: 'filling', name: 'Preenchimento Facial' },
  { id: 'threads', name: 'Fios de Sustentação' },
  { id: 'peel', name: 'Peeling Químico' },
  { id: 'laser', name: 'Tratamento a Laser' },
  { id: 'lip', name: 'Preenchimento Labial' },
  { id: 'bioestimulator', name: 'Bioestimulador de Colágeno' },
];

export interface NewDocumentFormValues {
  patientId: string;
  patientName: string;
  procedureType: string;
  appointmentDate: string;
  additionalInfo: string;
}

interface NewDocumentFormProps {
  onSubmit: (values: NewDocumentFormValues) => void;
  onCancel: () => void;
  isGenerating: boolean;
}

export const NewDocumentForm: React.FC<NewDocumentFormProps> = ({ 
  onSubmit, 
  onCancel, 
  isGenerating 
}) => {
  const form = useForm<NewDocumentFormValues>({
    defaultValues: {
      patientId: '',
      patientName: '',
      procedureType: '',
      appointmentDate: '',
      additionalInfo: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="shadow-soft border-border/50">
          <CardContent className="pt-6 space-y-6">
            {/* Seção do Paciente */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <User className="h-4 w-4 text-primary" />
                Informações do Paciente
              </div>
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Paciente</FormLabel>
                    <FormControl>
                      <PatientCombobox 
                        value={field.value}
                        onValueChange={(patientId, patientName) => {
                          field.onChange(patientId);
                          form.setValue('patientName', patientName);
                        }}
                        placeholder="Buscar paciente ou adicionar novo..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Seção do Procedimento */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Stethoscope className="h-4 w-4 text-accent" />
                Detalhes do Procedimento
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="procedureType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Tipo de Procedimento</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="transition-smooth hover:shadow-soft">
                            <SelectValue placeholder="Selecione o procedimento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PROCEDURE_TYPES.map((procedure) => (
                            <SelectItem key={procedure.id} value={procedure.id}>
                              {procedure.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="appointmentDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-warning" />
                        Data da Consulta
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="datetime-local" 
                          className="transition-smooth hover:shadow-soft focus:ring-2 focus:ring-primary/20" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Seção de Informações Adicionais */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <FileText className="h-4 w-4 text-info" />
                Informações Complementares
              </div>
              <FormField
                control={form.control}
                name="additionalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Observações (opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Observações ou detalhes específicos sobre o paciente ou procedimento..." 
                        className="resize-none min-h-[100px] transition-smooth hover:shadow-soft focus:ring-2 focus:ring-primary/20" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        
        <DialogFooter className="pt-4 gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="transition-smooth hover:shadow-soft"
          >
            Cancelar
          </Button>
          <PrimaryActionButton 
            type="submit"
            isLoading={isGenerating}
            loadingText="Gerando termo..."
            icon={<Sparkles className="h-4 w-4" />}
            className="shadow-soft hover:shadow-elegant transition-all duration-300"
          >
            Gerar com IA
          </PrimaryActionButton>
        </DialogFooter>
      </form>
    </Form>
  );
};
