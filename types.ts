export enum PipelineStatus {
  NEW = 'Novos Leads',
  CONTACTED = 'Contactado',
  VISIT_SCHEDULED = 'Visita Agendada',
  PROPOSAL = 'Proposta Enviada',
  CLOSED = 'Fechado',
}

export interface Property {
  id: string;
  title: string;
  price: number;
  type: 'Apartment' | 'House' | 'Penthouse';
  imageUrl: string;
  bedrooms: number;
  bathrooms: number;
  area: number; // in square meters
  latitude?: number;
  longitude?: number;
  description: string;
  amenities: string[];
  gallery: string[];
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: PipelineStatus;
  lastContact: string;
  propertyOfInterest: Property;
  clientNeeds: string;
  source?: string; // For reporting
  agent?: string; // For reporting
}

export enum TaskType {
  VISIT = 'VISIT',
  CALL = 'CALL',
  CONTRACT_SIGNING = 'CONTRACT_SIGNING',
  PAYMENT_FOLLOW_UP = 'PAYMENT_FOLLOW_UP',
}

export const TaskTypeLabels: Record<TaskType, string> = {
  [TaskType.VISIT]: 'Visita ao Imóvel',
  [TaskType.CALL]: 'Ligar para Lead',
  [TaskType.CONTRACT_SIGNING]: 'Assinatura de Contrato',
  [TaskType.PAYMENT_FOLLOW_UP]: 'Acompanhar Pagamento',
};

export interface Task {
  id: string;
  title: string;
  date: string;
  time: string;
  type: TaskType;
  leadId: string; // Changed from leadName to leadId for robustness
  notes?: string;
}

export type IconId = 'UsersIcon' | 'CalendarIcon' | 'MessageSquareIcon' | 'FileTextIcon' | 'HandshakeIcon' | 'TargetIcon';

export type StatCardId = 'newLeads' | 'visitsToday' | 'followUps' | 'proposalsSent' | 'dealsClosed' | 'conversionRate';

export interface StatCardConfig {
  id: StatCardId;
  title: string;
  isVisible: boolean;
  icon: IconId;
}

export interface TrendData {
  direction: 'up' | 'down' | 'neutral';
  change: number;
}

export interface MetaSettings {
  pageId: string;
  formId: string;
  accessToken: string;
  isConnected: boolean;
}