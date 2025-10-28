import React from 'react';
import { SearchIcon, BellIcon, PlusIcon, SunIcon, MoonIcon } from './icons';

interface HeaderProps {
  onAddNewLead: () => void;
  profilePicture: string;
  theme: 'light' | 'dark';
  onThemeChange: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddNewLead, profilePicture, theme, onThemeChange }) => {
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
         {/* Hamburger menu for mobile is in Sidebar */}
        <div className="relative hidden md:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </span>
          <input
            className="w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 border border-transparent rounded-lg focus:outline-none focus:bg-white dark:focus:bg-gray-600 focus:border-blue-500"
            type="text"
            placeholder="Buscar leads, imóveis..."
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button 
          onClick={onAddNewLead}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Novo Lead
        </button>

        <button 
          onClick={onThemeChange}
          className="p-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
          title={`Ativar tema ${theme === 'light' ? 'escuro' : 'claro'}`}
        >
          {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
        </button>

        <button className="p-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
          <BellIcon className="w-6 h-6" />
        </button>
        <div className="relative">
          <button className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300">
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={profilePicture}
              alt="User"
            />
          </button>
        </div>
      </div>
    </header>
  );
};