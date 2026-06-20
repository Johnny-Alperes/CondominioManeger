/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { Users, UserPlus, Search, Trash2, ShieldCheck, Car, Pencil, Phone, X } from 'lucide-react';
import { Resident } from '../types';

interface ResidentListProps {
  residents: Resident[];
  blocksCount: number;
  onAddResident: (resident: Resident) => void;
  onRemoveResident: (id: string) => void;
  onUpdateResident: (resident: Resident) => void;
  onAddAlert: (msg: string) => void;
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

const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

/// High-quality avatars grouped by gender representation
export const MALE_AVATARS = [
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=3.0&w=256&h=256&q=80' // Homem (Bonito, sem óculos, enquadramento perfeito com facepad)
];

export const FEMALE_AVATARS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=3.0&w=256&h=256&q=80' // Mulher (Bonita, enquadramento perfeito com facepad)
];

const normalizeStr = (str: string) => 
  str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : '';

export function getGenderByName(fullName: string): 'M' | 'F' {
  const cleanName = fullName.replace(/[\.\,\-\_]/g, ' ');
  const parts = cleanName.trim().split(/\s+/).map(p => 
    p.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  ).filter(p => p.length > 0);

  if (parts.length === 0) return 'M';

  const titles: Record<string, 'M' | 'F'> = {
    'dra': 'F',
    'sra': 'F',
    'dona': 'F',
    'prof': 'M',
    'profa': 'F',
    'sr': 'M',
    'seu': 'M',
    'dr': 'M'
  };

  let firstName = parts[0];
  if (titles[firstName]) {
    const titleGender = titles[firstName];
    if (parts.length > 1) {
      firstName = parts[1];
    } else {
      return titleGender;
    }
  }
  
  // High confidence female names
  const femaleExact = [
    'beatriz', 'alice', 'yasmin', 'ester', 'ruth', 'abigail', 'isabel', 'izabel', 'lucy', 
    'miriam', 'sarah', 'iris', 'solange', 'marlene', 'carol', 'caroline', 
    'vivi', 'vivian', 'elizabeth', 'sueli', 'cleide', 'nair', 'roseli', 'suelen',
    'suellen', 'ellen', 'karen', 'evelyn', 'helen', 'carmen', 'maribel', 'shirley',
    'kelly', 'ketly', 'rose', 'simone', 'solange', 'neide', 'janete', 'ivone', 
    'irene', 'margarida', 'lourdes', 'ines', 'denise', 'gisele', 'giselle', 
    'michelle', 'michele', 'aline', 'karine', 'eliane', 'cristiane', 'viviane', 
    'daiane', 'tatiane', 'lidiane', 'elizangela', 'rosangela', 'mariangela'
  ];

  // High confidence male names
  const maleExact = [
    'luca', 'lucas', 'andrea', 'danilo', 'paulo', 'murilo', 'alexandre', 'sena', 'moraes', 
    'costa', 'souza', 'silva', 'guilherme', 'henrique', 'felipe', 'vicente', 'jorge', 
    'jose', 'andre', 'rene', 'dante', 'pierre', 'filipe', 'bento', 'valdir', 'heitor',
    'marcos', 'mateus', 'matheus', 'carlos', 'tiago', 'thiago', 'roberto', 'marcelo',
    'pedro', 'arthur', 'igor', 'alencar', 'cesar', 'victor', 'douglas', 'jonas',
    'matias', 'tobias', 'thomas', 'vinicius', 'moises', 'benjamin', 'joaquim',
    'william', 'alan', 'renan', 'natan', 'jonathan', 'kevin', 'edu', 'caio', 'felix',
    'alex', 'luiz', 'ruiz', 'ariel', 'daniel', 'gabriel', 'rafael', 'samuel', 'miguel',
    'joel', 'michel'
  ];
  
  if (femaleExact.includes(firstName)) return 'F';
  if (maleExact.includes(firstName)) return 'M';
  
  // Suffix checks on stripped/normalized names
  if (firstName.endsWith('a')) {
    return 'F'; // Almost all female names in PT end in a
  }
  
  if (firstName.endsWith('e')) {
    const maleNamesEndingInE = [
      'alexandre', 'guilherme', 'henrique', 'felipe', 'filipe', 'vicente', 'jorge', 
      'jose', 'andre', 'rene', 'dante', 'pierre'
    ];
    if (maleNamesEndingInE.includes(firstName)) {
      return 'M';
    }
    return 'F'; // Cristiane, Rose, Gisele, Simone etc.
  }
  
  // Common female suffix endings in Portuguese
  const femaleEndings = ['is', 'iz', 'ys', 'en', 'yn', 'in', 'th', 'ldy', 'ly', 'ry'];
  const isFemaleEnding = femaleEndings.some(end => firstName.endsWith(end));
  if (isFemaleEnding) {
    const maleExceptions = ['luiz', 'denis', 'regis', 'benjamin', 'franklin', 'wesley', 'valdir', 'henry'];
    if (maleExceptions.includes(firstName)) {
      return 'M';
    }
    return 'F';
  }
  
  // Default fallback is male
  return 'M';
}

