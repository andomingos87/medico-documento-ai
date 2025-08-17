
import React, { useState } from 'react';
import { Patient } from './types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/formatDate';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PatientDetailsView } from './PatientDetailsView';
import { EditPatientDialog } from './EditPatientDialog';
import { DeletePatientDialog } from './DeletePatientDialog';
import { Skeleton } from '@/components/ui/skeleton';

interface PatientsListProps {
  patients: Patient[];
  isLoading?: boolean;
}

export const PatientsList = ({ patients, isLoading }: PatientsListProps) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const handleViewDetails = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Data de cadastro</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-20 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : patients.length > 0 ? (
                patients.map(patient => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.cpf}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>{formatDate(patient.created_at)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewDetails(patient)}
                      >
                        Ver detalhes
                      </Button>
                      <EditPatientDialog patient={patient} />
                      <DeletePatientDialog patient={patient} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center space-y-2">
                      <p className="text-neutral-500">Nenhum paciente encontrado</p>
                      <p className="text-sm text-neutral-400">
                        {patients.length === 0 ? 'Cadastre o primeiro paciente para começar' : 'Tente ajustar os filtros de busca'}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Paciente</DialogTitle>
          </DialogHeader>
          {selectedPatient && <PatientDetailsView patient={selectedPatient} />}
        </DialogContent>
      </Dialog>
    </>
  );
};
