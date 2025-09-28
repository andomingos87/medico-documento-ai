import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Patient } from './types';
import { Trash2 } from 'lucide-react';

interface DeletePatientDialogProps {
  patient: Patient;
  trigger?: React.ReactNode;
  onDeletePatient: (id: string) => Promise<void>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const DeletePatientDialog = ({ patient, trigger, onDeletePatient, open: controlledOpen, onOpenChange }: DeletePatientDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await onDeletePatient(patient.id);
      
      toast({
        title: 'Sucesso',
        description: 'Paciente removido com sucesso!',
      });
      
      setOpen(false);
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao remover paciente',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasDocuments = patient.documents && patient.documents.length > 0;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {trigger && (
        <AlertDialogTrigger asChild>
          {trigger}
        </AlertDialogTrigger>
      )}
      {!trigger && (
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir
          </Button>
        </AlertDialogTrigger>
      )}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-2">
              <p>
                Tem certeza que deseja excluir o paciente <strong>{patient.name}</strong>?
              </p>
              {hasDocuments && (
                <p className="text-amber-600">
                  <strong>Atenção:</strong> Este paciente possui {patient.documents.length} documento(s) 
                  associado(s). Os documentos não serão removidos, mas não aparecerão mais na listagem do paciente.
                </p>
              )}
              <p className="text-muted-foreground text-sm">
                Esta ação não pode ser desfeita.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? 'Removendo...' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};