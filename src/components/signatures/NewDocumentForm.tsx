
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { PrimaryActionButton } from '@/components/ui/primary-action-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles } from 'lucide-react';
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="patientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Paciente</FormLabel>
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
        
        <FormField
          control={form.control}
          name="procedureType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Procedimento</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
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
              <FormLabel>Data da Consulta</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="additionalInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Informações Adicionais (opcional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Observações ou detalhes específicos sobre o paciente ou procedimento..." 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <PrimaryActionButton 
            type="submit"
            isLoading={isGenerating}
            loadingText="Gerando..."
            icon={<Sparkles className="h-4 w-4" />}
          >
            Gerar com IA
          </PrimaryActionButton>
        </DialogFooter>
      </form>
    </Form>
  );
};
