import React from 'react';
import { Task, TaskType, TaskTypeLabels, Lead } from '../types';

interface TaskPillProps {
  task: Task;
  leads: Lead[];
}

const typeColors: Record<TaskType, string> = {
  [TaskType.VISIT]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  [TaskType.CALL]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  [TaskType.CONTRACT_SIGNING]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
  [TaskType.PAYMENT_FOLLOW_UP]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
};

export const TaskPill: React.FC<TaskPillProps> = ({ task, leads }) => {
  const leadName = leads.find(l => l.id === task.leadId)?.name || 'Lead Desconhecido';
  const title = `${TaskTypeLabels[task.type]} com ${leadName} às ${task.time}${task.notes ? `\nNota: ${task.notes}` : ''}`;

  return (
    <div
      className={`px-2 py-1 text-xs font-semibold rounded-md w-full truncate ${typeColors[task.type]}`}
      title={title}
    >
      <span className="font-bold">{task.time}</span> - {leadName}
    </div>
  );
};