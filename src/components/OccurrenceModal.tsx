/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ClipboardList, 
  Plus, 
  Trash2, 
  Search, 
  User, 
  MapPin, 
  AlertOctagon 
} from 'lucide-react';
import { Occurrence } from '../types';

interface OccurrenceModalProps {
  occurrences: Occurrence[];
  onAddOccurrence: (occ: Omit<Occurrence, 'id' | 'date'>) => void;
  onUpdateStatus: (id: string, status: 'Pendente' | 'Em Andamento' | 'Resolvido') => void;
  onRemoveOccurrence: (id: string) => void;
  onClose: () => void;
}

export default function OccurrenceModal({
  occurrences,
  onAddOccurrence,
  onUpdateStatus,
  onRemoveOccurrence,
  onClose
}: OccurrenceModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'Todos' | 'Pendente' | 'Em Andamento' | 'Resolvido'>('Todos');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [type, setType] = useState('Defeito de Equipamento');
  const [reportedBy, setReportedBy] = useState('');
  const [location, setLocation] = useState('');
  const [severity, setSeverity] = useState<'Baixo' | 'Médio' | 'Alto'>('Médio');
  const [description, setDescription] = useState('');

  const occurrenceTypes = [
    'Defeito de Equipamento',
    'Reclamação de Barulho',
    'Invasão / Suspeito',
    'Manutenção / Infraestrutura',
    'Vaga de Garagem',
    'Correspondência / Encomenda',
    'Outros'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportedBy || !location || !description) return;
    
    onAddOccurrence({
      type,
      reportedBy,
      location,
      severity,
      description,
      status: 'Pendente'
    });

    // Reset form
    setReportedBy('');
    setLocation('');
    setSeverity('Médio');
    setDescription('');
    setShowAddForm(false);
  };

  const filteredOccurrences = occurrences.filter(occ => {
    const matchesSearch = 
      occ.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      occ.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      occ.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      occ.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeFilter === 'Todos') return matchesSearch;
    return matchesSearch && occ.status === activeFilter;
  });

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl flex flex-col w-full max-w-4xl max-h-[85vh] overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-50 text-sky-600 rounded-2xl">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-slate-950 leading-none">Livro de Ocorrências</h3>
              <p className="text-xs text-slate-500 mt-1">Registros operacionais e comunicados internos de segurança</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 cursor-pointer transition-all active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body split into list & optional form */}
        <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
          
          {/* Main List Section */}
          <div className={`flex-grow p-6 flex flex-col h-full overflow-y-auto ${showAddForm ? 'md:w-3/5' : 'w-full'}`}>
            
            {/* Search and filter controls */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6 items-center justify-between">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Buscar ocorrência..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                />
              </div>

              <div className="flex bg-slate-100 p-1 rounded-xl self-stretch sm:self-auto overflow-x-auto">
                {(['Todos', 'Pendente', 'Em Andamento', 'Resolvido'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeFilter === f 
                        ? 'bg-white text-slate-900 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-sky-600 hover:bg-sky-550 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all scale-100 active:scale-95 cursor-pointer w-full sm:w-auto justify-center"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Nova Ocorrência
                </button>
              )}
            </div>

            {/* List container */}
            <div className="space-y-3 overflow-y-auto flex-grow max-h-[45vh] pr-1">
              {filteredOccurrences.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <ClipboardList className="w-10 h-10 text-slate-300 mb-3" />
                  <p className="text-slate-500 font-bold text-xs">Nenhuma ocorrência encontrada</p>
                  <p className="text-[10px] text-slate-400 mt-1">Experimente alterar os filtros ou realizar um novo registro.</p>
                </div>
              ) : (
                filteredOccurrences.map(occ => {
                  const isPending = occ.status === 'Pendente';
                  const isOngoing = occ.status === 'Em Andamento';
                  const isResolved = occ.status === 'Resolvido';

                  const isHigh = occ.severity === 'Alto';
                  const isMedium = occ.severity === 'Médio';

                  return (
                    <div 
                      key={occ.id} 
                      className={`p-4 rounded-2xl border transition-all text-left flex flex-col gap-3 group relative ${
                        isHigh 
                          ? 'border-rose-100 bg-rose-50/10' 
                          : isMedium 
                            ? 'border-amber-100 bg-amber-50/10' 
                            : 'border-slate-100 bg-white'
                      }`}
                    >
                      {/* Top Header line of single occurrence card */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-[13px] text-slate-900">{occ.type}</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide ${
                              isHigh 
                                ? 'bg-rose-100 text-rose-700' 
                                : isMedium 
                                  ? 'bg-amber-100 text-amber-700' 
                                  : 'bg-slate-100 text-slate-600'
                            }`}>
                              Gravidade {occ.severity}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-semibold flex-wrap">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3 text-slate-300" /> {occ.reportedBy}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-300" /> {occ.location}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                            <span>{occ.date}</span>
                          </div>
                        </div>

                        {/* Dropdown status update of single occurrence card */}
                        <div className="flex items-center gap-1.5">
                          <select 
                            value={occ.status}
                            onChange={(e) => onUpdateStatus(occ.id, e.target.value as any)}
                            className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg focus:outline-none cursor-pointer border ${
                              isResolved 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                : isOngoing 
                                  ? 'bg-amber-50 text-amber-700 border-amber-100' 
                                  : 'bg-sky-50 text-sky-700 border-sky-100'
                            }`}
                          >
                            <option value="Pendente">⌛ Pendente</option>
                            <option value="Em Andamento">⚙️ Em Progresso</option>
                            <option value="Resolvido">✓ Resolvido</option>
                          </select>

                          <button
                            onClick={() => onRemoveOccurrence(occ.id)}
                            className="p-1 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-lg cursor-pointer transition-all active:scale-90"
                            title="Excluir Ocorrência"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Occurrence body details */}
                      <p className="text-xs text-slate-650 font-medium leading-relaxed bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/50">
                        {occ.description}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Collapsible Form Panel on the right */}
          {showAddForm && (
            <div className="w-full md:w-2/5 p-6 border-t md:border-t-0 md:border-l border-slate-100 bg-slate-50/50 flex flex-col h-full overflow-y-auto animate-in slide-in-from-right duration-250">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <span className="font-extrabold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4 text-sky-500" />
                  Novo Comunicado
                </span>
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Categoria</label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    {occurrenceTypes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Solicitante</label>
                    <input 
                      type="text"
                      placeholder="Ex: Apt 104"
                      required
                      value={reportedBy}
                      onChange={(e) => setReportedBy(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Local / Posto</label>
                    <input 
                      type="text"
                      placeholder="Ex: Bloco A"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Critério de Gravidade</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Baixo', 'Médio', 'Alto'] as const).map(s => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setSeverity(s)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          severity === s
                            ? s === 'Alto'
                              ? 'bg-rose-50 text-rose-700 border-rose-300'
                              : s === 'Médio'
                                ? 'bg-amber-50 text-amber-700 border-amber-300'
                                : 'bg-slate-100 text-slate-700 border-slate-300'
                            : 'bg-white hover:bg-slate-50 text-slate-500 border-slate-200'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Detalhamento Técnico / Descrição</label>
                  <textarea 
                    placeholder="Descreva o incidente ou aviso com clareza..."
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-sky-600 hover:bg-sky-555 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer flex justify-center items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Salvar Ocorrência
                </button>
              </form>
            </div>
          )}

        </div>
        
      </div>
    </div>
  );
}
