import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DbProperty {
  id: string;
  title: string;
  price: number;
  type: 'Apartment' | 'House' | 'Penthouse';
  image_url: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
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
  created_at?: string;
  updated_at?: string;
}

export interface DbLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: string;
  last_contact: string;
  property_of_interest_id?: string;
  client_needs: string;
  source: string;
  agent: string;
  created_at?: string;
  updated_at?: string;
}

export interface DbTask {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'VISIT' | 'CALL' | 'CONTRACT_SIGNING' | 'PAYMENT_FOLLOW_UP';
  lead_id: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}
