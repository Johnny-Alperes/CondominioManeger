/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Siren, AlertTriangle, X, CheckCircle } from 'lucide-react';
import { CondoConfig, Resident, AccessLog, Shift, ShiftSwap, Guard, Occurrence } from './types';
import { 
  DEFAULT_CONDO_CONFIG, 
  INITIAL_RESIDENTS, 
  INITIAL_ACCESS_LOGS, 
  INITIAL_SHIFTS, 
  INITIAL_SHIFT_SWAPS,
  INITIAL_GUARDS,
  INITIAL_OCCURRENCES
} from './data';

import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import SetupWizard from './components/SetupWizard';
import DashboardAdmin from './components/DashboardAdmin';
import ShiftManagement from './components/ShiftManagement';
import ResidentLookup from './components/ResidentLookup';
import ResidentList, { getAvatar } from './components/ResidentList';
import SettingsPage from './components/SettingsPage';
import SupportPage from './components/SupportPage';
import OccurrenceModal from './components/OccurrenceModal';
import LoginPage from './components/LoginPage';

const normalizeResidents = (list: Resident[]): Resident[] => {
  return list.map(r => {
    const vehicles = r.vehicles && r.vehicles.length > 0 
      ? r.vehicles 
      : (r.vehicle ? [r.vehicle] : []);
    return {
      ...r,
      vehicles,
      vehicle: vehicles[0] || undefined,
      avatar: getAvatar(r.name, r.gender)
    };
  });
};

