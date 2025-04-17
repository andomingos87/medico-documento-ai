
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
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

// Tipos de procedimentos disponíveis
const PROCEDURE_TYPES = [
  { id: 'botox', name: 'Toxina Botulínica (Botox)' },
  { id: 'filling', name: 'Preenchimento Facial' },
  { id: 'threads', name: 'Fios de Sustentação' },
  { id: 'peel', name: 'Peeling Químico' },
  { id: 'laser', name: 'Tratamento a Laser' },
  { id: 'lip', name: 'Preenchimento Labial' },
  { id: 'bioestimulator', name: 'Bioestimulador de Colágeno' },
];

export interface NewDocumentFormValues {
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
          name="patientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Paciente</FormLabel>
              <FormControl>
                <Input placeholder="Nome completo do paciente" {...field} />
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
          <Button 
            type="submit" 
            className="bg-medico-600 hover:bg-medico-700"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full" />
                Gerando...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Gerar com IA
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
