import React, { useState, useRef, useEffect } from 'react';
import { BellIcon, UsersIcon, PlugIcon, FacebookIcon } from './icons';
import { MetaSettings } from '../types';

interface SettingsPageProps {
  profilePicture: string;
  onProfilePictureChange: (newPicture: string) => void;
  metaSettings: MetaSettings;
  onMetaConnect: (settings: MetaSettings) => void;
  onMetaDisconnect: () => void;
}

const SettingsCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
            {icon}
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 ml-3">{title}</h2>
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
);

const inputStyle = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-gray-200";
const labelStyle = "block text-sm font-medium text-gray-700 dark:text-gray-300";

export const SettingsPage: React.FC<SettingsPageProps> = ({ profilePicture, onProfilePictureChange, metaSettings, onMetaConnect, onMetaDisconnect }) => {
    const [profile, setProfile] = useState({
        name: 'Carlos Silva',
        email: 'carlos.silva@example.com',
        phone: '(11) 98765-4321'
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [localMetaSettings, setLocalMetaSettings] = useState(metaSettings);

    useEffect(() => {
        setLocalMetaSettings(metaSettings);
    }, [metaSettings]);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({...profile, [e.target.name]: e.target.value });
    };

    const handleProfileSave = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Perfil salvo com sucesso!');
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                onProfilePictureChange(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMetaSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalMetaSettings({ ...localMetaSettings, [e.target.name]: e.target.value });
    };

    const handleMetaConnect = (e: React.FormEvent) => {
        e.preventDefault();
        onMetaConnect(localMetaSettings);
    };

    return (
        <div>
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Configurações</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <SettingsCard title="Perfil do Usuário" icon={<UsersIcon className="w-6 h-6 text-blue-500" />}>
                        <div className="flex items-center space-x-4 mb-6">
                            <img src={profilePicture} alt="Foto de Perfil" className="w-20 h-20 rounded-full object-cover" />
                            <div>
                                <button type="button" onClick={triggerFileSelect} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:text-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500">
                                    Trocar Foto
                                </button>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png, image/jpeg" className="hidden" />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PNG ou JPG (Máx. 2MB)</p>
                            </div>
                        </div>
                        <form onSubmit={handleProfileSave} className="space-y-4">
                            <div><label className={labelStyle}>Nome</label><input type="text" name="name" value={profile.name} onChange={handleProfileChange} className={inputStyle} /></div>
                            <div><label className={labelStyle}>E-mail</label><input type="email" name="email" value={profile.email} onChange={handleProfileChange} className={inputStyle} /></div>
                            <div><label className={labelStyle}>Telefone</label><input type="tel" name="phone" value={profile.phone} onChange={handleProfileChange} className={inputStyle} /></div>
                            <div className="flex justify-end pt-2">
                                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    Salvar Alterações
                                </button>
                            </div>
                        </form>
                    </SettingsCard>
                </div>
                <div className="space-y-8">
                     <SettingsCard title="Notificações" icon={<BellIcon className="w-6 h-6 text-yellow-500" />}>
                        <div className="space-y-4">
                             <div className="flex items-center justify-between"><span className="text-gray-600 dark:text-gray-300">Novos leads recebidos</span><input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-gray-100 dark:bg-gray-600 dark:border-gray-500" defaultChecked /></div>
                            <div className="flex items-center justify-between"><span className="text-gray-600 dark:text-gray-300">Lembretes de tarefas</span><input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-gray-100 dark:bg-gray-600 dark:border-gray-500" defaultChecked /></div>
                        </div>
                    </SettingsCard>
                    <SettingsCard title="Integrações" icon={<PlugIcon className="w-6 h-6 text-green-500" />}>
                        <div className="flex items-start mb-2">
                            <FacebookIcon className="w-8 h-8 text-[#1877F2] mt-1 flex-shrink-0" />
                            <div className="ml-3">
                                <p className="font-semibold text-gray-800 dark:text-gray-100">Meta Lead Ads</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Receba leads do Facebook e Instagram.</p>
                            </div>
                        </div>
                        {metaSettings.isConnected ? (
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                                <p className="text-sm font-medium text-green-600 dark:text-green-400">Conectado com sucesso!</p>
                                <button onClick={onMetaDisconnect} className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline">Desconectar</button>
                            </div>
                        ) : (
                            <form onSubmit={handleMetaConnect} className="space-y-4 mt-4">
                                <div><label className={labelStyle}>ID da Página do Facebook</label><input type="text" name="pageId" value={localMetaSettings.pageId} onChange={handleMetaSettingsChange} className={inputStyle} placeholder="Ex: 101234567890123"/></div>
                                <div><label className={labelStyle}>ID do Formulário de Leads</label><input type="text" name="formId" value={localMetaSettings.formId} onChange={handleMetaSettingsChange} className={inputStyle} placeholder="Ex: 201234567890123"/></div>
                                <div>
                                    <label className={labelStyle}>Token de Acesso</label>
                                    <input type="password" name="accessToken" value={localMetaSettings.accessToken} onChange={handleMetaSettingsChange} className={inputStyle} placeholder="Cole seu token de acesso aqui"/>
                                    <p className="text-xs text-gray-500 mt-1">Este é um token de longa duração. <a href="https://developers.facebook.com/docs/facebook-login/access-tokens/refreshing/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Saiba mais</a>.</p>
                                </div>
                                <div className="flex justify-end pt-2">
                                    <button type="submit" className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        Salvar e Testar Conexão
                                    </button>
                                </div>
                            </form>
                        )}
                    </SettingsCard>
                </div>
            </div>
        </div>
    );
};