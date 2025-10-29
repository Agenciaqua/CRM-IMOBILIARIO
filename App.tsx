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
import { useDatabase } from './hooks/useDatabase';

const initialStatCardConfig: StatCardConfig[] = [
  { id: 'newLeads', title: 'Novos Leads', isVisible: true, icon: 'UsersIcon' },
  { id: 'visitsToday', title: 'Visitas Hoje', isVisible: true, icon: 'CalendarIcon' },
  { id: 'followUps', title: 'Follow-ups Pendentes', isVisible: true, icon: 'MessageSquareIcon' },
  { id: 'proposalsSent', title: 'Propostas Enviadas', isVisible: true, icon: 'FileTextIcon' },
  { id: 'dealsClosed', title: 'Negócios Fechados', isVisible: true, icon: 'HandshakeIcon' },
  { id: 'conversionRate', title: 'Taxa de Conversão', isVisible: true, icon: 'TargetIcon' },
];

const App: React.FC = () => {
  const db = useDatabase();
  const [activePage, setActivePage] = useState('Dashboard');

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

  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'lead' | 'property' | 'task', id: string, name: string } | null>(null);

  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);

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

  const handleMetaConnection = (settings: MetaSettings) => {
    const newSettings = { ...settings, isConnected: true };
    setMetaSettings(newSettings);
    localStorage.setItem('realtyflow-meta-settings', JSON.stringify(newSettings));

    const newLeadFromMeta = {
      name: 'Lead de Teste (Meta Ads)',
      phone: '(41) 91234-5678',
      email: `meta.lead.${Date.now()}@example.com`,
      clientNeeds: 'Interessado em imóveis anunciados no Facebook.',
      source: 'Meta Ads',
      agent: 'Não Atribuído'
    };

    db.addLead(newLeadFromMeta).catch(err => console.error('Error adding Meta lead:', err));
    alert('Conexão salva e testada com sucesso! Um lead de exemplo foi adicionado.');
  };

  const handleMetaDisconnection = () => {
    const newSettings = { pageId: '', formId: '', accessToken: '', isConnected: false };
    setMetaSettings(newSettings);
    localStorage.removeItem('realtyflow-meta-settings');
  };

  const handleAddLead = async (newLeadData: Omit<Lead, 'id' | 'status' | 'lastContact' | 'propertyOfInterest'>) => {
    try {
      await db.addLead(newLeadData);
      closeAllModals();
    } catch (err) {
      alert('Erro ao adicionar lead. Tente novamente.');
    }
  };

  const handleUpdateLead = async (updatedLead: Lead) => {
    try {
      await db.updateLead(updatedLead);
      closeAllModals();
    } catch (err) {
      alert('Erro ao atualizar lead. Tente novamente.');
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!itemToDelete) return;
    try {
      if (itemToDelete.type === 'lead') {
        await db.deleteLead(itemToDelete.id);
      } else if (itemToDelete.type === 'property') {
        await db.deleteProperty(itemToDelete.id);
      } else if (itemToDelete.type === 'task') {
        await db.deleteTask(itemToDelete.id);
      }
      closeAllModals();
    } catch (err) {
      alert('Erro ao excluir. Tente novamente.');
    }
  };

  const handleDayClick = (date: string) => {
    setSelectedDate(date);
    setIsDayDetailModalOpen(true);
  };

  const handleOpenTaskModal = (task?: Task, date?: string) => {
    setTaskToEdit(task || null);
    setSelectedDate(date || task?.date || new Date().toISOString().split('T')[0]);
    setIsDayDetailModalOpen(false);
    setIsTaskModalOpen(true);
  };

  const handleOpenTaskModalForLead = (lead: Lead) => {
    setLeadForTaskScheduling(lead);
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (taskData: Omit<Task, 'title'> & { id?: string }) => {
    const lead = db.leads.find(l => l.id === taskData.leadId);
    if (!lead) return;

    try {
      if (taskData.id) {
        const updatedTask: Task = { ...taskData, id: taskData.id, title: TaskTypeLabels[taskData.type] };
        await db.updateTask(updatedTask);
      } else {
        await db.addTask({
          ...taskData,
          title: TaskTypeLabels[taskData.type],
        });
      }

      if (taskData.type === TaskType.VISIT) {
        await db.updateLead({
          ...lead,
          status: PipelineStatus.VISIT_SCHEDULED,
          lastContact: new Date().toISOString().split('T')[0]
        });
      } else {
        await db.updateLead({
          ...lead,
          lastContact: new Date().toISOString().split('T')[0]
        });
      }

      closeAllModals();
    } catch (err) {
      alert('Erro ao salvar tarefa. Tente novamente.');
    }
  };

  const handleAddProperty = async (newPropertyData: Omit<Property, 'id'>) => {
    try {
      await db.addProperty(newPropertyData);
      closeAllModals();
    } catch (err) {
      alert('Erro ao adicionar imóvel. Tente novamente.');
    }
  };

  const handleUpdateProperty = async (updatedProperty: Property) => {
    try {
      await db.updateProperty(updatedProperty);
      closeAllModals();
    } catch (err) {
      alert('Erro ao atualizar imóvel. Tente novamente.');
    }
  };

  if (db.loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (db.error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <p className="text-red-600 dark:text-red-400 mb-4">Erro ao carregar dados: {db.error}</p>
          <button
            onClick={() => db.refreshData()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

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
                  leads={db.leads}
                  tasks={db.tasks}
                  statCardConfig={statCardConfig}
                  onStatCardConfigChange={handleStatCardConfigChange}
                  {...leadActions}
                />;
      case 'Leads':
        return <LeadsPage leads={db.leads} {...leadActions} />;
      case 'Properties':
        return <PropertiesPage
                  properties={db.properties}
                  onAddProperty={() => setIsAddPropertyModalOpen(true)}
                  {...propertyActions}
                />;
      case 'Reports':
        return <ReportsPage leads={db.leads} tasks={db.tasks} />;
      case 'Calendar':
        return <CalendarPage tasks={db.tasks} onDayClick={handleDayClick} leads={db.leads} />;
      case 'Map':
        return <MapPage properties={db.properties} />;
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
                  leads={db.leads}
                  tasks={db.tasks}
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

      {isAddLeadModalOpen && <AddLeadModal onAddLead={handleAddLead} onClose={closeAllModals} />}
      {leadToEdit && <EditLeadModal lead={leadToEdit} onUpdateLead={handleUpdateLead} onClose={closeAllModals} />}

      {isAddPropertyModalOpen && <AddPropertyModal onAddProperty={handleAddProperty} onClose={closeAllModals} />}
      {propertyToEdit && <EditPropertyModal property={propertyToEdit} onUpdateProperty={handleUpdateProperty} onClose={closeAllModals} />}

      {isDayDetailModalOpen && (
        <DayDetailModal
          date={selectedDate}
          tasks={db.tasks.filter(t => t.date === selectedDate)}
          leads={db.leads}
          onClose={closeAllModals}
          onAddTask={() => handleOpenTaskModal(undefined, selectedDate)}
          onEditTask={(task) => handleOpenTaskModal(task)}
          onDeleteTask={(task) => setItemToDelete({ type: 'task', id: task.id, name: `${task.title} com ${db.leads.find(l=>l.id===task.leadId)?.name || 'Lead'}`})}
        />
      )}

      {isTaskModalOpen && (
        <TaskModal
            leads={db.leads}
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
