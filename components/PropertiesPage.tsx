import React from 'react';
import { Property } from '../types';
import { PropertyCard } from './PropertyCard';
import { PlusIcon } from './icons';

interface PropertiesPageProps {
  properties: Property[];
  onAddProperty: () => void;
  onEditProperty: (property: Property) => void;
  onDeleteProperty: (property: Property) => void;
}

export const PropertiesPage: React.FC<PropertiesPageProps> = ({ properties, onAddProperty, onEditProperty, onDeleteProperty }) => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">Imóveis</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Aqui está o seu catálogo de imóveis cadastrados.</p>
        </div>
        <button
          onClick={onAddProperty}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Adicionar Imóvel
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
        {properties.map(prop => (
          <PropertyCard 
            key={prop.id} 
            property={prop}
            onEdit={onEditProperty}
            onDelete={onDeleteProperty}
          />
        ))}
      </div>
    </div>
  );
};