export const getAvatar = (name: string, gender?: 'M' | 'F'): string => {
  const finalGender = gender || getGenderByName(name);
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  if (finalGender === 'F') {
    return FEMALE_AVATARS[hash % FEMALE_AVATARS.length];
  } else {
    return MALE_AVATARS[hash % MALE_AVATARS.length];
  }
};

export default function ResidentList({ 
  residents, 
  blocksCount,
  onAddResident, 
  onRemoveResident,
  onUpdateResident,
  onAddAlert
}: ResidentListProps) {
  
  // Helper to generate dynamic block names based on condo blocks count
  const getBlockNames = (count: number) => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      const charCode = 65 + i;
      if (charCode <= 90) {
        list.push(`Bloco ${String.fromCharCode(charCode)}`);
      } else {
        list.push(`Bloco ${i - 25}`);
      }
    }
    return list;
  };

  const blockNames = getBlockNames(blocksCount);
  const defaultBlock = blockNames[0] || 'Bloco A';

  // States for search and filtering
  const [filterQuery, setFilterQuery] = useState('');
  const [filterBlock, setFilterBlock] = useState('Todos');

  // Form states for adding new resident
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [editingResidentId, setEditingResidentId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newGender, setNewGender] = useState<'M' | 'F'>('M');
  const [userTouchedGender, setUserTouchedGender] = useState(false);
  const [newUnit, setNewUnit] = useState('');
  const [newBlock, setNewBlock] = useState(defaultBlock);
  const [newRole, setNewRole] = useState<'Proprietário' | 'Inquilino' | 'Morador'>('Morador');
  const [newPhone, setNewPhone] = useState('');
  
  // Custom vehicle details on registration
  const [newPlate, setNewPlate] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newColor, setNewColor] = useState('Branco');
  
  // Multiple vehicles state
  const [formVehicles, setFormVehicles] = useState<Array<{ plate: string; model: string; color: string }>>([]);

  const handleStartEdit = (res: Resident) => {
    setEditingResidentId(res.id);
    setNewName(res.name);
    setNewGender(res.gender || getGenderByName(res.name));
    setUserTouchedGender(true);
    setNewUnit(res.unit);
    setNewBlock(res.block);
    setNewRole(res.role);
    setNewPhone(res.phone || '');
    
    // Load existing vehicles, fallback to single vehicle
    const vehiclesList = res.vehicles && res.vehicles.length > 0 
      ? res.vehicles 
      : (res.vehicle ? [res.vehicle] : []);
    setFormVehicles(vehiclesList);

    setNewPlate('');
    setNewModel('');
    setNewColor('Branco');
    setIsOpenForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddVehicleToFormList = () => {
    if (!newPlate.trim() || !newModel.trim()) {
      onAddAlert('Erro: Digite a placa e o modelo do veículo para adicionar.');
      return;
    }
    const exists = formVehicles.some(v => v.plate.toUpperCase() === newPlate.trim().toUpperCase());
    if (exists) {
      onAddAlert('Erro: Veículo com esta placa já está na lista.');
      return;
    }
    setFormVehicles([
      ...formVehicles,
      {
        plate: newPlate.trim().toUpperCase(),
        model: newModel.trim(),
        color: newColor
      }
    ]);
    setNewPlate('');
    setNewModel('');
    setNewColor('Branco');
  };

  const handleRemoveVehicleFromFormList = (plate: string) => {
    setFormVehicles(formVehicles.filter(v => v.plate.toUpperCase() !== plate.toUpperCase()));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newName || !newUnit) {
      onAddAlert('Erro: Por favor, preencha o nome do morador e o apartamento.');
      return;
    }

    // Capture inline vehicle if typed but not added
    let finalVehicles = [...formVehicles];
    if (newPlate.trim() && newModel.trim()) {
      const exists = finalVehicles.some(v => v.plate.toUpperCase() === newPlate.trim().toUpperCase());
      if (!exists) {
        finalVehicles.push({
          plate: newPlate.trim().toUpperCase(),
          model: newModel.trim(),
          color: newColor
        });
      }
    }

    if (editingResidentId) {
      const existing = residents.find(r => r.id === editingResidentId);
      if (existing) {
        const updated: Resident = {
          ...existing,
          name: newName,
          gender: newGender,
          role: newRole,
          unit: newUnit,
          block: newBlock,
          phone: newPhone,
          avatar: getAvatar(newName, newGender),
          vehicle: finalVehicles[0] || undefined,
          vehicles: finalVehicles
        };
        onUpdateResident(updated);
        onAddAlert(`Cadastro de morador atualizado: ${newName}`);
      }
      setEditingResidentId(null);
    } else {
      const added: Resident = {
        id: `res-${Date.now()}`,
        name: newName,
        gender: newGender,
        role: newRole,
        unit: newUnit,
        block: newBlock,
        phone: newPhone,
        avatar: getAvatar(newName, newGender),
        vehicle: finalVehicles[0] || undefined,
        vehicles: finalVehicles,
        isActive: true
      };

      onAddResident(added);
      onAddAlert(`Novo morador cadastrado: ${newName} (Ap ${newUnit} - ${newBlock})`);
    }

    // Reset Form
    setNewName('');
    setNewGender('M');
    setUserTouchedGender(false);
    setNewUnit('');
    setNewBlock(defaultBlock);
    setNewRole('Morador');
    setNewPhone('');
    setNewPlate('');
    setNewModel('');
    setNewColor('Branco');
    setFormVehicles([]);
    setIsOpenForm(false);
  };

  // Filter list
  const filteredResidents = residents.filter(res => {
    const qNormalized = normalizeStr(filterQuery);
    const matchesQuery = 
      normalizeStr(res.name).includes(qNormalized) ||
      res.unit.includes(filterQuery) ||
      (res.vehicle?.plate && normalizeStr(res.vehicle.plate).includes(qNormalized)) ||
      (res.vehicles?.some(v => normalizeStr(v.plate).includes(qNormalized)));
    
    const matchesBlock = filterBlock === 'Todos' || res.block === filterBlock;

    return matchesQuery && matchesBlock;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-bold text-lg text-slate-900 leading-none">Banco de Moradores Ativos</h3>
          <p className="text-xs text-slate-500 mt-1">Gerencie chaves, moradores e veículos do condomínio</p>
        </div>

        <button
          id="btn-toggle-add-form"
          onClick={() => {
            if (isOpenForm) {
              setEditingResidentId(null);
              setNewName('');
              setNewGender('M');
              setUserTouchedGender(false);
              setNewUnit('');
              setNewBlock(defaultBlock);
              setNewRole('Morador');
              setNewPhone('');
              setNewPlate('');
              setNewModel('');
              setNewColor('Branco');
            }
            setIsOpenForm(!isOpenForm);
          }}
          className="bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs py-3 px-5 rounded-xl transition-all shadow-sm flex items-center gap-2 active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>{isOpenForm ? (editingResidentId ? 'Cancelar Edição' : 'Cancelar Cadastro') : 'Cadastrar Novo Morador'}</span>
        </button>
      </div>

      {/* Form collapse container */}
      {isOpenForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-slate-150 shadow-md grid grid-cols-1 md:grid-cols-12 gap-4 animate-in slide-in-from-top-4 duration-250">
          <div className="col-span-12 border-b border-slate-100 pb-2 mb-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-widest block">
              {editingResidentId ? 'Editar Cadastro de Morador' : 'Novo Registro de Habitante'}
            </span>
          </div>

          <div className="col-span-12 md:col-span-3">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nome Completo</label>
            <input
              id="input-new-res-name"
              type="text"
              placeholder="Ex: Amanda Rezende"
              value={newName}
              onChange={(e) => {
                const val = e.target.value;
                setNewName(val);
                if (!userTouchedGender) {
                  setNewGender(getGenderByName(val));
                }
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold"
              required
            />
          </div>

          <div className="col-span-6 md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sexo / Gênero</label>
            <select
              id="select-new-res-gender"
              value={newGender}
              onChange={(e) => {
                setNewGender(e.target.value as 'M' | 'F');
                setUserTouchedGender(true);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-700"
            >
              <option value="M">Masculino ♂</option>
              <option value="F">Feminino ♀</option>
            </select>
          </div>

          <div className="col-span-6 md:col-span-1">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Apartamento</label>
            <input
              id="input-new-res-unit"
              type="text"
              placeholder="Ex: 502"
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-center"
              required
            />
          </div>

          <div className="col-span-6 md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bloco / Torre</label>
            <select
              id="select-new-res-block"
              value={newBlock}
              onChange={(e) => setNewBlock(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-700"
            >
              {blockNames.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="col-span-6 md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Vínculo Civil</label>
            <select
              id="select-new-res-role"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-700"
            >
              <option value="Morador">Morador Comum</option>
              <option value="Proprietário">Proprietário</option>
              <option value="Inquilino">Inquilino / Locatário</option>
            </select>
          </div>

          <div className="col-span-6 md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Telefone</label>
            <input
              id="input-new-res-phone"
              type="text"
              placeholder="Ex: (11) 91234-5678"
              value={newPhone}
              onChange={(e) => setNewPhone(formatPhone(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800"
            />
          </div>

          {/* Vehicle section within resident creation */}
          <div className="col-span-12 grid grid-cols-12 gap-4 pt-4 border-t border-slate-100 mt-2">
            <div className="col-span-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5" />
                <span>Registrar Veículos Associados (Suporta múltiplos veículos)</span>
              </span>
            </div>

            {/* List of currently added vehicles list in form */}
            {formVehicles.length > 0 && (
              <div className="col-span-12 flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-150 rounded-2xl">
                {formVehicles.map((veh) => (
                  <div key={veh.plate} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-xs">
                    <div className="text-[11px] font-bold text-slate-800">
                      <span>{veh.model}</span> <span className="text-slate-400 font-normal">({veh.color})</span>
                    </div>
                    <span className="px-1.5 py-0.5 bg-slate-900 text-white rounded text-[9px] font-black uppercase font-mono tracking-wider">
                      {veh.plate}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveVehicleFromFormList(veh.plate)}
                      className="text-red-500 hover:text-red-700 hover:bg-slate-100 p-0.5 rounded cursor-pointer transition-colors shrink-0"
                      title="Remover Veículo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="col-span-12 sm:col-span-4">
              <label className="block text-xs font-bold text-slate-400 mb-2">Placa do Veículo</label>
              <input
                id="input-new-res-plate"
                type="text"
                placeholder="ABC-1234"
                value={newPlate}
                onChange={(e) => setNewPlate(formatPlate(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-extrabold text-center uppercase tracking-widest"
              />
            </div>

            <div className="col-span-12 sm:col-span-4">
              <label className="block text-xs font-bold text-slate-400 mb-2">Marca / Modelo do Veículo</label>
              <input
                id="input-new-res-model"
                type="text"
                placeholder="Ex: Honda Civic"
                value={newModel}
                onChange={(e) => setNewModel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold"
              />
            </div>

            <div className="col-span-12 sm:col-span-4 flex gap-2 items-end">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-400 mb-2">Cor Principal</label>
                <select
                  id="select-new-res-color"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-700"
                >
                  <option>Branco</option>
                  <option>Preto</option>
                  <option>Prata</option>
                  <option>Cinza</option>
                  <option>Azul</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleAddVehicleToFormList}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 p-3 rounded-xl border border-slate-200 font-bold text-xs shrink-0 h-[46px] flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95"
                title="Adicionar à lista de veículos"
              >
                <span>+ Adicionar</span>
              </button>
            </div>
          </div>

          <div className="col-span-12 pt-4 flex justify-end">
            <button
              id="btn-submit-new-resident"
              type="submit"
              className="bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs py-3 px-8 rounded-xl transition-all shadow-md active:scale-95"
            >
              {editingResidentId ? 'Salvar Alterações do Morador' : 'Gravar Cadastro de Morador'}
            </button>
          </div>
        </form>
      )}

      {/* Grid List displaying residents */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        
        {/* Search header filters */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <input
              id="input-res-filter"
              type="text"
              placeholder="Pesquisar por nome ou placa..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 pl-9 text-xs font-semibold text-slate-700"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          <select
            id="select-res-filter-block"
            value={filterBlock}
            onChange={(e) => setFilterBlock(e.target.value)}
            className="w-full sm:w-44 bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-700"
          >
            <option value="Todos">Todos os Blocos</option>
            {blockNames.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Residents grid list cells */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredResidents.length > 0 ? (
            filteredResidents.map(res => (
              <div 
                key={res.id} 
                className="p-5 rounded-2xl border border-slate-150 bg-white flex justify-between items-start hover:shadow-md transition-all gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <img 
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0" 
                    src={res.avatar} 
                    alt={res.name}
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1">{res.name}</h4>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-widest mt-0.5">
                      {res.block} • Ap {res.unit}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider inline-block mt-1">
                      {res.role}
                    </span>

                    {res.phone && (
                      <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{res.phone}</span>
                      </div>
                    )}

                    {/* Associated vehicle bubble */}
                    {res.vehicles && res.vehicles.length > 0 ? (
                      <div className="mt-3 space-y-1.5">
                        {res.vehicles.map((v) => (
                          <div key={v.plate} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                            <Car className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[120px]">{v.model} ({v.color})</span>
                            <span className="bg-slate-100 text-slate-800 px-1 rounded uppercase font-mono tracking-widest text-[9px]">{v.plate}</span>
                          </div>
                        ))}
                      </div>
                    ) : res.vehicle ? (
                      <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                        <Car className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[120px]">{res.vehicle.model}</span>
                        <span className="bg-slate-100 text-slate-800 px-1 rounded uppercase font-mono tracking-widest text-[9px]">{res.vehicle.plate}</span>
                      </div>
                    ) : (
                      <span className="text-[9px] font-bold text-slate-400 block mt-3 italic">Sem veículo cadastrado</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-1.5 shrink-0">
                  <button
                    id={`btn-edit-resident-${res.id}`}
                    onClick={() => handleStartEdit(res)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-950 hover:bg-slate-100 border border-transparent transition-all"
                    title="Editar Morador"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    id={`btn-remove-resident-${res.id}`}
                    onClick={() => setDeleteId(res.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 border border-transparent transition-all"
                    title="Remover Morador"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12 text-slate-400 font-semibold select-none">
              Nenhum morador registrado ou correspondente aos termos.
            </div>
          )}
        </div>

      </div>

      {/* Custom Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-100 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-50 text-red-650 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-base">Remover Morador?</h4>
              <p className="text-xs text-slate-500 mt-2">
                Tem certeza de que deseja remover <strong>{residents.find(r => r.id === deleteId)?.name}</strong>? Esta ação não poderá ser desfeita.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all border border-slate-200 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  const res = residents.find(r => r.id === deleteId);
                  if (res) {
                    onRemoveResident(deleteId);
                    onAddAlert(`Morador ${res.name} excluído do sistema.`);
                  }
                  setDeleteId(null);
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
