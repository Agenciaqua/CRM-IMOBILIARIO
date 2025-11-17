import { useState, useEffect } from 'react';
import { supabase, DbProperty, DbLead, DbTask } from '../lib/supabase';
import { Property, Lead, Task } from '../types';

const DEFAULT_PROPERTIES: DbProperty[] = [
  {
    id: 'prop-1',
    title: 'Apartamento Moderno no Centro',
    price: 480000,
    type: 'Apartment',
    image_url: 'https://picsum.photos/seed/prop1/800/600',
    bedrooms: 3,
    bathrooms: 2,
    area: 95,
    latitude: -23.5505,
    longitude: -46.6333,
    description: 'Lindo apartamento no coração da cidade, totalmente reformado com acabamentos de alta qualidade. Perto de metrô, lojas e restaurantes.',
    amenities: ['Academia', 'Salão de Festas', 'Portaria 24h', 'Piscina'],
    gallery: ['https://picsum.photos/seed/prop1-g1/800/600', 'https://picsum.photos/seed/prop1-g2/800/600', 'https://picsum.photos/seed/prop1-g3/800/600'],
    address: { street: 'Av. Paulista, 1000', city: 'São Paulo', state: 'SP', zipCode: '01310-100' }
  },
  {
    id: 'prop-2',
    title: 'Casa Espaçosa com Quintal',
    price: 750000,
    type: 'House',
    image_url: 'https://picsum.photos/seed/prop2/800/600',
    bedrooms: 4,
    bathrooms: 3,
    area: 220,
    latitude: -23.5613,
    longitude: -46.6565,
    description: 'Casa ampla com grande quintal, perfeita para famílias. Possui churrasqueira e espaço para até 4 carros na garagem.',
    amenities: ['Churrasqueira', 'Quintal', 'Garagem Coberta'],
    gallery: ['https://picsum.photos/seed/prop2-g1/800/600', 'https://picsum.photos/seed/prop2-g2/800/600'],
    address: { street: 'Rua das Laranjeiras, 50', city: 'Rio de Janeiro', state: 'RJ', zipCode: '22240-000' }
  },
  {
    id: 'prop-3',
    title: 'Cobertura Duplex com Vista',
    price: 1200000,
    type: 'Penthouse',
    image_url: 'https://picsum.photos/seed/prop3/800/600',
    bedrooms: 3,
    bathrooms: 4,
    area: 180,
    latitude: -23.5432,
    longitude: -46.6292,
    description: 'Cobertura incrível com vista panorâmica da cidade. Área de lazer privativa com piscina e deck de madeira.',
    amenities: ['Piscina Privativa', 'Vista Panorâmica', 'Deck', 'Sauna'],
    gallery: ['https://picsum.photos/seed/prop3-g1/800/600', 'https://picsum.photos/seed/prop3-g2/800/600', 'https://picsum.photos/seed/prop3-g3/800/600', 'https://picsum.photos/seed/prop3-g4/800/600'],
    address: { street: 'Praça da Liberdade, 200', city: 'Belo Horizonte', state: 'MG', zipCode: '30140-010' }
  },
];

