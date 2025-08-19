import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DocumentForm, type DocumentFormValues } from './DocumentForm';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (values: DocumentFormValues) => Promise<void> | void;
}

export const NewDocumentDialog: React.FC<Props> = ({ open, onOpenChange, onCreate }) => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: DocumentFormValues) => {
    try {
      setSubmitting(true);
      await onCreate(values);
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo termo de consentimento</DialogTitle>
          <DialogDescription>Preencha os campos abaixo para criar um novo termo.</DialogDescription>
        </DialogHeader>

        <DocumentForm formId="document-form-new" submitting={submitting} onSubmit={handleSubmit} />

        <DialogFooter className="sm:flex-row sm:justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" form="document-form-new" disabled={submitting}>
            {submitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
