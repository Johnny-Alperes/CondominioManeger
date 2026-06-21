/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { 
  CalendarRange, Clock, ShieldCheck, Siren, HeartPulse, UserCheck, AlertOctagon, 
  Check, X, ClipboardCopy, Radio, Trash2, UserPlus, Phone, MapPin, Plus, UserX, Shield, Info
} from 'lucide-react';
import { Shift, ShiftSwap, Guard } from '../types';

interface ShiftManagementProps {
  shifts: Shift[];
  shiftSwaps: ShiftSwap[];
  onAddShiftSwap: (swap: ShiftSwap) => void;
  onUpdateSwapStatus: (swapId: string, status: 'Aprovado' | 'Recusado') => void;
  onRemoveShiftSwap: (swapId: string) => void;
  onAddAlert: (message: string) => void;
  guards: Guard[];
  onUpdateGuards: (guards: Guard[]) => void;
  onUpdateShifts: (shifts: Shift[]) => void;
}

const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

export default function ShiftManagement({
  shifts,
  shiftSwaps,
  onAddShiftSwap,
  onUpdateSwapStatus,
  onRemoveShiftSwap,
  onAddAlert,
  guards,
  onUpdateGuards,
  onUpdateShifts
}: ShiftManagementProps) {
  
  // Active sub-tab selector: 'monitor' | 'porteiros' | 'escalas'
  const [subTab, setSubTab] = useState<'monitor' | 'porteiros' | 'escalas'>('monitor');

  // Real-time ticking digital clock
  const [timeState, setTimeState] = useState('');
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeState(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Form states for Shift Swap request
  const [originalGuard, setOriginalGuard] = useState('');
  const [substituteGuard, setSubstituteGuard] = useState('');
  const [reason, setReason] = useState('');
  const [date, setDate] = useState('12/06/2026');
  const [deleteSwapId, setDeleteSwapId] = useState<string | null>(null);

  // Form states for registering brand new guard (porteiro)
  const [newGuardName, setNewGuardName] = useState('');
  const [newGuardRole, setNewGuardRole] = useState('Porteiro Diurno');
  const [newGuardPhone, setNewGuardPhone] = useState('');
  const [deleteGuardId, setDeleteGuardId] = useState<string | null>(null);

  // Form states for scheduling scales / shifts
  const [selectedGuardName, setSelectedGuardName] = useState('');
  const [selectedShiftLocation, setSelectedShiftLocation] = useState('Portaria Principal');
  const [selectedShiftHours, setSelectedShiftHours] = useState('06:00 - 18:00');
  const [selectedShiftDateKey, setSelectedShiftDateKey] = useState<'ontem' | 'hoje' | 'amanha'>('hoje');
  const [selectedShiftStatus, setSelectedShiftStatus] = useState<'Em Andamento' | 'Pendente' | 'Finalizado'>('Pendente');
  const [deleteShiftId, setDeleteShiftId] = useState<string | null>(null);

  // Synchronize dynamic default selected guard when list updates
  useEffect(() => {
    if (guards && guards.length > 0 && !selectedGuardName) {
      setSelectedGuardName(guards[0].name);
    }
  }, [guards, selectedGuardName]);

  // Submit Shift Swap
  const handleSwapSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!originalGuard || !substituteGuard || !reason) {
      onAddAlert('Erro: Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    onAddShiftSwap({
      id: `swap-${Date.now()}`,
      date,
      originalGuard,
      substituteGuard,
      reason,
      status: 'Pendente'
    });

    onAddAlert(`Solicitação registrada: Troca de ${originalGuard} por ${substituteGuard}.`);

    // Reset Form
    setOriginalGuard('');
    setSubstituteGuard('');
    setReason('');
  };

  // Submit Register Guard (Porteiro)
  const handleAddGuardSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newGuardName || !newGuardRole) {
      onAddAlert('Erro: Por favor, preencha o nome do porteiro e selecione a sua função.');
      return;
    }

    // Set pre-configured stylish URLs
    const preconfiguredAvatars = [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDtbPd1IgCKdRgax6t5chvTDwtFUi_46ZajgQkfqLReYXJwrWU4ySdeHmuD_RN3ydlSa14lfNBIuF7a6WQbaxDBFzvhJLS68jJ23KBaCFvFG28pUFKAveJZeCR2-dXWVsJO3xOjDho8fQAR2DVOvesfQA_R1lsPEXS3p_rMOaSZZ2xrsXZdvrwovm0eIWwB8--Sv3V1e_Zidxcm_JnbYtjtBjok1vVsWN999-m8p6Eas4u9lPiUde3W3bFSO4XhSlIHNC_nAdVpSXo',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCsR_LYgN9zQej8BDoOcBd3Wew1-LZfxtDkU88Omh9Yt8bdNvGXvM-MD-YiXM34u2SOzA_VkNbygCbGXa9nqMcjx7lLeFDxfz2RYPtXegLINYZnhrdF5BK2Uv971QDQw3F3REmm9AdiPlN8GsRhUG1igaQntYriG9_CtEiUqU33W6hbH2agVZsjNLb7187CmbUfBacF4EWL-dFBp2PgpyFvJDSjuqa6UgjvfiQ-xNPYTo0MlKY3TJhtRCHCQTRHN3tYJ7dal4cQWdY',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDo7YCWHGy97qxtGzzuVos8AxDG_RZ2DUkQ_xIvYJBlZDJw3vQso2Mt0cidV3AJlfq1u73Gn7c67JIY25iKxVUD3YhqHqrSHxL7COVhO9dZvuDHmWRS2pF-erDlAjok6ULr52NX-_LBONeXpLU_JEaNAlcVM5_ZQIoBF3trsuceEm-VV8cFKcIbo4JBs3WevWYL7UGLgzgbHs02m4I0W9p6tiTmsix0L6AiVTnazXukxPugjYeyoxN3b3EOM7-iSKU0vselMTCuot8'
    ];
    // Rotate through realistic avatars based on guard count or choose randomly
    const randomAvatar = preconfiguredAvatars[guards.length % preconfiguredAvatars.length];

    const newGuard: Guard = {
      id: `guard-${Date.now()}`,
      name: newGuardName,
      role: newGuardRole,
      phone: newGuardPhone || '(Não Informado)',
      avatar: randomAvatar
    };

    onUpdateGuards([...guards, newGuard]);
    onAddAlert(`Porteiro ${newGuardName} foi cadastrado e integrado no painel de segurança!`);

    // Reset fields
    setNewGuardName('');
    setNewGuardPhone('');
  };

  // Submit Schedule Shift (Escala)
  const handleScheduleShiftSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedGuardName) {
      onAddAlert('Erro: Adicione/Selecione pelo menos um porteiro para agendar.');
      return;
    }

    const assignedGuard = guards.find(g => g.name === selectedGuardName);
    const assignedRole = assignedGuard ? assignedGuard.role : 'Porteiro';
    const assignedAvatar = assignedGuard ? assignedGuard.avatar : 'https://lh3.googleusercontent.com/aida-public/AB6AXuDo7YCWHGy97qxtGzzuVos8AxDG_RZ2DUkQ_xIvYJBlZDJw3vQso2Mt0cidV3AJlfq1u73Gn7c67JIY25iKxVUD3YhqHqrSHxL7COVhO9dZvuDHmWRS2pF-erDlAjok6ULr52NX-_LBONeXpLU_JEaNAlcVM5_ZQIoBF3trsuceEm-VV8cFKcIbo4JBs3WevWYL7UGLgzgbHs02m4I0W9p6tiTmsix0L6AiVTnazXukxPugjYeyoxN3b3EOM7-iSKU0vselMTCuot8';

    const dateLabels = {
      ontem: 'Ontem',
      hoje: 'Hoje - Plantão Atual',
      amanha: 'Amanhã'
    };

    const newShift: Shift = {
      id: `shift-${Date.now()}`,
      name: selectedGuardName,
      role: assignedRole,
      location: selectedShiftLocation,
      avatar: assignedAvatar,
      hours: selectedShiftHours,
      status: selectedShiftStatus,
      dateKey: selectedShiftDateKey,
      dateLabel: dateLabels[selectedShiftDateKey]
    };

    onUpdateShifts([...shifts, newShift]);
    onAddAlert(`Novo turno agendado com sucesso para ${selectedGuardName} no setor ${selectedShiftLocation}!`);
  };

  const handleConfirmDeleteGuard = () => {
    if (!deleteGuardId) return;
    const targetGuard = guards.find(g => g.id === deleteGuardId);
    if (targetGuard) {
      onUpdateGuards(guards.filter(g => g.id !== deleteGuardId));
      onAddAlert(`Porteiro ${targetGuard.name} foi desligado do sistema.`);
    }
    setDeleteGuardId(null);
  };

  const handleConfirmDeleteShift = () => {
    if (!deleteShiftId) return;
    onUpdateShifts(shifts.filter(s => s.id !== deleteShiftId));
    onAddAlert('Escala de serviço excluída.');
    setDeleteShiftId(null);
  };

  // Radio check actions (Simulates checking-in on active staff radios!)
  const [radioLogs, setRadioLogs] = useState<string[]>([
    'Canal 1: Portaria Principal respondeu QAP às 14:02h.',
    'Canal 2: Ronda Móvel informou perímetro limpo às 13:58h.'
  ]);

  const triggerRadioCheck = (guardName: string) => {
    const nowStamp = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const checkMessage = `Canal 1: ${guardName} acusou QTR (Radiotelefone operacional) às ${nowStamp}h.`;
    setRadioLogs(prev => [checkMessage, ...prev].slice(0, 5));
    onAddAlert(`Sinal de rádio testado com sucesso para ${guardName}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Dynamic Sub Tab Navigation Header */}
      <div className="flex flex-wrap gap-2 bg-slate-150 bg-slate-200/50 p-1.5 rounded-2xl max-w-xl">
        <button
          id="tab-btn-monitor"
          onClick={() => setSubTab('monitor')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            subTab === 'monitor' 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Monitor de Plantões</span>
        </button>

        <button
          id="tab-btn-porteiros"
          onClick={() => setSubTab('porteiros')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            subTab === 'porteiros' 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Gestão de Porteiros</span>
        </button>

        <button
          id="tab-btn-escalas"
          onClick={() => setSubTab('escalas')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            subTab === 'escalas' 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <CalendarRange className="w-4 h-4" />
          <span>Organizar Turnos</span>
        </button>
      </div>

      {subTab === 'monitor' && (
        <>
          {/* Shifts visual row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {shifts.map((s) => {
              const isToday = s.dateKey === 'hoje';
              const isFinished = s.status === 'Finalizado';
              const isPending = s.status === 'Pendente';

              return (
                <div 
                  key={s.id} 
                  className={`p-6 rounded-2xl shadow-sm border flex flex-col justify-between min-h-[300px] transition-all relative overflow-hidden ${
                    isToday 
                      ? 'bg-slate-950 text-white border-slate-900 scale-[1.01] shadow-md' 
                      : 'bg-white text-slate-800 border-slate-100 hover:shadow-md'
                  }`}
                >
                  <div>
                    {/* Header Tag / Date */}
                    <div className="flex justify-between items-center mb-6">
                      <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1.5 rounded-lg ${
                        isToday 
                          ? 'bg-sky-500/20 text-sky-400' 
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {s.dateLabel}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        {isToday && (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 animate-pulse mr-1">
                            <Clock className="w-4 h-4" />
                            <span>{timeState}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Profile info */}
                    <div className="flex items-center gap-4">
                      <img 
                        className="w-16 h-16 rounded-full object-cover border-2 border-slate-200" 
                        src={s.avatar} 
                        alt={s.name}
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="font-bold text-lg">{s.name}</h4>
                        <span className={`text-xs font-semibold ${isToday ? 'text-slate-400' : 'text-slate-500'}`}>
                          {s.role}
                        </span>
                        <p className={`text-xs mt-1 font-bold uppercase tracking-wider ${isToday ? 'text-sky-300' : 'text-slate-700'}`}>
                          {s.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status details & radio signal simulation */}
                  <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-4" style={{borderColor: isToday ? '#1e293b' : '#f1f5f9'}}>
                    <div>
                      <p className={`text-[10px] font-bold uppercase tracking-wider ${isToday ? 'text-slate-400' : 'text-slate-500'}`}>
                        Escala de Horário
                      </p>
                      <span className="text-sm font-bold">{s.hours}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isToday ? (
                        <button
                          id={`btn-radio-check-${s.id}`}
                          onClick={() => triggerRadioCheck(s.name)}
                          className="bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 text-sky-400 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                        >
                          <Radio className="w-3.5 h-3.5" />
                          <span>Checar Rádio</span>
                        </button>
                      ) : (
                        <span className={`text-xs font-bold px-2.5 py-1.5 rounded-lg ${
                          isFinished 
                            ? 'bg-slate-50 text-slate-500' 
                            : 'bg-indigo-50 text-indigo-600'
                        }`}>
                          {s.status}
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}

            {shifts.length === 0 && (
              <div className="col-span-3 bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                <CalendarRange className="w-12 h-12 text-slate-300" />
                <h5 className="font-extrabold text-slate-700 text-sm">Nenhum Turno Ativo no Monitoramento</h5>
                <p className="text-xs text-slate-500 max-w-sm">
                  Utilize o painel <strong>Organizar Turnos</strong> acima para cadastrar a escala dos porteiros em atividade.
                </p>
              </div>
            )}

          </div>

          {/* Grid below: recent shift history log */}
          <div className="grid grid-cols-1 gap-6">

            {/* Shift History Log Table */}
            <div className="col-span-12 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                <div className="p-6 border-b border-slate-100">
                  <h3 className="font-bold text-lg text-slate-900">Histórico de Plantões</h3>
                  <p className="text-xs text-slate-500">Listagem histórica e cronograma de escalas do condomínio</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-medium text-sm">
                    <thead className="bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-widest border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4">Porteiro</th>
                        <th className="px-6 py-4">Posto de Trabalho</th>
                        <th className="px-6 py-4">Data do Plantão</th>
                        <th className="px-6 py-4">Horário</th>
                        <th className="px-6 py-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {shifts.map((s) => {
                        const isToday = s.dateKey === 'hoje';
                        const isFinished = s.status === 'Finalizado';
                        const isOngoing = s.status === 'Em Andamento';

                        return (
                          <tr key={s.id} className="hover:bg-slate-50/20">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img 
                                  src={s.avatar} 
                                  alt={s.name} 
                                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                                  referrerPolicy="no-referrer"
                                />
                                <div>
                                  <p className="font-bold text-slate-900">{s.name}</p>
                                  <p className="text-[10px] text-slate-400 font-semibold">{s.role}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-900">{s.location}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded text-xs font-semibold ${
                                isToday 
                                  ? 'bg-sky-50 text-sky-700 border border-sky-100' 
                                  : s.dateKey === 'amanha'
                                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                    : 'bg-slate-100 text-slate-600'
                              }`}>
                                {s.dateLabel}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs font-bold text-slate-500">{s.hours}</td>
                            <td className="px-6 py-4 text-center">
                              <span className={`px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider ${
                                isFinished 
                                  ? 'bg-slate-100 text-slate-500' 
                                  : isOngoing || isToday
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                    : 'bg-amber-50 text-amber-700 border border-amber-100'
                              }`}>
                                {isOngoing || isToday ? 'Em Andamento' : s.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Simulated Radio Monitor Signals Feed at Bottom */}
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Sinais e Testes de Rádio Frequência Ativos
                </span>
                <div className="space-y-1">
                  {radioLogs.map((logStr, i) => (
                    <p key={i} className="text-xs font-mono text-slate-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                      {logStr}
                    </p>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </>
      )}

      {subTab === 'porteiros' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cadastrar Porteiro Form Panel */}
          <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-900 border border-slate-155 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-slate-650" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Cadastrar Novo Porteiro</h3>
                <p className="text-xs text-slate-500">Integrar colaborador no condomínio</p>
              </div>
            </div>

            <form onSubmit={handleAddGuardSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-450 text-slate-500 uppercase tracking-wider mb-2">
                  Nome Completo *
                </label>
                <input
                  id="input-guard-name"
                  type="text"
                  placeholder="Ex: Gilberto Antunes Santos"
                  value={newGuardName}
                  onChange={(e) => setNewGuardName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-950 focus:border-transparent p-3 text-xs font-semibold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-450 text-slate-500 uppercase tracking-wider mb-2">
                  Cargo / Função *
                </label>
                <select
                  id="input-guard-role"
                  value={newGuardRole}
                  onChange={(e) => setNewGuardRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-950 focus:border-transparent p-3 text-xs font-semibold text-slate-750"
                  required
                >
                  <option value="Porteiro Diurno">Porteiro Diurno</option>
                  <option value="Porteiro Noturno">Porteiro Noturno</option>
                  <option value="Supervisor de Turno">Supervisor de Turno</option>
                  <option value="Auxiliar de Segurança">Auxiliar de Segurança</option>
                  <option value="Ronda Móvel">Ronda Móvel</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-450 text-slate-500 uppercase tracking-wider mb-2">
                  Telefone de Contato
                </label>
                <input
                  id="input-guard-phone"
                  type="text"
                  placeholder="Ex: (11) 91234-5678"
                  value={newGuardPhone}
                  onChange={(e) => setNewGuardPhone(formatPhone(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-950 focus:border-transparent p-3 text-xs font-semibold text-slate-800"
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-xl text-[11px] text-slate-550 leading-snug flex gap-2 border border-slate-100">
                <Info className="w-5 h-5 text-slate-400 shrink-0 inline" />
                <span>No cadastro, um avatar fardado exclusivo será gerado e associado automaticamente ao perfil do novo colaborador.</span>
              </div>

              <button
                id="btn-register-guard"
                type="submit"
                className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Salvar Cadastro de Porteiro</span>
              </button>
            </form>
          </div>

          {/* List of guards */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="mb-6">
                <h3 className="font-extrabold text-lg text-slate-900">Funcionários e Porteiros Ativos</h3>
                <p className="text-xs text-slate-500">Membros de segurança credenciados e autorizados no sistema</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guards.map((guard) => (
                  <div 
                    key={guard.id} 
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-350 hover:shadow-sm transition-all flex justify-between items-start gap-4 p-5 relative"
                  >
                    <div className="flex items-center gap-4">
                      <img 
                        src={guard.avatar} 
                        alt={guard.name} 
                        className="w-14 h-14 rounded-full object-cover border-2 border-slate-100 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-slate-900 text-sm leading-tight">{guard.name}</h4>
                        <div className="flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs font-bold text-slate-500">{guard.role}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span className="text-[11px] font-semibold text-slate-400">{guard.phone}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      id={`btn-remove-guard-${guard.id}`}
                      onClick={() => setDeleteGuardId(guard.id)}
                      className="p-2 justify-center rounded-xl text-slate-400 hover:border-red-155 hover:text-red-500 hover:bg-red-50 border border-transparent transition-all shrink-0 cursor-pointer"
                      title="Demitir / Desvincular Porteiro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {guards.length === 0 && (
                  <div className="col-span-2 text-center p-12 text-slate-450 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    Nenhum porteiro cadastrado. Por favor, utilize o painel ao lado para cadastrar novos colaboradores.
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      )}

      {subTab === 'escalas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Organizar Escala / Turno Form Panel */}
          <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-155 text-slate-700 flex items-center justify-center">
                <CalendarRange className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Escalar Turno / Plantão</h3>
                <p className="text-xs text-slate-500">Agendar porteiros em postos de trabalho</p>
              </div>
            </div>

            <form onSubmit={handleScheduleShiftSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Porteiro de Serviço *
                </label>
                <select
                  id="input-sched-guard"
                  value={selectedGuardName}
                  onChange={(e) => setSelectedGuardName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-950 focus:border-transparent p-3 text-xs font-semibold text-slate-800"
                  required
                >
                  {guards.map(g => (
                    <option key={g.id} value={g.name}>{g.name} ({g.role})</option>
                  ))}
                  {guards.length === 0 && (
                    <option value="">Nenhum porteiro cadastrado</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Posto de Atendimento *
                </label>
                <select
                  id="input-sched-location"
                  value={selectedShiftLocation}
                  onChange={(e) => setSelectedShiftLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-950 focus:border-transparent p-3 text-xs font-semibold text-slate-800"
                  required
                >
                  <option value="Portaria Principal">Portaria Principal</option>
                  <option value="Portaria Auxiliar">Portaria Auxiliar</option>
                  <option value="Controle de Acesso">Controle de Acesso</option>
                  <option value="Ronda Móvel">Ronda Móvel</option>
                  <option value="Central CFTV / Monitoramento">Central CFTV / Monitoramento</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Horário *
                  </label>
                  <select
                    id="input-sched-hours"
                    value={selectedShiftHours}
                    onChange={(e) => setSelectedShiftHours(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-950 focus:border-transparent p-3 text-xs font-semibold text-slate-800"
                    required
                  >
                    <option value="06:00 - 18:00">06:00 - 18:00 (Diurno)</option>
                    <option value="18:00 - 06:00">18:00 - 06:00 (Noturno)</option>
                    <option value="08:00 - 17:00">08:00 - 17:00 (Comercial)</option>
                    <option value="12:00 - 00:00">12:00 - 00:00 (Tarde/Noite)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Dia Escala *
                  </label>
                  <select
                    id="input-sched-datekey"
                    value={selectedShiftDateKey}
                    onChange={(e) => setSelectedShiftDateKey(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-950 focus:border-transparent p-3 text-xs font-semibold text-slate-800"
                    required
                  >
                    <option value="ontem">Ontem</option>
                    <option value="hoje">Hoje - Plantão Atual</option>
                    <option value="amanha">Amanhã</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Status Inicial *
                </label>
                <select
                  id="input-sched-status"
                  value={selectedShiftStatus}
                  onChange={(e) => setSelectedShiftStatus(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-950 focus:border-transparent p-3 text-xs font-semibold text-slate-800"
                  required
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Em Andamento">Em Andamento</option>
                  <option value="Finalizado">Finalizado</option>
                </select>
              </div>

              <button
                id="btn-schedule-shift"
                type="submit"
                className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Salvar Agendamento de Escala</span>
              </button>
            </form>
          </div>

          {/* Planned shifts Table / Board */}
          <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
              <div className="p-6 border-b border-slate-100">
                <h3 className="font-extrabold text-lg text-slate-900">Escala de Plantão Programada</h3>
                <p className="text-xs text-slate-500">Organize os turnos ativos e futuros atribuidos aos porteiros</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-medium text-sm">
                  <thead className="bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-widest border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Porteiro</th>
                      <th className="px-6 py-4">Cargo</th>
                      <th className="px-6 py-4">Posto</th>
                      <th className="px-6 py-4">Horário</th>
                      <th className="px-6 py-4">Período</th>
                      <th className="px-6 py-4 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {shifts.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/20 text-xs">
                        <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                          <img 
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0" 
                            src={s.avatar} 
                            alt={s.name}
                            referrerPolicy="no-referrer"
                          />
                          <span>{s.name}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-semibold">{s.role}</td>
                        <td className="px-6 py-4 font-bold text-slate-900">{s.location}</td>
                        <td className="px-6 py-4 text-slate-450 font-bold">{s.hours}</td>
                        <td className="px-6 py-4 text-xs">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-extrabold uppercase ${
                            s.dateKey === 'hoje' 
                              ? 'bg-sky-50 text-sky-700 border border-sky-100' 
                              : s.dateKey === 'amanha' 
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
                                : 'bg-slate-100 text-slate-600'
                          }`}>
                            {s.dateLabel}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center items-center">
                            <button
                              onClick={() => setDeleteShiftId(s.id)}
                              className="p-2 rounded-xl text-slate-400 hover:border-red-155 hover:text-red-500 hover:bg-red-50 border border-transparent transition-all cursor-pointer"
                              title="Remover Turno da Escala"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {shifts.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-xs text-slate-500">
                          Nenhum turno agendado. Preencha o formulário para organizar a escala de serviços.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Delete Swap Log Modal */}
      {deleteSwapId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-100 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-200 flex flex-col justify-center items-center">
            <div className="w-12 h-12 bg-red-50 text-red-650 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-6 h-6 text-red-600 animate-pulse" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-base">Excluir Troca de Turno?</h4>
              <p className="text-xs text-slate-500 mt-2">
                Tem certeza de que deseja excluir permanentemente o registro de solicitação de troca de turno? Esta operação não pode ser desfeita.
              </p>
            </div>
            <div className="flex gap-3 pt-2 w-full">
              <button
                type="button"
                onClick={() => setDeleteSwapId(null)}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all border border-slate-200 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (deleteSwapId) {
                    onRemoveShiftSwap(deleteSwapId);
                    onAddAlert('Solicitação de troca de turno removida.');
                  }
                  setDeleteSwapId(null);
                }}
                className="flex-1 py-2.5 px-4 bg-red-650 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dismiss / Fired Guard (Demitir) Confirmation Modal */}
      {deleteGuardId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-100 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-200 flex flex-col justify-center items-center">
            <div className="w-12 h-12 bg-red-50 text-red-650 rounded-2xl flex items-center justify-center mx-auto shadow-inner flex justify-center items-center">
              <UserX className="w-6 h-6 text-red-600 inline" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-base">Excluir / Demitir Porteiro?</h4>
              <p className="text-xs text-slate-500 mt-2">
                Tem certeza de que deseja desligar e descredenciar <strong>{guards.find(g => g.id === deleteGuardId)?.name}</strong>? Este colaborador será excluído do condomínio de forma definitiva.
              </p>
            </div>
            <div className="flex gap-3 pt-2 w-full">
              <button
                type="button"
                onClick={() => setDeleteGuardId(null)}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all border border-slate-200 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteGuard}
                className="flex-1 py-2.5 px-4 bg-red-650 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
              >
                Sim, Demitir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Shift Deletion confirmation modal */}
      {deleteShiftId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-100 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-200 flex flex-col justify-center items-center">
            <div className="w-12 h-12 bg-red-50 text-red-650 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-6 h-6 text-red-600 animate-pulse" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-base">Excluir Turno Agendado?</h4>
              <p className="text-xs text-slate-550 text-slate-500 mt-2">
                Tem certeza de que deseja remover esta escala/plantão do monitoramento? O horário ficará vago e disponível para novos porteiros.
              </p>
            </div>
            <div className="flex gap-3 pt-2 w-full">
              <button
                type="button"
                onClick={() => setDeleteShiftId(null)}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all border border-slate-200 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteShift}
                className="flex-1 py-2.5 px-4 bg-red-650 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
              >
                Excluir Escala
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
