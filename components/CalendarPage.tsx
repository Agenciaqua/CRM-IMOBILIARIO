import React, { useState } from 'react';
import { Task, Lead } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';
import { TaskPill } from './TaskPill';

interface CalendarPageProps {
  tasks: Task[];
  leads: Lead[];
  onDayClick: (date: string) => void;
}

const getLocalDateKey = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const dayOfMonth = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${dayOfMonth}`;
};

export const CalendarPage: React.FC<CalendarPageProps> = ({ tasks, leads, onDayClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(startOfMonth);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  const endDate = new Date(endOfMonth);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  const days = [];
  let day = new Date(startDate);
  while (day <= endDate) {
    days.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }

  const tasksByDate = tasks.reduce((acc, task) => {
    const date = task.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 capitalize">
          {currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
        </h1>
        <div className="flex items-center space-x-2">
          <button onClick={prevMonth} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:text-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600">
            Hoje
          </button>
          <button onClick={nextMonth} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-7 text-center font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="py-3 px-1">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((d, i) => {
            const dateKey = getLocalDateKey(d);
            const dayTasks = tasksByDate[dateKey] || [];
            return (
              <button
                key={i}
                onClick={() => onDayClick(dateKey)}
                className={`relative h-32 p-2 border-r border-b border-gray-200 dark:border-gray-700 text-left align-top focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 z-0 ${
                  d.getMonth() !== currentDate.getMonth() ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800'
                } hover:bg-blue-50 dark:hover:bg-blue-900/20`}
              >
                <span className={`text-sm font-medium ${isToday(d) ? 'flex items-center justify-center w-7 h-7 bg-blue-600 text-white rounded-full' : 'text-gray-800 dark:text-gray-300'}`}>
                  {d.getDate()}
                </span>
                <div className="mt-1 space-y-1 overflow-y-auto max-h-20">
                  {dayTasks.sort((a, b) => a.time.localeCompare(b.time)).map(task => (
                    <TaskPill key={task.id} task={task} leads={leads} />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};