
import React from 'react';
import { 
  FileText, 
  FilePlus, 
  FileCheck, 
  FileSignature, 
  Calendar, 
  Clock, 
  AlertCircle
} from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { createStatusBadge } from '@/lib/statusBadgeUtils';

export const Dashboard = () => {
  // Dados fictícios para os gráficos e stats
  const stats = [
    { 
      title: 'Documentos Gerados', 
      value: '145', 
      icon: FilePlus, 
      trend: { value: 12, isPositive: true } 
    },
    { 
      title: 'Documentos Assinados', 
      value: '87', 
      icon: FileCheck, 
      trend: { value: 5, isPositive: true } 
    },
    { 
      title: 'Pendentes de Assinatura', 
      value: '23', 
      icon: FileSignature, 
      trend: { value: 3, isPositive: false },
      className: 'border-l-4 border-warning'
    },
    { 
      title: 'Expiram em 24h', 
      value: '5', 
      icon: AlertCircle,
      className: 'border-l-4 border-destructive'
    },
  ];

  const recentDocuments = [
    { id: 1, title: 'Termo de Consentimento - Cirurgia', patient: 'João Silva', status: 'pending' as const, date: '15/04/2025' },
    { id: 2, title: 'Consentimento - Tratamento Invasivo', patient: 'Maria Oliveira', status: 'signed' as const, date: '14/04/2025' },
    { id: 3, title: 'Termo de Cirurgia Plástica', patient: 'Pedro Santos', status: 'signed' as const, date: '13/04/2025' },
    { id: 4, title: 'Termo de Anestesia', patient: 'Ana Costa', status: 'pending' as const, date: '12/04/2025' },
  ];

  const upcomingTasks = [
    { id: 1, title: 'Enviar lembrete para João Silva', time: '15:30', date: 'Hoje', priority: 'high' },
    { id: 2, title: 'Revisar termo de consentimento padrão', time: '10:00', date: 'Amanhã', priority: 'medium' },
    { id: 3, title: 'Validar assinaturas pendentes', time: '14:00', date: 'Sexta-feira', priority: 'low' },
  ];

  const priorityClasses = {
    high: 'bg-destructive',
    medium: 'bg-warning',
    low: 'bg-success'
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Visão Geral</h1>
        <p className="text-muted-foreground mt-1">Resumo dos seus documentos e assinaturas</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            className={stat.className}
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
                <div key={doc.id} className="flex items-center p-3 hover:bg-muted/50 rounded-lg transition-smooth">
                  <FileText className="mr-3 h-5 w-5 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-card-foreground truncate">{doc.title}</p>
                    <p className="text-sm text-muted-foreground">{doc.patient}</p>
                  </div>
                  <div className="text-xs mr-3">
                    {createStatusBadge(doc.status)}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    {doc.date}
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
                <div key={task.id} className="flex items-center p-3 hover:bg-muted/50 rounded-lg transition-smooth">
                  <div className={`w-3 h-3 rounded-full ${priorityClasses[task.priority]} mr-3`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-card-foreground truncate">{task.title}</p>
                    <p className="text-sm text-muted-foreground">{task.date}</p>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {task.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
