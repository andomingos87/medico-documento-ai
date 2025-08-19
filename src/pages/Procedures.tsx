import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ProcedureFilterBar } from '@/components/procedures/ProcedureFilterBar';
import { ProceduresList } from '@/components/procedures/ProceduresList';
import { useProcedures } from '@/hooks/useProcedures';
import { NewProcedureDialog } from '@/components/procedures/NewProcedureDialog';
import { EditProcedureDialog } from '@/components/procedures/EditProcedureDialog';
import { DeleteProcedureDialog } from '@/components/procedures/DeleteProcedureDialog';
import { ViewProcedureDialog } from '@/components/procedures/ViewProcedureDialog';

export const Procedures: React.FC = () => {
  const {
    filtered,
    search,
    setSearch,
    category,
    setCategory,
    selected,
    setSelected,
    isNewOpen,
    setIsNewOpen,
    isEditOpen,
    setIsEditOpen,
    isViewOpen,
    setIsViewOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    createProcedure,
    updateProcedure,
    deleteProcedure,
  } = useProcedures();

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Procedimentos</h1>
        <Button onClick={() => setIsNewOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Novo procedimento
        </Button>
      </div>

      <ProcedureFilterBar
        search={search}
        onSearch={setSearch}
        category={category}
        onCategory={setCategory}
        total={filtered.length}
      />

      <ProceduresList
        items={filtered}
        onView={(item) => { setSelected(item); setIsViewOpen(true); }}
        onEdit={(item) => { setSelected(item); setIsEditOpen(true); }}
        onDelete={(item) => { setSelected(item); setIsDeleteOpen(true); }}
      />

      <NewProcedureDialog
        open={isNewOpen}
        onOpenChange={setIsNewOpen}
        onSubmit={(v) => { createProcedure(v); setIsNewOpen(false); }}
      />

      <EditProcedureDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        item={selected}
        onSubmit={(v) => { if (selected) updateProcedure(selected.id, v); setIsEditOpen(false); }}
      />

      <ViewProcedureDialog open={isViewOpen} onOpenChange={setIsViewOpen} item={selected} />

      <DeleteProcedureDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={() => { if (selected) deleteProcedure(selected.id); setIsDeleteOpen(false); }}
      />
    </div>
  );
};

export default Procedures;
