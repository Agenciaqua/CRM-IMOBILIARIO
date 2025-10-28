import React from 'react';
import { Lead, PipelineStatus, Task } from '../types';
import { LeadCard } from './LeadCard';

interface PipelineColumnProps {
  status: PipelineStatus;
  leads: Lead[];
  tasks: Task[];
  onScheduleTask: (lead: Lead) => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (lead: Lead) => void;
}

const statusColors: Record<PipelineStatus, string> = {
  [PipelineStatus.NEW]: 'border-t-blue-500',
  [PipelineStatus.CONTACTED]: 'border-t-purple-500',
  [PipelineStatus.VISIT_SCHEDULED]: 'border-t-yellow-500',
  [PipelineStatus.PROPOSAL]: 'border-t-orange-500',
  [PipelineStatus.CLOSED]: 'border-t-green-500',
};

export const PipelineColumn: React.FC<PipelineColumnProps> = ({ status, leads, tasks, onScheduleTask, onEditLead, onDeleteLead }) => {
  return (
    <div className="flex flex-col flex-shrink-0 w-80">
      <div className={`p-4 bg-white dark:bg-gray-800 rounded-t-lg border-t-4 ${statusColors[status]}`}>
        <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 flex justify-between items-center">
          {status}
          <span className="text-sm font-normal bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full px-2 py-1">
            {leads.length}
          </span>
        </h3>
      </div>
      <div className="flex-1 p-2 bg-gray-100 dark:bg-gray-900 rounded-b-lg space-y-4 overflow-y-auto" style={{ minHeight: '200px' }}>
        {leads.map(lead => (
          <LeadCard 
            key={lead.id} 
            lead={lead}
            tasks={tasks} // Pass tasks to each card
            onScheduleTask={onScheduleTask}
            onEdit={onEditLead}
            onDelete={onDeleteLead}
          />
        ))}
      </div>
    </div>
  );
};