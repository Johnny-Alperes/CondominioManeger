/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { Settings, Save, RotateCcw, ShieldCheck, MapPin, Building, Activity, AlertCircle } from 'lucide-react';
import { CondoConfig } from '../types';
import AddressWithCEP from './AddressWithCEP';

interface SettingsPageProps {
  condoConfig: CondoConfig;
  onUpdateConfig: (config: CondoConfig) => void;
  onResetData: () => void;
}

export default function SettingsPage({ condoConfig, onUpdateConfig, onResetData }: SettingsPageProps) {
  const [name, setName] = useState(condoConfig.name);
  const [address, setAddress] = useState(condoConfig.address);
  const [blocks, setBlocks] = useState(condoConfig.blocks);
  const [apartmentsCount, setApartmentsCount] = useState(condoConfig.apartmentsCount);
  const [isAddressValid, setIsAddressValid] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('O nome do condomínio é obrigatório.');
      return;
    }
    if (!isAddressValid) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios do endereço (CEP válido, Rua, Número, Bairro, Cidade e UF).');
      return;
    }

    setErrorMsg(null);
    onUpdateConfig({
      name: name.trim(),
      address: address.trim(),
      blocks,
      apartmentsCount,
      isConfigured: true
    });
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-8 animate-in fade-in duration-300">
      
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-slate-900">Configurações Gerais</h3>
          <p className="text-xs text-slate-400 font-semibold">Editar parâmetros e preferências do terminal administrativo</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              Nome do Condomínio <span className="text-rose-500 font-extrabold text-sm">*</span>
            </label>
            <div className="relative">
              <input
                id="input-config-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (e.target.value.trim()) setErrorMsg(null);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-slate-950 p-3 text-sm font-semibold"
                required
              />
            </div>
          </div>

          <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 space-y-4">
            <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Configurar Localização & Mapa</h4>
            <AddressWithCEP 
              address={address} 
              onChange={(addr) => {
                setAddress(addr);
              }} 
              condoName={name}
              onValidChange={(valid) => {
                setIsAddressValid(valid);
                if (valid) setErrorMsg(null);
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Quantidade de Blocos
              </label>
              <input
                id="input-config-blocks"
                type="number"
                value={blocks}
                onChange={(e) => setBlocks(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-slate-950 p-3 text-sm font-semibold text-center"
                min="1"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Total de Apartamentos
              </label>
              <input
                id="input-config-apartments"
                type="number"
                value={apartmentsCount}
                onChange={(e) => setApartmentsCount(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-slate-950 p-3 text-sm font-semibold text-center"
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Success message banner */}
        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-650 text-emerald-600" />
            <span>Configurações gravadas com êxito!</span>
          </div>
        )}

        {/* Error message banner */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-800 flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-550 text-red-650 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
          <button
            id="btn-save-config"
            type="submit"
            className="w-full sm:w-auto bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Informações</span>
          </button>

          <button
            id="btn-reset-data"
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="w-full sm:w-auto border border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-50 text-red-650 text-red-600 font-bold text-xs py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reiniciar Banco de Dados</span>
          </button>
        </div>

      </form>

      {showResetConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-100 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-50 text-red-650 rounded-2xl flex items-center justify-center mx-auto shadow-inner text-red-600">
              <RotateCcw className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-base">Reiniciar Sistema?</h4>
              <p className="text-xs text-slate-500 mt-2">
                Deseja resetar todas as tabelas aos padrões de fábrica? <strong>Isso irá remover permanentemente todos os novos moradores e logs inseridos!</strong>
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all border border-slate-200 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetData();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2.5 px-4 bg-red-650 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
