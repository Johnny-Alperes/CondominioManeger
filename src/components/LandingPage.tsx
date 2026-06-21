import { motion } from 'motion/react';
import { Shield, ArrowRight, Menu, X } from 'lucide-react';
import { CondoConfig } from '../types';
import { useState, useEffect } from 'react';

interface LandingPageProps {
  isLoggedIn: boolean;
  onStartConfig: () => void;
  onEnterApp: () => void;
  onLogout: () => void;
  condoConfig: CondoConfig;
}

function Clock() {
  const [t, setT] = useState('');
  useEffect(() => {
    const u = () => setT(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    u(); const i = setInterval(u, 1000);
    return () => clearInterval(i);
  }, []);
  return <span className="tabular-nums">{t}</span>;
}

const platesList = [
  { plate: 'BRA2E19', status: 1 }, { plate: 'ABC4J67', status: 1 }, { plate: 'XYZ3K12', status: 0 },
  { plate: 'QRS7M90', status: 1 }, { plate: 'JKL5N34', status: 1 }, { plate: 'GHI1Q56', status: -1 },
];

export default function LandingPage({ isLoggedIn, onStartConfig, onEnterApp, onLogout }: LandingPageProps) {
  const [menu, setMenu] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % platesList.length), 1800);
    return () => clearInterval(t);
  }, []);

  const activePlate = platesList[idx];

  return (
    <div className="h-screen w-screen bg-zinc-950 text-white overflow-hidden flex flex-col font-mono antialiased relative selection:bg-zinc-700">
      <style>{`@keyframes draw { to { stroke-dashoffset: 0; } }`}</style>

      {/* background wall */}
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
      }} />

      {/* top bar */}
      <header className="relative z-20 flex items-center justify-between px-6 h-14 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <Shield className="w-4 h-4 text-zinc-500" />
          <span className="text-xs font-semibold tracking-[0.2em] text-zinc-400 uppercase">Condominio Manager</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <button onClick={onStartConfig} className="text-xs text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">Acessar</button>
          <button onClick={onEnterApp} className="text-xs bg-white text-zinc-950 px-4 py-1.5 font-bold hover:bg-zinc-200 transition-all uppercase tracking-widest">Entrar</button>
          {isLoggedIn && <button onClick={onLogout} className="text-xs text-zinc-600 hover:text-zinc-400 uppercase tracking-widest">Sair</button>}
        </nav>
        <button onClick={() => setMenu(m => !m)} className="md:hidden text-zinc-500">
          {menu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </header>

      {menu && (
        <div className="relative z-20 bg-zinc-950 border-b border-zinc-800 px-6 py-4 space-y-3 md:hidden">
          <button onClick={() => { setMenu(false); onStartConfig(); }} className="block text-xs text-zinc-400 uppercase tracking-widest">Acessar</button>
          <button onClick={() => { setMenu(false); onEnterApp(); }} className="block w-full text-xs bg-white text-zinc-950 px-4 py-2 font-bold uppercase tracking-widest">Entrar</button>
          {isLoggedIn && <button onClick={() => { setMenu(false); onLogout(); }} className="block text-xs text-zinc-600 uppercase tracking-widest">Sair</button>}
        </div>
      )}

      {/* single screen — product interface */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl mx-auto grid lg:grid-cols-2 gap-0 items-center">

          {/* left: bare text */}
          <div className="space-y-6 pb-10 lg:pb-0">
            <span className="text-[10px] text-zinc-600 tracking-[0.3em] uppercase">Portaria Inteligente</span>
            <h1 className="text-5xl md:text-7xl font-black leading-[0.85] tracking-tighter text-white">
              SEU<br />
              <span className="text-zinc-500">CONDOMÍNIO</span><br />
              NO CONTROLE
            </h1>
            <p className="text-sm text-zinc-600 leading-relaxed max-w-xs">
              Reconhecimento de placas, liberação remota e relatórios automáticos em um painel.
            </p>
            <div className="flex gap-2 pt-2">
              <button onClick={onStartConfig} className="bg-white text-zinc-950 px-6 py-3 text-sm font-bold hover:bg-zinc-200 transition-all uppercase tracking-widest">
                Ativar
              </button>
              <button onClick={onEnterApp} className="border border-zinc-800 text-zinc-500 px-6 py-3 text-sm font-bold hover:border-zinc-600 hover:text-zinc-300 transition-all uppercase tracking-widest">
                Painel
              </button>
            </div>
          </div>

          {/* right: live monitor panel */}
          <div className="bg-zinc-900/80 border border-zinc-800 p-5 lg:p-6 w-full">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span className="text-[9px] text-zinc-500 uppercase tracking-[0.2em]">POR-01 • AO VIVO</span>
              </div>
              <span className="text-[9px] text-zinc-700"><Clock /></span>
            </div>

            <div className="space-y-0 mb-4">
              <div className="flex text-[8px] text-zinc-700 uppercase tracking-[0.2em] pb-2 border-b border-zinc-800/50 mb-1">
                <span className="w-20">Placa</span>
                <span className="w-16 hidden sm:block">Modelo</span>
                <span className="flex-1 text-right">Status</span>
              </div>
              {platesList.map((p, i) => (
                <div
                  key={p.plate}
                  className={`flex items-center py-2 text-[11px] border-b border-zinc-800/30 transition-opacity duration-300 ${
                    i === idx ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  <span className={`w-20 font-bold tracking-widest ${
                    i === idx ? 'text-white' : 'text-zinc-500'
                  }`}>{p.plate}</span>
                  <span className="w-16 text-zinc-600 hidden sm:block">VEÍCULO</span>
                  <span className={`flex-1 text-right font-bold text-[10px] ${
                    p.status === 1 ? 'text-emerald-500' : p.status === 0 ? 'text-zinc-600' : 'text-red-500'
                  }`}>
                    {p.status === 1 ? 'LIBERADO' : p.status === 0 ? 'AGENDADO' : 'NEGADO'}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-800 text-[8px] text-zinc-700 uppercase tracking-widest">
              <span>3 câmeras • 32 acessos hoje</span>
              <span className="flex items-center gap-1"><span className="w-1 h-1 bg-red-500 rounded-full animate-pulse" /> REC</span>
            </div>
          </div>

        </div>
      </main>

      <footer className="relative z-10 flex items-center justify-between px-6 h-12 border-t border-zinc-800 text-[9px] text-zinc-700 uppercase tracking-[0.15em]">
        <span>&copy; 2026</span>
        <span>NPX</span>
      </footer>
    </div>
  );
}
