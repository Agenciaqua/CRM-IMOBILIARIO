import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { LeadsPage } from './components/LeadsPage';
import { PropertiesPage } from './components/PropertiesPage';
import { ReportsPage } from './components/ReportsPage';
import { CalendarPage } from './components/CalendarPage';
import { MapPage } from './components/MapPage';
import { SettingsPage } from './components/SettingsPage';
import { AddLeadModal } from './components/AddLeadModal';
import { EditLeadModal } from './components/EditLeadModal';
import { TaskModal } from './components/TaskModal';
import { DayDetailModal } from './components/DayDetailModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { AddPropertyModal } from './components/AddPropertyModal';
import { EditPropertyModal } from './components/EditPropertyModal';
import { Lead, Task, PipelineStatus, Property, StatCardConfig, TaskType, TaskTypeLabels, MetaSettings } from './types';

const initialProperties: Property[] = [
  { 
    id: 'prop-1', title: 'Apartamento Moderno no Centro', price: 480000, type: 'Apartment', imageUrl: 'https://picsum.photos/seed/prop1/800/600', 
    bedrooms: 3, bathrooms: 2, area: 95, latitude: -23.5505, longitude: -46.6333,
    description: 'Lindo apartamento no coração da cidade, totalmente reformado com acabamentos de alta qualidade. Perto de metrô, lojas e restaurantes.',
    amenities: ['Academia', 'Salão de Festas', 'Portaria 24h', 'Piscina'],
    gallery: ['https://picsum.photos/seed/prop1-g1/800/600', 'https://picsum.photos/seed/prop1-g2/800/600', 'https://picsum.photos/seed/prop1-g3/800/600'],
    address: { street: 'Av. Paulista, 1000', city: 'São Paulo', state: 'SP', zipCode: '01310-100' }
  },
  { 
    id: 'prop-2', title: 'Casa Espaçosa com Quintal', price: 750000, type: 'House', imageUrl: 'https://picsum.photos/seed/prop2/800/600', 
    bedrooms: 4, bathrooms: 3, area: 220, latitude: -23.5613, longitude: -46.6565,
    description: 'Casa ampla com grande quintal, perfeita para famílias. Possui churrasqueira e espaço para até 4 carros na garagem.',
    amenities: ['Churrasqueira', 'Quintal', 'Garagem Coberta'],
    gallery: ['https://picsum.photos/seed/prop2-g1/800/600', 'https://picsum.photos/seed/prop2-g2/800/600'],
    address: { street: 'Rua das Laranjeiras, 50', city: 'Rio de Janeiro', state: 'RJ', zipCode: '22240-000' }
  },
  { 
    id: 'prop-3', title: 'Cobertura Duplex com Vista', price: 1200000, type: 'Penthouse', imageUrl: 'https://picsum.photos/seed/prop3/800/600', 
    bedrooms: 3, bathrooms: 4, area: 180, latitude: -23.5432, longitude: -46.6292,
    description: 'Cobertura incrível com vista panorâmica da cidade. Área de lazer privativa com piscina e deck de madeira.',
    amenities: ['Piscina Privativa', 'Vista Panorâmica', 'Deck', 'Sauna'],
    gallery: ['https://picsum.photos/seed/prop3-g1/800/600', 'https://picsum.photos/seed/prop3-g2/800/600', 'https://picsum.photos/seed/prop3-g3/800/600', 'https://picsum.photos/seed/prop3-g4/800/600'],
    address: { street: 'Praça da Liberdade, 200', city: 'Belo Horizonte', state: 'MG', zipCode: '30140-010' }
  },
];

const daysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};

const initialLeads: Lead[] = [
    { id: 'lead-1', name: 'Carlos Silva', phone: '(11) 98765-4321', email: 'carlos.silva@example.com', status: PipelineStatus.NEW, lastContact: daysAgo(1), clientNeeds: 'Client is looking for a 3-bedroom apartment with a balcony in the downtown area, budget up to $500,000.', propertyOfInterest: initialProperties[0], source: 'Portal Imobiliário', agent: 'João Silva' },
    { id: 'lead-2', name: 'Ana Pereira', phone: '(21) 91234-5678', email: 'ana.p@example.com', status: PipelineStatus.CONTACTED, lastContact: daysAgo(15), clientNeeds: 'Client needs a house with a yard for her two dogs. Prefers a quiet neighborhood. Budget is flexible for the right property.', propertyOfInterest: initialProperties[1], source: 'Website', agent: 'Maria Oliveira' },
    { id: 'lead-3', name: 'Fernando Costa', phone: '(31) 99988-7766', email: 'fernando.costa@example.com', status: PipelineStatus.VISIT_SCHEDULED, lastContact: daysAgo(3), clientNeeds: 'Client wants a high-floor penthouse with a panoramic view. Must have at least 2 parking spots.', propertyOfInterest: initialProperties[2], source: 'Indicação', agent: 'João Silva' },
    { id: 'lead-4', name: 'Beatriz Almeida', phone: '(11) 98888-4444', email: 'beatriz.a@example.com', status: PipelineStatus.PROPOSAL, lastContact: daysAgo(0), clientNeeds: 'Looking for a modern apartment, high floor.', propertyOfInterest: initialProperties[0], source: 'Portal Imobiliário', agent: 'Pedro Martins' },
    { id: 'lead-5', name: 'Lucas Martins', phone: '(21) 97777-3333', email: 'lucas.m@example.com', status: PipelineStatus.CLOSED, lastContact: daysAgo(9), clientNeeds: 'Wants a large house for his family.', propertyOfInterest: initialProperties[1], source: 'Website', agent: 'Maria Oliveira' },
];

