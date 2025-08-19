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
  initialValues: Partial<DocumentFormValues>;
  onUpdate: (values: DocumentFormValues) => Promise<void> | void;
}

export const EditDocumentDialog: React.FC<Props> = ({ open, onOpenChange, initialValues, onUpdate }) => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: DocumentFormValues) => {
    try {
      setSubmitting(true);
      await onUpdate(values);
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar termo de consentimento</DialogTitle>
          <DialogDescription>Atualize os campos abaixo e salve as alterações.</DialogDescription>
        </DialogHeader>

        <DocumentForm formId="document-form-edit" initialValues={initialValues} submitting={submitting} onSubmit={handleSubmit} />

        <DialogFooter className="sm:flex-row sm:justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" form="document-form-edit" disabled={submitting}>
            {submitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
