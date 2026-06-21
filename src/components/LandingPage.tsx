/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Shield, LayoutDashboard, UserPlus, HelpCircle, Settings, MapPin, Globe, Share2, BellRing } from 'lucide-react';
import { CondoConfig } from '../types';

interface LandingPageProps {
  onStartConfig: () => void;
  onEnterApp: () => void;
  condoConfig: CondoConfig;
}

export default function LandingPage({ onStartConfig, onEnterApp, condoConfig }: LandingPageProps) {
  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen flex flex-col selection:bg-sky-200">
      {/* Top Header */}
      <header className="flex justify-between items-center w-full h-16 px-6 sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-slate-900" />
          <span className="text-lg font-bold text-slate-900 tracking-tight">Condomínio Maneger</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            id="btn-login-header"
            onClick={onEnterApp}
            className="text-sm font-semibold text-slate-700 hover:text-sky-600 hover:underline transition-all cursor-pointer"
          >
            {condoConfig.name}
          </button>
          <button 
            id="btn-start-header"
            onClick={onStartConfig}
            className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            Fazer Login
          </button>
        </div>
      </header>

      <main className="max-w-[1400px] w-full mx-auto px-6 py-12 flex-grow space-y-16">
        {/* Hero Section Card & Security Sidebar Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Hero Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="col-span-12 lg:col-span-8 min-h-[480px] relative overflow-hidden rounded-3xl shadow-lg group flex flex-col justify-center px-12 text-white bg-slate-950"
          >
            <div className="absolute inset-0">
              <img 
                className="w-full h-full object-cover opacity-35 transition-transform duration-700 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNys25y8c_ERPwviOEReNfcFoXwIjShDHVYj0N-tSvsE5pS99B1lYxQ6UAk8z8UhgU690sD7lEni3H3_Pa8KXeo1qfSgUtdjv2xzv4yov-YRHY_8R4q6oJa5txZPckW9IWOrjIWzoYiWM7D6zbCbRsdncfnwmwA5SUb_K7GE3rBCoUBp7ZdYOuZ5i9v95KWydTPGz7XaZiEIWTck_54oeU8OCZe5AuX3bFS1VP1posbb4cefVsbx4qM0wo59n7iho06NvlEKXOPpk"
                alt="Elite Condo Architecture"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 to-transparent" />
            </div>

            <div className="relative z-10 max-w-xl space-y-6">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-white tracking-tight">
                Gestão Inteligente para Condomínios de Elite
              </h1>
              <p className="text-slate-300 text-base md:text-lg font-light leading-relaxed">
                O Condomínio Maneger oferece controle total sobre segurança, vigilância de visitantes e operações administrativas em uma única plataforma integrada e altamente intuitiva.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button 
                  id="btn-hero-register"
                  onClick={onStartConfig}
                  className="bg-white text-slate-950 px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg hover:bg-slate-100 active:scale-95 transition-all"
                >
                  Cadastrar Novo Condomínio
                </button>
              </div>
            </div>
          </motion.div>

          {/* Security Focus Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="col-span-12 lg:col-span-4 bg-slate-900 text-white rounded-3xl p-8 flex flex-col justify-between shadow-lg relative overflow-hidden group border border-slate-800"
          >
            <div className="absolute -right-16 -top-16 opacity-5 pointer-events-none">
              <Shield className="w-64 h-64 text-white" />
            </div>

            <div className="space-y-6">
              <div className="w-12 h-12 bg-sky-500/10 text-sky-400 rounded-2xl flex items-center justify-center border border-sky-500/20">
                <Shield className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">Segurança Inabalável</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Controle de acesso seguro, registros de visitantes em tempo real e protocolos de emergência totalmente integrados à central de segurança.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 space-y-4">
              <div className="flex -space-x-2.5 items-center">
                <img 
                  className="w-10 h-10 rounded-full border-2 border-slate-950 object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDN0-72rtlbgtAf2fUnanQpNbWsHlFMCg4fs_2ErQ_xewI9RSxgavC8ruWpXR9HuSX7ynrrZOydJjusJU2TP9uSc-xeoZcE6qbv9y5AcudycP9-QHDBM3K-ASHMyejXgEfk9b5Qlq2mm2ekvOhHPzCMfXz5jslcXmziccRn0Yjn5CvQ9IFo5PpvSc0570844twhBuJ5CNltY001WwkHFc3InBLu7glFTuBrWGn5rN8gzS2gxvi8-Mer7Iv08PP-YsiImtwAm07QdQ"
                  alt="Security Guard Profile"
                  referrerPolicy="no-referrer"
                />
                <img 
                  className="w-10 h-10 rounded-full border-2 border-slate-950 object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkA-TJXCu5yx5a3D2ljFAFscaqTqU_BFfVKifnq117cwVtXAnKE5_wB7IbqkBicZ4MdzfUMpflOZRYnU9N0PZ0dQrKx-zLEOXst_GlJ2djpUxi_MutHj5Mvj1DVLLLpT1pUo10O1ODi64sH3BhoGZR3k83QQTwflOduk61mz-CAh_rNfXYIcxsii1UF_wdA3rUrO8LwGvaR8zpFfF9DvUQSIdQUbS0GotHo0VkC8e_kR-mbFlUws0zi2L94co2x_mLUtCtsMGXalo"
                  alt="Admin Profile"
                  referrerPolicy="no-referrer"
                />
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border-2 border-slate-950 text-xs font-bold text-slate-300">
                  +2k
                </div>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Aprovado por mais de 2.000 administradores em todo o país.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Feature Bento Grid Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mb-6">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-950 mb-3">Dashboard Operacional</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Visualize toda a operação em um único painel. De agendamentos de áreas comuns e autorizações até relatórios estruturados de rotatividade.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-slate-950 text-white rounded-3xl p-8 shadow-sm relative overflow-hidden group"
          >
            <div className="w-12 h-12 bg-slate-800 text-sky-400 rounded-2xl flex items-center justify-center mb-6">
              <UserPlus className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-3">Experiência do Visitante</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Check-in rápido e notificações instantâneas enviadas aos moradores, eliminando filas desnecessárias e elevando o prestígio do condomínio.
            </p>
            <button 
              onClick={onEnterApp}
              className="flex items-center gap-2 text-xs font-bold text-sky-400 hover:text-sky-300 transition-all group-hover:translate-x-1"
            >
              Conhecer a Portaria &rarr;
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden"
          >
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
              <BellRing className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-950 mb-3">Agilidade Operacional</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Escalas de turnos atualizadas, envio imediato de avisos emergenciais e acompanhamento visual do status do plantão com toda facilidade.
            </p>
          </motion.div>
        </div>

        {/* Call To Action Banner */}
        <section className="py-16 px-8 rounded-3xl bg-slate-900 text-slate-100 text-center relative overflow-hidden border border-slate-800">
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="grid grid-cols-12 gap-4 h-full">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="border-r border-white/20 h-full" />
              ))}
            </div>
          </div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-extrabold text-white">Pronto para elevar o padrão do seu condomínio?</h2>
            <p className="text-slate-400 text-base font-light">
              Junte-se a centenas de condomínios de elite que já modernizaram a sua segurança e administração utilizando o Condomínio Maneger.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button 
                id="btn-cta-start"
                onClick={onStartConfig}
                className="bg-white text-slate-950 px-10 py-3.5 rounded-xl font-bold text-sm shadow-md hover:scale-105 transition-all cursor-pointer"
              >
                Fazer Login
              </button>
              <button 
                id="btn-cta-consult"
                onClick={onEnterApp}
                className="border border-slate-700 hover:border-slate-550 text-slate-200 px-10 py-3.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all"
              >
                Falar com Especialista
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 border-t border-slate-800">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 space-y-4">
            <span className="text-lg font-bold text-white">Condomínio Maneger</span>
            <p className="text-sm text-slate-400 leading-relaxed">
              A solução definitiva e integrada de controle, portaria e segurança para administração residencial de elite.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-xs text-white uppercase tracking-wider mb-4">Plataforma</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Funcionalidades</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Segurança</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terminais</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrações</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xs text-white uppercase tracking-wider mb-4">Suporte</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Treinamentos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API & Devs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Status do Sistema</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xs text-white uppercase tracking-wider mb-4">Políticas</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1440px] mx-auto border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2026 Condomínio Maneger. Desenvolvido por <span className="text-white font-bold">NPX Soluções Tecnológicas</span>. Todos os direitos reservados.</p>
          <div className="flex gap-6 text-slate-400">
            <Globe className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
            <Share2 className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
}
