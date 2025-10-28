import React from 'react';
import { TrendData } from '../types';
import { TrendingUpIcon, TrendingDownIcon } from './icons';

interface TrendIndicatorProps {
  trend: TrendData;
}

const TrendIndicator: React.FC<TrendIndicatorProps> = ({ trend }) => {
  if (trend.direction === 'neutral') {
    return (
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
        - Sem alteração
      </p>
    );
  }

  const isUp = trend.direction === 'up';
  const colorClass = isUp ? 'text-green-500' : 'text-red-500';
  const Icon = isUp ? TrendingUpIcon : TrendingDownIcon;

  return (
    <div className={`flex items-center text-sm font-medium ${colorClass}`}>
      <Icon className="w-4 h-4 mr-1" />
      <span>{trend.change.toFixed(1)}% vs. semana passada</span>
    </div>
  );
};


interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: TrendData;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend }) => {
  return (
    <div className="flex items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
        {trend && <div className="mt-1"><TrendIndicator trend={trend} /></div>}
      </div>
    </div>
  );
};