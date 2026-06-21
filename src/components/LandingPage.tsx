import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Shield, ArrowRight, ChevronDown, Menu, X, Building2, Users, Car, Camera, BellRing, Clock, Fingerprint, BarChart3, Sparkles, CheckCircle, Github, Twitter, Instagram, Phone, MapPin, Key, Wifi, Zap, Sun, Moon, Eye } from 'lucide-react';
import { CondoConfig } from '../types';
import { useState, useRef, useEffect, type ReactNode, type MouseEvent } from 'react';

interface LandingPageProps {
  isLoggedIn: boolean;
  onStartConfig: () => void;
  onEnterApp: () => void;
  onLogout: () => void;
  condoConfig: CondoConfig;
}

function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);
  return pos;
}

function GlowCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouse = (e: MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX((y - centerY) / 20);
    setRotateY((x - centerX) / 20);
  };

  const handleLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      className={`transition-transform duration-200 ease-out ${className}`}
      style={{ perspective: '1000px', transform: `rotateX(${-rotateX}deg) rotateY(${rotateY}deg)` }}
    >
      {children}
    </div>
  );
}

export default function LandingPage({ isLoggedIn, onStartConfig, onEnterApp, onLogout, condoConfig }: LandingPageProps) {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.12], [1, 0.97]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mousePos = useMousePosition();

  const features = [
    { icon: Camera, title: 'Reconhecimento de Placas', desc: 'Câmeras OCR identificam veículos em tempo real — morador liberado sem parar.', color: 'from-emerald-400 to-teal-500', stats: '0.3s' },
    { icon: Fingerprint, title: 'Portaria Remota', desc: 'Libere visitantes pelo celular. Vídeo, áudio e interfone direto no painel.', color: 'from-violet-400 to-purple-500', stats: '100%' },
    { icon: Users, title: 'Banco de Moradores', desc: 'Cadastro completo com veículos, fotos e contatos. Tudo centralizado.', color: 'from-sky-400 to-cyan-500', stats: 'Ilimitado' },
    { icon: BellRing, title: 'Alertas Inteligentes', desc: 'Notificações push para entregas, visitas e ocorrências em tempo real.', color: 'from-amber-400 to-orange-500', stats: 'Push' },
    { icon: BarChart3, title: 'Relatórios Automáticos', desc: 'Dashboard com fluxo de visitantes, picos de movimento e histórico completo.', color: 'from-rose-400 to-pink-500', stats: '24h' },
    { icon: Clock, title: 'Gestão de Porteiros', desc: 'Escala digital, troca de turnos e ronda com check-in por QR Code.', color: 'from-indigo-400 to-blue-500', stats: 'QR' },
  ];

  const stats = [
    { value: '2.000+', label: 'Condomínios Ativos', icon: Building2 },
    { value: '50mil+', label: 'Acessos Liberados/Dia', icon: Car },
    { value: '99.9%', label: 'Tempo Online', icon: Wifi },
    { value: '3s', label: 'Tempo Médio de Abertura', icon: Zap },
  ];

  const numbers = [
    { value: 'R$ 0', label: 'Taxa de setup' },
    { value: '5 min', label: 'Tempo de configuração' },
    { value: '1', label: 'Sistema completo' },
    { value: '∞', label: 'Moradores e veículos' },
  ];

  return (
    <div className="bg-slate-950 text-white min-h-screen selection:bg-sky-500/30 overflow-x-hidden">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-8px) rotate(0.5deg); }
          66% { transform: translateY(4px) rotate(-0.3deg); }
        }
        @keyframes dash {
          to { stroke-dashoffset: -24; }
        }
        @keyframes grid-shift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(24px, 24px); }
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.4); }
          70% { box-shadow: 0 0 0 20px rgba(56, 189, 248, 0); }
          100% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0); }
        }
      `}</style>

      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center shadow-lg shadow-sky-500/20 relative" style={{ animation: 'pulse-ring 2s infinite' }}>
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">Condomínio <span className="text-sky-400">Maneger</span></span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Funcionalidades</a>
              <a href="#numbers" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Números</a>
              <a href="#depoimentos" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Depoimentos</a>
              {condoConfig.isConfigured && (
                <button onClick={onEnterApp} className="text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors">
                  {condoConfig.name}
                </button>
              )}
              {isLoggedIn ? (
                <button onClick={onLogout} className="border border-slate-700 text-slate-300 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 hover:text-white transition-all active:scale-95">
                  Sair
                </button>
              ) : (
                <button onClick={onStartConfig} className="bg-white text-slate-950 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all shadow-lg shadow-white/10 active:scale-95">
                  Fazer Login
                </button>
              )}
            </nav>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-slate-300 hover:text-white">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden bg-slate-900/95 backdrop-blur-xl border-b border-slate-800">
            <div className="px-6 py-4 space-y-3">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-slate-300 hover:text-white py-2">Funcionalidades</a>
              <a href="#numbers" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-slate-300 hover:text-white py-2">Números</a>
              <a href="#depoimentos" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-slate-300 hover:text-white py-2">Depoimentos</a>
              {condoConfig.isConfigured && (
                <button onClick={() => { setMobileMenuOpen(false); onEnterApp(); }} className="block text-sm font-semibold text-sky-400 py-2">{condoConfig.name}</button>
              )}
              {isLoggedIn ? (
                <button onClick={() => { setMobileMenuOpen(false); onLogout(); }} className="w-full border border-slate-700 text-slate-300 px-5 py-3 rounded-xl text-sm font-bold hover:bg-slate-800">Sair</button>
              ) : (
                <button onClick={() => { setMobileMenuOpen(false); onStartConfig(); }} className="w-full bg-white text-slate-950 px-5 py-3 rounded-xl text-sm font-bold">Fazer Login</button>
              )}
            </div>
          </motion.div>
        )}
      </motion.header>

      <motion.section style={{ opacity: heroOpacity, scale: heroScale }} className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,#0f172a_0%,transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,#1e1b4b_0%,transparent_50%)]" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            animation: 'grid-shift 8s linear infinite',
          }} />
        </div>

        <div className="relative z-10 mx-auto max-w-[1400px] px-6 w-full">
          <div className="grid lg:grid-cols-5 gap-12 md:gap-16 items-center">
            <div className="lg:col-span-3 space-y-8">
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }} className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400 tracking-wide uppercase">Sistema validado em todo Brasil</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[1.0] tracking-tight">
                  <span className="text-white">Gestão de </span>
                  <span className="bg-gradient-to-r from-sky-400 via-violet-400 to-purple-400 bg-clip-text text-transparent inline-block" style={{ animation: 'float 6s ease-in-out infinite' }}>
                    portaria
                  </span>
                  <br />
                  <span className="text-white">que funciona</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed max-w-xl">
                  Controle remoto, liberação por placa e relatórios automáticos. O sistema que síndicos, porteiros e moradores aprovam.
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }} className="flex flex-wrap gap-4">
                <button onClick={onStartConfig} className="group relative bg-gradient-to-r from-sky-500 to-violet-500 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-sky-500/20 hover:shadow-sky-500/40 active:scale-[0.97] transition-all overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                    Começar Agora
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-violet-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
                <button onClick={onEnterApp} className="px-8 py-4 rounded-2xl font-bold text-sm border border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:border-slate-500 active:scale-[0.97] transition-all flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Ver Painel
                </button>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.4 }}>
                <div className="grid grid-cols-4 gap-6 pt-4">
                  {numbers.map((n, i) => (
                    <div key={i} className="text-center">
                      <span className="text-2xl md:text-3xl font-black text-white block">{n.value}</span>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{n.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-2 hidden lg:block">
              <GlowCard>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, rotateY: 5 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="relative"
                >
                  <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-6 shadow-2xl">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Online</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-600">Portaria Principal</span>
                    </div>

                    <div className="space-y-3">
                      {[
                        { plate: 'ABC-1234', model: 'Toyota Corolla', status: 'Liberado', time: '14:32', color: 'emerald' },
                        { plate: 'XYZ-5678', model: 'Honda Civic', status: 'Visitante', time: '14:28', color: 'amber' },
                        { plate: 'DEF-9012', model: 'Fiat Toro', status: 'Liberado', time: '14:15', color: 'emerald' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800/60">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full bg-${item.color}-500`} />
                            <div>
                              <span className="font-mono text-xs font-extrabold text-white tracking-widest">{item.plate}</span>
                              <span className="text-[10px] text-slate-500 block">{item.model}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`text-[10px] font-bold ${
                              item.status === 'Liberado' ? 'text-emerald-400' : 'text-amber-400'
                            }`}>
                              {item.status}
                            </span>
                            <span className="text-[9px] text-slate-600 block">{item.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                      <span className="flex items-center gap-1"><Camera className="w-3 h-3" /> 3 câmeras ativas</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 12 visitantes hoje</span>
                    </div>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/20 to-violet-500/20 rounded-3xl blur-xl -z-10" />
                </motion.div>
              </GlowCard>
            </div>
          </div>
        </div>

        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600">
          <span className="text-[10px] font-bold uppercase tracking-widest">Role</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.section>

      <section id="stats" className="relative py-16 md:py-20 border-t border-slate-900">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center"
                >
                  <Icon className="w-5 h-5 text-sky-400 mx-auto mb-3" />
                  <span className="text-3xl md:text-4xl font-black text-white block">{s.value}</span>
                  <span className="text-xs text-slate-500 font-semibold">{s.label}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="features" className="relative py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-500/[0.03] to-transparent" />
        <div className="mx-auto max-w-[1400px] px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500/10 to-violet-500/10 border border-sky-500/20 rounded-full px-4 py-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-xs font-bold text-sky-400 tracking-wide uppercase">Tudo em um só lugar</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Sua portaria no piloto<br />automático
            </h2>
            <p className="text-slate-400 text-lg font-light max-w-2xl mx-auto">
              Enquanto você gerencia o condomínio, o Maneger cuida da portaria.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="group relative bg-slate-900/30 border border-slate-800/40 rounded-3xl p-6 hover:bg-slate-900/50 hover:border-slate-700/50 transition-all duration-300"
                >
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:via-sky-500/[0.02] transition-all duration-500" />
                  <div className="relative flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} bg-opacity-10 flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-600">{feature.stats}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 relative">{feature.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed relative">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative py-24 md:py-32 border-t border-slate-900">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5">
                <span className="text-xs font-bold text-indigo-400 tracking-wide uppercase">Na prática</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Como funciona<br />o dia a dia?
              </h2>
              <div className="space-y-4">
                {[
                  { step: '01', title: 'Morador chega na portaria', desc: 'Câmera lê a placa automaticamente.' },
                  { step: '02', title: 'Sistema identifica', desc: 'Cruzamento com banco de dados em 0.3 segundos.' },
                  { step: '03', title: 'Cancela abre sozinha', desc: 'Sem burocracia. Sem fila. Sem papel.' },
                  { step: '04', title: 'Tudo registrado', desc: 'Log de acesso salvo com foto, placa e horário.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-slate-900/30 rounded-2xl border border-slate-800/40">
                    <span className="text-xs font-black text-sky-400 font-mono w-8 shrink-0 pt-0.5">{item.step}</span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-8 text-center space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-violet-500 rounded-full flex items-center justify-center mx-auto">
                  <Camera className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">0.3 segundos</h3>
                <p className="text-sm text-slate-400 max-w-xs mx-auto">
                  Tempo médio entre a leitura da placa e a liberação da cancela.
                </p>
                <div className="pt-4">
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: '0%' }}
                      whileInView={{ width: '100%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-sky-500 to-violet-500 rounded-full"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                    <span>0s</span>
                    <span>0.3s</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="numbers" className="relative py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-500/[0.02] to-transparent" />
        <div className="mx-auto max-w-[1400px] px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400 tracking-wide uppercase">Resultados reais</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Números que falam
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { metric: '70%', desc: 'Redução no tempo de espera da portaria', color: 'from-sky-500 to-cyan-500' },
              { metric: '100%', desc: 'Dos acessos registrados automaticamente', color: 'from-emerald-500 to-teal-500' },
              { metric: '0', desc: 'Papel usado no dia a dia da portaria', color: 'from-violet-500 to-purple-500' },
              { metric: '24/7', desc: 'Suporte técnico disponível', color: 'from-amber-500 to-orange-500' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-slate-900/30 border border-slate-800/40 rounded-3xl p-8 flex items-center gap-6"
              >
                <span className={`text-5xl md:text-6xl font-black bg-gradient-to-br ${item.color} bg-clip-text text-transparent shrink-0`}>
                  {item.metric}
                </span>
                <p className="text-slate-300 text-sm font-semibold">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="depoimentos" className="relative py-24 md:py-32 border-t border-slate-900">
        <div className="mx-auto max-w-[1400px] px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-bold text-amber-400 tracking-wide uppercase">Quem usa, aprova</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              O que estão falando
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: 'O sistema de leitura de placas acabou com a fila na portaria. Os moradores amaram.', author: 'Ana Clara Santos', role: 'Síndica • Residencial Park', initials: 'AS' },
              { quote: 'Setup rápido, interface intuitiva. Meu porteiro de 60 anos aprendeu a usar em 10 minutos.', author: 'Roberto Mendes', role: 'Administrador • Spazio Premium', initials: 'RM' },
              { quote: 'O relatório de visitantes me salva todo mês. Saber exatamente quem entrou e quando é outro nível.', author: 'Juliana Costa', role: 'Gestora • Village Green', initials: 'JC' },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-slate-900/30 border border-slate-800/40 rounded-3xl p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="w-4 h-4 fill-amber-400 text-amber-400" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-8">&ldquo;{t.quote}&rdquo;</p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-800/40">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white">{t.initials}</div>
                  <div>
                    <p className="text-sm font-bold text-white">{t.author}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 md:py-32 bg-gradient-to-b from-transparent via-sky-500/[0.02] to-transparent">
        <div className="mx-auto max-w-[1400px] px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-10 md:p-16 text-center overflow-hidden"
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-sky-500/20 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '5s' }} />
              <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-violet-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '7s' }} />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
              <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-violet-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-sky-500/20">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                5 minutos separam você<br />de uma portaria inteligente
              </h2>
              <p className="text-slate-400 text-lg font-light max-w-lg mx-auto">
                Sem contrato fidelidade. Sem taxa de implantação. Sem complicação.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <button onClick={onStartConfig} className="group bg-gradient-to-r from-sky-500 to-violet-500 text-white px-10 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-sky-500/20 hover:shadow-sky-500/40 active:scale-[0.97] transition-all flex items-center justify-center gap-2">
                  Começar Agora
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={onEnterApp} className="border border-slate-700 text-slate-300 px-10 py-4 rounded-2xl font-bold text-sm hover:bg-slate-800/50 hover:border-slate-500 active:scale-[0.97] transition-all">
                  Fale Conosco
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-slate-900 py-16">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-base font-extrabold text-white">Condomínio <span className="text-sky-400">Maneger</span></span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Portaria inteligente, gestão simplificada.
              </p>
              <div className="flex gap-4 text-slate-600">
                <Github className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                <Twitter className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                <Instagram className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>

            {[
              { title: 'Produto', links: ['Funcionalidades', 'Preços', 'Segurança', 'API'] },
              { title: 'Suporte', links: ['Central de Ajuda', 'Treinamentos', 'Status', 'Contato'] },
              { title: 'Legal', links: ['Privacidade', 'Termos de Uso', 'LGPD', 'Cookies'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-bold text-xs text-white uppercase tracking-wider mb-5">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((link, j) => (
                    <li key={j}><a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-600">&copy; 2026 Condomínio Maneger. Todos os direitos reservados.</p>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span>Desenvolvido por</span>
              <span className="text-slate-400 font-bold">NPX Soluções Tecnológicas</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