const initialTasks: Task[] = [
    { id: 'task-1', title: 'Visita ao Imóvel', date: '2024-07-20', time: '10:00', type: TaskType.VISIT, leadId: 'lead-3', notes: 'Cliente pediu para confirmar um dia antes.' },
    { id: 'task-2', title: 'Ligar para Lead', date: new Date().toISOString().split('T')[0], time: '14:00', type: TaskType.CALL, leadId: 'lead-2' },
];

const initialStatCardConfig: StatCardConfig[] = [
  { id: 'newLeads', title: 'Novos Leads', isVisible: true, icon: 'UsersIcon' },
  { id: 'visitsToday', title: 'Visitas Hoje', isVisible: true, icon: 'CalendarIcon' },
  { id: 'followUps', title: 'Follow-ups Pendentes', isVisible: true, icon: 'MessageSquareIcon' },
  { id: 'proposalsSent', title: 'Propostas Enviadas', isVisible: true, icon: 'FileTextIcon' },
  { id: 'dealsClosed', title: 'Negócios Fechados', isVisible: true, icon: 'HandshakeIcon' },
  { id: 'conversionRate', title: 'Taxa de Conversão', isVisible: true, icon: 'TargetIcon' },
];

const App: React.FC = () => {
  const [activePage, setActivePage] = useState('Dashboard');
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [profilePicture, setProfilePicture] = useState<string>(() => {
    return localStorage.getItem('realtyflow-profile-picture') || 'https://picsum.photos/seed/user/100/100';
  });
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('realtyflow-theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  
  const [metaSettings, setMetaSettings] = useState<MetaSettings>(() => {
    const savedSettings = localStorage.getItem('realtyflow-meta-settings');
    return savedSettings ? JSON.parse(savedSettings) : { pageId: '', formId: '', accessToken: '', isConnected: false };
  });


  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
    localStorage.setItem('realtyflow-theme', theme);
  }, [theme]);

  const handleThemeChange = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  
  const handleProfilePictureChange = (newPicture: string) => {
    setProfilePicture(newPicture);
    localStorage.setItem('realtyflow-profile-picture', newPicture);
  };

  const [statCardConfig, setStatCardConfig] = useState<StatCardConfig[]>(() => {
    try {
      const savedConfigJSON = localStorage.getItem('realtyflow-statcard-config');
      if (!savedConfigJSON) return initialStatCardConfig;
      
      const savedConfig = JSON.parse(savedConfigJSON);
      const savedConfigIds = new Set(savedConfig.map((c: StatCardConfig) => c.id));
      const mergedConfig = [...savedConfig];
      initialStatCardConfig.forEach(defaultCard => {
        if (!savedConfigIds.has(defaultCard.id)) {
          mergedConfig.push(defaultCard);
        }
      });
      return mergedConfig;
    } catch (error) {
      console.error("Could not parse stat card config from localStorage", error);
      return initialStatCardConfig;
    }
  });
  
  // Modal States
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'lead' | 'property' | 'task', id: string, name: string } | null>(null);

  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);
  
  // Calendar and Task Modal States
  const [isDayDetailModalOpen, setIsDayDetailModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [leadForTaskScheduling, setLeadForTaskScheduling] = useState<Lead | null>(null);


  const handleStatCardConfigChange = (newConfig: StatCardConfig[]) => {
    setStatCardConfig(newConfig);
    localStorage.setItem('realtyflow-statcard-config', JSON.stringify(newConfig));
  };
  
  const closeAllModals = () => {
    setIsAddLeadModalOpen(false);
    setLeadToEdit(null);
    setItemToDelete(null);
    setIsAddPropertyModalOpen(false);
    setPropertyToEdit(null);
    setIsDayDetailModalOpen(false);
    setIsTaskModalOpen(false);
    setTaskToEdit(null);
    setLeadForTaskScheduling(null);
  };

  // --- Integration Handlers ---
  const handleMetaConnection = (settings: MetaSettings) => {
    const newSettings = { ...settings, isConnected: true };
    setMetaSettings(newSettings);
    localStorage.setItem('realtyflow-meta-settings', JSON.stringify(newSettings));

    // Simulate receiving a new lead upon connection test
    const newLeadFromMeta: Lead = {
      id: `lead-meta-${Date.now()}`,
      name: 'Lead de Teste (Meta Ads)',
      phone: '(41) 91234-5678',
      email: `meta.lead.${Date.now()}@example.com`,
      status: PipelineStatus.NEW,
      lastContact: new Date().toISOString().split('T')[0],
      clientNeeds: 'Interessado em imóveis anunciados no Facebook.',
      propertyOfInterest: properties[Math.floor(Math.random() * properties.length)],
      source: 'Meta Ads',
      agent: 'Não Atribuído'
    };
    setLeads(prevLeads => [newLeadFromMeta, ...prevLeads]);
    
    // In a real app, you would now use the token to subscribe to webhooks.
    alert('Conexão salva e testada com sucesso! Um lead de exemplo foi adicionado.');
  };

  const handleMetaDisconnection = () => {
    const newSettings = { pageId: '', formId: '', accessToken: '', isConnected: false };
    setMetaSettings(newSettings);
    localStorage.removeItem('realtyflow-meta-settings');
  };
  
  // --- Lead Handlers ---
  const handleAddLead = (newLeadData: Omit<Lead, 'id' | 'status' | 'lastContact' | 'propertyOfInterest'>) => {
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      ...newLeadData,
      status: PipelineStatus.NEW,
      lastContact: new Date().toISOString().split('T')[0],
      propertyOfInterest: properties[Math.floor(Math.random() * properties.length)],
    };
    setLeads(prevLeads => [newLead, ...prevLeads]);
    closeAllModals();
  };
  
  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads(prevLeads => prevLeads.map(lead => lead.id === updatedLead.id ? updatedLead : lead));
    closeAllModals();
  };

  const handleDeleteConfirmed = () => {
    if (!itemToDelete) return;
    if (itemToDelete.type === 'lead') {
      setLeads(prevLeads => prevLeads.filter(lead => lead.id !== itemToDelete.id));
    } else if (itemToDelete.type === 'property') {
      setProperties(prevProps => prevProps.filter(prop => prop.id !== itemToDelete.id));
    } else if (itemToDelete.type === 'task') {
        handleDeleteTask(itemToDelete.id);
    }
    closeAllModals();
  };
  
  // --- Calendar and Task Handlers ---
  const handleDayClick = (date: string) => {
    setSelectedDate(date);
    setIsDayDetailModalOpen(true);
  };

  const handleOpenTaskModal = (task?: Task, date?: string) => {
    setTaskToEdit(task || null);
    setSelectedDate(date || task?.date || new Date().toISOString().split('T')[0]);
    setIsDayDetailModalOpen(false); // Close day detail
    setIsTaskModalOpen(true); // Open task modal
  };
  
  const handleOpenTaskModalForLead = (lead: Lead) => {
    setLeadForTaskScheduling(lead);
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskData: Omit<Task, 'title'> & { id?: string }) => {
    const lead = leads.find(l => l.id === taskData.leadId);
    if (!lead) return;

    if (taskData.id) { // Editing existing task
      const updatedTask: Task = { ...taskData, id: taskData.id, title: TaskTypeLabels[taskData.type] };
      setTasks(prev => prev.map(t => t.id === taskData.id ? updatedTask : t));
    } else { // Creating new task
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}`,
        title: TaskTypeLabels[taskData.type],
      };
      setTasks(prev => [...prev, newTask]);
    }
    
    // Update lead status if a visit was scheduled
    if (taskData.type === TaskType.VISIT) {
      setLeads(prev => prev.map(l => 
        l.id === taskData.leadId ? { ...l, status: PipelineStatus.VISIT_SCHEDULED, lastContact: new Date().toISOString().split('T')[0] } : l
      ));
    } else {
        // Just update last contact for other task types
        setLeads(prev => prev.map(l => 
          l.id === taskData.leadId ? { ...l, lastContact: new Date().toISOString().split('T')[0] } : l
        ));
    }
    closeAllModals();
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    // The confirmation modal handles closing itself
  };

  // --- Property Handlers ---
  const handleAddProperty = (newPropertyData: Omit<Property, 'id'>) => {
    const newProperty: Property = {
      id: `prop-${Date.now()}`,
      ...newPropertyData,
    };
    setProperties(prev => [newProperty, ...prev]);
    closeAllModals();
  };

  const handleUpdateProperty = (updatedProperty: Property) => {
    setProperties(prev => prev.map(p => p.id === updatedProperty.id ? updatedProperty : p));
    closeAllModals();
  };


  const renderContent = () => {
    const leadActions = {
      onScheduleTask: handleOpenTaskModalForLead,
      onEditLead: setLeadToEdit,
      onDeleteLead: (lead: Lead) => setItemToDelete({ type: 'lead', id: lead.id, name: lead.name }),
      onUpdateLead: handleUpdateLead,
    };
    const propertyActions = {
      onEditProperty: setPropertyToEdit,
      onDeleteProperty: (prop: Property) => setItemToDelete({ type: 'property', id: prop.id, name: prop.title }),
    };

    switch (activePage) {
      case 'Dashboard':
        return <Dashboard 
                  leads={leads} 
                  tasks={tasks}
                  statCardConfig={statCardConfig}
                  onStatCardConfigChange={handleStatCardConfigChange}
                  {...leadActions} 
                />;
      case 'Leads':
        return <LeadsPage leads={leads} {...leadActions} />;
      case 'Properties':
        return <PropertiesPage 
                  properties={properties} 
                  onAddProperty={() => setIsAddPropertyModalOpen(true)}
                  {...propertyActions}
                />;
      case 'Reports':
        return <ReportsPage leads={leads} tasks={tasks} />;
      case 'Calendar':
        return <CalendarPage tasks={tasks} onDayClick={handleDayClick} leads={leads} />;
      case 'Map':
        return <MapPage properties={properties} />;
      case 'Settings':
        return <SettingsPage 
                  profilePicture={profilePicture}
                  onProfilePictureChange={handleProfilePictureChange}
                  metaSettings={metaSettings}
                  onMetaConnect={handleMetaConnection}
                  onMetaDisconnect={handleMetaDisconnection}
                />;
      default:
        return <Dashboard 
                  leads={leads} 
                  tasks={tasks}
                  statCardConfig={statCardConfig}
                  onStatCardConfigChange={handleStatCardConfigChange}
                  {...leadActions} 
                />;
    }
  };

  return (
    <>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <Sidebar activePage={activePage} onNavigate={setActivePage} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            onAddNewLead={() => setIsAddLeadModalOpen(true)} 
            profilePicture={profilePicture}
            theme={theme}
            onThemeChange={handleThemeChange}
          />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
            <div className="container mx-auto px-6 py-8">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
      
      {/* Modals */}
      {isAddLeadModalOpen && <AddLeadModal onAddLead={handleAddLead} onClose={closeAllModals} />}
      {leadToEdit && <EditLeadModal lead={leadToEdit} onUpdateLead={handleUpdateLead} onClose={closeAllModals} />}
      
      {isAddPropertyModalOpen && <AddPropertyModal onAddProperty={handleAddProperty} onClose={closeAllModals} />}
      {propertyToEdit && <EditPropertyModal property={propertyToEdit} onUpdateProperty={handleUpdateProperty} onClose={closeAllModals} />}
      
      {isDayDetailModalOpen && (
        <DayDetailModal
          date={selectedDate}
          tasks={tasks.filter(t => t.date === selectedDate)}
          leads={leads}
          onClose={closeAllModals}
          onAddTask={() => handleOpenTaskModal(undefined, selectedDate)}
          onEditTask={(task) => handleOpenTaskModal(task)}
          onDeleteTask={(task) => setItemToDelete({ type: 'task', id: task.id, name: `${task.title} com ${leads.find(l=>l.id===task.leadId)?.name || 'Lead'}`})}
        />
      )}
      
      {isTaskModalOpen && (
        <TaskModal
            leads={leads}
            onSave={handleSaveTask}
            onClose={closeAllModals}
            taskToEdit={taskToEdit}
            selectedDate={selectedDate}
            leadForScheduling={leadForTaskScheduling}
        />
      )}

      {itemToDelete && (
        <ConfirmDeleteModal 
          title={`Confirmar Exclusão de ${itemToDelete.type === 'lead' ? 'Lead' : itemToDelete.type === 'property' ? 'Imóvel' : 'Tarefa'}`}
          message={`Você tem certeza que deseja excluir "${itemToDelete.name}"?`}
          onConfirm={handleDeleteConfirmed} 
          onClose={closeAllModals} 
        />
      )}
    </>
  );
};

export default App;