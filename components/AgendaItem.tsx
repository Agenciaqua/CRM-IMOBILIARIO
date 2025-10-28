import React from 'react';
import { Task, TaskType, Lead } from '../types';
import { CalendarIcon, PhoneIcon, SignatureIcon, DollarSignIcon } from './icons';

const typeIcons: Record<TaskType, React.ReactNode> = {
  [TaskType.VISIT]: <CalendarIcon className="w-5 h-5 text-green-500" />,
  [TaskType.CALL]: <PhoneIcon className="w-5 h-5 text-blue-500" />,
  [TaskType.CONTRACT_SIGNING]: <SignatureIcon className="w-5 h-5 text-purple-500" />,
  [TaskType.PAYMENT_FOLLOW_UP]: <DollarSignIcon className="w-5 h-5 text-yellow-500" />,
};

interface AgendaItemProps {
  task: Task;
  leads: Lead[];
}

export const AgendaItem: React.FC<AgendaItemProps> = ({ task, leads }) => {
  const leadName = leads.find(l => l.id === task.leadId)?.name || 'Lead Desconhecido';
  
  return (
    <div className="flex items-start p-3 -mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
        {typeIcons[task.type]}
      </div>
      <div className="ml-4 flex-1">
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{task.title}</p>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{task.time}</p>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">com {leadName}</p>
        {task.notes && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 italic truncate" title={task.notes}>
            Nota: {task.notes}
          </p>
        )}
      </div>
    </div>
  );
};