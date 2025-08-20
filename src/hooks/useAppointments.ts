import { useEffect, useMemo, useState } from 'react';
import {
  Appointment,
  AppointmentStatus,
  ListAppointmentsParams,
  createAppointment,
  deleteAppointment,
  listAppointments,
  updateAppointment,
  NewAppointment,
  UpdateAppointment,
} from '@/integrations/supabase/appointments';

export type AppointmentsFilters = {
  search: string;
  status: AppointmentStatus | 'todos';
  professionalId: string | 'todos';
  dateRange?: { from?: Date; to?: Date };
};

export const useAppointments = () => {
  const [items, setItems] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AppointmentsFilters>({
    search: '',
    status: 'todos',
    professionalId: 'todos',
    dateRange: undefined,
  });

  const toISODate = (d?: Date) => (d ? new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString() : undefined);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const params: ListAppointmentsParams = {
        search: filters.search,
        status: filters.status,
        professionalId: filters.professionalId,
        from: toISODate(filters.dateRange?.from),
        to: filters.dateRange?.to ? new Date(filters.dateRange.to.getTime() + 24 * 60 * 60 * 1000).toISOString() : undefined,
        limit: 200,
        offset: 0,
      };
      const data = await listAppointments(params);
      setItems(data);
      setError(null);
    } catch (err: any) {
      console.error('Erro ao buscar agendamentos:', err);
      setError(err.message || 'Erro ao carregar agendamentos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.status, filters.professionalId, filters.dateRange?.from?.getTime(), filters.dateRange?.to?.getTime()]);

  const updateFilters = (patch: Partial<AppointmentsFilters>) => setFilters((prev) => ({ ...prev, ...patch }));

  const stats = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const isToday = (iso: string) => {
      const d = new Date(iso);
      return d >= startOfToday && d <= endOfToday;
    };
    const isLast30d = (iso: string) => new Date(iso) >= last30d;

    const totalLast30 = items.filter((i) => isLast30d(i.scheduled_at)).length;
    const today = items.filter((i) => isToday(i.scheduled_at)).length;
    const pending = items.filter((i) => i.status === 'agendado').length;
    const confirmedLast30 = items.filter((i) => isLast30d(i.scheduled_at) && i.status === 'confirmado').length;
    const baseRateDen = items.filter((i) => isLast30d(i.scheduled_at) && (i.status === 'agendado' || i.status === 'confirmado')).length;
    const rate = baseRateDen > 0 ? Math.round((confirmedLast30 / baseRateDen) * 100) : 0;

    return { today, totalLast30, pending, confirmationRate: rate };
  }, [items]);

  const onCreate = async (values: NewAppointment) => {
    const created = await createAppointment(values);
    setItems((prev) => [created, ...prev]);
    return created;
  };

  const onUpdate = async (id: string, values: UpdateAppointment) => {
    const updated = await updateAppointment(id, values);
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
    return updated;
  };

  const onDelete = async (id: string) => {
    await deleteAppointment(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return {
    items,
    isLoading,
    error,
    filters,
    updateFilters,
    refetch: fetchAppointments,
    stats,
    createAppointment: onCreate,
    updateAppointment: onUpdate,
    deleteAppointment: onDelete,
  };
};
