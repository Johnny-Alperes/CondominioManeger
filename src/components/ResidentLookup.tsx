/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Search, Phone, ShieldAlert, CheckCircle2, UserCheck, Play, HelpCircle, Siren, Eye, VolumeX, ShieldCheck, History, AlertOctagon, MessageCircle, Flame } from 'lucide-react';
import { Resident, AccessLog, Shift } from '../types';

interface ResidentLookupProps {
  residents: Resident[];
  accessLogs: AccessLog[];
  onAddAccessLog: (log: AccessLog) => void;
  onAddAlert: (msg: string) => void;
  activeShift?: Shift;
}

export default function ResidentLookup({ 
  residents, 
  accessLogs, 
  onAddAccessLog,
  onAddAlert,
  activeShift
}: ResidentLookupProps) {
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [customPhone, setCustomPhone] = useState('');
  const [callLog, setCallLog] = useState<string[]>([]);

  // Simulate gateway release
  const [releaseStatus, setReleaseStatus] = useState<string | null>(null);

  // Accent and diacritics normalization for accurate search matching (e.g., matching João when typing joao)
  const normalizeStr = (str: string) => 
    str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : '';

  // Get current list of matched residents
  const queryNormalized = normalizeStr(searchQuery);
  const matchedResidents = searchQuery ? residents.filter(res => 
    normalizeStr(res.name).includes(queryNormalized) ||
    (res.vehicle?.plate && normalizeStr(res.vehicle.plate).includes(queryNormalized)) ||
    (res.vehicles?.some(v => normalizeStr(v.plate).includes(queryNormalized)))
  ) : [];

  // Search trigger
  const handleSearch = (queryStr: string) => {
    setSearchQuery(queryStr);
    setCustomPhone('');
    if (!queryStr) {
      setSelectedResident(null);
      return;
    }
    
    const termNormalized = normalizeStr(queryStr);
    const matches = residents.filter(res => 
      normalizeStr(res.name).includes(termNormalized) ||
      (res.vehicle?.plate && normalizeStr(res.vehicle.plate).includes(termNormalized)) ||
      (res.vehicles?.some(v => normalizeStr(v.plate).includes(termNormalized)))
    );

    if (matches.length > 0) {
      // If the current selected resident is still in the filtered matches, keep it.
      // Otherwise, default select the first matching resident of the list.
      const isStillAMatch = selectedResident && matches.some(m => m.id === selectedResident.id);
      if (!isStillAMatch) {
        setSelectedResident(matches[0]);
      }
    } else {
      setSelectedResident(null);
    }
  };

  const formatPhone = (val: string) => {
    const raw = val.replace(/\D/g, '');
    if (raw.length <= 2) return raw;
    if (raw.length <= 7) return `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
    return `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7, 11)}`;
  };

  const handleWhatsAppContact = (res: Resident) => {
    const phoneToUse = res.phone || customPhone;
    if (!phoneToUse) {
      onAddAlert(`Aviso: O morador ${res.name} do Ap ${res.unit} não possui número de telefone cadastrado.`);
      return;
    }

    const cleanPhone = phoneToUse.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      onAddAlert(`Erro: Número de telefone inválido.`);
      return;
    }

    // Format phone to digits only and add country code (55 for Brazil) if missing
    const finalPhone = cleanPhone.length <= 11 ? `55${cleanPhone}` : cleanPhone;
    const waUrl = `https://wa.me/${finalPhone}`;

    const timestamp = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setCallLog(prevLogs => [`WhatsApp AP ${res.unit} (${res.name.split(' ')[0]}): Iniciado às ${timestamp}.`, ...prevLogs]);
    onAddAlert(`Iniciando contato via WhatsApp com Ap ${res.unit}`);

    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // Simulate quick authorization gateway
  const triggerGateRelease = (res: Resident) => {
    // If the search query matched a specific vehicle plate, locate that vehicle. Otherwise fallback to primary.
    const searchNorm = normalizeStr(searchQuery);
    const matchedVehicle = res.vehicles?.find(v => normalizeStr(v.plate).includes(searchNorm)) || res.vehicle;

    setReleaseStatus(`Liberando Portão / Cancelas de Entrada para ${matchedVehicle?.model || 'Morador'} (${matchedVehicle?.plate || 'Sem Placa'})...`);
    
    setTimeout(() => {
      setReleaseStatus(`Sucesso! Portão de Acesso Principal liberado para ${res.name}.`);
      onAddAlert(`Portão Liberado Manulamente: ${res.name} (${matchedVehicle?.plate || 'SEM PLACA'})`);
      
      // Register entry log automatically
      const now = new Date();
      onAddAccessLog({
        id: `gate-log-${Date.now()}`,
        plate: matchedVehicle?.plate || 'SEM PLACA',
        vehicleModel: matchedVehicle?.model || 'Registrado',
        vehicleColor: matchedVehicle?.color || 'Não específica',
        type: 'Morador',
        name: res.name,
        subType: 'Acesso Rápido de Portão',
        destination: `${res.block} - Ap ${res.unit}`,
        time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        status: 'ENTRADA'
      });

      // Clear layout notification after 4s
      setTimeout(() => setReleaseStatus(null), 4000);
    }, 2000);
  };

  // Quick Action Buttons
  const handleQuickAction = (actionLabel: string, subType: string, destination: string) => {
    const now = new Date();
    onAddAccessLog({
      id: `quick-${Date.now()}`,
      plate: 'PEDESTRE',
      vehicleModel: 'Entrada Direta',
      vehicleColor: '-',
      type: 'Visitante',
      name: actionLabel,
      subType,
      destination,
      time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: 'ENTRADA'
    });
    onAddAlert(`Acesso de pedestre registrado: ${actionLabel}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
      
      {/* Central Content Area (Column spans 8) */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* Big Premium Search Engine bar */}
        <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-lg text-slate-900 leading-none">Monitor de Segurança Inteligente</h3>
            <p className="text-xs text-slate-500 mt-1">Consulte placas de moradores ou visitantes para identificação instantânea</p>
          </div>

          <div className="relative">
            <input
              id="input-plate-search"
              type="text"
              placeholder="Digite uma placa (Ex: ABC-1234) ou nome do morador..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-950 focus:border-transparent p-4.5 pl-12 text-sm font-semibold tracking-wider text-slate-800"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-5" />
          </div>

          {searchQuery && (
            <div className="pt-2 border-t border-slate-100 animate-in fade-in duration-200">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Resultados encontrados ({matchedResidents.length})
              </div>
              {matchedResidents.length > 0 ? (
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                  {matchedResidents.map(res => {
                    const isSelected = selectedResident?.id === res.id;
                    return (
                      <button
                        key={res.id}
                        type="button"
                        onClick={() => setSelectedResident(res)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-left cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 border-slate-950 text-white shadow-sm'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <img
                          src={res.avatar}
                          alt={res.name}
                          className="w-6 h-6 rounded-lg object-cover shrink-0 border border-slate-200"
                          referrerPolicy="no-referrer"
                        />
                        <div className="truncate max-w-[170px]">
                          <span className="block truncate font-extrabold leading-tight">{res.name}</span>
                          <span className={`block text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-400'} mt-0.5`}>
                            {res.block} • Ap {res.unit}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-red-500 font-semibold italic">Nenhum morador ou veículo correspondente encontrado.</p>
              )}
            </div>
          )}
        </section>

        {/* BREATHTAKING RESIDENT COMPREHENSIVE CARD (If Selected) */}
        {selectedResident ? (
          <section className="bg-white rounded-3xl border border-slate-100 shadow-lg p-6 md:p-8 space-y-6 animate-in zoom-in-95 duration-250">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <img 
                  className="w-18 h-18 rounded-2xl object-cover border-4 border-slate-50 shadow-sm" 
                  src={selectedResident.avatar} 
                  alt={selectedResident.name}
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-xl font-black text-slate-900 tracking-tight leading-tight">{selectedResident.name}</h4>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                    {selectedResident.block} • Apartamento {selectedResident.unit}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 bg-sky-50 text-sky-700 rounded-full text-xs font-bold tracking-wider">
                  {selectedResident.role}
                </span>
                <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold tracking-wider">
                  Cadastro Ativo
                </span>
              </div>
            </div>

            {/* Vehicle Details Subgrid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-150 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <span>Veículos Cadastrados</span>
                </div>
                
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {selectedResident.vehicles && selectedResident.vehicles.length > 0 ? (
                    selectedResident.vehicles.map((v) => (
                      <div key={v.plate} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-xs text-slate-900">{v.model}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">Cor: {v.color}</span>
                        </div>
                        <span className="px-2.5 py-1 bg-slate-900 text-white rounded-lg font-black tracking-widest text-[10px] uppercase shadow-xs shrink-0 font-mono">
                          {v.plate}
                        </span>
                      </div>
                    ))
                  ) : selectedResident.vehicle ? (
                    <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-xs text-slate-900">{selectedResident.vehicle.model}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">Cor: {selectedResident.vehicle.color}</span>
                      </div>
                      <span className="px-2.5 py-1 bg-slate-900 text-white rounded-lg font-black tracking-widest text-[10px] uppercase shadow-xs shrink-0 font-mono">
                        {selectedResident.vehicle.plate}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 font-semibold italic block text-center py-2">Sem veículos cadastrados</span>
                  )}
                </div>
              </div>

              {/* Communication center */}
              <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-150 flex flex-col justify-between gap-4">
                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Canal de Comunicação</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 font-extrabold px-2 py-0.5 rounded uppercase">WhatsApp</span>
                  </div>

                  <button
                    id="btn-whatsapp-contact"
                    onClick={() => handleWhatsAppContact(selectedResident)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:scale-[1.01] active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Entrar em contato com Apt {selectedResident.unit}</span>
                  </button>

                  {selectedResident.phone ? (
                    <div className="text-center pt-1">
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Telefone Cadastrado</p>
                      <p className="text-xs text-slate-800 font-bold mt-0.5">{selectedResident.phone}</p>
                    </div>
                  ) : (
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <p className="text-[10px] text-amber-600 font-extrabold uppercase">Morador sem telefone cadastrado</p>
                      <p className="text-[10px] text-slate-500 font-medium">Digite o celular abaixo para abrir a conversa diretamente:</p>
                      <input
                        type="text"
                        placeholder="Ex: (11) 91234-5678"
                        value={customPhone}
                        onChange={(e) => setCustomPhone(formatPhone(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Release gateways actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                id="btn-release-gate"
                onClick={() => triggerGateRelease(selectedResident)}
                className="w-full sm:w-auto bg-slate-950 text-white hover:bg-slate-800 px-6 py-3.5 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                disabled={releaseStatus !== null}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Liberar Acesso e Cancela</span>
              </button>

              <button
                id="btn-cancel-view"
                onClick={() => handleSearch('')}
                className="w-full sm:w-auto text-slate-500 hover:text-slate-900 font-semibold text-xs py-2 px-4 uppercase tracking-wider"
              >
                Voltar ao Monitor Geral
              </button>
            </div>

            {/* Display Gate Trigger Status Banner */}
            {releaseStatus && (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-xs font-semibold text-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block shrink-0" />
                <span>{releaseStatus}</span>
              </div>
            )}

          </section>
        ) : (
          /* Empty screen helper if NO resident searched */
          searchQuery && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10 text-center space-y-4 animate-in fade-in duration-200">
              <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto" />
              <div>
                <h4 className="font-bold text-slate-900 text-base">Veículo não cadastrado</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Nenhum morador corresponde à placa "{searchQuery.toUpperCase()}". Deseja cadastrar o fluxo de acesso como um visitante manual?
                </p>
              </div>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => handleQuickAction('Visitante Avulso', `Placa: ${searchQuery.toUpperCase()}`, 'Entrada Portaria')}
                  className="bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm"
                >
                  Registrar Entrada Visitante
                </button>
                <button
                  onClick={() => handleSearch('')}
                  className="text-slate-500 hover:text-slate-800 font-semibold text-xs px-3 py-2"
                >
                  Limpar Busca
                </button>
              </div>
            </div>
          )
        )}

        {/* Quick check-in panel & shortcut bento cells */}
        <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-lg text-slate-900">Telefones importantes</h3>
            <p className="text-xs text-slate-500">Contatos de emergência e canais públicos para suporte imediato</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            
            <button
              id="btn-phone-police"
              onClick={() => {
                navigator.clipboard.writeText('190');
                onAddAlert('Número da Polícia Militar (190) copiado!');
              }}
              className="p-4 bg-red-50/40 hover:bg-red-50 border border-red-100 hover:border-red-200 rounded-2xl text-left hover:scale-[1.02] transition-all flex flex-col justify-between min-h-[110px] group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center border border-red-200 group-hover:scale-110 transition-transform">
                <Siren className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900 block leading-tight">Polícia Militar</span>
                <span className="text-xs font-mono font-extrabold text-red-600 tracking-wider">190</span>
              </div>
            </button>

            <button
              id="btn-phone-fire"
              onClick={() => {
                navigator.clipboard.writeText('193');
                onAddAlert('Número do Corpo de Bombeiros (193) copiado!');
              }}
              className="p-4 bg-orange-50/40 hover:bg-orange-50 border border-orange-100 hover:border-orange-200 rounded-2xl text-left hover:scale-[1.02] transition-all flex flex-col justify-between min-h-[110px] group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center border border-orange-200 group-hover:scale-110 transition-transform">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900 block leading-tight">Bombeiros</span>
                <span className="text-xs font-mono font-extrabold text-orange-600 tracking-wider">193</span>
              </div>
            </button>

            <button
              id="btn-phone-samu"
              onClick={() => {
                navigator.clipboard.writeText('192');
                onAddAlert('Número do SAMU (192) copiado!');
              }}
              className="p-4 bg-rose-50/40 hover:bg-rose-50 border border-rose-100 hover:border-rose-200 rounded-2xl text-left hover:scale-[1.02] transition-all flex flex-col justify-between min-h-[110px] group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center border border-rose-200 group-hover:scale-110 transition-transform">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900 block leading-tight">SAMU</span>
                <span className="text-xs font-mono font-extrabold text-rose-600 tracking-wider">192</span>
              </div>
            </button>

            <button
              id="btn-phone-civil"
              onClick={() => {
                navigator.clipboard.writeText('199');
                onAddAlert('Número da Defesa Civil (199) copiado!');
              }}
              className="p-4 bg-amber-50/40 hover:bg-amber-50 border border-amber-100 hover:border-amber-200 rounded-2xl text-left hover:scale-[1.02] transition-all flex flex-col justify-between min-h-[110px] group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center border border-amber-200 group-hover:scale-110 transition-transform">
                <AlertOctagon className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900 block leading-tight">Defesa Civil</span>
                <span className="text-xs font-mono font-extrabold text-amber-600 tracking-wider">199</span>
              </div>
            </button>

          </div>
        </section>

      </div>

      {/* RIGHT SIDE PANEL: Security info, ongoing plantão contacts, alert tracker */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Plantão Status Guard overview */}
        <section className="bg-slate-950 text-white rounded-3xl p-6 shadow-md border border-slate-900 flex flex-col justify-between min-h-[200px]">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-lg tracking-widest">
                Portaria Ativa
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Porteiro do Dia
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              <img 
                className="w-12 h-12 rounded-full object-cover border-2 border-slate-800" 
                src={activeShift?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuDdrom_lII-QF57cj52nr-aYsAwKAf4cy66Fs_MXCYxnXWUiRvQs_6La6Vc-BZxV-5O4zTS-nVjq5TYF4F6RUloFUxmmeB18CobF_80sYlj1DpFib4YuYsV_xM1rgzxeNQmLLVaCmrdmsQrod9fB1U_7utSs-G4BM9AZ4bFzR3DhvkMol3t0C3JChoMneet3MvhatAJiEnfaeBH5MCIEj70AHJEThdQ7CqAWrMOr4fEGMnCQ1gYeX6nfxxuYwVLvwVnRu3d2jc6Omg"}
                alt={`${activeShift?.name || "Marcos V. Santos"} Profile`}
                referrerPolicy="no-referrer"
              />
              <div className="text-left">
                <h5 className="font-bold text-sm text-white">{activeShift?.name || "Marcos V. Santos"}</h5>
                <p className="text-xs text-slate-400">{activeShift?.role || "Supervisor de Segurança"}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-900 flex flex-col gap-2 text-xs text-slate-400 font-medium">
            <div className="flex items-center justify-between">
              <span>Posto Atual:</span>
              <span className="font-bold text-white font-mono">{activeShift?.location || "Portaria Principal"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Horário:</span>
              <span className="font-bold text-white font-mono">{activeShift?.hours || "06:00 - 18:00"}</span>
            </div>
          </div>
        </section>

        {/* Dynamic call history log list */}
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-slate-500" />
            <h4 className="font-bold text-slate-950 text-sm">Histórico de Contatos</h4>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {callLog.length > 0 ? (
              callLog.map((log, i) => (
                <div key={i} className="text-xs p-3 bg-slate-50 border border-slate-150 rounded-xl font-medium text-slate-700">
                  {log}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-6 font-semibold select-all">Selecione um morador cadastrado e entre em contato via WhatsApp para visualizar o histórico.</p>
            )}
          </div>
        </section>

      </div>

    </div>
  );
}
