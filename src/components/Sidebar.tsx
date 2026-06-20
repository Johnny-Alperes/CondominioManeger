/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Shield, ShieldAlert, LayoutDashboard, UserX, FileText, CalendarRange, Users, Settings, HelpCircle, ClipboardList, LogOut } from 'lucide-react';
import { CondoConfig } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  condoConfig: CondoConfig;
  onOpenOccurrences: () => void;
  onExit: () => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  condoConfig, 
  onOpenOccurrences,
  onExit 
}: SidebarProps) {
  
  const menuItems = [
    { id: 'dashboard', label: 'Monitor & Busca', icon: LayoutDashboard },
    { id: 'registro', label: 'Registro de Acessos', icon: FileText },
    { id: 'moradores', label: 'Banco de Moradores', icon: Users },
    { id: 'turnos', label: 'Gestão de Turnos', icon: CalendarRange },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-950 flex flex-col z-50 shadow-xl border-r border-slate-900 select-none">
      
      {/* Brand Header */}
      <div className="p-6 flex flex-col gap-1 border-b border-slate-900">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onExit}>
          <Shield className="w-6 h-6 text-sky-400" />
          <h1 className="text-xl font-bold text-white tracking-tight leading-none">
            {condoConfig.name || 'Spazio'}
          </h1>
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
          Terminal do Administrador
        </span>
      </div>

      {/* Navigation menu */}
      <nav className="flex-grow mt-6 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-250 text-left text-sm font-semibold outline-none ${
                    isActive 
                      ? 'bg-slate-900 text-white shadow-inner scale-[0.98]'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Settings / helper tools at bottom */}
      <div className="p-4 flex flex-col gap-2 border-t border-slate-900">
        
        {/* Livro de Ocorrências Button */}
        <button 
          onClick={onOpenOccurrences}
          className="w-full py-3.5 bg-sky-600 hover:bg-sky-550 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <ClipboardList className="w-4 h-4" />
          <span>Livro de Ocorrências</span>
        </button>

        {/* Support items */}
        <button 
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
            activeTab === 'settings' 
              ? 'bg-slate-900 text-white' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-500" />
          <span>Configurações</span>
        </button>

        <button 
          onClick={() => setActiveTab('suporte')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
            activeTab === 'suporte' 
              ? 'bg-slate-900 text-white' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-slate-500" />
          <span>Suporte & Dicas</span>
        </button>

        <button 
          id="btn-sidebar-exit"
          onClick={onExit}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-left text-red-500 hover:text-red-400 hover:bg-red-950/20 transition-all border border-transparent hover:border-red-900/30 mt-1 cursor-pointer whitespace-nowrap"
        >
          <LogOut className="w-4 h-4 text-red-500" />
          <span>Sair</span>
        </button>
      </div>

    </aside>
  );
}
