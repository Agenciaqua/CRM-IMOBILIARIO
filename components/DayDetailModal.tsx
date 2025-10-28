import React from 'react';
import { Task, Lead } from '../types';
import { XIcon, CalendarDaysIcon, PlusIcon, EditIcon, TrashIcon } from './icons';
import { AgendaItem } from './AgendaItem';

interface DayDetailModalProps {
  date: string;
  tasks: Task[];
  leads: Lead[];
  onClose: () => void;
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({ date, tasks, leads, onClose, onAddTask, onEditTask, onDeleteTask }) => {
  const formattedDate = new Date(date).toLocaleDateString('pt-BR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <CalendarDaysIcon className="w-6 h-6 text-blue-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 capitalize">{formattedDate}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <XIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {tasks.length > 0 ? (
            <div className="space-y-2">
              {tasks.sort((a,b) => a.time.localeCompare(b.time)).map(task => (
                <div key={task.id} className="flex items-center group">
                  <div className="flex-grow">
                    <AgendaItem task={task} leads={leads} />
                  </div>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEditTask(task)} title="Editar Tarefa" className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                      <EditIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => onDeleteTask(task)} title="Excluir Tarefa" className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">Nenhuma tarefa agendada para este dia.</p>
          )}
        </div>

        <div className="flex justify-end items-center p-5 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
          <button 
            type="button"
            onClick={onAddTask}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Adicionar Nova Tarefa
          </button>
        </div>
      </div>
    </div>
  );
};