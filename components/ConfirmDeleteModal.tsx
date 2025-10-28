import React from 'react';
import { XIcon, TrashIcon } from './icons';

interface ConfirmDeleteModalProps {
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ title, message, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <TrashIcon className="w-6 h-6 text-red-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <XIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <div className="p-6">
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{message}</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Esta ação não pode ser desfeita.
            </p>
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
                type="button"
                onClick={onConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
                Sim, Excluir
            </button>
        </div>
      </div>
    </div>
  );
};