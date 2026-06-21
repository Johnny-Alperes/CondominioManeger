import { motion, useScroll, useTransform } from 'motion/react';
import { Shield, LayoutDashboard, UserPlus, BellRing, Building2, Camera, Fingerprint, ArrowRight, ChevronDown, Sparkles, Clock, Users, CheckCircle, BarChart3, Globe, Github, Twitter, Instagram, Menu, X } from 'lucide-react';
import { CondoConfig } from '../types';
import { useState } from 'react';

interface LandingPageProps {
  isLoggedIn: boolean;
  onStartConfig: () => void;
  onEnterApp: () => void;
  onLogout: () => void;
  condoConfig: CondoConfig;
}

function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '5s' }} />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-sky-500/15 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '7s', animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[150px]" />
    </div>
  );
}

const features = [
  {
    icon: Camera,
    title: 'Controle de Acesso',
    desc: 'Câmeras integradas, reconhecimento de placas e liberação remota direto do seu painel.',
    color: 'from-sky-500 to-cyan-500',
  },
  {
    icon: Fingerprint,
    title: 'Segurança Biométrica',
    desc: 'Identificação por digital e facial para moradores, funcionários e visitantes frequentes.',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: BarChart3,
    title: 'Relatórios Smart',
    desc: 'Dashboard analítico com gráficos em tempo real sobre fluxo de visitantes e ocorrências.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: BellRing,
    title: 'Notificações Push',
    desc: 'Alertas instantâneos para moradores sobre entregas, visitas e avisos importantes.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Users,
    title: 'Gestão de Moradores',
    desc: 'Cadastro completo com unidades, veículos e documentos em um banco de dados centralizado.',
    color: 'from-rose-500 to-pink-500',
  },
  {
    icon: Clock,
    title: 'Escalas Inteligentes',
    desc: 'Gestão de turnos, trocas de plantão e checklist de ronda automatizados.',
    color: 'from-indigo-500 to-blue-500',
  },
];

const testimonials = [
  {
    quote: 'Reduzimos em 70% o tempo de espera na portaria. Os moradores amaram o sistema.',
    author: 'Ana Clara Santos',
    role: 'Síndica • Residencial Park',
    avatar: 'AS',
  },
  {
    quote: 'O controle de acesso por placa transformou a segurança do nosso condomínio. Indispensável!',
    author: 'Roberto Mendes',
    role: 'Administrador • Spazio Premium',
    avatar: 'RM',
  },
  {
    quote: 'Setup em 5 minutos e suporte incrível. Melhor decisão que tomamos para a portaria.',
    author: 'Juliana Costa',
    role: 'Gestora • Village Green',
    avatar: 'JC',
  },
];

