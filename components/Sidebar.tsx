import React, { useState } from 'react';
import { HomeIcon, UsersIcon, BuildingIcon, ClipboardListIcon, SettingsIcon, MenuIcon, XIcon, CalendarDaysIcon, MapIcon } from './icons';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  collapsed: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, collapsed, onClick }) => (
  <a 
    href="#" 
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
      active 
        ? 'bg-blue-600 text-white' 
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
    }`}>
    {icon}
    <span className={`ml-4 transition-opacity duration-200 ${collapsed ? 'lg:hidden' : ''}`}>{label}</span>
  </a>
);

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleNavigation = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  }

  const sidebarContent = (
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-center h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <BuildingIcon className="w-8 h-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-800 dark:text-gray-100">RealtyFlow</span>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          <NavItem icon={<HomeIcon className="w-6 h-6" />} label="Dashboard" active={activePage === 'Dashboard'} onClick={() => handleNavigation('Dashboard')} collapsed={false} />
          <NavItem icon={<UsersIcon className="w-6 h-6" />} label="Leads & Clientes" active={activePage === 'Leads'} onClick={() => handleNavigation('Leads')} collapsed={false} />
          <NavItem icon={<BuildingIcon className="w-6 h-6" />} label="Imóveis" active={activePage === 'Properties'} onClick={() => handleNavigation('Properties')} collapsed={false} />
          <NavItem icon={<CalendarDaysIcon className="w-6 h-6" />} label="Calendário" active={activePage === 'Calendar'} onClick={() => handleNavigation('Calendar')} collapsed={false} />
          <NavItem icon={<MapIcon className="w-6 h-6" />} label="Mapa" active={activePage === 'Map'} onClick={() => handleNavigation('Map')} collapsed={false} />
          <NavItem icon={<ClipboardListIcon className="w-6 h-6" />} label="Relatórios" active={activePage === 'Reports'} onClick={() => handleNavigation('Reports')} collapsed={false} />
        </nav>
        <div className="px-4 py-4 mt-auto">
          <NavItem icon={<SettingsIcon className="w-6 h-6" />} label="Configurações" active={activePage === 'Settings'} onClick={() => handleNavigation('Settings')} collapsed={false} />
        </div>
      </div>
  );
  
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        {sidebarContent}
      </aside>

      {/* Mobile Menu Button */}
      <div className="md:hidden absolute top-4 left-4 z-20">
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-gray-500 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
          {isMobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-10 flex md:hidden transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          {sidebarContent}
        </div>
        <div className="flex-1 bg-black opacity-50" onClick={() => setIsMobileMenuOpen(false)}></div>
      </div>
    </>
  );
};