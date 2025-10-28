import React, { useState } from 'react';
import { Lead, Task, PipelineStatus, StatCardConfig, StatCardId, TrendData, IconId } from '../types';
import { StatCard } from './StatCard';
import { AgendaItem } from './AgendaItem';
import { PipelineColumn } from './PipelineColumn';
import { SlidersHorizontalIcon, UsersIcon, CalendarIcon, MessageSquareIcon, FileTextIcon, HandshakeIcon, TargetIcon } from './icons';
import { CustomizeDashboardModal } from './CustomizeDashboardModal';

interface DashboardProps {
  leads: Lead[];
  tasks: Task[]; // Receives all tasks now
  statCardConfig: StatCardConfig[];
  onStatCardConfigChange: (newConfig: StatCardConfig[]) => void;
  onScheduleTask: (lead: Lead) => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (lead: Lead) => void;
}

const pipelineOrder: PipelineStatus[] = [
  PipelineStatus.NEW,
  PipelineStatus.CONTACTED,
  PipelineStatus.VISIT_SCHEDULED,
  PipelineStatus.PROPOSAL,
  PipelineStatus.CLOSED,
];

const previousWeekData = {
  newLeads: 5,
  visitsToday: 1,
  followUps: 4,
  proposalsSent: 3,
  dealsClosed: 1,
  conversionRate: 15, // as a percentage
};

// This map is the key to making localStorage persistence work with icons
const iconMap: Record<IconId, React.ReactNode> = {
  UsersIcon: <UsersIcon className="w-8 h-8 text-blue-500" />,
  CalendarIcon: <CalendarIcon className="w-8 h-8 text-green-500" />,
  MessageSquareIcon: <MessageSquareIcon className="w-8 h-8 text-yellow-500" />,
  FileTextIcon: <FileTextIcon className="w-8 h-8 text-indigo-500" />,
  HandshakeIcon: <HandshakeIcon className="w-8 h-8 text-emerald-500" />,
  TargetIcon: <TargetIcon className="w-8 h-8 text-rose-500" />,
};

export const Dashboard: React.FC<DashboardProps> = ({ leads, tasks, statCardConfig, onStatCardConfigChange, onScheduleTask, onEditLead, onDeleteLead }) => {
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  
  const getStatValue = (id: StatCardId): number => {
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter(t => t.date === today);
    const closedDeals = leads.filter(lead => lead.status === PipelineStatus.CLOSED).length;

    switch (id) {
      case 'newLeads':
        return leads.filter(lead => lead.status === PipelineStatus.NEW).length;
      case 'visitsToday':
        return todayTasks.filter(task => task.type === 'VISIT').length;
      case 'followUps':
        return todayTasks.filter(task => task.type !== 'VISIT').length;
      case 'proposalsSent':
        return leads.filter(lead => lead.status === PipelineStatus.PROPOSAL).length;
      case 'dealsClosed':
        return closedDeals;
      case 'conversionRate':
        if (leads.length === 0) return 0;
        return (closedDeals / leads.length) * 100;
      default:
        return 0;
    }
  };

  const calculateTrend = (currentValue: number, previousValue: number): TrendData => {
    if (previousValue === 0) {
      return { direction: currentValue > 0 ? 'up' : 'neutral', change: currentValue > 0 ? 100 : 0 };
    }
    const change = ((currentValue - previousValue) / previousValue) * 100;
    return {
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
      change: Math.abs(change),
    };
  };

  const visibleStatCards = statCardConfig.filter(card => card.isVisible);
  const todayTasks = tasks.filter(t => t.date === new Date().toISOString().split('T')[0]);

  return (
    <>
      <div>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">Dashboard</h1>
          <button 
            onClick={() => setIsCustomizeModalOpen(true)}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-white dark:text-gray-300 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <SlidersHorizontalIcon className="w-5 h-5 mr-2" />
            Personalizar
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleStatCards.map(card => {
            const currentValue = getStatValue(card.id);
            const previousValue = previousWeekData[card.id];
            const trend = calculateTrend(currentValue, previousValue);
             return (
               <StatCard 
                key={card.id} 
                title={card.title} 
                value={card.id === 'conversionRate' ? `${currentValue.toFixed(1)}%` : currentValue.toString()} 
                icon={iconMap[card.icon]} 
                trend={trend}
              />
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 mt-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Agenda do Dia</h2>
            <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-4">
              {todayTasks.length > 0 ? (
                // FIX: Pass the `leads` prop to AgendaItem as it's required to look up lead names.
                todayTasks.map(task => <AgendaItem key={task.id} task={task} leads={leads} />)
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Nenhuma tarefa para hoje.</p>
              )}
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-2">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Atividade Recente</h2>
              <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                  <p className="text-gray-500 dark:text-gray-400">Feed de atividades em breve.</p>
              </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Funil de Vendas</h2>
          <div className="w-full overflow-x-auto pb-4">
            <div className="inline-grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 min-w-max">
              {pipelineOrder.map(status => (
                <PipelineColumn
                  key={status}
                  status={status}
                  leads={leads.filter(lead => lead.status === status)}
                  tasks={tasks} // Pass all tasks down
                  onScheduleTask={onScheduleTask}
                  onEditLead={onEditLead}
                  onDeleteLead={onDeleteLead}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {isCustomizeModalOpen && (
        <CustomizeDashboardModal
          config={statCardConfig}
          onSave={onStatCardConfigChange}
          onClose={() => setIsCustomizeModalOpen(false)}
        />
      )}
    </>
  );
};
