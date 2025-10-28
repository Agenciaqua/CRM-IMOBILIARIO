import React, { useState, useEffect } from 'react';
import { Lead, Task, TaskType, TaskTypeLabels } from '../types';
import { XIcon, CalendarIcon, PhoneIcon, SignatureIcon, DollarSignIcon } from './icons';

interface TaskModalProps {
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'title'> & { id?: string }) => void;
  leads: Lead[];
  taskToEdit?: Task | null;
  selectedDate?: string;
  leadForScheduling?: Lead | null;
}

const typeIcons: Record<TaskType, React.ReactNode> = {
  [TaskType.VISIT]: <CalendarIcon className="w-6 h-6 text-green-500 mr-3" />,
  [TaskType.CALL]: <PhoneIcon className="w-6 h-6 text-blue-500 mr-3" />,
  [TaskType.CONTRACT_SIGNING]: <SignatureIcon className="w-6 h-6 text-purple-500 mr-3" />,
  [TaskType.PAYMENT_FOLLOW_UP]: <DollarSignIcon className="w-6 h-6 text-yellow-500 mr-3" />,
};

export const TaskModal: React.FC<TaskModalProps> = ({ onClose, onSave, leads, taskToEdit, selectedDate, leadForScheduling }) => {
  const [formData, setFormData] = useState({
    id: taskToEdit?.id,
    date: taskToEdit?.date || selectedDate || new Date().toISOString().split('T')[0],
    time: taskToEdit?.time || '10:00',
    notes: taskToEdit?.notes || '',
    type: taskToEdit?.type || TaskType.VISIT,
    leadId: taskToEdit?.leadId || leadForScheduling?.id || '',
  });

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        id: taskToEdit.id,
        date: taskToEdit.date,
        time: taskToEdit.time,
        notes: taskToEdit.notes || '',
        type: taskToEdit.type,
        leadId: taskToEdit.leadId,
      });
    }
  }, [taskToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.time || !formData.leadId) {
      alert('Por favor, preencha a data, hora e selecione um lead.');
      return;
    }
    onSave(formData);
  };
  
  const leadName = leads.find(l => l.id === formData.leadId)?.name;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            {typeIcons[formData.type]}
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {taskToEdit ? 'Editar Tarefa' : 'Agendar Nova Tarefa'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <XIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="leadId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lead</label>
              <select 
                id="leadId"
                name="leadId"
                value={formData.leadId}
                onChange={handleChange}
                required
                disabled={!!leadForScheduling}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 disabled:bg-gray-100 dark:disabled:bg-gray-700/50"
              >
                <option value="" disabled>Selecione um lead</option>
                {leads.map(lead => (
                  <option key={lead.id} value={lead.id}>{lead.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Tarefa</label>
              <select 
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              >
                {Object.entries(TaskTypeLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data</label>
                    <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-gray-200" />
                </div>
                <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hora</label>
                    <input type="time" name="time" id="time" value={formData.time} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-gray-200" />
                </div>
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notas (Opcional)</label>
              <textarea name="notes" id="notes" value={formData.notes} onChange={handleChange} rows={3}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-gray-200"
                placeholder="Ex: Encontrar na portaria, levar chaves da unidade 101..."
              />
            </div>
          </div>
          <div className="flex justify-end items-center p-5 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-lg space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:text-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Salvar Tarefa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};