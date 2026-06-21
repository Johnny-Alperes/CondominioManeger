import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Shield, ArrowRight, Menu, X, Camera, Users, Car, Wifi, Zap, Fingerprint, BellRing, BarChart3, Clock, Building2, ChevronDown, Play, Pause, Activity, Radio, Scan, Key, Maximize2 } from 'lucide-react';
import { CondoConfig } from '../types';
import { useState, useRef, useEffect } from 'react';

interface LandingPageProps {
  isLoggedIn: boolean;
  onStartConfig: () => void;
  onEnterApp: () => void;
  onLogout: () => void;
  condoConfig: CondoConfig;
}

function LiveFeed({ onCountChange }: { onCountChange?: (n: number) => void }) {
  const entries = [
    { plate: 'BRA2E19', model: 'VW T-Cross', unit: 'Bl A • Ap 42', status: 'LIBERADO' },
    { plate: 'ABC4J67', model: 'Fiat Pulse', unit: 'Bl B • Ap 15', status: 'LIBERADO' },
    { plate: 'XYZ3K12', model: 'Honda Civic', unit: 'Visitante • Bl A', status: 'AGENDADO' },
    { plate: 'QRS7M90', model: 'Chevrolet Onix', unit: 'Bl C • Ap 08', status: 'LIBERADO' },
    { plate: 'JKL5N34', model: 'Toyota Corolla', unit: 'Bl A • Ap 33', status: 'LIBERADO' },
    { plate: 'MNO8P22', model: 'Ford Ranger', unit: 'Bl B • Ap 21', status: 'PENDENTE' },
    { plate: 'GHI1Q56', model: 'Renault Kwid', unit: 'Visitante • Bl C', status: 'NEGADO' },
    { plate: 'DEF9R78', model: 'Hyundai HB20', unit: 'Bl C • Ap 05', status: 'LIBERADO' },
  ];
  const count = 5;
  useEffect(() => { onCountChange?.(count); }, []);
  const shown = entries.slice(0, count);
  return (
    <div className="space-y-1 font-mono">
      <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.15em] text-slate-500 pb-2 border-b border-slate-800 mb-2">
        <span className="w-[90px]">Placa</span>
        <span className="w-[90px]">Modelo</span>
        <span className="w-[110px] hidden sm:block">Unidade</span>
        <span className="w-[60px] text-right">Status</span>
      </div>
      {shown.map((item) => (
        <div key={item.plate} className="flex items-center justify-between py-2 text-[11px] border-b border-slate-800/50 last:border-0">
          <span className="w-[90px] font-bold tracking-widest text-white">{item.plate}</span>
          <span className="w-[90px] text-slate-400">{item.model}</span>
          <span className="w-[110px] text-slate-500 hidden sm:block">{item.unit}</span>
          <span className={`w-[60px] text-right font-bold text-[10px] ${
            item.status === 'LIBERADO' ? 'text-emerald-400' :
            item.status === 'AGENDADO' ? 'text-sky-400' :
            item.status === 'NEGADO' ? 'text-red-400' : 'text-amber-400'
          }`}>{item.status}</span>
        </div>
      ))}
    </div>
  );
}

function AnimatedCounter({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <span className="text-2xl md:text-3xl font-bold text-white tabular-nums">{value}</span>
      <span className="text-[10px] text-slate-500 block mt-0.5">{label}</span>
    </div>
  );
}

