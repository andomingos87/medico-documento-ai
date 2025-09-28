import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PatientForm } from './PatientForm';
import { useToast } from '@/hooks/use-toast';
import { Patient, UpdatePatientData } from './types';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface EditPatientDialogProps {
  patient: Patient;
  trigger?: React.ReactNode;
  onUpdatePatient: (id: string, data: UpdatePatientData) => Promise<any>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const EditPatientDialog = ({ patient, trigger, onUpdatePatient, open: controlledOpen, onOpenChange }: EditPatientDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      await onUpdatePatient(patient.id, {
        name: data.name,
        cpf: data.cpf,
        gender: data.gender,
        birth_date: data.birthDate,
        email: data.email,
        phone: data.phone,
        street: data.street || null,
        number: data.number || null,
        complement: data.complement || null,
        neighborhood: data.neighborhood || null,
        city: data.city || null,
        state: data.state || null,
        zip_code: data.zipCode || null,
      });
      
      toast({
        title: 'Sucesso',
        description: 'Paciente atualizado com sucesso!',
      });
      
      setOpen(false);
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao atualizar paciente',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      {!trigger && (
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Paciente</DialogTitle>
        </DialogHeader>
        <PatientForm
          patient={patient}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};