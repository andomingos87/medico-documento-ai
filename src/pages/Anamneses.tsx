import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { useAnamneses } from '@/hooks/useAnamneses';
import { AnamnesesList } from '@/components/anamneses/AnamnesesList';
import { NewAnamnesisDialog } from '@/components/anamneses/NewAnamnesisDialog';
import { EditAnamnesisDialog } from '@/components/anamneses/EditAnamnesisDialog';
import { DeleteAnamnesisDialog } from '@/components/anamneses/DeleteAnamnesisDialog';
import { ViewAnamnesisDialog } from '@/components/anamneses/ViewAnamnesisDialog';

export const Anamneses: React.FC = () => {
  const {
    filtered,
    search,
    setSearch,
    selected,
    setSelected,
    isNewOpen,
    setIsNewOpen,
    isEditOpen,
    setIsEditOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    createItem,
    updateItem,
    deleteItem,
    sendLink,
  } = useAnamneses();

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Anamneses</h1>
          <p className="text-sm text-neutral-600">Gerencie as anamneses dos pacientes</p>
        </div>
        <Button onClick={() => setIsNewOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nova anamnese
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Input
          placeholder="Buscar por paciente ou procedimento"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      <AnamnesesList
        items={filtered}
        onView={(item) => { setSelected(item); setIsEditOpen(false); setIsDeleteOpen(false); }}
        onEdit={(item) => { setSelected(item); setIsEditOpen(true); }}
        onDelete={(item) => { setSelected(item); setIsDeleteOpen(true); }}
        onSendLink={(item) => sendLink(item.id)}
      />

      <NewAnamnesisDialog
        open={isNewOpen}
        onOpenChange={setIsNewOpen}
        onSubmit={(v) => { createItem(v); setIsNewOpen(false); }}
      />

      <EditAnamnesisDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        item={selected}
        onSubmit={(v) => { if (selected) updateItem(selected.id, v); setIsEditOpen(false); }}
      />

      <ViewAnamnesisDialog
        open={Boolean(selected && !isEditOpen && !isDeleteOpen)}
        onOpenChange={(open) => { if (!open) setSelected(null); }}
        item={selected}
      />

      <DeleteAnamnesisDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={() => { if (selected) deleteItem(selected.id); setIsDeleteOpen(false); }}
      />
    </div>
  );
};

export default Anamneses;
