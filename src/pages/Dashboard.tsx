import React, { useEffect, useMemo, useState } from 'react';
import { 
  FileText, 
  FilePlus, 
  FileCheck, 
  FileSignature, 
  Calendar, 
  Clock
} from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createStatusBadge } from '@/lib/statusBadgeUtils';
import { listDocuments, type DocumentRow, updateDocument } from '@/integrations/supabase/documents';
import { listTasks, type Task, updateTask } from '@/integrations/supabase/tasks';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const Dashboard = () => {
  // Estados para dados reais
  const [totalDocs, setTotalDocs] = useState<number>(0);
  const [signedDocs, setSignedDocs] = useState<number>(0);
  const [pendingDocs, setPendingDocs] = useState<number>(0);
  const [expiring24h, setExpiring24h] = useState<number>(0);
  const [recentDocuments, setRecentDocuments] = useState<DocumentRow[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Contagens adicionais
  const [patientsCount, setPatientsCount] = useState<number>(0);
  const [anamnesesCount, setAnamnesesCount] = useState<number>(0);

  // Modais
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentRow | null>(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Loading das ações rápidas
  const [updatingDoc, setUpdatingDoc] = useState(false);
  const [updatingTask, setUpdatingTask] = useState(false);

  const { toast } = useToast();

  const yyyyMmDd = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Mapeia status do documento para badge do Dashboard
  const mapDocStatusForBadge = (status: DocumentRow['status']): 'pending' | 'signed' => {
    if (status === 'assinado') return 'signed';
    return 'pending'; // 'pendente' e 'rascunho' exibem como pendente
  };

  // Classe do ponto de prioridade das tarefas
  const getPriorityDotClass = (priority: Task['priority']) => {
    switch (priority) {
      case 'critica':
        return 'bg-destructive';
      case 'alta':
        return 'bg-warning';
      case 'media':
        return 'bg-primary';
      default:
        return 'bg-success'; // baixa
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        // KPIs via contagem (usa pageSize 1 para obter apenas o count)
        const [all, signed, pending, expiring, recent, tasks, patientsCnt, anamnesesCnt] = await Promise.all([
          listDocuments({ page: 1, pageSize: 1 }),
          listDocuments({ status: 'assinado', page: 1, pageSize: 1 }),
          listDocuments({ status: 'pendente', page: 1, pageSize: 1 }),
          (() => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            return listDocuments({ status: 'pendente', expiresUntil: yyyyMmDd(tomorrow), page: 1, pageSize: 1 });
          })(),
          listDocuments({ page: 1, pageSize: 5 }),
          listTasks(),
          // Contagens diretas no Supabase
          (async () => {
            const { count, error } = await (supabase as any)
              .from('patients')
              .select('*', { count: 'exact', head: true });
            if (error) throw error;
            return count || 0;
          })(),
          (async () => {
            const { count, error } = await (supabase as any)
              .from('anamneses')
              .select('*', { count: 'exact', head: true });
            if (error) throw error;
            return count || 0;
          })(),
        ]);

        if (!isMounted) return;
        setTotalDocs(all.total || 0);
        setSignedDocs(signed.total || 0);
        setPendingDocs(pending.total || 0);
        setExpiring24h(expiring.total || 0);
        setRecentDocuments(recent.items || []);
        // Apenas tarefas abertas ou em progresso, limita a 5 mais recentes
        const pendingTasks = (tasks || []).filter(t => t.status === 'aberta' || t.status === 'em_progresso').slice(0, 5);
        setUpcomingTasks(pendingTasks);
        setPatientsCount(patientsCnt as number);
        setAnamnesesCount(anamnesesCnt as number);
      } catch (e: any) {
        console.error(e);
        if (isMounted) setError(e?.message || 'Erro ao carregar o dashboard');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAll();
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => ([
    { 
      title: 'Pacientes', 
      value: String(patientsCount), 
      icon: FilePlus,
      trend: undefined,
    },
    { 
      title: 'Anamneses', 
      value: String(anamnesesCount), 
      icon: FileSignature, 
      trend: undefined,
    },
    { 
      title: 'Termos (Total)', 
      value: String(totalDocs), 
      icon: FileText, 
      trend: undefined,
    },
    { 
      title: 'Termos Assinados', 
      value: String(signedDocs), 
      icon: FileCheck, 
      trend: undefined,
    },
  ]), [patientsCount, anamnesesCount, totalDocs, signedDocs]);

  // Ações rápidas - Documento
  const handleUpdateDocumentStatus = async (status: 'pendente' | 'assinado') => {
    if (!selectedDoc) return;
    try {
      setUpdatingDoc(true);
      const updated = await updateDocument(selectedDoc.id, { status });
      // Atualiza doc selecionado
      setSelectedDoc(updated);
      // Atualiza lista recente (se presente)
      setRecentDocuments(prev => prev.map(d => d.id === updated.id ? { ...d, status: updated.status } : d));
      // Ajusta contadores locais
      setSignedDocs(prev => prev + (status === 'assinado' && selectedDoc.status !== 'assinado' ? 1 : status !== 'assinado' && selectedDoc.status === 'assinado' ? -1 : 0));
      setPendingDocs(prev => prev + (status === 'pendente' && selectedDoc.status !== 'pendente' ? 1 : status !== 'pendente' && selectedDoc.status === 'pendente' ? -1 : 0));
      toast({ title: 'Documento atualizado', description: `Status alterado para "${status}".` });
    } catch (e: any) {
      console.error(e);
      toast({ title: 'Erro ao atualizar documento', description: e?.message || 'Tente novamente.', variant: 'destructive' as any });
    } finally {
      setUpdatingDoc(false);
    }
  };

  // Ações rápidas - Tarefa
  const handleUpdateTaskStatus = async (status: 'em_progresso' | 'concluida') => {
    if (!selectedTask) return;
    try {
      setUpdatingTask(true);
      const updated = await updateTask(selectedTask.id, { status });
      setSelectedTask(updated);
      // Atualiza lista de pendentes (remove quando concluída)
      setUpcomingTasks(prev => {
        const mapped = prev.map(t => t.id === updated.id ? { ...t, status: updated.status } : t);
        return status === 'concluida' ? mapped.filter(t => t.id !== updated.id) : mapped;
      });
      toast({ title: 'Tarefa atualizada', description: `Status alterado para "${status}".` });
    } catch (e: any) {
      console.error(e);
      toast({ title: 'Erro ao atualizar tarefa', description: e?.message || 'Tente novamente.', variant: 'destructive' as any });
    } finally {
      setUpdatingTask(false);
    }
  };

  return (
    <>
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Visão Geral</h1>
        <p className="text-muted-foreground mt-1">Resumo dos seus documentos e assinaturas</p>
        {loading && (
          <p className="text-xs text-muted-foreground mt-1">Carregando dados...</p>
        )}
        {error && (
          <p className="text-xs text-destructive mt-1">{error}</p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Documentos Recentes</CardTitle>
            <CardDescription>Últimos termos de consentimento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center p-3 hover:bg-muted/50 rounded-lg transition-smooth cursor-pointer"
                  onClick={() => { setSelectedDoc(doc); setDocModalOpen(true); }}
                >
                  <FileText className="mr-3 h-5 w-5 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-card-foreground truncate">{doc.title}</p>
                    <p className="text-sm text-muted-foreground">{doc.patient_ref?.name || doc.patient || '—'}</p>
                  </div>
                  <div className="text-xs mr-3">
                    {createStatusBadge(mapDocStatusForBadge(doc.status))}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    {new Date(doc.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tarefas Pendentes</CardTitle>
            <CardDescription>Ações relacionadas a documentos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center p-3 hover:bg-muted/50 rounded-lg transition-smooth cursor-pointer"
                  onClick={() => { setSelectedTask(task); setTaskModalOpen(true); }}
                >
                  <div className={`w-3 h-3 rounded-full ${getPriorityDotClass(task.priority)} mr-3`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-card-foreground truncate">{task.title}</p>
                    <p className="text-sm text-muted-foreground">{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Sem prazo'}</p>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {new Date(task.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    {/* Modal Documento */}
    <Dialog open={docModalOpen} onOpenChange={setDocModalOpen}>
      <DialogContent className="sm:max-w-[720px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Documento</DialogTitle>
          <DialogDescription>Visualização do termo selecionado</DialogDescription>
        </DialogHeader>
        {selectedDoc && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{selectedDoc.title}</h3>
              <div className="text-xs">{createStatusBadge(mapDocStatusForBadge(selectedDoc.status))}</div>
            </div>
            <div className="text-sm text-muted-foreground">
              Paciente: {selectedDoc.patient_ref?.name || selectedDoc.patient || '—'}
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-muted-foreground">Criado em:</span> {new Date(selectedDoc.created_at).toLocaleString()}</div>
              <div><span className="text-muted-foreground">Atualizado em:</span> {new Date(selectedDoc.updated_at).toLocaleString()}</div>
              <div><span className="text-muted-foreground">Tipo:</span> {selectedDoc.document_type}</div>
              <div><span className="text-muted-foreground">Expira em:</span> {selectedDoc.expires_at ? new Date(selectedDoc.expires_at).toLocaleDateString() : '—'}</div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button size="sm" onClick={() => handleUpdateDocumentStatus('assinado')} disabled={updatingDoc || selectedDoc.status === 'assinado'}>
                Marcar como assinado
              </Button>
              <Button size="sm" variant="secondary" onClick={() => handleUpdateDocumentStatus('pendente')} disabled={updatingDoc || selectedDoc.status === 'pendente'}>
                Marcar como pendente
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>

    {/* Modal Tarefa */}
    <Dialog open={taskModalOpen} onOpenChange={setTaskModalOpen}>
      <DialogContent className="sm:max-w-[640px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tarefa</DialogTitle>
          <DialogDescription>Detalhes da tarefa selecionada</DialogDescription>
        </DialogHeader>
        {selectedTask && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getPriorityDotClass(selectedTask.priority)}`} />
              <h3 className="font-semibold text-lg">{selectedTask.title}</h3>
            </div>
            {selectedTask.description && (
              <p className="text-sm whitespace-pre-wrap">{selectedTask.description}</p>
            )}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-muted-foreground">Status:</span> {selectedTask.status}</div>
              <div><span className="text-muted-foreground">Prazo:</span> {selectedTask.due_date ? new Date(selectedTask.due_date).toLocaleDateString() : 'Sem prazo'}</div>
              <div><span className="text-muted-foreground">Atribuído a:</span> {selectedTask.assignee?.name || '—'}</div>
              <div><span className="text-muted-foreground">Criada em:</span> {new Date(selectedTask.created_at).toLocaleString()}</div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button size="sm" onClick={() => handleUpdateTaskStatus('em_progresso')} disabled={updatingTask || selectedTask.status === 'em_progresso' || selectedTask.status === 'concluida'}>
                Marcar em progresso
              </Button>
              <Button size="sm" variant="secondary" onClick={() => handleUpdateTaskStatus('concluida')} disabled={updatingTask || selectedTask.status === 'concluida'}>
                Marcar concluída
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  </>
);
};
