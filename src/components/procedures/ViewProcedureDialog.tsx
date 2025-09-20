import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, FileText, Shield, AlertTriangle, Calendar } from 'lucide-react';
import { ProcedureItem } from './types';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  item: ProcedureItem | null;
}

export const ViewProcedureDialog: React.FC<Props> = ({ open, onOpenChange, item }) => {
  const handleCopyAll = React.useCallback(() => {
    if (!item) return;
    const parts = [
      `Procedimento: ${item.name}`,
      `Categoria: ${item.category}`,
      item.description ? `Descrição:\n${item.description}` : '',
      item.risks ? `Riscos:\n${item.risks}` : '',
      item.contraindications ? `Contraindicações:\n${item.contraindications}` : '',
    ]
      .filter(Boolean)
      .join('\n\n');
    navigator.clipboard?.writeText(parts);
  }, [item]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              <Eye className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">Detalhes do Procedimento</DialogTitle>
              <DialogDescription>Visualize as informações cadastradas do procedimento</DialogDescription>
            </div>
            {item && <Badge variant="secondary" className="mt-1">{item.category}</Badge>}
          </div>
        </DialogHeader>
        <Separator className="my-2" />
        {item && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {item.createdAt && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Criado em {new Date(item.createdAt).toLocaleString()}</span>
                </div>
              )}
              {item.updatedAt && (
                <div className="flex items-center gap-2 text-muted-foreground sm:justify-end">
                  <Calendar className="h-4 w-4" />
                  <span>Atualizado em {new Date(item.updatedAt).toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Descrição</span>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed">{item.description || '—'}</div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Riscos</span>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed">{item.risks || '—'}</div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-primary" />
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Contraindicações</span>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed">{item.contraindications || '—'}</div>
              </div>
            </div>

            {/* <div className="flex justify-end pt-2">
              <Button type="button" variant="outline" onClick={handleCopyAll}>Copiar tudo</Button>
            </div> */}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
