/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { Car, UserPlus, Search, Save, DoorOpen, ArrowRight, CheckCircle2, AlertTriangle, Trash2, Pencil } from 'lucide-react';
import { Resident, AccessLog } from '../types';

interface DashboardAdminProps {
  residents: Resident[];
  accessLogs: AccessLog[];
  onAddAccessLog: (log: AccessLog) => void;
  onUpdateResidentVehicle: (residentId: string, vehicle: { plate: string; model: string; color: string }) => void;
  onUpdateAccessLog: (log: AccessLog) => void;
  onRemoveAccessLog: (id: string) => void;
  onAddAlert?: (msg: string) => void;
}

const formatPlate = (value: string): string => {
  let cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  if (cleaned.length === 0) return '';
  const letters = cleaned.slice(0, 3).replace(/[^A-Z]/g, '');
  const rest = cleaned.slice(3);
  if (letters.length < 3) {
    return letters;
  }
  if (rest.length === 0) {
    if (value.endsWith('-')) {
      return letters;
    }
    return `${letters}-`;
  }
  const isMercosur = rest.length > 1 && /[A-Z]/.test(rest.charAt(1));
  if (isMercosur) {
    return `${letters}${rest.slice(0, 4)}`.slice(0, 7);
  } else {
    return `${letters}-${rest.slice(0, 4)}`.slice(0, 8);
  }
};

