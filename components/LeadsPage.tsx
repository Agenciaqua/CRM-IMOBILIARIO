import React, { useState, useMemo } from 'react';
import { Lead, PipelineStatus } from '../types';
import { EditIcon, TrashIcon } from './icons';

interface LeadsPageProps {
  leads: Lead[];
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (lead: Lead) => void;
  onUpdateLead: (lead: Lead) => void;
}

const statusColors: Record<string, string> = {
  'Novos Leads': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  'Contactado': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
  'Visita Agendada': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  'Proposta Enviada': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  'Fechado': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
};

export const LeadsPage: React.FC<LeadsPageProps> = ({ leads, onEditLead, onDeleteLead, onUpdateLead }) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleStatusChange = (leadId: string, newStatus: PipelineStatus) => {
    const leadToUpdate = leads.find(l => l.id === leadId);
    if (leadToUpdate) {
      const updatedLead = {
        ...leadToUpdate,
        status: newStatus,
        lastContact: new Date().toISOString().split('T')[0],
      };
      onUpdateLead(updatedLead);
    }
  };

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      if (statusFilter !== 'all' && lead.status !== statusFilter) return false;
      
      if (startDate || endDate) {
        const leadDate = new Date(lead.lastContact);
        leadDate.setMinutes(leadDate.getMinutes() + leadDate.getTimezoneOffset());
        if (startDate) {
          const filterStartDate = new Date(startDate);
          filterStartDate.setMinutes(filterStartDate.getMinutes() + filterStartDate.getTimezoneOffset());
          if (leadDate < filterStartDate) return false;
        }
        if (endDate) {
          const filterEndDate = new Date(endDate);
          filterEndDate.setMinutes(filterEndDate.getMinutes() + filterEndDate.getTimezoneOffset());
          if (leadDate > filterEndDate) return false;
        }
      }
      return true;
    });
  }, [leads, statusFilter, startDate, endDate]);

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">Leads & Clientes</h1>

      <div className="my-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex flex-col md:flex-row gap-4 items-center border border-gray-200 dark:border-gray-700">
        <div className="w-full md:w-auto">
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
          <select 
            id="status-filter" 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          >
            <option value="all">Todos os Status</option>
            {Object.values(PipelineStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-auto">
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">De</label>
          <input 
            type="date" id="start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>
        <div className="w-full md:w-auto">
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Até</label>
          <input 
            type="date" id="end-date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>
      </div>
      
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr className="text-left font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-3">Nome</th>
                <th className="px-6 py-3">Contato</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Imóvel de Interesse</th>
                <th className="px-6 py-3">Último Contato</th>
                <th className="px-6 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLeads.length > 0 ? (
                filteredLeads.map(lead => (
                  <tr key={lead.id} className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4"><div className="font-medium text-gray-900 dark:text-gray-100">{lead.name}</div></td>
                    <td className="px-6 py-4"><div>{lead.email}</div><div className="text-sm text-gray-500 dark:text-gray-400">{lead.phone}</div></td>
                    <td className="px-6 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as PipelineStatus)}
                        className={`px-2 py-1 text-xs font-semibold leading-tight rounded-full border-0 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none appearance-none cursor-pointer ${statusColors[lead.status]}`}
                      >
                        {Object.values(PipelineStatus).map(status => (
                          <option key={status} value={status} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 font-medium">
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">{lead.propertyOfInterest.title}</td>
                    <td className="px-6 py-4 text-sm">{new Date(lead.lastContact).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => onEditLead(lead)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                           <EditIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => onDeleteLead(lead)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                           <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 px-6 text-gray-500 dark:text-gray-400">Nenhum lead encontrado com os filtros selecionados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};