export default function LandingPage({ isLoggedIn, onStartConfig, onEnterApp, onLogout, condoConfig }: LandingPageProps) {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setPulse(p => !p), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-[#0a0a0c] text-white min-h-screen selection:bg-sky-500/40 overflow-x-hidden font-sans antialiased">
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes radar-sweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="flex justify-between items-center h-16 md:h-20 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[4px] bg-white text-[#0a0a0c] flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold tracking-tight uppercase text-white/80"><span className="text-white">CONDOMINIO</span> MANAGER</span>
              <span className="hidden sm:inline-flex text-[9px] uppercase tracking-[0.15em] text-slate-600 border border-slate-800 px-2 py-0.5 rounded-[2px]">v2.0</span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <a href="#monitor" className="text-[11px] font-semibold text-slate-400 hover:text-white tracking-wider uppercase transition-colors">Monitor</a>
              <a href="#cobertura" className="text-[11px] font-semibold text-slate-400 hover:text-white tracking-wider uppercase transition-colors">Cobertura</a>
              {condoConfig.isConfigured && (
                <button onClick={onEnterApp} className="text-[11px] font-semibold text-sky-400 hover:text-sky-300 uppercase tracking-wider transition-colors">{condoConfig.name}</button>
              )}
              {isLoggedIn ? (
                <button onClick={onLogout} className="text-[11px] font-semibold text-red-400 hover:text-red-300 uppercase tracking-wider border border-slate-800 px-4 py-2 rounded-[4px] hover:bg-white/5 transition-all">Sair</button>
              ) : (
                <button onClick={onStartConfig} className="text-[11px] font-bold text-[#0a0a0c] bg-white px-5 py-2.5 rounded-[4px] hover:bg-white/90 transition-all uppercase tracking-wider">Acessar Sistema</button>
              )}
            </nav>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-slate-400 hover:text-white">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="md:hidden bg-[#0a0a0c]/95 backdrop-blur-xl border-b border-white/5">
            <div className="px-6 py-4 space-y-3">
              <a href="#monitor" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-slate-300 hover:text-white py-2">Monitor</a>
              <a href="#cobertura" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-slate-300 hover:text-white py-2">Cobertura</a>
              {condoConfig.isConfigured && <button onClick={() => { setMobileMenuOpen(false); onEnterApp(); }} className="block text-sm text-sky-400 py-2">{condoConfig.name}</button>}
              {isLoggedIn ? (
                <button onClick={() => { setMobileMenuOpen(false); onLogout(); }} className="w-full border border-slate-700 text-slate-300 px-5 py-3 rounded text-sm font-bold hover:bg-slate-800">Sair</button>
              ) : (
                <button onClick={() => { setMobileMenuOpen(false); onStartConfig(); }} className="w-full bg-white text-black px-5 py-3 rounded text-sm font-bold">Acessar Sistema</button>
              )}
            </div>
          </motion.div>
        )}
      </motion.header>

      <section id="monitor" className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 50%, rgba(56, 189, 248, 0.03) 0%, transparent 50%),
                              radial-gradient(circle at 75% 50%, rgba(139, 92, 246, 0.03) 0%, transparent 50%)`,
          }} />
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px)`,
            backgroundSize: '100% 4px',
          }} />
        </div>

        <motion.div style={{ opacity }} className="relative z-10 mx-auto max-w-[1400px] px-6 w-full">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6 pt-8">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <span className="text-[10px] font-mono text-emerald-400/80 tracking-[0.2em] uppercase bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 inline-block">
                  {pulse ? '● Online' : '○ Online'}
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl md:text-7xl lg:text-7xl font-black leading-[0.9] tracking-tight"
              >
                <span className="text-white/40 font-light">SEU</span><br />
                <span className="text-white">CONDOMÍNIO</span><br />
                <span className="text-white/40 font-light">NO</span><br />
                <span className="bg-gradient-to-r from-sky-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">CONTROLE</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-sm md:text-base text-slate-500 font-mono leading-relaxed max-w-md"
              >
                Portaria com reconhecimento de placas, liberação remota e relatórios automáticos. Tudo que seu condomínio precisa em um painel.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-3 pt-2"
              >
                <button onClick={onStartConfig} className="bg-white text-[#0a0a0c] px-7 py-3.5 text-sm font-bold hover:bg-white/90 transition-all flex items-center gap-2 uppercase tracking-wider rounded-[4px]">
                  Ativar Sistema
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={onEnterApp} className="border border-white/10 text-slate-400 px-7 py-3.5 text-sm font-bold hover:bg-white/5 hover:text-white transition-all uppercase tracking-wider rounded-[4px]">
                  Acessar Painel
                </button>
              </motion.div>
            </div>

            <div className="lg:col-span-7 space-y-6 pt-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="bg-[#0d0d0f] border border-white/[0.06] rounded-[4px] overflow-hidden shadow-2xl"
              >
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-[#0a0a0c]">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-2 text-[10px] text-slate-600 font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                      POR-01
                    </span>
                    <span className="text-[9px] text-slate-700 font-mono hidden sm:inline">Portaria Principal</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] text-slate-700 font-mono uppercase tracking-wider">14:32:19</span>
                    <Camera className="w-3.5 h-3.5 text-slate-600" />
                    <Maximize2 className="w-3 h-3 text-slate-700" />
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/[0.04]">
                    <span className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.15em]">Últimos Acessos</span>
                    <span className="text-[9px] font-mono text-slate-700">
                      <Activity className="w-3 h-3 inline mr-1" />
                      8 registros
                    </span>
                  </div>
                  <LiveFeed />
                </div>
                <div className="px-5 py-3 border-t border-white/[0.06] bg-[#0a0a0c] flex items-center justify-between text-[9px] text-slate-700 font-mono">
                  <span>3 câmeras ativas • 12 veículos hoje</span>
                  <span>● gravando</span>
                </div>
              </motion.div>

              <div className="grid grid-cols-4 gap-3">
                {[
                  { value: '2.000+', label: 'Condomínios', color: 'text-sky-400' },
                  { value: '50k+', label: 'Acessos/dia', color: 'text-emerald-400' },
                  { value: '99.9%', label: 'Uptime', color: 'text-violet-400' },
                  { value: '0.3s', label: 'Liberação', color: 'text-amber-400' },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                    className="bg-[#0d0d0f] border border-white/[0.04] rounded-[4px] p-4 text-center"
                  >
                    <span className={`text-lg md:text-xl font-bold tabular-nums ${s.color}`}>{s.value}</span>
                    <span className="text-[9px] text-slate-600 block mt-1 font-mono">{s.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-700">
          <motion.div animate={{ y: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </div>
      </section>

      <section id="cobertura" className="relative py-32 md:py-40 border-t border-white/[0.04]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent" />
        <div className="mx-auto max-w-[1400px] px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start"
          >
            <div className="space-y-10 lg:sticky lg:top-28">
              <div>
                <span className="text-[9px] font-mono text-slate-600 tracking-[0.2em] uppercase border border-white/10 px-3 py-1 inline-block mb-6">[Módulos]</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black leading-[0.95] tracking-tight text-white">
                O SISTEMA<br />
                <span className="text-white/30 font-light">COMPLETO DE</span><br />
                PORTARIA
              </h2>
              <div className="space-y-6">
                {[
                  { icon: Scan, title: 'Leitura de Placas', desc: 'OCR integrado às câmeras. Identificação em 0.3s sem intervenção manual.' },
                  { icon: Fingerprint, title: 'Liberação Remota', desc: 'Porteiro libera pelo painel ou app. Visitante agenda visita pelo celular.' },
                  { icon: Users, title: 'Banco de Moradores', desc: 'Cadastro completo com veículos. Suporte a múltiplos veículos por unidade.' },
                  { icon: BellRing, title: 'Alertas em Tempo Real', desc: 'Notificação push para moradores sobre entregas, visitas e ocorrências.' },
                  { icon: BarChart3, title: 'Relatórios Automáticos', desc: 'Dashboard com fluxo de visitantes, horários de pico e histórico de acesso.' },
                  { icon: Clock, title: 'Gestão de Porteiros', desc: 'Escala digital, troca de turnos e ronda com check-in. Tudo registrado.' },
                ].map((mod, i) => {
                  const Icon = mod.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className="group flex gap-5 p-4 border-l-2 border-white/5 hover:border-sky-500/50 transition-all duration-300"
                    >
                      <Icon className="w-5 h-5 text-slate-500 mt-0.5 shrink-0 group-hover:text-sky-400 transition-colors" />
                      <div>
                        <h3 className="text-sm font-bold text-white">{mod.title}</h3>
                        <p className="text-xs text-slate-500 mt-1 font-mono leading-relaxed">{mod.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-6 pt-16 lg:pt-32">
              <div className="bg-[#0d0d0f] border border-white/[0.06] rounded-[4px] p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.04]">
                  <Camera className="w-5 h-5 text-sky-400" />
                  <div>
                    <span className="text-xs font-bold text-white block">Câmera • Portaria Principal</span>
                    <span className="text-[9px] text-slate-600 font-mono">AO VIVO • 14:32:19</span>
                  </div>
                  <span className="ml-auto flex items-center gap-1.5 text-[9px] text-slate-600 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    REC
                  </span>
                </div>
                <div className="aspect-video bg-[#050508] rounded-[4px] flex items-center justify-center border border-white/[0.03] relative overflow-hidden">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
                    backgroundSize: '30px 30px',
                  }} />
                  <div className="relative z-10 text-center">
                    <Camera className="w-10 h-10 text-slate-800 mx-auto mb-2" />
                    <span className="text-[10px] text-slate-700 font-mono block">FLUXO AO VIVO • CFTV INTEGRADO</span>
                  </div>
                  <motion.div
                    className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-sky-500/30 to-transparent"
                    style={{ animation: 'scanline 4s linear infinite' }}
                  />
                </div>
              </div>

              <div className="bg-[#0d0d0f] border border-white/[0.06] rounded-[4px] p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.04]">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="text-xs font-bold text-white block">Fluxo de Acessos • Hoje</span>
                    <span className="text-[9px] text-slate-600 font-mono">DADOS EM TEMPO REAL</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { label: '07:00 - 09:00', value: 42, peak: true },
                    { label: '09:00 - 12:00', value: 28, peak: false },
                    { label: '12:00 - 14:00', value: 35, peak: false },
                    { label: '14:00 - 16:00', value: 18, peak: false },
                    { label: '16:00 - 19:00', value: 51, peak: true },
                  ].map((h, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="text-[10px] text-slate-600 font-mono w-24 shrink-0">{h.label}</span>
                      <div className="flex-grow h-5 bg-[#050508] rounded-[2px] overflow-hidden">
                        <motion.div
                          initial={{ width: '0%' }}
                          whileInView={{ width: `${(h.value / 55) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          className={`h-full rounded-[2px] ${h.peak ? 'bg-sky-500' : 'bg-sky-500/30'}`}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono w-8 text-right">{h.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-24 md:py-32 border-t border-white/[0.04]">
        <div className="mx-auto max-w-[1400px] px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-[#0d0d0f] border border-white/[0.06] rounded-[4px] p-10 md:p-16 relative overflow-hidden"
          >
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 20% 80%, rgba(56, 189, 248, 0.03) 0%, transparent 50%)`,
            }} />
            <div className="relative z-10 max-w-2xl">
              <span className="text-[9px] font-mono text-slate-600 tracking-[0.2em] uppercase border border-white/10 px-3 py-1 inline-block mb-6">[Começar]</span>
              <h2 className="text-4xl md:text-5xl font-black leading-[0.95] tracking-tight text-white mb-6">
                PRONTO PARA<br />
                <span className="text-white/30 font-light">COLOCAR SEU</span><br />
                CONDOMÍNIO<br />
                NO CONTROLE?
              </h2>
              <p className="text-sm text-slate-500 font-mono leading-relaxed mb-8 max-w-md">
                5 minutos de configuração. Sem taxa de implantação. Sem contrato de fidelidade.
              </p>
              <div className="flex flex-wrap gap-3">
                <button onClick={onStartConfig} className="bg-white text-[#0a0a0c] px-8 py-4 text-sm font-bold hover:bg-white/90 transition-all flex items-center gap-2 uppercase tracking-wider rounded-[4px]">
                  Ativar Sistema
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={onEnterApp} className="border border-white/10 text-slate-400 px-8 py-4 text-sm font-bold hover:bg-white/5 hover:text-white transition-all uppercase tracking-wider rounded-[4px]">
                  Ver Painel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-white/[0.04] py-12">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-8 mb-8 border-b border-white/[0.04]">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-600" />
              <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">CONDOMINIO MANAGER</span>
            </div>
            <div className="flex gap-6 text-[10px] text-slate-600 font-mono">
              <a href="#" className="hover:text-white transition-colors">Funcionalidades</a>
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos</a>
              <a href="#" className="hover:text-white transition-colors">Suporte</a>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-700 font-mono">
            <span>&copy; 2026 Condomínio Manager. Todos os direitos reservados.</span>
            <span>NPX Soluções Tecnológicas</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
