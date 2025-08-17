
import React from 'react';
import { usePatients } from '@/hooks/usePatients';
import { PatientFilterBar } from '@/components/patients/PatientFilterBar';
import { PatientsList } from '@/components/patients/PatientsList';
import { NewPatientDialog } from '@/components/patients/NewPatientDialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export const Patients = () => {
  const { patients, filters, updateFilters, createPatient, updatePatient, deletePatient, isLoading, error } = usePatients();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Pacientes</h1>
          <p className="text-neutral-600">
            Gerencie todos os pacientes e veja seus documentos associados
          </p>
        </div>
        <NewPatientDialog onCreatePatient={createPatient} />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar pacientes: {error}
          </AlertDescription>
        </Alert>
      )}
      
      <PatientFilterBar 
        filters={filters}
        onFilterChange={updateFilters}
        totalResults={patients.length}
      />
      
      <PatientsList 
        patients={patients} 
        isLoading={isLoading} 
        onUpdatePatient={updatePatient}
        onDeletePatient={deletePatient}
      />
    </div>
  );
};
