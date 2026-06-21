/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { MapPin, ZoomIn, ZoomOut, Compass, Navigation, RefreshCw, Eye } from 'lucide-react';

interface SimulatedMapProps {
  address: string;
  condoName: string;
}

export default function SimulatedMap({ address, condoName }: SimulatedMapProps) {
  const [zoom, setZoom] = useState<number>(1.2);
  const [mapType, setMapType] = useState<'vector' | 'satellite' | 'traffic' | 'blueprint'>('vector');
  const [coords, setCoords] = useState({ lat: -23.55052, lng: -46.633308 });
  const [isRotating, setIsRotating] = useState(false);
  const [angle, setAngle] = useState(0);

  // Generate deterministic coordinates based on the address string
  useEffect(() => {
    if (!address) return;
    
    // Simple hash function to generate deterministic but realistic-looking coordinates in Brazil
    let hash = 0;
    for (let i = 0; i < address.length; i++) {
      hash = address.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // São Paulo / Brazil bounding region
    const latOffset = (Math.abs(hash % 10000) / 10000) * 0.15 - 0.075;
    const lngOffset = (Math.abs((hash >> 3) % 10000) / 10000) * 0.15 - 0.075;
    
    setCoords({
      lat: -23.55052 + latOffset,
      lng: -46.633308 + lngOffset
    });
  }, [address]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2.2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.6));
  
  const rotateCompass = () => {
    setIsRotating(true);
    setAngle(prev => (prev + 90) % 360);
    setTimeout(() => setIsRotating(false), 500);
  };

  // Extract street name or use default
  const streetName = address ? address.split(',')[0] : 'Rua Principal';
  const neighborhood = address ? address.split('-')[1]?.trim() || address.split(',')[1]?.trim() || 'Bairro Alvorada' : 'Bairro Alvorada';

  return (
    <div className="w-full bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-800 relative z-10 flex flex-col h-[340px] text-slate-100 select-none">
      
      {/* Header Bar */}
      <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-850 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest text-slate-405 text-slate-400">
            GPS Ativo • Coordenadas de Satélite
          </span>
        </div>
        <div className="text-[10px] font-mono text-slate-500">
          Lat: {coords.lat.toFixed(6)} | Lng: {coords.lng.toFixed(6)}
        </div>
      </div>

      {/* Map Stage Container */}
      <div className="flex-1 relative overflow-hidden bg-slate-950">
        
        {/* The Animated Grid Background representing Mock Map */}
        <div 
          className="absolute inset-0 transition-transform duration-500 ease-out"
          style={{ 
            transform: `scale(${zoom}) rotate(${angle}deg)`,
            transformOrigin: 'center center'
          }}
        >
          {/* Map Layers depending on Selection */}
          {mapType === 'vector' && (
            <svg className="w-full h-full opacity-60" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Green Park */}
              <rect x="20" y="30" width="120" height="90" rx="12" fill="#064e3b" fillOpacity="0.4" stroke="#059669" strokeWidth="1" strokeDasharray="4 2" />
              <text x="35" y="75" fill="#34d399" className="text-[11px] font-bold font-sans tracking-wide">Parque Ecológico</text>
              
              {/* Blue Lake / River */}
              <path d="M 320 0 Q 300 120 380 200 T 400 300" stroke="#0369a1" strokeWidth="24" fill="none" strokeLinecap="round" opacity="0.6" />
              <path d="M 320 0 Q 300 120 380 200 T 400 300" stroke="#38bdf8" strokeWidth="2" fill="none" strokeDasharray="4 4" opacity="0.4" />
              
              {/* Grid Roads */}
              {/* Avenue vertical */}
              <line x1="200" y1="0" x2="200" y2="300" stroke="#475569" strokeWidth="24" />
              <line x1="200" y1="0" x2="200" y2="300" stroke="#1e293b" strokeWidth="22" />
              <line x1="200" y1="0" x2="200" y2="300" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.5" /> {/* Main Avenue strip */}

              {/* Street horizontal */}
              <line x1="0" y1="150" x2="400" y2="150" stroke="#475569" strokeWidth="18" />
              <line x1="0" y1="150" x2="400" y2="150" stroke="#1e293b" strokeWidth="16" />
              <line x1="0" y1="150" x2="400" y2="150" stroke="#ffffff" strokeWidth="1" strokeDasharray="6 4" opacity="0.3" />

              {/* Diagonal Connector Street */}
              <line x1="0" y1="50" x2="200" y2="150" stroke="#475569" strokeWidth="14" />
              <line x1="0" y1="50" x2="200" y2="150" stroke="#1e293b" strokeWidth="12" />

              {/* Neighborhood block dividers */}
              <rect x="230" y="25" width="60" height="40" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
              <rect x="230" y="80" width="60" height="50" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
              <rect x="40" y="190" width="110" height="80" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="1" />

              {/* Street Labels */}
              <text x="215" y="210" fill="#94a3b8" className="text-[9px] font-mono tracking-widest" transform="rotate(90, 215, 210)">Av. Central</text>
              <text x="50" y="144" fill="#cbd5e1" className="text-[9px] font-bold">{streetName}</text>
              <text x="238" y="50" fill="#64748b" className="text-[8px] font-bold">Q. 04</text>
              <text x="238" y="110" fill="#64748b" className="text-[8px] font-bold">Q. 05</text>
              <text x="50" y="215" fill="#64748b" className="text-[10px] font-bold font-sans opacity-70">{condoName || 'Condomínio'} Area</text>
            </svg>
          )}

          {mapType === 'satellite' && (
            <div className="absolute inset-0 bg-slate-950 flex items-center justify-center">
              {/* Satellite Simulation Grid */}
              <div className="absolute inset-0 bg-[radial-gradient(#10b981_1.2px,transparent_1.2px)] [background-size:16px_16px] opacity-15" />
              <svg className="w-full h-full opacity-70" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Forest Areas */}
                <rect x="10" y="20" width="140" height="110" rx="16" fill="#022c22" stroke="#059669" strokeWidth="2" opacity="0.6" />
                <path d="M 50,35 Q 60,60 80,40 T 110,60" stroke="#10b981" strokeWidth="1.5" fill="none" opacity="0.3" />
                
                {/* Water Reservoir */}
                <path d="M 300 0 Q 280 120 370 210 T 400 300" stroke="#082f49" strokeWidth="32" fill="none" strokeLinecap="round" />
                <path d="M 300 0 Q 280 120 370 210 T 400 300" stroke="#0369a1" strokeWidth="24" fill="none" strokeLinecap="round" opacity="0.5" />

                {/* Building Outlines */}
                <rect x="230" y="20" width="55" height="35" rx="4" fill="#040b14" stroke="#475569" strokeWidth="2" />
                <rect x="232" y="22" width="22" height="12" fill="#1e293b" />
                <rect x="260" y="22" width="22" height="12" fill="#1e293b" />
                
                <rect x="230" y="75" width="55" height="45" rx="4" fill="#040b14" stroke="#475569" strokeWidth="2" />
                <circle cx="257" cy="97" r="10" fill="#0f172a" stroke="#334155" strokeWidth="1" />

                {/* Target Arena (Condo blocks mock) */}
                <rect x="40" y="180" width="120" height="90" rx="14" fill="#030712" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />
                <text x="50" y="205" fill="#10b981" className="text-[8px] font-bold font-mono tracking-wider">ÁREA ALVO DE LOGÍSTICA</text>

                {/* Road overlays */}
                <line x1="200" y1="0" x2="200" y2="300" stroke="#1f2937" strokeWidth="12" />
                <line x1="200" y1="0" x2="200" y2="300" stroke="#374151" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="150" x2="400" y2="150" stroke="#1f2937" strokeWidth="10" />
              </svg>
              <div className="absolute top-4 left-4 bg-slate-900/90 py-1 px-2.5 rounded-md border border-slate-700/80 text-[7px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                IMG STATUS ROUTER SECURE
              </div>
            </div>
          )}

          {mapType === 'traffic' && (
            <svg className="w-full h-full opacity-70" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Roads with traffic overlay */}
              <line x1="200" y1="0" x2="200" y2="300" stroke="#1e293b" strokeWidth="16" />
              <line x1="0" y1="150" x2="400" y2="150" stroke="#1e293b" strokeWidth="14" />
              <line x1="0" y1="50" x2="200" y2="150" stroke="#1e293b" strokeWidth="10" />

              {/* Traffic flows */}
              {/* Red (Congestion) */}
              <line x1="200" y1="0" x2="200" y2="110" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" className="animate-pulse" />
              <text x="210" y="60" fill="#ef4444" className="text-[7px] font-bold font-mono">TRÂFEGO INTENSO</text>

              {/* Orange (Moderate) */}
              <line x1="200" y1="110" x2="200" y2="180" stroke="#f97316" strokeWidth="4" strokeLinecap="round" />
              
              {/* Green (Fluid) */}
              <line x1="200" y1="180" x2="200" y2="300" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
              <line x1="0" y1="150" x2="400" y2="150" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
              <line x1="0" y1="50" x2="200" y2="150" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />

              {/* Transit Nodes */}
              <circle cx="200" cy="150" r="14" fill="#0f172a" stroke="#f97316" strokeWidth="3" />
              <text x="195" y="153" fill="#ffffff" className="text-[8px] font-bold font-mono">15m</text>
            </svg>
          )}

          {mapType === 'blueprint' && (
            <div className="absolute inset-0 bg-sky-950 flex items-center justify-center">
              {/* Draft Blueprint simulation */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#0369a1_1px,transparent_1px),linear-gradient(to_bottom,#0369a1_1px,transparent_1px)] [background-size:20px_20px] opacity-25" />
              <svg className="w-full h-full opacity-60" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Structural outlines */}
                <rect x="40" y="30" width="120" height="90" rx="2" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="40" y1="30" x2="160" y2="120" stroke="#0284c7" strokeWidth="0.5" />
                <line x1="160" y1="30" x2="40" y2="120" stroke="#0284c7" strokeWidth="0.5" />
                
                {/* Center Road tracks */}
                <line x1="200" y1="0" x2="200" y2="300" stroke="#0284c7" strokeWidth="4" />
                <line x1="0" y1="150" x2="400" y2="150" stroke="#0284c7" strokeWidth="4" />

                {/* Main plot map */}
                <rect x="230" y="40" width="120" height="210" rx="8" stroke="#38bdf8" strokeWidth="1.5" fill="#082f49" fillOpacity="0.6" />
                <text x="245" y="65" fill="#38bdf8" className="text-[10px] font-mono tracking-wider font-semibold">PLANTA DE ACESSO</text>
                
                {/* Simulated blocks */}
                <rect x="245" y="90" width="40" height="40" rx="3" stroke="#38bdf8" strokeWidth="1" />
                <text x="257" y="113" fill="#38bdf8" className="text-[8px] font-mono">B-1</text>
                
                <rect x="300" y="90" width="40" height="40" rx="3" stroke="#38bdf8" strokeWidth="1" />
                <text x="312" y="113" fill="#38bdf8" className="text-[8px] font-mono">B-2</text>

                <rect x="245" y="145" width="40" height="40" rx="3" stroke="#38bdf8" strokeWidth="1" />
                <text x="257" y="168" fill="#38bdf8" className="text-[8px] font-mono">B-3</text>
                
                <rect x="300" y="145" width="40" height="40" rx="3" stroke="#38bdf8" strokeWidth="1" />
                <text x="312" y="168" fill="#38bdf8" className="text-[8px] font-mono">B-4</text>

                {/* Boundary parameters */}
                <line x1="220" y1="40" x2="220" y2="250" stroke="#38bdf8" strokeWidth="0.75" strokeDasharray="5 5" />
                <text x="210" y="145" fill="#7dd3fc" className="text-[7px]" transform="rotate(-90 210 145)">Limite Limítrofe: 210m</text>
              </svg>
            </div>
          )}
        </div>

        {/* Central Pulsing Target Bouncing Pin */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center justify-center relative translate-y-[-16px]">
            
            {/* Pulsing ring indicator */}
            <span className="absolute bottom-[-1px] w-6 h-6 bg-slate-950/40 rounded-full border border-sky-400 scale-[2.2] animate-ping opacity-60"></span>
            <span className="absolute bottom-[-3px] w-4 h-3 bg-slate-950/70 rounded-full blur-[1.5px] scale-[1.5]"></span>

            {/* Bouncing Map Pin Container */}
            <div className="relative animate-bounce duration-1000 bg-rose-600 text-white rounded-full p-2.5 shadow-2xl relative z-10 border-2 border-white">
              <MapPin className="w-5 h-5 fill-rose-600 text-white" />
            </div>

            {/* Premium Float Tooltip Card */}
            <div className="absolute top-[48px] bg-slate-900/95 border border-slate-700/70 rounded-xl px-3 py-2 text-center shadow-2xl w-48 backdrop-blur-md opacity-90">
              <h5 className="text-[10px] font-extrabold text-white truncate uppercase tracking-wider">{condoName || 'Condomínio'}</h5>
              <p className="text-[8px] text-slate-350 truncate mt-0.5 font-semibold text-slate-300">{streetName || 'Rua Principal'}</p>
              <p className="text-[7px] text-slate-450 font-mono text-slate-400 mt-0.5">{neighborhood}</p>
            </div>
          </div>
        </div>

        {/* Map Type Mode Overlay Selector Tabs */}
        <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-750 p-1.5 rounded-2xl flex gap-1 z-20 backdrop-blur-sm">
          {(['vector', 'satellite', 'traffic', 'blueprint'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setMapType(type)}
              className={`px-2.5 py-1 text-[8px] font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                mapType === type
                  ? 'bg-white text-slate-900 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {type === 'vector' && 'Mapa'}
              {type === 'satellite' && 'Satélite'}
              {type === 'traffic' && 'Tráfego'}
              {type === 'blueprint' && 'Planta'}
            </button>
          ))}
        </div>

        {/* Float Right Action Controls column */}
        <div className="absolute right-3 top-3 flex flex-col gap-2 z-20">
          <button
            type="button"
            onClick={rotateCompass}
            className={`w-8 h-8 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-750 flex items-center justify-center text-slate-200 transition-all active:scale-90 shadow-lg backdrop-blur-sm cursor-pointer ${isRotating ? 'animate-spin' : ''}`}
            title="Rotacionar Mapa"
          >
            <Compass 
              className="w-4 h-4 text-slate-100 transition-transform duration-500" 
              style={{ transform: `rotate(${angle}deg)` }} 
            />
          </button>
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-8 h-8 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-750 flex items-center justify-center text-slate-200 transition-all active:scale-90 shadow-lg backdrop-blur-sm cursor-pointer"
            title="Aumentar Zoom"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-8 h-8 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-750 flex items-center justify-center text-slate-200 transition-all active:scale-90 shadow-lg backdrop-blur-sm cursor-pointer"
            title="Diminuir Zoom"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              // Trigger slight shake/jitter simulation of coordinates
              setCoords(prev => ({
                lat: prev.lat + (Math.random() * 0.002 - 0.001),
                lng: prev.lng + (Math.random() * 0.002 - 0.001)
              }));
            }}
            className="w-8 h-8 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-750 flex items-center justify-center text-slate-200 transition-all active:scale-90 shadow-lg backdrop-blur-sm cursor-pointer animate-pulse"
            title="Recalibrar Sinal"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Small Compass Arrow Pointer in left-bottom corner */}
        <div className="absolute left-3 bottom-3 pointer-events-none z-20 bg-slate-950/80 border border-slate-800 rounded-xl p-1.5 flex items-center gap-1.5 text-[8px] font-mono text-slate-300 backdrop-blur-sm">
          <Navigation 
            className="w-3 h-3 text-rose-500 fill-rose-500" 
            style={{ transform: `rotate(${33 - angle}deg)` }} // Static offset rotated map alignment
          />
          <span>NORTE ({((360 - angle) % 360)}°)</span>
        </div>

        {/* Interactive Coordinate overlay bar bottom-right */}
        <div className="absolute right-3 bottom-3 pointer-events-none z-20 bg-slate-950/80 border border-slate-800 rounded-xl px-2 py-1 text-[8px] font-mono text-slate-300 backdrop-blur-sm flex items-center gap-1">
          <Eye className="w-3 h-3 text-slate-450 text-slate-400" />
          <span>SIMULAÇÃO DE SENSORES OK</span>
        </div>

      </div>
    </div>
  );
}
