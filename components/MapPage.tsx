import React from 'react';
import { Property } from '../types';
import { MapComponent } from './MapComponent';

interface MapPageProps {
  properties: Property[];
}

export const MapPage: React.FC<MapPageProps> = ({ properties }) => {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">Mapa de Imóveis</h1>
      <p className="mt-1 text-gray-600 dark:text-gray-400">Visualize a localização dos seus imóveis.</p>
      <div className="mt-6">
        <MapComponent properties={properties} />
      </div>
    </div>
  );
};