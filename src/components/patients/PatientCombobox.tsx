import React, { useState } from 'react';
import { Check, ChevronsUpDown, Plus, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { NewPatientDialog } from './NewPatientDialog';
import { usePatients } from '@/hooks/usePatients';
import { Patient } from './types';

interface PatientComboboxProps {
  value?: string;
  onValueChange: (patientId: string, patientName: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const PatientCombobox: React.FC<PatientComboboxProps> = ({
  value,
  onValueChange,
  placeholder = "Buscar paciente ou adicionar novo...",
  disabled = false,
  className
}) => {
  const [open, setOpen] = useState(false);
  const { patients, createPatient, isLoading } = usePatients();
  
  const selectedPatient = patients.find((patient) => patient.id === value);

  const handleCreatePatient = async (patientData: any) => {
    const newPatient = await createPatient(patientData);
    if (newPatient) {
      onValueChange(newPatient.id, newPatient.name);
      setOpen(false);
    }
  };

  const formatPatientDisplay = (patient: Patient) => {
    return `${patient.name} - ${patient.cpf}`;
  };

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between text-left font-normal"
            disabled={disabled}
          >
            {selectedPatient ? (
              <span className="truncate">{formatPatientDisplay(selectedPatient)}</span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput 
                placeholder="Buscar por nome, CPF ou email..." 
                className="border-0 bg-transparent py-3 text-sm outline-none ring-0 placeholder:text-muted-foreground focus:ring-0"
              />
            </div>
            <CommandList>
              <CommandEmpty className="py-6 text-center text-sm">
                <div className="flex flex-col items-center gap-2">
                  <p>Nenhum paciente encontrado.</p>
                  <NewPatientDialog 
                    trigger={
                      <Button variant="outline" size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Cadastrar novo paciente
                      </Button>
                    }
                    onCreatePatient={handleCreatePatient}
                  />
                </div>
              </CommandEmpty>
              
              <CommandGroup>
                <div className="p-2 border-b">
                  <NewPatientDialog 
                    trigger={
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar novo paciente
                      </Button>
                    }
                    onCreatePatient={handleCreatePatient}
                  />
                </div>
                
                {patients.map((patient) => (
                  <CommandItem
                    key={patient.id}
                    value={`${patient.name} ${patient.cpf} ${patient.email}`}
                    onSelect={() => {
                      onValueChange(patient.id, patient.name);
                      setOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedPatient?.id === patient.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{patient.name}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {patient.cpf} • {patient.email}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};