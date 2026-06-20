/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Resident {
  id: string;
  name: string;
  role: 'Proprietário' | 'Inquilino' | 'Morador';
  unit: string;
  block: string;
  avatar: string;
  phone?: string;
  vehicle?: {
    plate: string;
    model: string;
    color: string;
  };
  vehicles?: Array<{
    plate: string;
    model: string;
    color: string;
  }>;
  gender?: 'M' | 'F';
  isActive: boolean;
}

export interface AccessLog {
  id: string;
  plate: string;
  vehicleModel: string;
  vehicleColor: string;
  type: 'Morador' | 'Visitante' | 'Serviço';
  name: string;
  subType?: string; // e.g. "Proprietário", "Convidada", "Net Internet"
  destination: string; // e.g. "Bl. A - Ap 1202"
  time: string;
  status: 'ENTRADA' | 'SAÍDA';
}

export interface Shift {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  hours: string;
  status: 'Finalizado' | 'Em Andamento' | 'Pendente';
  dateLabel: string; // e.g. "Ontem", "Hoje - Plantão Atual", "Amanhã"
  dateKey: 'ontem' | 'hoje' | 'amanha';
  badgeColor?: string;
}

export interface ShiftSwap {
  id: string;
  date: string;
  originalGuard: string;
  substituteGuard: string;
  reason: string;
  status: 'Aprovado' | 'Recusado' | 'Pendente';
}

export interface Guard {
  id: string;
  name: string;
  role: string;
  phone: string;
  avatar: string;
}

export interface CondoConfig {
  name: string;
  address: string;
  blocks: number;
  apartmentsCount: number;
  isConfigured: boolean;
}

export interface Occurrence {
  id: string;
  type: string;
  reportedBy: string;
  description: string;
  severity: 'Baixo' | 'Médio' | 'Alto';
  date: string;
  location: string;
  status: 'Pendente' | 'Em Andamento' | 'Resolvido';
}