export default function LandingPage({ isLoggedIn, onStartConfig, onEnterApp, onLogout, condoConfig }: LandingPageProps) {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-slate-950 text-white min-h-screen selection:bg-sky-500/30 overflow-x-hidden">
      {/* Fixed Gradient Nav Bar */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">Condomínio <span className="text-sky-400">Maneger</span></span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Funcionalidades</a>
              <a href="#testimonials" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Depoimentos</a>
              {condoConfig.isConfigured && (
                <button onClick={onEnterApp} className="text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors">
                  {condoConfig.name}
                </button>
              )}
              {isLoggedIn ? (
                <button
                  onClick={onLogout}
                  className="border border-slate-700 text-slate-300 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 hover:text-white transition-all active:scale-95"
                >
                  Sair
                </button>
              ) : (
                <button
                  onClick={onStartConfig}
                  className="bg-white text-slate-950 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all shadow-lg shadow-white/10 active:scale-95"
                >
                  Fazer Login
                </button>
              )}
            </nav>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-slate-900/95 backdrop-blur-xl border-b border-slate-800"
          >
            <div className="px-6 py-4 space-y-3">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-slate-300 hover:text-white py-2">Funcionalidades</a>
              <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-slate-300 hover:text-white py-2">Depoimentos</a>
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

      {/* HERO SECTION */}
      <motion.section style={{ opacity: heroOpacity, scale: heroScale }} className="relative min-h-screen flex items-center pt-20">
        <FloatingOrbs />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#0f172a_0%,_transparent_70%)]" />

        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />

        <div className="relative z-10 mx-auto max-w-[1400px] px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="space-y-6"
              >
                <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight">
                  <span className="text-white">O futuro da </span>
                  <br />
                  <span className="bg-gradient-to-r from-sky-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                    portaria inteligente
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed max-w-lg">
                  Controle total sobre segurança, acesso de visitantes e operações administrativas em uma plataforma unificada e intuitiva.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
                className="flex flex-wrap gap-4"
              >
                <button
                  onClick={onStartConfig}
                  className="group relative bg-gradient-to-r from-sky-500 to-violet-500 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-sky-500/20 hover:shadow-sky-500/40 active:scale-[0.97] transition-all overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Começar Agora
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-violet-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>

                <button
                  onClick={onEnterApp}
                  className="px-8 py-4 rounded-2xl font-bold text-sm border border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:border-slate-500 active:scale-[0.97] transition-all flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Acessar Painel
                </button>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="flex items-center gap-6 pt-4"
              >
                <div className="flex -space-x-2">
                  {['AS', 'RM', 'JC', 'LP'].map((init, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 border-2 border-slate-950 flex items-center justify-center text-[9px] font-bold text-slate-300">
                      {init}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  <span className="text-slate-300 font-bold">+2.000</span> condomínios confiam
                </p>
              </motion.div>
            </div>

            {/* Right - Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block relative"
            >
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl shadow-sky-500/10 border border-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80"
                    alt="Dashboard de dados"
                    className="w-full h-auto object-cover"
                  />
                </div>
                {/* Glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-sky-500/20 to-violet-500/20 rounded-3xl blur-2xl -z-10" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest">Role</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.section>

      {/* STATS SECTION */}
      {/* FEATURES SECTION */}
      <section id="features" className="relative py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-500/5 to-transparent" />
        <FloatingOrbs />

        <div className="mx-auto max-w-[1400px] px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 space-y-4"
          >
            <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 rounded-full px-4 py-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-xs font-bold text-sky-400 tracking-wide uppercase">Recursos Premium</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Tudo que seu condomínio precisa
            </h2>
            <p className="text-slate-400 text-lg font-light max-w-2xl mx-auto">
              Uma plataforma completa com ferramentas inteligentes para gestão, segurança e portaria.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group relative bg-slate-900/40 border border-slate-800/60 rounded-3xl p-8 hover:bg-slate-900/60 hover:border-slate-700/60 transition-all duration-300"
                >
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:via-sky-500/5 transition-all duration-500" />

                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} bg-opacity-10 flex items-center justify-center mb-6 relative`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3 relative">{feature.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed relative">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="relative py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 space-y-4"
          >
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-xs font-bold text-violet-400 tracking-wide uppercase">Depoimentos</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Quem usa, recomenda
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="w-4 h-4 fill-amber-400 text-amber-400" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-8">&ldquo;{t.quote}&rdquo;</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white">
                    {t.avatar}
                  </div>
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

      {/* CTA SECTION */}
      <section className="relative py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-t from-sky-500/10 via-transparent to-transparent" />
        <div className="mx-auto max-w-[1400px] px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-12 md:p-20 text-center overflow-hidden"
          >
            <FloatingOrbs />

            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Pronto para modernizar<br />seu condomínio?
              </h2>
              <p className="text-slate-400 text-lg font-light">
                Junte-se a mais de 2.000 condomínios que já transformaram sua gestão com o Condomínio Maneger.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <button
                  onClick={onStartConfig}
                  className="group bg-gradient-to-r from-sky-500 to-violet-500 text-white px-10 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-sky-500/20 hover:shadow-sky-500/40 active:scale-[0.97] transition-all flex items-center justify-center gap-2"
                >
                  Começar Agora
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={onEnterApp}
                  className="border border-slate-700 text-slate-300 px-10 py-4 rounded-2xl font-bold text-sm hover:bg-slate-800/50 hover:border-slate-500 active:scale-[0.97] transition-all"
                >
                  Fale Conosco
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 py-16">
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
                A solução definitiva de controle, portaria e segurança para administração residencial de elite.
              </p>
              <div className="flex gap-4 text-slate-600">
                <Github className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                <Twitter className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                <Instagram className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>

            {[
              { title: 'Plataforma', links: ['Funcionalidades', 'Segurança', 'Terminais', 'Integrações'] },
              { title: 'Suporte', links: ['Central de Ajuda', 'Treinamentos', 'API & Devs', 'Status'] },
              { title: 'Políticas', links: ['Privacidade', 'Termos de Uso', 'Cookies', 'LGPD'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-bold text-xs text-white uppercase tracking-wider mb-5">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-600">
              &copy; 2026 Condomínio Maneger. Todos os direitos reservados.
            </p>
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
