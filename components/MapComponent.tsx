import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Property } from '../types';
import { LoaderCircleIcon, AlertTriangleIcon } from './icons';

interface MapComponentProps {
  properties: Property[];
}

const containerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '0.5rem',
};

const center = {
  lat: -23.56,
  lng: -46.65
};

// This is the correct API key for Google Maps, as provided by the user.
// The process.env.API_KEY is for the Gemini API and causes an InvalidKeyMapError.
const MAPS_API_KEY = 'AIzaSyDaT39-uIS-spKVpFiZvyo-6-S9I9bg6nI';

// Dark theme styles for Google Maps
const mapDarkStyle = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    },
];

export const MapComponent: React.FC<MapComponentProps> = ({ properties }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: MAPS_API_KEY
  });

  const [activeProperty, setActiveProperty] = useState<Property | null>(null);
  
  const handleMarkerClick = (prop: Property) => {
    setActiveProperty(prop);
  };

  const handleCloseClick = () => {
    setActiveProperty(null);
  };
  
  const isDarkMode = document.documentElement.classList.contains('dark');

  if (loadError) {
    return (
        <div className="w-full h-[600px] flex flex-col items-center justify-center bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-300 dark:border-red-700 p-4">
            <AlertTriangleIcon className="w-12 h-12" />
            <h3 className="mt-4 text-xl font-semibold">Ação Necessária: Ativar Faturamento</h3>
            <p className="mt-2 text-center">O mapa não pôde ser carregado porque o faturamento (billing) não está ativado na conta do Google Cloud associada a esta chave de API.</p>
            <p className="mt-2 text-sm text-center font-semibold">
              Por favor, acesse seu <a href="https://console.cloud.google.com/project/_/billing/enable" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300">Google Cloud Console</a>, selecione o projeto correto e ative o faturamento para a API de Mapas.
            </p>
             <p className="mt-1 text-xs text-center text-red-500">(Erro: BillingNotEnabledMapError)</p>
        </div>
    );
  }

  if (!isLoaded) {
    return (
        <div className="w-full h-[600px] flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg">
            <LoaderCircleIcon className="w-12 h-12 text-blue-500" />
            <p className="ml-4 text-lg font-medium text-gray-700 dark:text-gray-200">Carregando Mapa...</p>
        </div>
    );
  }

  return (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onClick={handleCloseClick}
        options={{
            disableDefaultUI: true,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            styles: isDarkMode ? mapDarkStyle : [],
        }}
      >
        {properties.map(prop => (
          prop.latitude && prop.longitude && (
            <Marker
              key={prop.id}
              position={{ lat: prop.latitude, lng: prop.longitude }}
              onClick={() => handleMarkerClick(prop)}
            />
          )
        ))}

        {activeProperty && activeProperty.latitude && activeProperty.longitude && (
          <InfoWindow
            position={{ lat: activeProperty.latitude, lng: activeProperty.longitude }}
            onCloseClick={handleCloseClick}
          >
            <div className="p-1 text-gray-900">
              <h3 className="font-bold text-md">{activeProperty.title}</h3>
              <p className="text-blue-600 font-semibold">
                R$ {activeProperty.price.toLocaleString('pt-BR')}
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
  );
};