
import React from 'react';
import { Patient, PatientDocument } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface PatientDetailsViewProps {
  patient: Patient;
}

export const PatientDetailsView = ({ patient }: PatientDetailsViewProps) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status: PatientDocument['status']) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">Rascunho</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Pendente</Badge>;
      case 'signed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Assinado</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">Expirado</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-neutral-500">Nome completo</p>
              <p className="text-neutral-700">{patient.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">CPF</p>
              <p className="text-neutral-700">{patient.cpf}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Gênero</p>
              <p className="text-neutral-700">
                {patient.gender === 'male' ? 'Masculino' : 
                  patient.gender === 'female' ? 'Feminino' : 'Outro'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Data de Nascimento</p>
              <p className="text-neutral-700">{formatDate(patient.birthDate)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Email</p>
              <p className="text-neutral-700">{patient.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Telefone</p>
              <p className="text-neutral-700">{patient.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {patient.address && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Endereço</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-neutral-500">Logradouro</p>
                <p className="text-neutral-700">{patient.address.street}, {patient.address.number}</p>
              </div>
              {patient.address.complement && (
                <div>
                  <p className="text-sm font-medium text-neutral-500">Complemento</p>
                  <p className="text-neutral-700">{patient.address.complement}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-neutral-500">Bairro</p>
                <p className="text-neutral-700">{patient.address.neighborhood}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500">CEP</p>
                <p className="text-neutral-700">{patient.address.zipCode}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500">Cidade/Estado</p>
                <p className="text-neutral-700">{patient.address.city}/{patient.address.state}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Documentos</CardTitle>
        </CardHeader>
        <CardContent>
          {patient.documents && patient.documents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patient.documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>{doc.title}</TableCell>
                    <TableCell>
                      {doc.type === 'consent' ? 'Termo de Consentimento' : 
                       doc.type === 'authorization' ? 'Autorização' : 
                       doc.type === 'declaration' ? 'Declaração' : 
                       doc.type}
                    </TableCell>
                    <TableCell>{formatDate(doc.createdAt)}</TableCell>
                    <TableCell>{getStatusBadge(doc.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-neutral-500">Nenhum documento vinculado a este paciente.</p>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Informações do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-neutral-500">Data de Cadastro</p>
              <p className="text-neutral-700">{formatDate(patient.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Última Atualização</p>
              <p className="text-neutral-700">{formatDate(patient.updatedAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