export default function App() {
  // Navigation: 'LANDING' | 'WIZARD' | 'CONSOLE' | 'LOGIN'
  const [activeView, setActiveView] = useState<'LANDING' | 'WIZARD' | 'CONSOLE' | 'LOGIN'>('LANDING');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => localStorage.getItem('condo_is_logged_in') === 'true');

  // Persistence States
  const [condoConfig, setCondoConfig] = useState<CondoConfig>(DEFAULT_CONDO_CONFIG);
  const [residents, setResidents] = useState<Resident[]>(() => normalizeResidents(INITIAL_RESIDENTS));
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>(INITIAL_ACCESS_LOGS);
  const [shifts, setShifts] = useState<Shift[]>(INITIAL_SHIFTS);
  const [guards, setGuards] = useState<Guard[]>(INITIAL_GUARDS);
  const [shiftSwaps, setShiftSwaps] = useState<ShiftSwap[]>(INITIAL_SHIFT_SWAPS);
  const [occurrences, setOccurrences] = useState<Occurrence[]>(INITIAL_OCCURRENCES);
  
  // Occurrence Modal navigation toggle
  const [isOccurrenceModalOpen, setIsOccurrenceModalOpen] = useState<boolean>(false);
  
  // System-wide notification state ticker
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('condo_config');
    const savedResidents = localStorage.getItem('condo_residents');
    const savedLogs = localStorage.getItem('condo_logs');
    const savedSwaps = localStorage.getItem('condo_swaps');
    const savedView = localStorage.getItem('condo_active_view');
    const savedGuards = localStorage.getItem('condo_guards');
    const savedShifts = localStorage.getItem('condo_shifts');
    const savedOccurrences = localStorage.getItem('condo_occurrences');

    if (savedConfig) setCondoConfig(JSON.parse(savedConfig));
    if (savedResidents) setResidents(normalizeResidents(JSON.parse(savedResidents)));
    if (savedLogs) setAccessLogs(JSON.parse(savedLogs));
    if (savedSwaps) setShiftSwaps(JSON.parse(savedSwaps));
    if (savedView) setActiveView(savedView as any);
    if (savedGuards) setGuards(JSON.parse(savedGuards));
    if (savedShifts) setShifts(JSON.parse(savedShifts));
    if (savedOccurrences) setOccurrences(JSON.parse(savedOccurrences));
  }, []);

  // Sync state helpers that also push to LocalStorage
  const updateCondoConfig = (newConfig: CondoConfig) => {
    setCondoConfig(newConfig);
    localStorage.setItem('condo_config', JSON.stringify(newConfig));
  };

  const updateResidents = (updatedList: Resident[]) => {
    const normalized = normalizeResidents(updatedList);
    setResidents(normalized);
    localStorage.setItem('condo_residents', JSON.stringify(normalized));
  };

  const addAccessLog = (newLog: AccessLog) => {
    const updated = [newLog, ...accessLogs];
    setAccessLogs(updated);
    localStorage.setItem('condo_logs', JSON.stringify(updated));
  };

  const addShiftSwap = (newSwap: ShiftSwap) => {
    const updated = [newSwap, ...shiftSwaps];
    setShiftSwaps(updated);
    localStorage.setItem('condo_swaps', JSON.stringify(updated));
  };

  const updateSwapStatus = (swapId: string, status: 'Aprovado' | 'Recusado') => {
    const updated = shiftSwaps.map(item => 
      item.id === swapId ? { ...item, status } : item
    );
    setShiftSwaps(updated);
    localStorage.setItem('condo_swaps', JSON.stringify(updated));
  };

  const handleAddResident = (newRes: Resident) => {
    updateResidents([...residents, newRes]);
  };

  const handleRemoveResident = (resId: string) => {
    updateResidents(residents.filter(r => r.id !== resId));
  };

  const handleUpdateResident = (updatedRes: Resident) => {
    const updated = residents.map(r => r.id === updatedRes.id ? updatedRes : r);
    updateResidents(updated);
  };

  const handleUpdateResidentVehicle = (residentId: string, vehicle: { plate: string; model: string; color: string }) => {
    const updated = residents.map(r => {
      if (r.id === residentId) {
        const currentVehicles = r.vehicles || (r.vehicle ? [r.vehicle] : []);
        const exists = currentVehicles.some(v => v.plate.toUpperCase() === vehicle.plate.toUpperCase());
        let newVehicles;
        if (exists) {
          newVehicles = currentVehicles.map(v => v.plate.toUpperCase() === vehicle.plate.toUpperCase() ? vehicle : v);
        } else {
          newVehicles = [...currentVehicles, vehicle];
        }
        return {
          ...r,
          vehicle: newVehicles[0],
          vehicles: newVehicles
        };
      }
      return r;
    });
    updateResidents(updated);
    triggerAlert(`Veículo ${vehicle.plate} associado com sucesso.`);
  };

  const handleUpdateAccessLog = (updatedLog: AccessLog) => {
    const updated = accessLogs.map(log => log.id === updatedLog.id ? updatedLog : log);
    setAccessLogs(updated);
    localStorage.setItem('condo_logs', JSON.stringify(updated));
  };

  const handleRemoveAccessLog = (logId: string) => {
    const updated = accessLogs.filter(log => log.id !== logId);
    setAccessLogs(updated);
    localStorage.setItem('condo_logs', JSON.stringify(updated));
    triggerAlert('Registro de acesso removido com sucesso.');
  };

  const handleRemoveShiftSwap = (swapId: string) => {
    const updated = shiftSwaps.filter(s => s.id !== swapId);
    setShiftSwaps(updated);
    localStorage.setItem('condo_swaps', JSON.stringify(updated));
    triggerAlert('Solicitação de troca de turno removida.');
  };

  const handleUpdateShifts = (updatedList: Shift[]) => {
    setShifts(updatedList);
    localStorage.setItem('condo_shifts', JSON.stringify(updatedList));
  };

  const handleUpdateGuards = (updatedList: Guard[]) => {
    setGuards(updatedList);
    localStorage.setItem('condo_guards', JSON.stringify(updatedList));
  };

  // Helper trigger custom system-wide notifications
  const triggerAlert = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Setup completion handler
  const handleWizardComplete = (config: CondoConfig) => {
    updateCondoConfig(config);
    setActiveView('CONSOLE');
    localStorage.setItem('condo_active_view', 'CONSOLE');
    triggerAlert(`Benvindo ao terminal de controle, Condomínio ${config.name}!`);
  };

  const handleAddOccurrence = (newOccData: Omit<Occurrence, 'id' | 'date'>) => {
    const formatter = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    const formattedDate = formatter.format(new Date());

    const newOccItem: Occurrence = {
      ...newOccData,
      id: `occ-${Date.now()}`,
      date: formattedDate
    };

    const updated = [newOccItem, ...occurrences];
    setOccurrences(updated);
    localStorage.setItem('condo_occurrences', JSON.stringify(updated));
    triggerAlert('Nova ocorrência registrada com sucesso!');
  };

  const handleUpdateOccurrenceStatus = (occId: string, status: 'Pendente' | 'Em Andamento' | 'Resolvido') => {
    const updated = occurrences.map(occ => occ.id === occId ? { ...occ, status } : occ);
    setOccurrences(updated);
    localStorage.setItem('condo_occurrences', JSON.stringify(updated));
    triggerAlert(`Ocorrência atualizada com sucesso para "${status}".`);
  };

  const handleRemoveOccurrence = (occId: string) => {
    const updated = occurrences.filter(occ => occ.id !== occId);
    setOccurrences(updated);
    localStorage.setItem('condo_occurrences', JSON.stringify(updated));
    triggerAlert('Ocorrência removida do livro de registros.');
  };

  // Reset database back to factory
  const handleResetDatabase = () => {
    localStorage.removeItem('condo_config');
    localStorage.removeItem('condo_residents');
    localStorage.removeItem('condo_logs');
    localStorage.removeItem('condo_swaps');
    localStorage.removeItem('condo_active_view');
    localStorage.removeItem('condo_guards');
    localStorage.removeItem('condo_shifts');
    localStorage.removeItem('condo_occurrences');

    setCondoConfig(DEFAULT_CONDO_CONFIG);
    setResidents([]);
    setAccessLogs([]);
    setShiftSwaps([]);
    setGuards([]);
    setShifts([]);
    setOccurrences([]);
    setActiveView('LANDING');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      
      {/* 1. VIEW ROUTER LOGIC */}
      {activeView === 'LANDING' && (
        <LandingPage 
          isLoggedIn={isLoggedIn}
          onStartConfig={() => {
            if (isLoggedIn) {
              setActiveView('WIZARD');
              localStorage.setItem('condo_active_view', 'WIZARD');
            } else {
              setActiveView('LOGIN');
              localStorage.setItem('condo_active_view', 'LOGIN');
            }
          }} 
          onEnterApp={() => {
            if (isLoggedIn) {
              setActiveView('CONSOLE');
              localStorage.setItem('condo_active_view', 'CONSOLE');
            } else {
              setActiveView('LOGIN');
              localStorage.setItem('condo_active_view', 'LOGIN');
            }
          }} 
          onLogout={() => {
            setIsLoggedIn(false);
            localStorage.setItem('condo_is_logged_in', 'false');
          }}
          condoConfig={condoConfig}
          />
      )}

      {activeView === 'LOGIN' && (
        <LoginPage 
          onSuccess={(email) => {
            setIsLoggedIn(true);
            localStorage.setItem('condo_is_logged_in', 'true');
            setToastMessage(`Login realizado com sucesso! Bem-vindo!`);
            setActiveView('WIZARD');
            localStorage.setItem('condo_active_view', 'WIZARD');
          }}
          onCancel={() => {
            setActiveView('LANDING');
            localStorage.setItem('condo_active_view', 'LANDING');
          }}
        />
      )}

      {activeView === 'WIZARD' && (
        <SetupWizard 
          onComplete={handleWizardComplete}
          onCancel={() => {
            setActiveView('LANDING');
            localStorage.setItem('condo_active_view', 'LANDING');
          }}
        />
      )}

      {activeView === 'CONSOLE' && (
        <div className="flex pl-64 min-h-screen relative">
          
          {/* Global Master Sidebar Navigation Panel */}
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            condoConfig={condoConfig}
            onOpenOccurrences={() => setIsOccurrenceModalOpen(true)}
            onExit={() => {
              setIsLoggedIn(false);
              localStorage.setItem('condo_is_logged_in', 'false');
              setActiveView('LANDING');
              localStorage.setItem('condo_active_view', 'LANDING');
            }}
          />

          {/* Core Content Area */}
          <main className="flex-grow p-8 max-w-[1400px] w-full mx-auto space-y-8">
            
            {/* Header / Configured Status Bar */}
            <header className="flex justify-between items-center pb-6 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  {activeTab === 'dashboard' && 'Monitor de Segurança'}
                  {activeTab === 'registro' && 'Registro de Acessos'}
                  {activeTab === 'moradores' && 'Banco de Moradores'}
                  {activeTab === 'turnos' && 'Escalas & Plantões'}
                  {activeTab === 'settings' && 'Personalizar Terminal'}
                  {activeTab === 'suporte' && 'Manual de Portaria'}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-semibold text-slate-500">
                    {condoConfig.address}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {condoConfig.blocks} blocos • {condoConfig.apartmentsCount} Aptos
                  </span>
                </div>
              </div>

              {/* Fast alert badge indicator */}
              <div className="flex items-center gap-3">
              </div>
            </header>

            {/* 2. DYNAMICAL TABS SELECTOR CONTAINER */}
            <div className="space-y-6">
              {activeTab === 'dashboard' && (
                <ResidentLookup 
                  residents={residents}
                  accessLogs={accessLogs}
                  onAddAccessLog={addAccessLog}
                  onAddAlert={triggerAlert}
                  activeShift={shifts.find(s => s.status === 'Em Andamento')}
                />
              )}

              {activeTab === 'registro' && (
                <DashboardAdmin 
                  residents={residents}
                  accessLogs={accessLogs}
                  onAddAccessLog={addAccessLog}
                  onUpdateResidentVehicle={handleUpdateResidentVehicle}
                  onUpdateAccessLog={handleUpdateAccessLog}
                  onRemoveAccessLog={handleRemoveAccessLog}
                />
              )}

              {activeTab === 'moradores' && (
                <ResidentList 
                  residents={residents}
                  blocksCount={condoConfig.blocks}
                  onAddResident={handleAddResident}
                  onRemoveResident={handleRemoveResident}
                  onUpdateResident={handleUpdateResident}
                  onAddAlert={triggerAlert}
                />
              )}

              {activeTab === 'turnos' && (
                <ShiftManagement 
                  shifts={shifts}
                  shiftSwaps={shiftSwaps}
                  onAddShiftSwap={addShiftSwap}
                  onUpdateSwapStatus={updateSwapStatus}
                  onRemoveShiftSwap={handleRemoveShiftSwap}
                  onAddAlert={triggerAlert}
                  guards={guards}
                  onUpdateGuards={handleUpdateGuards}
                  onUpdateShifts={handleUpdateShifts}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsPage 
                  condoConfig={condoConfig}
                  onUpdateConfig={updateCondoConfig}
                  onResetData={handleResetDatabase}
                />
              )}

              {activeTab === 'suporte' && <SupportPage />}
            </div>

          </main>
        </div>
      )}

      {/* 3. FLUID NOTIFICATION SYSTEM TOASTER CELL */}
      {toastMessage && (
        <div id="system-toast" className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-800 text-white p-4 rounded-2xl flex items-center gap-3 shadow-2xl animate-in slide-in-from-bottom-5 max-w-sm">
          <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-400">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div className="flex-grow text-xs font-semibold select-all">
            {toastMessage}
          </div>
          <button 
            id="btn-close-toast"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4. DRAG-ACTIVATED OCCURRENCE LIST MODAL OVERLAY */}
      {isOccurrenceModalOpen && (
        <OccurrenceModal 
          occurrences={occurrences}
          onAddOccurrence={handleAddOccurrence}
          onUpdateStatus={handleUpdateOccurrenceStatus}
          onRemoveOccurrence={handleRemoveOccurrence}
          onClose={() => setIsOccurrenceModalOpen(false)}
        />
      )}

    </div>
  );
}

