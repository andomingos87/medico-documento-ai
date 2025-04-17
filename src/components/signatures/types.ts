
export interface BaseDocument {
  id: string;
  patientName: string;
  procedureType: string;
  appointmentDate: string;
  readingTime: number;
  createdAt: string;
  status: string;
}

export interface PendingDocument extends BaseDocument {
  status: 'pending';
}

export interface SignedDocument extends BaseDocument {
  status: 'signed';
  signedAt: string;
  deliveryMethod: 'email' | 'whatsapp';
}

export type Document = PendingDocument | SignedDocument;

// Dados fictícios para documentos pendentes e assinados
export const PENDING_DOCUMENTS: PendingDocument[] = [
  {
    id: 'doc1',
    patientName: 'Mariana Oliveira',
    procedureType: 'Toxina Botulínica (Botox)',
    appointmentDate: '2025-04-18T14:30:00',
    readingTime: 4,
    createdAt: '2025-04-17T10:15:00',
    status: 'pending',
  },
  {
    id: 'doc2',
    patientName: 'Carlos Eduardo Santos',
    procedureType: 'Preenchimento Facial',
    appointmentDate: '2025-04-18T16:00:00',
    readingTime: 6,
    createdAt: '2025-04-17T11:30:00',
    status: 'pending',
  },
  {
    id: 'doc3',
    patientName: 'Patrícia Mendes',
    procedureType: 'Fios de Sustentação',
    appointmentDate: '2025-04-19T09:15:00',
    readingTime: 7,
    createdAt: '2025-04-17T14:45:00',
    status: 'pending',
  },
];

export const SIGNED_DOCUMENTS: SignedDocument[] = [
  {
    id: 'doc4',
    patientName: 'Juliana Costa',
    procedureType: 'Toxina Botulínica (Botox)',
    appointmentDate: '2025-04-16T10:00:00',
    readingTime: 4,
    createdAt: '2025-04-15T15:20:00',
    signedAt: '2025-04-16T10:15:00',
    status: 'signed',
    deliveryMethod: 'email',
  },
  {
    id: 'doc5',
    patientName: 'Roberto Almeida',
    procedureType: 'Peeling Químico',
    appointmentDate: '2025-04-16T14:30:00',
    readingTime: 5,
    createdAt: '2025-04-15T16:40:00',
    signedAt: '2025-04-16T14:45:00',
    status: 'signed',
    deliveryMethod: 'whatsapp',
  },
];
