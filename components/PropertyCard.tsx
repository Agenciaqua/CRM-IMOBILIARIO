import React, { useState, useRef, useEffect } from 'react';
import { Property } from '../types';
import { BedIcon, BathIcon, SquareMetreIcon, ChevronDownIcon, MoreVerticalIcon, EditIcon, TrashIcon, CheckIcon } from './icons';

interface PropertyCardProps {
  property: Property;
  onEdit: (property: Property) => void;
  onDelete: (property: Property) => void;
}

const DetailItem: React.FC<{ icon: React.ReactNode; value: React.ReactNode }> = ({ icon, value }) => (
  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
    {icon}
    <span className="ml-1.5">{value}</span>
  </div>
);

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <div className="relative">
        <img src={property.imageUrl} alt={property.title} className="w-full h-48 object-cover" />
        <div className="absolute top-2 right-2" ref={menuRef}>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 bg-black bg-opacity-40 rounded-full text-white hover:bg-opacity-60">
            <MoreVerticalIcon className="w-5 h-5" />
          </button>
          {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-600">
                <ul className="py-1">
                  <li>
                    <button onClick={() => { onEdit(property); setIsMenuOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                      <EditIcon className="w-4 h-4 mr-3" /> Editar
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { onDelete(property); setIsMenuOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/20">
                      <TrashIcon className="w-4 h-4 mr-3" /> Excluir
                    </button>
                  </li>
                </ul>
              </div>
            )}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">{property.type}</p>
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 truncate flex-grow" title={property.title}>{property.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{property.address.city}, {property.address.state}</p>
        <p className="text-xl font-semibold text-blue-600 dark:text-blue-400 mt-2">
          R$ {property.price.toLocaleString('pt-BR')}
        </p>
      </div>
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <DetailItem icon={<BedIcon className="w-5 h-5" />} value={property.bedrooms} />
        <DetailItem icon={<BathIcon className="w-5 h-5" />} value={property.bathrooms} />
        <DetailItem icon={<SquareMetreIcon className="w-5 h-5" />} value={<>{property.area} m²</>} />
      </div>
      
      {/* Expandable Section */}
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1000px]' : 'max-h-0'}`}>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Descrição</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{property.description}</p>
          
          <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Comodidades</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-4">
            {property.amenities.map(amenity => (
              <div key={amenity} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                <span>{amenity}</span>
              </div>
            ))}
          </div>

          <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Galeria</h4>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {property.gallery.map((img, index) => (
              <img key={index} src={img} alt={`Galeria ${index+1}`} className="w-24 h-20 object-cover rounded-md flex-shrink-0" />
            ))}
          </div>
        </div>
      </div>

      <button 
        onClick={() => setIsExpanded(!isExpanded)} 
        className="w-full py-2 text-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700"
      >
        <ChevronDownIcon className={`w-6 h-6 mx-auto transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
};