import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PrimaryActionButton } from '@/components/ui/primary-action-button';
import { SecondaryActionButton } from '@/components/ui/secondary-action-button';
import { toast } from 'sonner';
import { getDocument, updateDocument } from '@/integrations/supabase/documents';

export const EditDocument: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('<p>Conteúdo do termo...</p>');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingDoc, setIsLoadingDoc] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!id) {
        setLoadError('ID do documento não informado');
        setIsLoadingDoc(false);
        return;
      }
      try {
        setIsLoadingDoc(true);
        setLoadError(null);
        const data = await getDocument(id);
        if (!cancelled) {
          setTitle(data.title ?? '');
          // Conteúdo ainda não persiste no banco; mantemos editor local.
        }
      } catch (e: any) {
        if (!cancelled) setLoadError(e?.message ?? 'Erro ao carregar documento');
      } finally {
        if (!cancelled) setIsLoadingDoc(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    try {
      setIsSaving(true);
      await updateDocument(id, { title });
      toast.success('Termo atualizado com sucesso!');
      navigate(`/documentos/${id}`);
    } catch (e: any) {
      toast.error(e?.message ?? 'Erro ao salvar termo');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Editar Termo</h1>
          <p className="text-neutral-500 mt-1">Atualize o conteúdo e o título do termo</p>
        </div>
        <div className="flex gap-2">
          <SecondaryActionButton onClick={() => navigate(-1)} disabled={isSaving}>Cancelar</SecondaryActionButton>
          <PrimaryActionButton onClick={handleSave} isLoading={isSaving} loadingText="Salvando..." disabled={isLoadingDoc || !!loadError}>
            Salvar alterações
          </PrimaryActionButton>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          {isLoadingDoc && (
            <p className="text-sm text-neutral-500">Carregando documento...</p>
          )}
          {loadError && (
            <p className="text-sm text-red-600">{loadError}</p>
          )}
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Termo de Consentimento - Procedimento X (Paciente)" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo (HTML permitido)</Label>
            <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} className="min-h-[220px]" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
