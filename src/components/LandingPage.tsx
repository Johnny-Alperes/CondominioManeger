import { Shield, Menu, X, Mail, Lock, User, UserPlus } from 'lucide-react';
import { CondoConfig } from '../types';
import { useState } from 'react';

interface LandingPageProps {
  isLoggedIn: boolean;
  onStartConfig: () => void;
  onEnterApp: () => void;
  onLogout: () => void;
  condoConfig: CondoConfig;
}

function tryLogin(email: string, password: string): string | null {
  const raw = localStorage.getItem('condo_registered_users');
  const users = raw ? JSON.parse(raw) : [];
  const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return 'Usuário não encontrado.';
  if (user.password !== password) return 'Senha incorreta.';
  return null;
}

export default function LandingPage({ isLoggedIn, onStartConfig, onEnterApp, onLogout, condoConfig }: LandingPageProps) {
  const [menu, setMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [showSignUp, setShowSignUp] = useState(false);
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState('');

  const handleSignUp = () => {
    setSignUpError('');
    setSignUpSuccess('');
    if (!signUpName || !signUpEmail || !signUpPassword) {
      setSignUpError('Preencha todos os campos.');
      return;
    }
    if (signUpPassword.length < 6) {
      setSignUpError('A senha deve conter pelo menos 6 caracteres.');
      return;
    }
    const raw = localStorage.getItem('condo_registered_users');
    const users = raw ? JSON.parse(raw) : [];
    const exists = users.some((u: any) => u.email.toLowerCase() === signUpEmail.toLowerCase());
    if (exists) {
      setSignUpError('Este e-mail já está cadastrado.');
      return;
    }
    users.push({ name: signUpName, email: signUpEmail.toLowerCase(), password: signUpPassword });
    localStorage.setItem('condo_registered_users', JSON.stringify(users));
    setSignUpSuccess('Conta criada com sucesso! Faça login.');
    setSignUpName('');
    setSignUpEmail('');
    setSignUpPassword('');
  };

  const handleLogin = () => {
    setLoginError('');
    if (!email || !password) { setLoginError('Preencha todos os campos.'); return; }
    const err = tryLogin(email, password);
    if (err) { setLoginError(err); return; }
    localStorage.setItem('condo_is_logged_in', 'true');
    window.location.reload();
  };

  return (
    <div className="h-screen w-screen bg-zinc-950 text-white overflow-hidden flex flex-col font-mono antialiased relative selection:bg-zinc-700">

      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=80"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-zinc-950/70" />

      <header className="relative z-20 flex items-center justify-between px-6 h-14 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <Shield className="w-4 h-4 text-zinc-500" />
          <span className="text-xs font-semibold tracking-[0.2em] text-zinc-400 uppercase">Condominio Manager</span>
        </div>
        <nav className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <button onClick={onEnterApp} className="text-xs text-zinc-300 hover:text-white uppercase tracking-widest transition-colors">{condoConfig.name || 'Condomínio'}</button>
          ) : (
            <button onClick={onStartConfig} className="text-xs text-zinc-300 hover:text-white uppercase tracking-widest transition-colors">Acessar</button>
          )}

          {showLogin ? (
            <div className="flex items-center gap-2">
              <div className="relative">
                <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-40 bg-zinc-900 border border-zinc-700 text-xs text-zinc-300 px-2.5 py-1.5 pl-8 outline-none focus:border-zinc-500"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                <input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  className="w-36 bg-zinc-900 border border-zinc-700 text-xs text-zinc-300 px-2.5 py-1.5 pl-8 outline-none focus:border-zinc-500"
                />
              </div>
              <button onClick={handleLogin} className="text-xs bg-white text-zinc-950 px-3 py-1.5 font-bold hover:bg-zinc-200 transition-all uppercase tracking-widest">Ok</button>
              <button onClick={() => { setShowLogin(false); setLoginError(''); }} className="text-xs text-zinc-600 hover:text-zinc-400 uppercase tracking-widest">X</button>
              {loginError && <span className="text-[10px] text-red-400">{loginError}</span>}
            </div>
          ) : (
            <button onClick={() => setShowLogin(true)} className="text-xs bg-white text-zinc-950 px-4 py-1.5 font-bold hover:bg-zinc-200 transition-all uppercase tracking-widest">Entrar</button>
          )}

          {isLoggedIn && <button onClick={onLogout} className="text-xs text-zinc-600 hover:text-zinc-400 uppercase tracking-widest">Sair</button>}
        </nav>
        <button onClick={() => setMenu(m => !m)} className="md:hidden text-zinc-500">
          {menu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </header>

      {menu && (
        <div className="relative z-20 bg-zinc-950 border-b border-zinc-800 px-6 py-4 space-y-3 md:hidden">
          <button onClick={() => { setMenu(false); onStartConfig(); }} className="block text-xs text-zinc-300 uppercase tracking-widest">Acessar</button>
          <button onClick={() => { setMenu(false); onEnterApp(); }} className="block w-full text-xs bg-white text-zinc-950 px-4 py-2 font-bold uppercase tracking-widest">Entrar</button>
          {isLoggedIn && <button onClick={() => { setMenu(false); onLogout(); }} className="block text-xs text-zinc-600 uppercase tracking-widest">Sair</button>}
        </div>
      )}

      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        {showSignUp ? (
          <div className="w-full max-w-sm mx-auto space-y-5">
            <div className="text-center mb-2">
              <h2 className="text-xl font-black text-white tracking-tight">Criar Conta</h2>
              <p className="text-xs text-zinc-400 mt-1">Inscreva-se para administrar seu condomínio.</p>
            </div>

            {signUpError && (
              <div className="bg-red-900/40 border border-red-700 text-red-300 text-[10px] px-3 py-2 text-center tracking-wider uppercase">{signUpError}</div>
            )}
            {signUpSuccess && (
              <div className="bg-emerald-900/40 border border-emerald-700 text-emerald-300 text-[10px] px-3 py-2 text-center tracking-wider uppercase">{signUpSuccess}</div>
            )}

            <div className="space-y-3">
              <div className="relative">
                <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                <input
                  type="text"
                  placeholder="Nome completo"
                  value={signUpName}
                  onChange={e => setSignUpName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 text-xs text-zinc-300 px-2.5 py-2 pl-8 outline-none focus:border-zinc-500"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                <input
                  type="email"
                  placeholder="E-mail"
                  value={signUpEmail}
                  onChange={e => setSignUpEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 text-xs text-zinc-300 px-2.5 py-2 pl-8 outline-none focus:border-zinc-500"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                <input
                  type="password"
                  placeholder="Senha (mín. 6 caracteres)"
                  value={signUpPassword}
                  onChange={e => setSignUpPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSignUp()}
                  className="w-full bg-zinc-900 border border-zinc-700 text-xs text-zinc-300 px-2.5 py-2 pl-8 outline-none focus:border-zinc-500"
                />
              </div>
              <button onClick={handleSignUp} className="w-full bg-white text-zinc-950 py-2.5 text-xs font-bold hover:bg-zinc-200 transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                <UserPlus className="w-3.5 h-3.5" />
                <span>Registrar Conta</span>
              </button>
            </div>

            <button onClick={() => { setShowSignUp(false); setSignUpError(''); setSignUpSuccess(''); }} className="block mx-auto text-[10px] text-zinc-600 hover:text-zinc-400 uppercase tracking-widest">
              Voltar
            </button>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <span className="text-xs text-zinc-300 tracking-[0.3em] uppercase">Portaria Inteligente</span>
            <h1 className="text-5xl md:text-8xl font-black leading-[0.85] tracking-tighter text-white">
              SEU<br />
              <span className="text-zinc-500">CONDOMÍNIO</span><br />
              NO CONTROLE
            </h1>
            <p className="text-base md:text-lg text-zinc-300 leading-relaxed max-w-lg mx-auto">
              Reconhecimento de placas, liberação remota e relatórios automáticos em um painel.
            </p>
            <div className="flex gap-3 pt-2 justify-center">
              <button onClick={onStartConfig} className="bg-white text-zinc-950 px-8 py-4 text-base font-bold hover:bg-zinc-200 transition-all uppercase tracking-widest">
                Cadastrar Novo Condomínio
              </button>
              <button onClick={() => setShowSignUp(true)} className="border border-zinc-600 text-zinc-300 px-8 py-4 text-base font-bold hover:border-zinc-500 hover:text-white transition-all uppercase tracking-widest">
                Cadastrar-se
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="relative z-10 flex items-center justify-between px-6 h-12 border-t border-zinc-800 text-[9px] text-zinc-700 uppercase tracking-[0.15em]">
        <span>&copy; 2026 — NPX Soluções Tecnológicas</span>
        <span>NPX</span>
      </footer>
    </div>
  );
}