export default function DashboardAdmin({ 
  residents, 
  accessLogs, 
  onAddAccessLog,
  onUpdateResidentVehicle,
  onUpdateAccessLog,
  onRemoveAccessLog,
  onAddAlert
}: DashboardAdminProps) {
  
  // State for Resident Vehicle Registration Form
  const [resPlate, setResPlate] = useState('');
  const [resColor, setResColor] = useState('Branco');
  const [resModel, setResModel] = useState('');
  const [selectedResId, setSelectedResId] = useState('');
  const [resSearchQuery, setResSearchQuery] = useState('');
  const [resSearchDropdownOpen, setResSearchDropdownOpen] = useState(false);

  // State for Visitor entry Form
  const [visPlate, setVisPlate] = useState('');
  const [visDuration, setVisDuration] = useState('1 Hora');
  const [visName, setVisName] = useState('');
  const [visBlock, setVisBlock] = useState('');
  const [visUnit, setVisUnit] = useState('');

  // Filtering variables for logs list
  const [logFilterQuery, setLogFilterQuery] = useState('');
  const [logTypeFilter, setLogTypeFilter] = useState('Todos');

  // Inline Log Editing States
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [deleteLogId, setDeleteLogId] = useState<string | null>(null);
  const [editPlate, setEditPlate] = useState('');
  const [editModel, setEditModel] = useState('');
  const [editName, setEditName] = useState('');
  const [editDestination, setEditDestination] = useState('');

  const handleStartEditLog = (log: AccessLog) => {
    setEditingLogId(log.id);
    setEditPlate(log.plate);
    setEditModel(log.vehicleModel);
    setEditName(log.name);
    setEditDestination(log.destination);
  };

  const handleSaveLogEdit = (log: AccessLog) => {
    const updatedLog: AccessLog = {
      ...log,
      plate: editPlate.toUpperCase(),
      vehicleModel: editModel,
      name: editName,
      destination: editDestination
    };
    onUpdateAccessLog(updatedLog);
    setEditingLogId(null);
  };

  // Submit resident vehicle
  const handleResidentVehicleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedResId || !resPlate || !resModel) {
      if (onAddAlert) {
        onAddAlert('Erro: Por favor, preencha todos os campos obrigatórios e selecione o morador.');
      }
      return;
    }

    const resident = residents.find(r => r.id === selectedResId);
    if (!resident) return;

    // Update the resident vehicle in state
    onUpdateResidentVehicle(selectedResId, {
      plate: resPlate.toUpperCase(),
      model: resModel,
      color: resColor
    });

    // Create entrance log
    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    onAddAccessLog({
      id: `log-${Date.now()}`,
      plate: resPlate.toUpperCase(),
      vehicleModel: resModel,
      vehicleColor: resColor,
      type: 'Morador',
      name: resident.name,
      subType: resident.role,
      destination: `${resident.block} - Ap ${resident.unit}`,
      time: timeStr,
      status: 'ENTRADA'
    });

    // Reset Form
    setResPlate('');
    setResModel('');
    setResColor('Branco');
    setSelectedResId('');
    setResSearchQuery('');
    setResSearchDropdownOpen(false);
  };

  // Submit visitor entry
  const handleVisitorSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!visName || !visBlock || !visUnit) {
      if (onAddAlert) {
        onAddAlert('Erro: Por favor, preencha o nome do visitante, o bloco e o apartamento.');
      }
      return;
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    // Add entrance log
    onAddAccessLog({
      id: `log-${Date.now()}`,
      plate: visPlate ? visPlate.toUpperCase() : 'SEM PLACA',
      vehicleModel: visPlate ? 'Veículo de Visita' : 'Pedestre',
      vehicleColor: visPlate ? 'Não específica' : '-',
      type: 'Visitante',
      name: visName,
      subType: `Convidado (${visDuration})`,
      destination: `${visBlock.toUpperCase()} - Ap ${visUnit}`,
      time: timeStr,
      status: 'ENTRADA'
    });

    // Reset Form
    setVisPlate('');
    setVisDuration('1 Hora');
    setVisName('');
    setVisBlock('');
    setVisUnit('');
  };

  // Switch status (ENTRADA / SAÍDA) for a log item
  const handleToggleLogStatus = (log: AccessLog) => {
    const updatedStatus: 'ENTRADA' | 'SAÍDA' = log.status === 'ENTRADA' ? 'SAÍDA' : 'ENTRADA';
    const updatedLog: AccessLog = { ...log, status: updatedStatus, time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) };
    onAddAccessLog(updatedLog);
  };

  // Filter lists of residents based on search query
  const filteredResidentsForForm = residents.filter(r => {
    const normalizeStr = (str: string) => 
      str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : '';
    const qNormalized = normalizeStr(resSearchQuery);
    return normalizeStr(r.name).includes(qNormalized) || r.unit.includes(resSearchQuery);
  });

  // Filter logs for display
  const filteredLogs = accessLogs.filter(log => {
    const matchesSearch = 
      log.plate.toLowerCase().includes(logFilterQuery.toLowerCase()) ||
      log.name.toLowerCase().includes(logFilterQuery.toLowerCase()) ||
      log.destination.toLowerCase().includes(logFilterQuery.toLowerCase());
    
    const matchesType = logTypeFilter === 'Todos' || log.type === logTypeFilter;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Forms Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Resident Vehicle Registration */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Cadastrar Veículo de Morador</h3>
              <p className="text-xs text-slate-500">Registro permanente ou atualização de frota interna</p>
            </div>
          </div>

          <form onSubmit={handleResidentVehicleSubmit} className="grid grid-cols-2 gap-4">
            
            {/* Resident Search Bar */}
            <div className="col-span-2 relative">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Morador Responsável *
              </label>
              <div className="relative">
                <input
                  id="input-res-select"
                  type="text"
                  placeholder="Buscar por nome ou apartamento..."
                  value={resSearchQuery}
                  onChange={(e) => {
                    setResSearchQuery(e.target.value);
                    setResSearchDropdownOpen(true);
                  }}
                  onFocus={() => setResSearchDropdownOpen(true)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-950 focus:border-transparent p-3.5 pl-10 text-sm font-medium"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
              </div>

              {/* Suggestions Dropdown */}
              {resSearchDropdownOpen && resSearchQuery && (
                <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg z-30">
                  {filteredResidentsForForm.length > 0 ? (
                    filteredResidentsForForm.map(res => (
                      <button
                        key={res.id}
                        type="button"
                        onClick={() => {
                          setSelectedResId(res.id);
                          setResSearchQuery(`${res.name} (Ap ${res.unit} - ${res.block})`);
                          setResSearchDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-between"
                      >
                        <span>{res.name}</span>
                        <span className="text-slate-400">{res.block} - Ap {res.unit}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-xs text-slate-400 font-medium">Nenhum morador encontrado</div>
                  )}
                </div>
              )}
            </div>

            <div className="col-span-1">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Placa do Veículo *
              </label>
              <input
                id="input-res-plate"
                type="text"
                placeholder="ABC-1234"
                value={resPlate}
                onChange={(e) => setResPlate(formatPlate(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-950 focus:border-transparent p-3.5 text-sm font-bold tracking-widest text-slate-900"
                required
              />
            </div>

            <div className="col-span-1">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Cor Principal *
              </label>
              <select
                id="select-res-color"
                value={resColor}
                onChange={(e) => setResColor(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-950 focus:border-transparent p-3.5 text-sm font-medium text-slate-900"
              >
                <option>Branco</option>
                <option>Preto</option>
                <option>Cinza</option>
                <option>Prata</option>
                <option>Vermelho</option>
                <option>Azul</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Modelo / Marca *
              </label>
              <input
                id="input-res-model"
                type="text"
                placeholder="Ex: Toyota Corolla"
                value={resModel}
                onChange={(e) => setResModel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-950 focus:border-transparent p-3.5 text-sm font-medium text-slate-900"
                required
              />
            </div>

            <div className="col-span-2 mt-2">
              <button
                id="btn-register-vehicle"
                type="submit"
                className="w-full bg-slate-950 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>Salvar & Liberar Acesso</span>
              </button>
            </div>

          </form>
        </section>

        {/* Visitor Entry Form */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Entrada de Visitante</h3>
              <p className="text-xs text-slate-500">Acesso temporário monitorado e limitado</p>
            </div>
          </div>

          <form onSubmit={handleVisitorSubmit} className="grid grid-cols-2 gap-4">
            
            <div className="col-span-1">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Placa (Opcional)
              </label>
              <input
                id="input-vis-plate"
                type="text"
                placeholder="XYZ-9876"
                value={visPlate}
                onChange={(e) => setVisPlate(formatPlate(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-950 focus:border-transparent p-3.5 text-sm font-semibold tracking-widest text-slate-900"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Tempo Est. Permanência
              </label>
              <select
                id="select-vis-duration"
                value={visDuration}
                onChange={(e) => setVisDuration(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-950 focus:border-transparent p-3.5 text-sm font-medium text-slate-900"
              >
                <option>1 Hora</option>
                <option>2 Horas</option>
                <option>4 Horas</option>
                <option>Pernoite</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Nome Completo do Visitante *
              </label>
              <input
                id="input-vis-name"
                type="text"
                placeholder="Nome do visitante..."
                value={visName}
                onChange={(e) => setVisName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-950 focus:border-transparent p-3.5 text-sm font-medium text-slate-900"
                required
              />
            </div>

            <div className="col-span-1">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Bloco / Torre *
              </label>
              <input
                id="input-vis-block"
                type="text"
                placeholder="Ex: Bloco B"
                value={visBlock}
                onChange={(e) => setVisBlock(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-950 focus:border-transparent p-3.5 text-sm font-medium text-slate-900"
                required
              />
            </div>

            <div className="col-span-1">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Apartamento *
              </label>
              <input
                id="input-vis-unit"
                type="text"
                placeholder="Ex: 104"
                value={visUnit}
                onChange={(e) => setVisUnit(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-950 focus:border-transparent p-3.5 text-sm font-medium text-slate-900"
                required
              />
            </div>

            <div className="col-span-2 mt-2">
              <button
                id="btn-register-visitor"
                type="submit"
                className="w-full bg-amber-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-amber-700 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
              >
                <DoorOpen className="w-4 h-4" />
                <span>Autorizar & Liberar Entrada</span>
              </button>
            </div>

          </form>
        </section>

      </div>

      {/* Access logs List table */}
      <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-bold text-lg text-slate-900 font-headline-sm">Últimos Acessos</h3>
            <p className="text-xs text-slate-500">Fluxos registrados nas portarias e pontos de controle</p>
          </div>
          
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {/* Filter select */}
            <select
              id="select-log-type-filter"
              value={logTypeFilter}
              onChange={(e) => setLogTypeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-600 focus:ring-1 focus:ring-slate-900 focus:border-transparent"
            >
              <option value="Todos">Todos</option>
              <option value="Morador">Morador</option>
              <option value="Visitante">Visitante</option>
              <option value="Serviço">Serviço</option>
            </select>

            <input
              id="input-log-search"
              type="text"
              placeholder="Filtro rápido..."
              value={logFilterQuery}
              onChange={(e) => setLogFilterQuery(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-600 focus:ring-1 focus:ring-slate-900 focus:border-transparent w-full sm:w-36"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Veículo / Placa</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4">Nome completo / Identificação</th>
                <th className="px-6 py-4">Destino</th>
                <th className="px-6 py-4">Horário</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {filteredLogs.length > 0 ? (
                filteredLogs.map(log => {
                  const isMorador = log.type === 'Morador';
                  const isVisitante = log.type === 'Visitante';
                  
                  return (
                    <tr key={log.id} className={`hover:bg-slate-50/50 transition-colors ${log.id === editingLogId ? 'bg-slate-50 border-y border-slate-200 shadow-inner' : ''}`}>
                      <td className="px-6 py-4">
                        {log.id === editingLogId ? (
                          <div className="flex flex-col gap-1.5 max-w-[150px]">
                            <input 
                              type="text" 
                              value={editPlate} 
                              onChange={e => setEditPlate(formatPlate(e.target.value))} 
                              className="w-full p-2 border border-slate-200 rounded-xl text-xs font-extrabold tracking-widest uppercase bg-white text-slate-900"
                              placeholder="Placa"
                            />
                            <input 
                              type="text" 
                              value={editModel} 
                              onChange={e => setEditModel(e.target.value)} 
                              className="w-full p-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-900"
                              placeholder="Modelo"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-950 font-extrabold tracking-widest text-xs uppercase shadow-sm">
                              {log.plate}
                            </span>
                            <span className="text-xs text-slate-500 font-semibold">{log.vehicleModel}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          isMorador 
                            ? 'bg-sky-50 text-sky-700' 
                            : isVisitante
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {log.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {log.id === editingLogId ? (
                          <input 
                            type="text" 
                            value={editName} 
                            onChange={e => setEditName(e.target.value)} 
                            className="p-2 border border-slate-200 rounded-xl text-xs w-full bg-white text-slate-900 font-semibold"
                            placeholder="Nome Completo"
                          />
                        ) : (
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900">{log.name}</span>
                            <span className="text-xs text-slate-400 font-medium">{log.subType}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {log.id === editingLogId ? (
                          <input 
                            type="text" 
                            value={editDestination} 
                            onChange={e => setEditDestination(e.target.value)} 
                            className="p-2 border border-slate-200 rounded-xl text-xs w-full bg-white text-slate-900 font-bold uppercase"
                            placeholder="Destino"
                          />
                        ) : (
                          <span className="text-xs text-slate-500 font-bold uppercase">{log.destination}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400 font-semibold">{log.time}</td>
                      <td className="px-6 py-4 text-center">
                        {log.id === editingLogId ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleSaveLogEdit(log)}
                              className="bg-slate-950 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer"
                            >
                              Salvar
                            </button>
                            <button
                              onClick={() => setEditingLogId(null)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer border border-slate-250"
                            >
                              Voltar
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              id={`btn-toggle-status-${log.id}`}
                              onClick={() => handleToggleLogStatus(log)}
                              className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[10px] tracking-wider transition-all hover:scale-105 ${
                                log.status === 'ENTRADA'
                                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                                  : 'bg-red-50 hover:bg-red-100 text-red-700'
                              }`}
                            >
                              ● {log.status}
                            </button>
                            <button
                              onClick={() => handleStartEditLog(log)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-950 hover:bg-slate-100 transition-all cursor-pointer"
                              title="Editar registro"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteLogId(log.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                              title="Excluir registro"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400 font-semibold">
                    <div className="flex flex-col items-center gap-2 justify-center">
                      <AlertTriangle className="w-5 h-5 text-slate-300" />
                      <span>Nenhum fluxo de acesso localizado com estes critérios</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Custom Log Delete Confirmation Modal */}
      {deleteLogId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-100 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-50 text-red-650 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-base">Excluir Registro?</h4>
              <p className="text-xs text-slate-500 mt-2">
                Tem certeza de que deseja excluir permanentemente o registro de acesso? Esta operação é irreversível.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteLogId(null)}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all border border-slate-200 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (deleteLogId) {
                    onRemoveAccessLog(deleteLogId);
                    if (onAddAlert) {
                      onAddAlert('Registro de acesso removido do terminal.');
                    }
                  }
                  setDeleteLogId(null);
                }}
                className="flex-1 py-2.5 px-4 bg-red-650 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