export const useDatabase = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  const dbPropertyToProperty = (dbProp: DbProperty): Property => ({
    id: dbProp.id,
    title: dbProp.title,
    price: Number(dbProp.price),
    type: dbProp.type,
    imageUrl: dbProp.image_url,
    bedrooms: dbProp.bedrooms,
    bathrooms: dbProp.bathrooms,
    area: Number(dbProp.area),
    latitude: dbProp.latitude,
    longitude: dbProp.longitude,
    description: dbProp.description,
    amenities: dbProp.amenities,
    gallery: dbProp.gallery,
    address: dbProp.address,
  });

  const dbLeadToLead = (dbLead: DbLead, allProperties: Property[]): Lead => {
    const propertyOfInterest = allProperties.find(p => p.id === dbLead.property_of_interest_id) || allProperties[0];

    return {
      id: dbLead.id,
      name: dbLead.name,
      phone: dbLead.phone,
      email: dbLead.email,
      status: dbLead.status as any,
      lastContact: dbLead.last_contact,
      propertyOfInterest: propertyOfInterest,
      clientNeeds: dbLead.client_needs,
      source: dbLead.source,
      agent: dbLead.agent,
    };
  };

  const dbTaskToTask = (dbTask: DbTask): Task => ({
    id: dbTask.id,
    title: dbTask.title,
    date: dbTask.date,
    time: dbTask.time,
    type: dbTask.type as any,
    leadId: dbTask.lead_id,
    notes: dbTask.notes,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      try {
        const [propertiesRes, leadsRes, tasksRes] = await Promise.all([
          supabase.from('properties').select('*').order('created_at', { ascending: false }),
          supabase.from('leads').select('*').order('created_at', { ascending: false }),
          supabase.from('tasks').select('*').order('date', { ascending: true }),
        ]);

        if (!propertiesRes.error && !leadsRes.error && !tasksRes.error) {
          setIsSupabaseConnected(true);

          const dbProperties = (propertiesRes.data || []) as DbProperty[];
          const mappedProperties = dbProperties.map(p => dbPropertyToProperty(p));

          const dbLeads = (leadsRes.data || []) as DbLead[];
          const mappedLeads = dbLeads.map(l => dbLeadToLead(l, mappedProperties));

          const dbTasks = (tasksRes.data || []) as DbTask[];
          const mappedTasks = dbTasks.map(t => dbTaskToTask(t));

          setProperties(mappedProperties);
          setLeads(mappedLeads);
          setTasks(mappedTasks);
        } else {
          throw new Error('Falha ao carregar do Supabase');
        }
      } catch (supabaseErr) {
        console.warn('Supabase não disponível, usando dados locais:', supabaseErr);
        setIsSupabaseConnected(false);

        const defaultProps = DEFAULT_PROPERTIES.map(p => dbPropertyToProperty(p));
        setProperties(defaultProps);
        setLeads([]);
        setTasks([]);
      }
    } catch (err: any) {
      console.error('Erro ao carregar dados:', err);
      setError(null);
      const defaultProps = DEFAULT_PROPERTIES.map(p => dbPropertyToProperty(p));
      setProperties(defaultProps);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    let channels: any[] = [];
    try {
      const propertiesChannel = supabase
        .channel('properties-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, () => {
          loadData();
        })
        .subscribe();

      const leadsChannel = supabase
        .channel('leads-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
          loadData();
        })
        .subscribe();

      const tasksChannel = supabase
        .channel('tasks-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
          loadData();
        })
        .subscribe();

      channels = [propertiesChannel, leadsChannel, tasksChannel];
    } catch (err) {
      console.warn('Não foi possível configurar real-time:', err);
    }

    return () => {
      channels.forEach(ch => supabase.removeChannel(ch));
    };
  }, []);

  const addProperty = async (propertyData: Omit<Property, 'id'>) => {
    try {
      if (!isSupabaseConnected) {
        throw new Error('Supabase não conectado');
      }

      const { data, error } = await supabase
        .from('properties')
        .insert([{
          title: propertyData.title,
          price: propertyData.price,
          type: propertyData.type,
          image_url: propertyData.imageUrl,
          bedrooms: propertyData.bedrooms,
          bathrooms: propertyData.bathrooms,
          area: propertyData.area,
          latitude: propertyData.latitude,
          longitude: propertyData.longitude,
          description: propertyData.description,
          amenities: propertyData.amenities,
          gallery: propertyData.gallery,
          address: propertyData.address,
        }])
        .select();

      if (error) throw error;
      return data[0];
    } catch (err: any) {
      console.error('Erro ao adicionar imóvel:', err);
      throw err;
    }
  };

  const updateProperty = async (property: Property) => {
    try {
      if (!isSupabaseConnected) {
        throw new Error('Supabase não conectado');
      }

      const { error } = await supabase
        .from('properties')
        .update({
          title: property.title,
          price: property.price,
          type: property.type,
          image_url: property.imageUrl,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          area: property.area,
          latitude: property.latitude,
          longitude: property.longitude,
          description: property.description,
          amenities: property.amenities,
          gallery: property.gallery,
          address: property.address,
        })
        .eq('id', property.id);

      if (error) throw error;
    } catch (err: any) {
      console.error('Erro ao atualizar imóvel:', err);
      throw err;
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      if (!isSupabaseConnected) {
        throw new Error('Supabase não conectado');
      }

      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err: any) {
      console.error('Erro ao deletar imóvel:', err);
      throw err;
    }
  };

  const addLead = async (leadData: Omit<Lead, 'id' | 'status' | 'lastContact' | 'propertyOfInterest'>) => {
    try {
      if (!isSupabaseConnected) {
        throw new Error('Supabase não conectado');
      }

      const { data, error } = await supabase
        .from('leads')
        .insert([{
          name: leadData.name,
          phone: leadData.phone,
          email: leadData.email,
          status: 'Novos Leads',
          last_contact: new Date().toISOString().split('T')[0],
          property_of_interest_id: properties[0]?.id || null,
          client_needs: leadData.clientNeeds,
          source: leadData.source,
          agent: leadData.agent,
        }])
        .select();

      if (error) throw error;
      return data[0];
    } catch (err: any) {
      console.error('Erro ao adicionar lead:', err);
      throw err;
    }
  };

  const updateLead = async (lead: Lead) => {
    try {
      if (!isSupabaseConnected) {
        throw new Error('Supabase não conectado');
      }

      const { error } = await supabase
        .from('leads')
        .update({
          name: lead.name,
          phone: lead.phone,
          email: lead.email,
          status: lead.status,
          last_contact: lead.lastContact,
          property_of_interest_id: lead.propertyOfInterest?.id || null,
          client_needs: lead.clientNeeds,
          source: lead.source,
          agent: lead.agent,
        })
        .eq('id', lead.id);

      if (error) throw error;
    } catch (err: any) {
      console.error('Erro ao atualizar lead:', err);
      throw err;
    }
  };

  const deleteLead = async (id: string) => {
    try {
      if (!isSupabaseConnected) {
        throw new Error('Supabase não conectado');
      }

      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err: any) {
      console.error('Erro ao deletar lead:', err);
      throw err;
    }
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'title'> & { title: string }) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title: taskData.title,
          date: taskData.date,
          time: taskData.time,
          type: taskData.type,
          lead_id: taskData.leadId,
          notes: taskData.notes || '',
        }])
        .select();

      if (error) throw error;
      return data[0];
    } catch (err: any) {
      console.error('Error adding task:', err);
      throw err;
    }
  };

  const updateTask = async (task: Task) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          title: task.title,
          date: task.date,
          time: task.time,
          type: task.type,
          lead_id: task.leadId,
          notes: task.notes || '',
        })
        .eq('id', task.id);

      if (error) throw error;
    } catch (err: any) {
      console.error('Error updating task:', err);
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err: any) {
      console.error('Error deleting task:', err);
      throw err;
    }
  };

  return {
    properties,
    leads,
    tasks,
    loading,
    error,
    isSupabaseConnected,
    addProperty,
    updateProperty,
    deleteProperty,
    addLead,
    updateLead,
    deleteLead,
    addTask,
    updateTask,
    deleteTask,
    refreshData: loadData,
  };
};
