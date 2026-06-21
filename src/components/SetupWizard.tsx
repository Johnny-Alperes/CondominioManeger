/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building, MapPin, Plus, Minus, ArrowLeft, ArrowRight, Info, Check, AlertCircle } from 'lucide-react';
import { CondoConfig } from '../types';
import AddressWithCEP from './AddressWithCEP';

interface SetupWizardProps {
  onComplete: (config: CondoConfig) => void;
  onCancel: () => void;
}

export default function SetupWizard({ onComplete, onCancel }: SetupWizardProps) {
  const [step, setStep] = useState<number>(1);
  const [condoName, setCondoName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [blocks, setBlocks] = useState<number>(4);
  const [apartments, setApartments] = useState<number>(120);
  const [isAddressValid, setIsAddressValid] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const nextStep = () => {
    setErrorMsg(null);
    if (step === 1) {
      if (!condoName.trim()) {
        setErrorMsg('O nome do condomínio é obrigatório.');
        return;
      }
    } else if (step === 2) {
      if (!isAddressValid) {
        setErrorMsg('Por favor, preencha todos os campos obrigatórios do endereço (CEP válido, Rua, Número, Bairro, Cidade e UF).');
        return;
      }
    }

    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete({
        name: condoName.trim(),
        address: address.trim(),
        blocks: blocks,
        apartmentsCount: apartments,
        isConfigured: true
      });
    }
  };

  const prevStep = () => {
    setErrorMsg(null);
    if (step > 1) {
      setStep(step - 1);
    } else {
      onCancel();
    }
  };

  const progressPercent = Math.round((step / 4) * 100);

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen flex flex-col items-center justify-center p-6 select-none relative">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12 relative z-10 overflow-hidden">
        
        {/* Branding Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-950 tracking-tight">Condomínio Maneger</h1>
          <p className="text-slate-500 text-sm mt-1">Configuração do Terminal Administrativo</p>
        </div>

        {/* Progress bar */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">
              Etapa {step} de 4
            </span>
            <span className="text-xs font-bold text-slate-500">
              {progressPercent}% Concluído
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-slate-950" 
              initial={{ width: '25%' }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Dynamic Interactive Steps */}
        <div className="min-h-[280px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 text-center"
              >
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-slate-900" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-1.5 focus:outline-none">
                    Qual o nome do condomínio? <span className="text-rose-500 font-extrabold text-lg">*</span>
                  </h2>
                  <p className="text-slate-500 text-sm max-w-md mx-auto">
                    Este nome será cadastrado e utilizado para identificar sua equipe e comunicações com moradores.
                  </p>
                </div>
                <div className="max-w-md mx-auto">
                  <input
                    id="input-condo-name"
                    type="text"
                    value={condoName}
                    onChange={(e) => {
                      setCondoName(e.target.value);
                      if (e.target.value.trim()) setErrorMsg(null);
                    }}
                    placeholder="Ex: Edifício Bella Vista"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-950 focus:border-transparent p-4 text-center text-lg font-medium text-slate-900"
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-slate-900" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-1.5">
                    Qual o endereço do condomínio? <span className="text-rose-500 font-extrabold text-lg">*</span>
                  </h2>
                  <p className="text-slate-500 text-sm max-w-md mx-auto">
                    Insira o CEP ou o endereço civil do condomínio para gerarmos os relatórios, mapas e localizações dinâmicas.
                  </p>
                </div>
                <div className="max-w-xl mx-auto">
                  <AddressWithCEP 
                    address={address} 
                    onChange={(addr) => {
                      setAddress(addr);
                    }} 
                    condoName={condoName} 
                    onValidChange={(valid) => {
                      setIsAddressValid(valid);
                      if (valid) setErrorMsg(null);
                    }}
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 text-center"
              >
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-slate-900" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900">Quantos blocos o condomínio possui?</h2>
                  <p className="text-slate-500 text-sm max-w-md mx-auto">
                    Informe o número total de torres ou blocos independentes para estruturarmos seu banco de dados de unidades.
                  </p>
                </div>

                {/* Counter Selector */}
                <div className="flex items-center justify-center gap-6 py-4">
                  <button
                    id="btn-decrement-blocks"
                    onClick={() => setBlocks(Math.max(1, blocks - 1))}
                    className="w-12 h-12 rounded-full border border-slate-300 text-slate-800 flex items-center justify-center hover:bg-slate-50 transition-colors active:scale-90"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <div className="w-16 text-center">
                    <span className="text-4xl font-extrabold text-slate-900">{blocks}</span>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-wider">Blocos</p>
                  </div>
                  <button
                    id="btn-increment-blocks"
                    onClick={() => setBlocks(Math.min(99, blocks + 1))}
                    className="w-12 h-12 rounded-full bg-slate-950 text-white flex items-center justify-center hover:bg-slate-800 transition-colors active:scale-90 shadow-md"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Quick select chips */}
                <div className="flex flex-wrap justify-center gap-2">
                  {[1, 2, 4, 8].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setBlocks(v)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        blocks === v
                          ? 'bg-slate-950 border-slate-950 text-white shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {v === 1 ? 'Torre Única' : `${v} Blocos`}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 text-center"
              >
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-slate-900" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900">Escopo do Condomínio</h2>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto">
                    Precisamos dessa informação para configurar os módulos de acesso e logística do condomínio.
                  </p>
                </div>
                <div className="max-w-xs mx-auto space-y-2">
                  <label className="block text-xs font-bold text-slate-400 text-left uppercase tracking-wider">
                    Quantos apartamentos possui no total?
                  </label>
                  <div className="relative">
                    <input
                      id="input-apartments"
                      type="number"
                      value={apartments}
                      onChange={(e) => setApartments(Math.max(1, parseInt(e.target.value) || 0))}
                      placeholder="Ex: 124"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-950 focus:border-transparent p-4 text-center text-lg font-bold text-slate-900"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-xs font-semibold text-red-700 rounded-2xl flex items-center gap-2 mt-6 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-150 mt-8">
          <button
            id="btn-prev-step"
            onClick={prevStep}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold text-slate-700 border border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 1 ? 'Cancelar' : 'Voltar'}
          </button>
          
          <button
            id="btn-next-step"
            onClick={nextStep}
            className="w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-semibold bg-slate-950 text-white hover:bg-slate-800 transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {step === 4 ? 'Finalizar Etapa' : 'Próximo'}
            {step === 4 ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Support Note */}
        <div className="mt-8 flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
          <Info className="w-5 h-5 text-slate-400 shrink-0" />
          <p className="text-xs text-slate-500 leading-relaxed">
            Você poderá reajustar essas configurações estruturais a qualquer momento através do painel geral de suporte ou configurações de infraestrutura.
          </p>
        </div>
      </div>

      {/* Aesthetic ambient blobs */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[40%] bg-slate-200 rounded-full blur-[140px] opacity-30" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[35%] h-[35%] bg-sky-200 rounded-full blur-[120px] opacity-20" />
      </div>
    </div>
  );
}
