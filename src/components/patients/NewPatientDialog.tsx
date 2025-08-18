import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PatientForm } from './PatientForm';
import { useToast } from '@/hooks/use-toast';
import { PrimaryActionButton } from '@/components/ui/primary-action-button';
import { UserPlus } from 'lucide-react';
import { CreatePatientData } from './types';

interface NewPatientDialogProps {
  trigger?: React.ReactNode;
  onCreatePatient: (data: CreatePatientData) => Promise<any>;
}

export const NewPatientDialog = ({ trigger, onCreatePatient }: NewPatientDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      await onCreatePatient({
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
        education_level: data.educationLevel || null,
        comprehension_level: data.comprehensionLevel || null,
      });
      
      toast({
        title: 'Sucesso',
        description: 'Paciente cadastrado com sucesso!',
      });
      
      setOpen(false);
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao cadastrar paciente',
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
      <DialogTrigger asChild>
        {trigger || (
          <PrimaryActionButton>
            <UserPlus className="w-4 h-4 mr-2" />
            Novo Paciente
          </PrimaryActionButton>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Paciente</DialogTitle>
        </DialogHeader>
        <PatientForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};