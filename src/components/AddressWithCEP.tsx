/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ChangeEvent, useRef } from 'react';
import { Search, Loader2, MapPin, CheckCircle, AlertCircle, Edit, List } from 'lucide-react';
import SimulatedMap from './SimulatedMap';

interface AddressWithCEPProps {
  address: string;
  onChange: (fullAddress: string) => void;
  condoName: string;
  onValidChange?: (isValid: boolean) => void;
}

export default function AddressWithCEP({ address, onChange, condoName, onValidChange }: AddressWithCEPProps) {
  // Mode of input: 'cep' (structured fields with CEP lookup) or 'manual' (unstructured plain line)
  const [inputMode, setInputMode] = useState<'cep' | 'manual'>('cep');

  // Structured fields
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [stateCode, setStateCode] = useState('');

  // Unstructured field
  const [manualAddress, setManualAddress] = useState(address || '');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Keep track of the last processed address to break infinite loops
  const lastProcessedAddressRef = useRef<string>('');

  // Calculate validity
  const isValidAddress = inputMode === 'cep'
    ? (cep.replace(/\D/g, '').length === 8 &&
       street.trim() !== '' &&
       number.trim() !== '' &&
       neighborhood.trim() !== '' &&
       city.trim() !== '' &&
       stateCode.trim().length >= 2)
    : (manualAddress.trim() !== '');

  // Propagate validity up
  useEffect(() => {
    if (onValidChange) {
      onValidChange(isValidAddress);
    }
  }, [isValidAddress]);

  // Initialize structured fields from initial address on mount or changes
  useEffect(() => {
    if (!address) return;
    if (address === lastProcessedAddressRef.current) return;

    // Try to parse an existing structured address of style:
    // "Rua, Num, Compl - Bairro, Cidade - Estado, CEP: XXXXX-XXX"
    const cepMatch = address.match(/(?:CEP|cep)[\s:]*([\d-]{8,9})/i);
    const parsedCep = cepMatch ? cepMatch[1] : '';

    if (parsedCep && inputMode === 'cep') {
      setCep(parsedCep);
      // Try to split the rest
      const cleanAddressPart = address.replace(/(?:CEP|cep)[\s:]*[\d-]{8,9}/gi, '').trim().replace(/,\s*$/, '');
      const parts = cleanAddressPart.split(' - ');
      
      if (parts.length >= 3) {
        // e.g. ["Rua das Flores, 450", "Bairro", "São Paulo, SP"] or similar
        const firstPart = parts[0].split(',');
        const parsedStreet = firstPart[0]?.trim() || '';
        const parsedNumber = firstPart[1]?.trim() || '';
        
        const parsedBairro = parts[1]?.trim() || '';
        
        const finalPart = parts[2].split(',');
        const parsedCity = finalPart[0]?.trim() || '';
        const parsedState = finalPart[1]?.trim() || '';

        setStreet(parsedStreet);
        setNumber(parsedNumber);
        setNeighborhood(parsedBairro);
        setCity(parsedCity);
        setStateCode(parsedState);
      } else {
        // Simple fallback
        setManualAddress(address);
      }
    } else if (!cep) {
      // Unstructured address fallback
      setManualAddress(address);
    }
    
    lastProcessedAddressRef.current = address;
  }, [address]);

  // Sync back to parent when any structured field changes in 'cep' mode
  useEffect(() => {
    if (inputMode === 'cep') {
      const parts: string[] = [];
      
      if (street) {
        let streetLine = street;
        if (number) streetLine += `, ${number}`;
        parts.push(streetLine);
      } else {
        return; // Don't synchronize empty street
      }

      if (neighborhood) parts.push(neighborhood);
      
      let locLine = '';
      if (city) locLine += city;
      if (stateCode) locLine += `, ${stateCode}`;
      if (locLine) parts.push(locLine);
      
      if (cep) parts.push(`CEP: ${cep}`);

      const compiled = parts.join(' - ');
      if (compiled && compiled !== address) {
        lastProcessedAddressRef.current = compiled;
        onChange(compiled);
      }
    }
  }, [street, number, neighborhood, city, stateCode, cep, inputMode]);

  // Handle unstructured address change
  const handleManualAddressChange = (val: string) => {
    setManualAddress(val);
    lastProcessedAddressRef.current = val;
    onChange(val);
  };

  // CEP Trigger fetch Lookup
  const fetchCEP = async (cepValue: string) => {
    const cleaned = cepValue.replace(/\D/g, '');
    if (cleaned.length !== 8) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
      if (!response.ok) {
        throw new Error('Serviço de CEP indisponível no momento.');
      }
      
      const data = await response.json();
      
      if (data.erro) {
        setErrorMsg('CEP não localizado no banco de dados postal.');
      } else {
        setStreet(data.logradouro || '');
        setNeighborhood(data.bairro || '');
        setCity(data.localidade || '');
        setStateCode(data.uf || '');
        setSuccessMsg('Endereço autocompletado com sucesso!');
        setTimeout(() => setSuccessMsg(null), 3500);
      }
    } catch (err: any) {
      setErrorMsg('Falha ao conectar com o servidor postal local de CEP.');
    } finally {
      setLoading(false);
    }
  };

  const handleCepInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;
    // Format mask XXXXX-XXX
    raw = raw.replace(/\D/g, '');
    if (raw.length > 8) raw = raw.slice(0, 8);
    
    let formatted = raw;
    if (raw.length > 5) {
      formatted = `${raw.slice(0, 5)}-${raw.slice(5)}`;
    }
    
    setCep(formatted);

    if (raw.length === 8) {
      fetchCEP(raw);
    }
  };

  const currentComputedAddress = inputMode === 'cep' 
    ? [
        street ? `${street}${number ? `, ${number}` : ''}` : '',
        neighborhood || '',
        city ? `${city}${stateCode ? `, ${stateCode}` : ''}` : '',
        cep ? `CEP: ${cep}` : ''
      ].filter(Boolean).join(' - ') || 'Digite as informações do condomínio...'
    : manualAddress;

  return (
    <div className="space-y-6 w-full text-left">
      
      {/* Selector input mode toggle */}
      <div className="flex bg-slate-100 p-1 rounded-xl max-w-sm mx-auto">
        <button
          type="button"
          onClick={() => setInputMode('cep')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            inputMode === 'cep'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          Buscar CEP + Campos
        </button>
        <button
          type="button"
          onClick={() => setInputMode('manual')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            inputMode === 'manual'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Edit className="w-3.5 h-3.5" />
          Endereço Manual Livre
        </button>
      </div>

      {inputMode === 'cep' ? (
        <div className="space-y-4 animate-in fade-in duration-300">
          
          {/* Row: CEP Search Input */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
              Informe seu CEP do Condomínio <span className="text-rose-500 font-black text-sm">*</span>
            </label>
            <div className="relative">
              <input
                id="address-cep-input"
                type="text"
                value={cep}
                onChange={handleCepInputChange}
                placeholder="Ex: 01311-000"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-950 focus:border-transparent p-3.5 pl-11 text-sm font-semibold text-slate-900 tracking-wide"
              />
              <Search className="w-4 h-4 text-slate-450 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              {loading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-slate-900 animate-spin" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Buscando...</span>
                </div>
              )}
            </div>
          </div>

          {/* Alert messages feedback */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-xs font-semibold text-red-700 rounded-xl flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-250 text-xs font-semibold text-emerald-850 rounded-xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-650 text-emerald-500 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Sub Row: Logradouro & Number */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                Rua / Avenida / Logradouro <span className="text-rose-500 font-black text-sm">*</span>
              </label>
              <input
                id="address-street-input"
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Ex: Av. Paulista"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-950 focus:border-transparent p-3 text-xs font-semibold text-slate-900"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                Número <span className="text-rose-500 font-black text-sm">*</span>
              </label>
              <input
                id="address-number-input"
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="Ex: 450"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-950 focus:border-transparent p-3 text-xs font-semibold text-slate-900 text-center"
              />
            </div>
          </div>

          {/* Sub Row: Bairro, Cidade e Estado */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                Bairro <span className="text-rose-500 font-black text-sm">*</span>
              </label>
              <input
                id="address-neighborhood-input"
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Bela Vista"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-950 focus:border-transparent p-3 text-xs font-semibold text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                Cidade <span className="text-rose-500 font-black text-sm">*</span>
              </label>
              <input
                id="address-city-input"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="São Paulo"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-950 focus:border-transparent p-3 text-xs font-semibold text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                Estado (UF) <span className="text-rose-500 font-black text-sm">*</span>
              </label>
              <input
                id="address-state-input"
                type="text"
                value={stateCode}
                onChange={(e) => setStateCode(e.target.value.toUpperCase())}
                placeholder="SP"
                maxLength={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-950 focus:border-transparent p-3 text-xs font-semibold text-slate-900 text-center uppercase"
              />
            </div>
          </div>

        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
              Endereço Completo em Linha Física Única <span className="text-rose-500 font-black text-sm">*</span>
            </label>
            <textarea
              id="address-manual-textarea"
              rows={3}
              value={manualAddress}
              onChange={(e) => handleManualAddressChange(e.target.value)}
              placeholder="Digite o endereço completo com Rua, Número, Bairro, Cidade, Estado e CEP..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-950 focus:border-transparent p-4 text-sm font-semibold text-slate-900"
              required
            />
          </div>
        </div>
      )}

      {/* Styled Render Preview and Real Map Link */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
            Localização em Tempo Real (Simulação de Satélite)
          </span>
          <SimulatedMap 
            address={currentComputedAddress} 
            condoName={condoName || 'Seu Condomínio'} 
          />
        </div>
      </div>

    </div>
  );
}
