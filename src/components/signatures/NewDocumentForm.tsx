
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { SecondaryActionButton } from '@/components/ui/secondary-action-button';
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
import { useQuery } from '@tanstack/react-query';
import { listProcedures } from '@/integrations/supabase/procedures';
import { PatientCombobox } from '@/components/patients/PatientCombobox';

// Procedimentos virão do banco (Supabase)

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

  // Carrega procedimentos do Supabase para o Select
  const { data: procedures = [], isLoading: isLoadingProcedures } = useQuery({
    queryKey: ['procedures', { search: '', category: 'Todos' }],
    queryFn: () => listProcedures({}),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="patientId"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
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
                      <SelectValue placeholder={isLoadingProcedures ? 'Carregando...' : 'Selecione o procedimento'} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {procedures.map((p) => (
                      <SelectItem key={p.id} value={p.name}>
                        {p.name}
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
            <FormItem className="md:col-span-2">
              <FormLabel>Informações Adicionais (opcional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Observações ou detalhes específicos sobre o paciente ou procedimento..." 
                  className="resize-none min-h-[80px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        
        <DialogFooter className="pt-4">
          <SecondaryActionButton type="button" onClick={onCancel}>
            Cancelar
          </SecondaryActionButton>
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
