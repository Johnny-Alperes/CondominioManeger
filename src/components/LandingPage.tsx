import { Shield, Menu, X } from 'lucide-react';
import { CondoConfig } from '../types';
import { useState } from 'react';

interface LandingPageProps {
  isLoggedIn: boolean;
  onStartConfig: () => void;
  onEnterApp: () => void;
  onLogout: () => void;
  condoConfig: CondoConfig;
}

export default function LandingPage({ isLoggedIn, onStartConfig, onEnterApp, onLogout }: LandingPageProps) {
  const [menu, setMenu] = useState(false);

  return (
    <div className="h-screen w-screen bg-zinc-950 text-white overflow-hidden flex flex-col font-mono antialiased relative selection:bg-zinc-700">

      {/* background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=80"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-zinc-950/70" />

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

      {/* center content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="text-center space-y-6">
          <span className="text-[10px] text-zinc-600 tracking-[0.3em] uppercase">Portaria Inteligente</span>
          <h1 className="text-5xl md:text-7xl font-black leading-[0.85] tracking-tighter text-white">
            SEU<br />
            <span className="text-zinc-500">CONDOMÍNIO</span><br />
            NO CONTROLE
          </h1>
          <p className="text-sm text-zinc-600 leading-relaxed max-w-md mx-auto">
            Reconhecimento de placas, liberação remota e relatórios automáticos em um painel.
          </p>
          <div className="flex gap-2 pt-2 justify-center">
            <button onClick={onStartConfig} className="bg-white text-zinc-950 px-6 py-3 text-sm font-bold hover:bg-zinc-200 transition-all uppercase tracking-widest">
              Ativar
            </button>
            <button onClick={onEnterApp} className="border border-zinc-800 text-zinc-500 px-6 py-3 text-sm font-bold hover:border-zinc-600 hover:text-zinc-300 transition-all uppercase tracking-widest">
              Painel
            </button>
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
