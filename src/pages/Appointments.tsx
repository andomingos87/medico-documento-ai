import React from "react";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, CheckCircle2, Clock, Percent } from "lucide-react";
import { useAppointments } from "@/hooks/useAppointments";
import { listProfessionals, type ProfessionalRow } from "@/integrations/supabase/professionals";
import { NewAppointmentDialog } from "@/components/appointments/NewAppointmentDialog";
import { EditAppointmentDialog } from "@/components/appointments/EditAppointmentDialog";
import { DayPicker } from "react-day-picker";
import { startOfDay, endOfDay, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";

export const Appointments = () => {
  const [view, setView] = React.useState<"lista" | "calendario">("lista");
  const { items, stats, filters, updateFilters, isLoading, error, createAppointment, updateAppointment, deleteAppointment } = useAppointments();
  const [professionals, setProfessionals] = React.useState<ProfessionalRow[]>([]);
  const [openNew, setOpenNew] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);

  React.useEffect(() => {
    (async () => {
      try {
        const pros = await listProfessionals();
        setProfessionals(pros);
      } catch (e) {
        console.error("Erro ao carregar profissionais", e);
      }
    })();
  }, []);

  const selected = React.useMemo(() => items.find(i => i.id === selectedId) || null, [items, selectedId]);

  const dayItems = React.useMemo(() => {
    if (!selectedDate) return [] as typeof items;
    return items.filter(it => isSameDay(new Date(it.scheduled_at), selectedDate));
  }, [items, selectedDate]);

  // Conjunto de dias com agendamentos para desenhar um ponto no calendário
  const daysWithItems = React.useMemo(() => {
    const m = new Map<string, number>();
    for (const it of items) {
      const d = new Date(it.scheduled_at);
      const key = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
      m.set(key, (m.get(key) || 0) + 1);
    }
    return m;
  }, [items]);

  // Componente customizado para o conteúdo do dia (adiciona um ponto quando há agendamentos)
  const DayContent = React.useCallback((props: any) => {
    const date: Date = props.date;
    const key = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
    const count = daysWithItems.get(key) || 0;
    return (
      <div className="relative flex items-center justify-center">
        <span>{date.getDate()}</span>
        {count > 0 && (
          <span
            title={`${count} agendamento(s)`}
            className="absolute -bottom-1 h-1.5 w-1.5 rounded-full bg-primary"
          />
        )}
      </div>
    );
  }, [daysWithItems]);

  const dayStatusSummary = React.useMemo(() => {
    const sum = { agendado: 0, confirmado: 0, cancelado: 0, concluido: 0 } as Record<string, number>;
    for (const it of dayItems) sum[it.status] = (sum[it.status] || 0) + 1;
    return sum;
  }, [dayItems]);

  const statusChipClass = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'text-emerald-800 bg-emerald-100';
      case 'cancelado':
        return 'text-rose-800 bg-rose-100';
      case 'concluido':
        return 'text-sky-800 bg-sky-100';
      default:
        return 'text-neutral-700 bg-neutral-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Agendamentos</h1>
          <p className="text-neutral-600">Gerencie sua agenda, visualize por calendário ou lista, filtre e acompanhe confirmações.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setOpenNew(true)}>
            Novo agendamento
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Hoje" value={stats.today} icon={CalendarDays} description="Agendamentos do dia" />
        <StatCard title="Total agendamentos" value={stats.totalLast30} icon={Clock} description="Últimos 30 dias" />
        <StatCard title="Conf. pendentes" value={stats.pending} icon={CheckCircle2} description="Aguardando confirmação" />
        <StatCard title="Taxa de confirmação" value={`${stats.confirmationRate}%`} icon={Percent} description="Últimos 30 dias" />
      </div>

      {/* Filtros e busca */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-2">
          <Input
            placeholder="Buscar por paciente, profissional ou observação..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
          />
        </div>
        <Select value={filters.status} onValueChange={(v) => updateFilters({ status: v as any })}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="agendado">Agendado</SelectItem>
            <SelectItem value="confirmado">Confirmado</SelectItem>
            <SelectItem value="cancelado">Cancelado</SelectItem>
            <SelectItem value="concluido">Concluído</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.professionalId} onValueChange={(v) => updateFilters({ professionalId: v as any })}>
          <SelectTrigger>
            <SelectValue placeholder="Profissional" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            {professionals.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Visualizações */}
      <Tabs value={view} onValueChange={(v) => setView(v as any)}>
        <TabsList>
          <TabsTrigger value="lista">Lista</TabsTrigger>
          <TabsTrigger value="calendario">Calendário</TabsTrigger>
        </TabsList>
        <TabsContent value="lista" className="mt-4">
          {isLoading ? (
            <div className="border rounded-md p-6 text-sm text-muted-foreground">Carregando agendamentos...</div>
          ) : error ? (
            <div className="border rounded-md p-6 text-sm text-red-600">{error}</div>
          ) : items.length === 0 ? (
            <div className="border rounded-md p-6 text-sm text-muted-foreground">Nenhum agendamento encontrado.</div>
          ) : (
            <div className="border rounded-md divide-y">
              {items.map((a) => (
                <div key={a.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-medium truncate">
                      {new Date(a.scheduled_at).toLocaleString()} • {a.patient?.name || 'Paciente'}
                    </div>
                    <div className="text-sm text-neutral-600 truncate">
                      {a.professional?.name ? `Prof.: ${a.professional.name}` : 'Sem profissional'}
                      {a.procedure?.name ? ` • Proc.: ${a.procedure.name}` : ''}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs uppercase tracking-wide px-2 py-1 rounded ${statusChipClass(a.status)}`}>
                      {a.status}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setSelectedId(a.id); setOpenEdit(true); }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        if (!confirm('Excluir este agendamento?')) return;
                        try {
                          await deleteAppointment(a.id);
                          toast({ title: 'Agendamento excluído', description: 'O agendamento foi removido com sucesso.' });
                        } catch (e: any) {
                          toast({ title: 'Erro ao excluir', description: e?.message ?? 'Tente novamente.', variant: 'destructive' });
                        }
                      }}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="calendario" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border rounded-md p-4">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={(day) => {
                  setSelectedDate(day ?? undefined);
                  if (day) {
                    updateFilters({ from: startOfDay(day), to: endOfDay(day) });
                  } else {
                    updateFilters({ from: undefined, to: undefined });
                  }
                }}
                locale={ptBR}
                weekStartsOn={1}
                showOutsideDays
                fixedWeeks
                captionLayout="dropdown-buttons"
                components={{ DayContent }}
                className="rdp-custom"
                styles={{
                  caption: { paddingBottom: 8 },
                  day: { height: 36, width: 36, margin: 2 },
                  month: { padding: 8 },
                }}
              />
              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary inline-block" /> Dia com agendamentos</div>
                <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-neutral-300 inline-block" /> Sem agendamentos</div>
              </div>
            </div>
            <div className="border rounded-md">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="font-medium">
                    {selectedDate ? `Agendamentos em ${selectedDate.toLocaleDateString()}` : "Selecione um dia"}
                  </div>
                  {selectedDate && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded bg-neutral-100">Agendado: {dayStatusSummary.agendado}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100">Confirmado: {dayStatusSummary.confirmado}</span>
                      <span className="px-2 py-0.5 rounded bg-rose-100">Cancelado: {dayStatusSummary.cancelado}</span>
                      <span className="px-2 py-0.5 rounded bg-sky-100">Concluído: {dayStatusSummary.concluido}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="divide-y">
                {selectedDate && dayItems.length === 0 && (
                  <div className="p-4 text-sm text-muted-foreground">Nenhum agendamento para este dia.</div>
                )}
                {dayItems.map((a) => (
                  <div key={a.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="font-medium truncate">
                        {new Date(a.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {a.patient?.name || 'Paciente'}
                      </div>
                      <div className="text-sm text-neutral-600 truncate">
                        {a.professional?.name ? `Prof.: ${a.professional.name}` : 'Sem profissional'}
                        {a.procedure?.name ? ` • Proc.: ${a.procedure.name}` : ''}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs uppercase tracking-wide px-2 py-1 rounded ${statusChipClass(a.status)}`}>
                        {a.status}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setSelectedId(a.id); setOpenEdit(true); }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          if (!confirm('Excluir este agendamento?')) return;
                          try {
                            await deleteAppointment(a.id);
                            toast({ title: 'Agendamento excluído', description: 'O agendamento foi removido com sucesso.' });
                          } catch (e: any) {
                            toast({ title: 'Erro ao excluir', description: e?.message ?? 'Tente novamente.', variant: 'destructive' });
                          }
                        }}
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <NewAppointmentDialog
        open={openNew}
        onOpenChange={setOpenNew}
        onSubmit={async (values) => {
          try {
            await createAppointment(values);
            toast({ title: 'Agendamento criado', description: 'O agendamento foi salvo com sucesso.' });
          } catch (e: any) {
            toast({ title: 'Erro ao criar', description: e?.message ?? 'Tente novamente.', variant: 'destructive' });
          }
        }}
      />

      <EditAppointmentDialog
        open={openEdit}
        onOpenChange={setOpenEdit}
        appointment={selected}
        onSubmit={async (id, values) => {
          try {
            await updateAppointment(id, values);
            toast({ title: 'Agendamento atualizado', description: 'As alterações foram salvas com sucesso.' });
          } catch (e: any) {
            toast({ title: 'Erro ao atualizar', description: e?.message ?? 'Tente novamente.', variant: 'destructive' });
          }
        }}
      />
    </div>
  );
};

export default Appointments;
