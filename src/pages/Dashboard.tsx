
import React from 'react';
import { FileText, FilePlus, FileCheck, Users, Calendar, Clock } from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

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
      icon: FileText, 
      trend: { value: 3, isPositive: false } 
    },
    { 
      title: 'Usuários Ativos', 
      value: '8', 
      icon: Users,
      description: 'Últimos 30 dias' 
    },
  ];

  const recentDocuments = [
    { id: 1, title: 'Atestado Médico - João Silva', type: 'Atestado', date: '15/04/2025' },
    { id: 2, title: 'Receita - Maria Oliveira', type: 'Receita', date: '14/04/2025' },
    { id: 3, title: 'Laudo Médico - Pedro Santos', type: 'Laudo', date: '13/04/2025' },
    { id: 4, title: 'Solicitação de Exame - Ana Costa', type: 'Solicitação', date: '12/04/2025' },
  ];

  const upcomingTasks = [
    { id: 1, title: 'Assinar laudo do paciente José', time: '15:30', date: 'Hoje' },
    { id: 2, title: 'Revisar documentação da clínica', time: '10:00', date: 'Amanhã' },
    { id: 3, title: 'Atualizar receitas padrão', time: '14:00', date: 'Sexta-feira' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            description={stat.description}
          />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Documentos Recentes</CardTitle>
            <CardDescription>Últimos documentos gerados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center p-2 hover:bg-neutral-50 rounded-md">
                  <FileText className="mr-3 h-5 w-5 text-medico-600" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-900 truncate">{doc.title}</p>
                    <p className="text-xs text-neutral-500">{doc.type}</p>
                  </div>
                  <div className="text-xs text-neutral-500 flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    {doc.date}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tarefas Próximas</CardTitle>
            <CardDescription>Atividades agendadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center p-2 hover:bg-neutral-50 rounded-md">
                  <div className="w-2 h-2 rounded-full bg-medico-600 mr-3" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-900 truncate">{task.title}</p>
                    <p className="text-xs text-neutral-500">{task.date}</p>
                  </div>
                  <div className="text-xs text-neutral-500 flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
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
