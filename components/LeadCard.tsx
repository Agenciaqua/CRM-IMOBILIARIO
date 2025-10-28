import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Lead, Task } from '../types';
import { PhoneIcon, MessageSquareIcon, CalendarIcon, WandSparklesIcon, MoreVerticalIcon, EditIcon, TrashIcon, ClockIcon, AlertTriangleIcon } from './icons';
import { SmartActionModal } from './SmartActionModal';

interface LeadCardProps {
  lead: Lead;
  tasks: Task[];
  onScheduleTask: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, tasks, onScheduleTask, onEdit, onDelete }) => {
  const [isSmartActionModalOpen, setIsSmartActionModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const attentionIndicator = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to the start of the day

    const hasOverdueTask = tasks.some(task => {
        // FIX: The Task type uses `leadId`, not `leadName`. Compare against the lead's `id`.
        if (task.leadId !== lead.id) return false;
        const taskDate = new Date(task.date);
        // Add timezone offset to compare correctly
        taskDate.setMinutes(taskDate.getMinutes() + taskDate.getTimezoneOffset());
        return taskDate < today;
    });

    if (hasOverdueTask) {
        return (
            <span title="Tarefa Atrasada!">
                <ClockIcon className="w-5 h-5 text-red-500 ml-2" />
            </span>
        );
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    const lastContactDate = new Date(lead.lastContact);
    
    if (lastContactDate < sevenDaysAgo) {
        return (
            <span title="Necessita Follow-up!">
                <AlertTriangleIcon className="w-5 h-5 text-yellow-500 ml-2" />
            </span>
        );
    }

    return null;
  }, [lead, tasks]);

  // Sanitize phone number for tel: link
  const sanitizedPhone = lead.phone.replace(/\D/g, '');

  return (
    <>
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <p className="text-md font-bold text-gray-800 dark:text-gray-100">{lead.name}</p>
            {attentionIndicator}
          </div>
          <div className="relative" ref={menuRef}>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full">
              <MoreVerticalIcon className="w-5 h-5" />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-600">
                <ul className="py-1">
                  <li>
                    <button onClick={() => { onEdit(lead); setIsMenuOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                      <EditIcon className="w-4 h-4 mr-3" /> Editar
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { onDelete(lead); setIsMenuOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/20">
                      <TrashIcon className="w-4 h-4 mr-3" /> Excluir
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{lead.propertyOfInterest.title}</p>
        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-2">
          R$ {lead.propertyOfInterest.price.toLocaleString('pt-BR')}
        </p>
        
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex space-x-2">
            <a href={`tel:${sanitizedPhone}`} title="Ligar" className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <PhoneIcon className="w-4 h-4" />
            </a>
            <a href={`mailto:${lead.email}`} title="Enviar Mensagem" className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <MessageSquareIcon className="w-4 h-4" />
            </a>
            <button title="Agendar Tarefa" onClick={() => onScheduleTask(lead)} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <CalendarIcon className="w-4 h-4" />
            </button>
          </div>
          <button 
            onClick={() => setIsSmartActionModalOpen(true)}
            className="flex items-center px-3 py-1 text-xs font-medium text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-full hover:from-purple-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105"
          >
            <WandSparklesIcon className="w-4 h-4 mr-1.5" />
            Ação Rápida
          </button>
        </div>
      </div>
      {isSmartActionModalOpen && <SmartActionModal lead={lead} onClose={() => setIsSmartActionModalOpen(false)} />}
    </>
  );
};
