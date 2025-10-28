import React, { useState, useRef } from 'react';
import { StatCardConfig } from '../types';
import { XIcon, SlidersHorizontalIcon, GripVerticalIcon } from './icons';

interface CustomizeDashboardModalProps {
  config: StatCardConfig[];
  onClose: () => void;
  onSave: (newConfig: StatCardConfig[]) => void;
}

export const CustomizeDashboardModal: React.FC<CustomizeDashboardModalProps> = ({ config, onClose, onSave }) => {
  const [localConfig, setLocalConfig] = useState<StatCardConfig[]>(config);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleVisibilityChange = (id: string, isVisible: boolean) => {
    setLocalConfig(prev =>
      prev.map(card => (card.id === id ? { ...card, isVisible } : card))
    );
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragItem.current = position;
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragOverItem.current = position;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const configCopy = [...localConfig];
    const dragItemContent = configCopy[dragItem.current];
    configCopy.splice(dragItem.current, 1);
    configCopy.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setLocalConfig(configCopy);
  };

  const handleSave = () => {
    onSave(localConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <SlidersHorizontalIcon className="w-6 h-6 text-blue-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Personalizar Painel</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <XIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <div className="p-6">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Selecione os cards que deseja exibir e arraste para reordenar.</p>
            <div className="space-y-2">
                {localConfig.map((card, index) => (
                    <div 
                        key={card.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragEnter={(e) => handleDragEnter(e, index)}
                        onDragEnd={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        <div className="flex items-center">
                            <GripVerticalIcon className="w-5 h-5 text-gray-400 dark:text-gray-500 cursor-grab mr-3" />
                            <input
                                type="checkbox"
                                id={`card-toggle-${card.id}`}
                                checked={card.isVisible}
                                onChange={(e) => handleVisibilityChange(card.id, e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 dark:border-gray-500 text-blue-600 focus:ring-blue-500 bg-gray-100 dark:bg-gray-600"
                            />
                            <label htmlFor={`card-toggle-${card.id}`} className="ml-3 text-sm font-medium text-gray-800 dark:text-gray-200">
                                {card.title}
                            </label>
                        </div>
                    </div>
                ))}
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
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};