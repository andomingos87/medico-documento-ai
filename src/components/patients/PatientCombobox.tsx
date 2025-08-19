import React, { useState } from 'react';
import { Check, ChevronDown, Plus, Search } from 'lucide-react';
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
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
              "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50 text-left font-normal",
              className
            )}
          >
            {selectedPatient ? (
              <span className="truncate">{formatPatientDisplay(selectedPatient)}</span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 rounded-md border border-input bg-popover text-popover-foreground shadow-md"
          align="start"
        >
          <Command>
            <div className="flex items-center border-b border-border px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput 
                placeholder="Buscar por nome, CPF ou email..." 
                className="border-0 bg-transparent py-2 text-sm outline-none ring-0 placeholder:text-muted-foreground focus:ring-0"
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
                <div className="p-1 border-b">
                  <NewPatientDialog 
                    trigger={
                      <Button variant="ghost" size="sm" className="w-full justify-start h-8">
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
                    className="cursor-pointer hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedPatient?.id === patient.id ? "opacity-100 text-primary" : "opacity-0"
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