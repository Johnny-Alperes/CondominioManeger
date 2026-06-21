/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Mail, Lock, User, ArrowLeft, Eye, EyeOff, UserPlus, CheckCircle2, ShieldAlert } from 'lucide-react';

interface LoginPageProps {
  onSuccess: (email: string) => void;
  onCancel: () => void;
}

export default function LoginPage({ onSuccess, onCancel }: LoginPageProps) {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve conter pelo menos 6 caracteres.');
      return;
    }

    const savedUsersStr = localStorage.getItem('condo_registered_users');
    const users = savedUsersStr ? JSON.parse(savedUsersStr) : [];

    if (isSignUp) {
      if (!name) {
        setError('Por favor, informe seu nome completo.');
        return;
      }

      // Check if user exists
      const userExists = users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (userExists) {
        setError('Este endereço de e-mail já está cadastrado.');
        return;
      }

      // Save user
      const newUser = { name, email: email.toLowerCase(), password };
      users.push(newUser);
      localStorage.setItem('condo_registered_users', JSON.stringify(users));

      setSuccessMsg('Conta criada com sucesso! Faça login para continuar.');
      setIsSignUp(false);
      setName('');
      setPassword('');
    } else {
      // Find user
      const foundUser = users.find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      // fallback basic local credentials for testing (e.g. admin@condomaneger.com / admin123)
      const isDefaultAdmin = email.toLowerCase() === 'admin@condomaneger.com' && password === 'admin123';

      if (foundUser || isDefaultAdmin) {
        onSuccess(email);
      } else {
        setError('E-mail ou senha incorretos. Tente novamente ou crie uma conta.');
      }
    }
  };

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen flex flex-col justify-center items-center px-6 selection:bg-sky-200">
      
      {/* Background decoration elements */}
      <div className="absolute top-12 left-12 opacity-20 pointer-events-none hidden md:block">
        <Shield className="w-48 h-48 text-slate-300" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-slate-100 relative z-10"
      >
        {/* Return Button */}
        <button
          onClick={onCancel}
          className="absolute top-6 left-6 flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar</span>
        </button>

        {/* Logo Icon */}
        <div className="flex flex-col items-center mt-4 mb-6">
          <div className="w-12 h-12 bg-slate-950 text-white rounded-2xl flex items-center justify-center mb-3">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {isSignUp ? 'Criar Nova Conta' : 'Acesse sua Conta'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isSignUp 
              ? 'Inscreva-se para administrar seu condomínio com excelência.' 
              : 'Faça login com sua conta ou utilize admin@condomaneger.com / admin123'}
          </p>
        </div>

        {/* Action Error / Success indicators */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs flex gap-2 items-center">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl text-xs flex gap-2 items-center">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-400 font-medium placeholder:text-slate-400"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 block">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@condominio.com"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-400 font-medium placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-600 block">Senha</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo de 6 caracteres"
                className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-400 font-medium placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Form Submit Button */}
          <button
            type="submit"
            className="w-full bg-slate-950 text-white py-3 rounded-xl font-bold text-sm shadow-md hover:bg-slate-900 active:scale-98 transition-all mt-2 cursor-pointer flex items-center justify-center gap-2"
          >
            {isSignUp ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Registrar Conta</span>
              </>
            ) : (
              <span>Entrar no Sistema</span>
            )}
          </button>
        </form>

        {/* Tab Switch Link */}
        <div className="mt-6 text-center text-xs text-slate-500 font-medium">
          {isSignUp ? (
            <p>
              Já possui uma conta?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setError('');
                }}
                className="text-sky-600 hover:underline font-bold cursor-pointer"
              >
                Fazer Login
              </button>
            </p>
          ) : (
            <p>
              Não possui uma conta?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setError('');
                }}
                className="text-sky-600 hover:underline font-bold cursor-pointer"
              >
                Criar Conta Grátis
              </button>
            </p>
          )}
        </div>

        {/* Built By Indicator */}
        <div className="text-center mt-6 pt-5 border-t border-slate-100 text-[10px] text-slate-400 font-medium">
          Desenvolvido por <span className="font-bold text-slate-600">NPX Soluções Tecnológicas</span>
        </div>
      </motion.div>
    </div>
  );
}
