import React, { useState, useMemo } from 'react';
import { Lead, Task, PipelineStatus } from '../types';
import { UsersIcon, HandshakeIcon, TargetIcon, FileTextIcon, BarChart3Icon, PieChartIcon } from './icons';

interface ReportsPageProps {
  leads: Lead[];
  tasks: Task[];
}

interface ReportCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
}

const ReportCard: React.FC<ReportCardProps> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center border border-gray-200 dark:border-gray-700">
        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
            {icon}
        </div>
        <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
        </div>
    </div>
);


const ChartCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
            {icon}
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 ml-3">{title}</h3>
        </div>
        <div>{children}</div>
    </div>
);


export const ReportsPage: React.FC<ReportsPageProps> = ({ leads, tasks }) => {
    const [timeFilter, setTimeFilter] = useState('30days');

    const filteredLeads = useMemo(() => {
        const now = new Date();
        let startDate = new Date();

        if (timeFilter === '7days') {
            startDate.setDate(now.getDate() - 7);
        } else if (timeFilter === '30days') {
            startDate.setDate(now.getDate() - 30);
        } else if (timeFilter === 'thisMonth') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }

        return leads.filter(lead => {
            const leadDate = new Date(lead.lastContact);
            return leadDate >= startDate;
        });
    }, [leads, timeFilter]);

    const reportData = useMemo(() => {
        const totalLeads = filteredLeads.length;
        const dealsClosed = filteredLeads.filter(l => l.status === PipelineStatus.CLOSED).length;
        const proposalsSent = filteredLeads.filter(l => l.status === PipelineStatus.PROPOSAL).length;
        const conversionRate = totalLeads > 0 ? (dealsClosed / totalLeads) * 100 : 0;
        
        const performanceByAgent = filteredLeads
            .filter(l => l.status === PipelineStatus.CLOSED && l.agent)
            .reduce((acc, lead) => {
                acc[lead.agent!] = (acc[lead.agent!] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

        const leadSources = filteredLeads
            .filter(l => l.source)
            .reduce((acc, lead) => {
                acc[lead.source!] = (acc[lead.source!] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

        return { totalLeads, dealsClosed, proposalsSent, conversionRate, performanceByAgent, leadSources };
    }, [filteredLeads]);
    
    const maxAgentDeals = Math.max(1, ...Object.values(reportData.performanceByAgent));
    const totalSourceLeads = Object.values(reportData.leadSources).reduce((sum, count) => sum + count, 0);
    const sourceColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

    let cumulativePercentage = 0;
    const pieGradient = Object.entries(reportData.leadSources)
      .map(([source, count], index) => {
        const percentage = (count / totalSourceLeads) * 100;
        const start = cumulativePercentage;
        cumulativePercentage += percentage;
        const end = cumulativePercentage;
        return `${sourceColors[index % sourceColors.length]} ${start}% ${end}%`;
      })
      .join(', ');

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">Relatórios</h1>
      
      <div className="my-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
            <label className="font-medium text-gray-700 dark:text-gray-300">Período:</label>
            <select
                value={timeFilter}
                onChange={e => setTimeFilter(e.target.value)}
                className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            >
                <option value="7days">Últimos 7 dias</option>
                <option value="30days">Últimos 30 dias</option>
                <option value="thisMonth">Este Mês</option>
            </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <ReportCard title="Total de Novos Leads" value={reportData.totalLeads.toString()} icon={<UsersIcon className="w-8 h-8 text-blue-500" />} />
        <ReportCard title="Negócios Fechados" value={reportData.dealsClosed.toString()} icon={<HandshakeIcon className="w-8 h-8 text-emerald-500" />} />
        <ReportCard title="Taxa de Conversão" value={`${reportData.conversionRate.toFixed(1)}%`} icon={<TargetIcon className="w-8 h-8 text-rose-500" />} />
        <ReportCard title="Propostas Enviadas" value={reportData.proposalsSent.toString()} icon={<FileTextIcon className="w-8 h-8 text-indigo-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <ChartCard title="Desempenho por Corretor (Negócios Fechados)" icon={<BarChart3Icon className="w-6 h-6 text-purple-500" />}>
            <div className="space-y-4">
                {Object.keys(reportData.performanceByAgent).length > 0 ? (
                    Object.entries(reportData.performanceByAgent).sort(([, a], [, b]) => b - a).map(([agent, count]) => (
                        <div key={agent} className="flex items-center">
                            <span className="w-28 text-sm font-medium text-gray-600 dark:text-gray-300 truncate">{agent}</span>
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 mr-2">
                            <div className="bg-purple-500 h-6 rounded-full text-xs font-bold text-white flex items-center justify-end pr-2" style={{ width: `${(count / maxAgentDeals) * 100}%` }}>
                                    {count}
                            </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">Nenhum negócio fechado neste período.</p>
                )}
            </div>
        </ChartCard>
        <ChartCard title="Origem dos Leads" icon={<PieChartIcon className="w-6 h-6 text-amber-500" />}>
            {totalSourceLeads > 0 ? (
                <div className="flex flex-col sm:flex-row items-center justify-around">
                    <div className="w-40 h-40 rounded-full flex-shrink-0 mb-4 sm:mb-0" style={{ background: `conic-gradient(${pieGradient})` }}></div>
                    <div className="space-y-2 text-sm">
                        {Object.entries(reportData.leadSources).map(([source, count], index) => (
                            <div key={source} className="flex items-center">
                                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: sourceColors[index % sourceColors.length] }}></span>
                                <span className="font-medium text-gray-700 dark:text-gray-200">{source}:</span>
                                <span className="ml-1 text-gray-500 dark:text-gray-400">{count} ({(count/totalSourceLeads * 100).toFixed(1)}%)</span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">Nenhum lead encontrado neste período.</p>
            )}
        </ChartCard>
      </div>
    </div>
  );
};