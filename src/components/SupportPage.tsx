/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HelpCircle, Info, Radio, ShieldAlert, Key } from 'lucide-react';

export default function SupportPage() {
  const qa = [
    {
      q: 'Como funciona a busca por placas com Ricardo Fernandes?',
      a: 'Clique em "Monitor & Busca" no painel principal, depois insira a placa "ABC-1234" na barra de buscas. O detalhado crachá identificador do morador correspondente será renderizado instantaneamente com foto e dados originais, junto aos gatilhos de liberação de cancela.'
    },
    {
      q: 'Qual a diferença entre os registros de moradores e de visitantes?',
      a: 'Os moradores listados no banco de dados fixo possuem direito a liberação automática ou monitorada de vagas, enquanto visitantes geram passes de acesso temporários vinculados a um tempo de permanência estimado.'
    },
    {
      q: 'Para que serve o Livro de Ocorrências?',
      a: 'Permite registrar ocorrências e avisos operacionais da portaria (como defeitos de equipamentos, reclamações de barulho e problemas de infraestrutura), acompanhando a gravidade de cada evento e seu status atual (Pendente, Em Progresso ou Resolvido).'
    },
    {
      q: 'Os dados inseridos no painel são persistidos?',
      a: 'Sim, o Condomínio Maneger utiliza o mecanismo de salvamento em LocalStorage do navegador. Todos os veículos criados, acessos liberados ou trocas de turno registradas se mantêm ativos de forma persistente após a atualização da janela!'
    }
  ];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-8 animate-in fade-in duration-300">
      
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-slate-900">Suporte ao Operador</h3>
          <p className="text-xs text-slate-400 font-semibold">Tire dúvidas de procedimentos ou consulte códigos de rádio</p>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Help block list */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Guia de Procedimentos Ativos</h4>
          <div className="divide-y divide-slate-100 border border-slate-150 rounded-2xl overflow-hidden">
            {qa.map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2">
                <span className="text-xs font-extrabold text-slate-900 block">{item.q}</span>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Radio codes helper banner */}
        <div className="p-4 rounded-2xl bg-slate-950 text-white flex items-start gap-4">
          <Radio className="w-5 h-5 text-sky-400 shrink-0 mt-1 animate-pulse" />
          <div className="space-y-1">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wide block">Tabela de Códigos Q de Rádio</span>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] font-mono text-slate-400">
              <p>QAP - Na escuta / Operando</p>
              <p>QTO - Sanitário / Pausa</p>
              <p>QSL - Entendido / Confirmado</p>
              <p>QRV - À disposição</p>
              <p>QTI - Destino / Rota</p>
              <p>QTR - Horário correto</p>
            </div>
          </div>
        </div>

        {/* Technical Support and Tips Details from NPX Soluções Tecnológicas */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150 flex items-start gap-4">
          <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-900 block">NPX Soluções Tecnológicas</span>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Este sistema é desenvolvido e licenciado pela <strong>NPX Soluções Tecnológicas</strong>. Para suporte avançado, manutenção preventiva de sistemas ou esclarecimento de dúvidas, entre em contato através do telefone: <a href="tel:83998630182" className="text-slate-900 font-bold hover:underline">(83) 99863-0182</a>.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
