
import React, { useState } from 'react';
import { Patient, UpdatePatientData } from './types';
import { formatDate } from '@/lib/formatDate';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PatientDetailsView } from './PatientDetailsView';
import { EditPatientDialog } from './EditPatientDialog';
import { DeletePatientDialog } from './DeletePatientDialog';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

interface PatientsListProps {
  patients: Patient[];
  isLoading?: boolean;
  onUpdatePatient: (id: string, data: UpdatePatientData) => Promise<any>;
  onDeletePatient: (id: string) => Promise<void>;
}

export const PatientsList = ({ patients, isLoading, onUpdatePatient, onDeletePatient }: PatientsListProps) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);

  const handleViewDetails = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const handleDeleteClick = (patient: Patient) => {
    setPatientToDelete(patient);
  };

  const handleEditClick = (patient: Patient) => {
    setPatientToEdit(patient);
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <DataTable
          data={patients}
          loading={Boolean(isLoading)}
          getRowId={(r) => r.id}
          emptyMessage={patients.length === 0 ? 'Cadastre o primeiro paciente para começar' : 'Nenhum paciente encontrado'}
          className="border-0 rounded-none"
          columns={[
            { header: 'Nome', cell: (r) => <span className="font-medium">{r.name}</span> },
            { header: 'CPF', accessor: 'cpf' as any },
            { header: 'Email', accessor: 'email' as any },
            { header: 'Telefone', accessor: 'phone' as any },
            { header: 'Data de cadastro', cell: (r) => formatDate(r.created_at) },
          ] as Column<Patient>[]}
          renderActions={(row) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleViewDetails(row)}>Ver detalhes</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditClick(row)}>Editar</DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-red-600" 
                  onClick={() => handleDeleteClick(row)}
                >
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
      </div>

      <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Paciente</DialogTitle>
          </DialogHeader>
          {selectedPatient && <PatientDetailsView patient={selectedPatient} />}
        </DialogContent>
      </Dialog>

      {patientToDelete && (
        <DeletePatientDialog 
          patient={patientToDelete} 
          onDeletePatient={onDeletePatient}
          open={!!patientToDelete}
          onOpenChange={(open) => !open && setPatientToDelete(null)}
        />
      )}

      {patientToEdit && (
        <EditPatientDialog 
          patient={patientToEdit} 
          onUpdatePatient={onUpdatePatient}
          open={!!patientToEdit}
          onOpenChange={(open) => !open && setPatientToEdit(null)}
        />
      )}
    </>
  );
};
