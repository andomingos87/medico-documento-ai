import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useProfessionals, PROFESSIONAL_ROLES } from '@/hooks/useProfessionals';
import { ProfessionalsList } from '@/components/professionals/ProfessionalsList';
import { NewProfessionalDialog } from '@/components/professionals/NewProfessionalDialog';
import { EditProfessionalDialog } from '@/components/professionals/EditProfessionalDialog';
import { DeleteProfessionalDialog } from '@/components/professionals/DeleteProfessionalDialog';

export const Professionals: React.FC = () => {
  const {
    items,
    search, setSearch,
    role, setRole,
    selected, setSelected,
    isNewOpen, setIsNewOpen,
    isEditOpen, setIsEditOpen,
    isDeleteOpen, setIsDeleteOpen,
    createItem,
    updateItem,
    deleteItem,
  } = useProfessionals();

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Buscar por nome, email ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[280px]"
          />
          <div className="flex items-center gap-2">
            <Label className="text-sm">Função</Label>
            <Select value={role} onValueChange={(v) => setRole(v as any)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas</SelectItem>
                {PROFESSIONAL_ROLES.map(r => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={() => setIsNewOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Profissional
        </Button>
      </div>

      <ProfessionalsList
        items={items}
        onEdit={(item) => { setSelected(item); setIsEditOpen(true); }}
        onDelete={(item) => { setSelected(item); setIsDeleteOpen(true); }}
      />

      <NewProfessionalDialog
        open={isNewOpen}
        onOpenChange={setIsNewOpen}
        onSubmit={(values) => {
          createItem(values);
          setIsNewOpen(false);
        }}
      />

      <EditProfessionalDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        item={selected}
        onSubmit={(values) => {
          if (selected) updateItem(selected.id, values);
          setIsEditOpen(false);
        }}
      />

      <DeleteProfessionalDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={() => {
          if (selected) deleteItem(selected.id);
          setIsDeleteOpen(false);
        }}
      />
    </div>
  );
};
