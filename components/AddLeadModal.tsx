import React, { useState } from 'react';
import { Lead } from '../types';
import { XIcon, UsersIcon } from './icons';

interface AddLeadModalProps {
  onClose: () => void;
  onAddLead: (leadData: Omit<Lead, 'id' | 'status' | 'lastContact' | 'propertyOfInterest'>) => void;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({ onClose, onAddLead }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [clientNeeds, setClientNeeds] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Nome e E-mail são obrigatórios.');
      return;
    }
    onAddLead({ name, email, phone, clientNeeds });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <UsersIcon className="w-6 h-6 text-blue-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Adicionar Novo Lead</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <XIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome Completo</label>
              <input 
                type="text" 
                id="name" 
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-gray-200"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-mail</label>
              <input 
                type="email" 
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-gray-200"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Telefone</label>
              <input 
                type="tel" 
                id="phone"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-gray-200"
              />
            </div>
            <div>
              <label htmlFor="clientNeeds" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Necessidades do Cliente</label>
              <textarea 
                id="clientNeeds"
                value={clientNeeds}
                onChange={e => setClientNeeds(e.target.value)}
                rows={3}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-gray-200"
                placeholder="Ex: Procura apartamento de 3 quartos na zona sul..."
              />
            </div>
          </div>

          <div className="flex justify-end items-center p-5 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-lg space-x-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:text-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Salvar Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};