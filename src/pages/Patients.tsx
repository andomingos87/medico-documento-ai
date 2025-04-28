
import React from 'react';
import { usePatients } from '@/hooks/usePatients';
import { PatientFilterBar } from '@/components/patients/PatientFilterBar';
import { PatientsList } from '@/components/patients/PatientsList';

export const Patients = () => {
  const { patients, filters, updateFilters } = usePatients();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Pacientes</h1>
        <p className="text-neutral-600">
          Gerencie todos os pacientes e veja seus documentos associados
        </p>
      </div>
      
      <PatientFilterBar 
        filters={filters}
        onFilterChange={updateFilters}
        totalResults={patients.length}
      />
      
      <PatientsList patients={patients} />
    </div>
  );
};
