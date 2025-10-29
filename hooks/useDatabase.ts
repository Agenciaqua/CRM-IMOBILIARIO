import { useState, useEffect } from 'react';
import { supabase, DbProperty, DbLead, DbTask } from '../lib/supabase';
import { Property, Lead, Task } from '../types';

export const useDatabase = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dbPropertyToProperty = (dbProp: DbProperty, allProperties: DbProperty[]): Property => ({
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

  const dbLeadToLead = (dbLead: DbLead, properties: Property[]): Lead => {
    const propertyOfInterest = properties.find(p => p.id === dbLead.property_of_interest_id);

    return {
      id: dbLead.id,
      name: dbLead.name,
      phone: dbLead.phone,
      email: dbLead.email,
      status: dbLead.status as any,
      lastContact: dbLead.last_contact,
      propertyOfInterest: propertyOfInterest || properties[0],
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

      const [propertiesRes, leadsRes, tasksRes] = await Promise.all([
        supabase.from('properties').select('*').order('created_at', { ascending: false }),
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
        supabase.from('tasks').select('*').order('date', { ascending: true }),
      ]);

      if (propertiesRes.error) throw propertiesRes.error;
      if (leadsRes.error) throw leadsRes.error;
      if (tasksRes.error) throw tasksRes.error;

      const dbProperties = propertiesRes.data as DbProperty[];
      const mappedProperties = dbProperties.map(p => dbPropertyToProperty(p, dbProperties));

      const dbLeads = leadsRes.data as DbLead[];
      const mappedLeads = dbLeads.map(l => dbLeadToLead(l, mappedProperties));

      const dbTasks = tasksRes.data as DbTask[];
      const mappedTasks = dbTasks.map(t => dbTaskToTask(t));

      setProperties(mappedProperties);
      setLeads(mappedLeads);
      setTasks(mappedTasks);
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

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

    return () => {
      supabase.removeChannel(propertiesChannel);
      supabase.removeChannel(leadsChannel);
      supabase.removeChannel(tasksChannel);
    };
  }, []);

  const addProperty = async (propertyData: Omit<Property, 'id'>) => {
    try {
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
      console.error('Error adding property:', err);
      throw err;
    }
  };

  const updateProperty = async (property: Property) => {
    try {
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
      console.error('Error updating property:', err);
      throw err;
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err: any) {
      console.error('Error deleting property:', err);
      throw err;
    }
  };

  const addLead = async (leadData: Omit<Lead, 'id' | 'status' | 'lastContact' | 'propertyOfInterest'>) => {
    try {
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
      console.error('Error adding lead:', err);
      throw err;
    }
  };

  const updateLead = async (lead: Lead) => {
    try {
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
      console.error('Error updating lead:', err);
      throw err;
    }
  };

  const deleteLead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err: any) {
      console.error('Error deleting lead:', err);
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
