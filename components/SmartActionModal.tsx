import React, { useState, useCallback, useEffect } from 'react';
import { Lead } from '../types';
import { XIcon, WandSparklesIcon, LoaderCircleIcon } from './icons';
import { generateFollowUpEmail } from '../services/geminiService';

interface SmartActionModalProps {
  lead: Lead;
  onClose: () => void;
}

export const SmartActionModal: React.FC<SmartActionModalProps> = ({ lead, onClose }) => {
  const [activeTab, setActiveTab] = useState('email');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  const handleGenerateEmail = useCallback(async () => {
    setIsLoading(true);
    setGeneratedEmail('');
    try {
      const emailText = await generateFollowUpEmail(lead);
      setGeneratedEmail(emailText);
    } catch (error) {
      setGeneratedEmail("Falha ao gerar e-mail. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }, [lead]);

  useEffect(() => {
    // Automatically generate email when modal opens for the first time
    handleGenerateEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl transform transition-all">
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <WandSparklesIcon className="w-6 h-6 text-purple-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Ações Rápidas IA para {lead.name}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <XIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              <button className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'email' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'}`}>
                Gerar E-mail de Follow-up
              </button>
              <button className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-gray-400 dark:text-gray-500 cursor-not-allowed`}>
                Sugerir Imóveis (Em breve)
              </button>
            </nav>
          </div>

          <div className="mt-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-48">
                <LoaderCircleIcon className="w-8 h-8 text-blue-600" />
                <p className="mt-3 text-gray-600 dark:text-gray-300">Gerando e-mail com IA...</p>
              </div>
            ) : (
              <div>
                <textarea 
                  value={generatedEmail}
                  readOnly
                  className="w-full h-48 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 dark:text-gray-200"
                  placeholder="O conteúdo do e-mail aparecerá aqui..."
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end items-center p-5 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-lg space-x-4">
           <button 
            onClick={handleGenerateEmail}
            disabled={isLoading}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:text-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 disabled:opacity-50"
          >
            <WandSparklesIcon className="w-4 h-4 mr-2" />
            Gerar Novamente
          </button>
          <button 
            onClick={copyToClipboard}
            disabled={!generatedEmail || isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isCopied ? 'Copiado!' : 'Copiar Texto'}
          </button>
        </div>
      </div>
    </div>
  );
};