import { Resident, AccessLog, Shift, ShiftSwap, CondoConfig, Guard, Occurrence } from './types';

export const INITIAL_RESIDENTS: Resident[] = [
  {
    id: 'res-1',
    name: 'Ricardo Fernandes de Almeida',
    role: 'Morador',
    unit: '402',
    block: 'Bloco B',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAO0IKf99Ek6hGIYpd0PJ-Xq9mxXTOXgnjzPrAyVQFSae8NSjne3ZkaOD5IOkI3zz1tYJ1bpq3lTjQLmXkMyBrloxE3vp7Riz_7GrnHHX_pgDQi4CU2Op_U_2OO2v_7aUjkeSPxunAVyqbUhbhgw0sF58BBAK9s2dd3Su25UtL033Tv0bB9e6liR9LVdrND0PFBnyN-llrkLMFN_lPZqW5a5v2mmEj5cM3gnbGpSGjK5xTjzdYLgEAUqmeAOPAgMKDORiMv0CmMoJI',
    phone: '(11) 98765-4321',
    vehicle: {
      plate: 'ABC-1234',
      model: 'Toyota Corolla',
      color: 'Prata'
    },
    gender: 'M',
    isActive: true
  },
  {
    id: 'res-2',
    name: 'Carlos Eduardo',
    role: 'Proprietário',
    unit: '1202',
    block: 'Bloco A',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDN0-72rtlbgtAf2fUnanQpNbWsHlFMCg4fs_2ErQ_xewI9RSxgavC8ruWpXR9HuSX7ynrrZOydJjusJU2TP9uSc-xeoZcE6qbv9y5AcudycP9-QHDBM3K-ASHMyejXgEfk9b5Qlq2mm2ekvOhHPzCMfXz5jslcXmziccRn0Yjn5CvQ9IFo5PpvSc0570844twhBuJ5CNltY001WwkHFc3InBLu7glFTuBrWGn5rN8gzS2gxvi8-Mer7Iv08PP-YsiImtwAm07QdQ',
    phone: '(11) 99123-4567',
    vehicle: {
      plate: 'ABC-9999',
      model: 'Honda Civic',
      color: 'Prata'
    },
    gender: 'M',
    isActive: true
  },
  {
    id: 'res-3',
    name: 'Mariana Luz',
    role: 'Morador',
    unit: '304',
    block: 'Bloco C',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkA-TJXCu5yx5a3D2ljFAFscaqTqU_BFfVKifnq117cwVtXAnKE5_wB7IbqkBicZ4MdzfUMpflOZRYnU9N0PZ0dQrKx-zLEOXst_GlJ2djpUxi_MutHj5Mvj1DVLLLpT1pUo10O1ODi64sH3BhoGZR3k83QQTwflOduk61mz-CAh_rNfXYIcxsii1UF_wdA3rUrO8LwGvaR8zpFfF9DvUQSIdQUbS0GotHo0VkC8e_kR-mbFlUws0zi2L94co2x_mLUtCtsMGXalo',
    phone: '(21) 98888-7777',
    vehicle: {
      plate: 'XYZ-9876',
      model: 'VW Gol',
      color: 'Branco'
    },
    gender: 'F',
    isActive: true
  },
  {
    id: 'res-4',
    name: 'João Silva',
    role: 'Morador',
    unit: '101',
    block: 'Bloco A',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtbPd1IgCKdRgax6t5chvTDwtFUi_46ZajgQkfqLReYXJwrWU4ySdeHmuD_RN3ydlSa14lfNBIuF7a6WQbaxDBFzvhJLS68jJ23KBaCFvFG28pUFKAveJZeCR2-dXWVsJO3xOjDho8fQAR2DVOvesfQA_R1lsPEXS3p_rMOaSZZ2xrsXZdvrwovm0eIWwB8--Sv3V1e_Zidxcm_JnbYtjtBjok1vVsWN999-m8p6Eas4u9lPiUde3W3bFSO4XhSlIHNC_nAdVpSXo',
    phone: '(11) 97777-5555',
    vehicle: {
      plate: 'KJH-5522',
      model: 'Fiat Argo',
      color: 'Preto'
    },
    gender: 'M',
    isActive: true
  }
];

export const INITIAL_ACCESS_LOGS: AccessLog[] = [
  {
    id: 'log-1',
    plate: 'ABC-1234',
    vehicleModel: 'Honda Civic',
    vehicleColor: 'Prata',
    type: 'Morador',
    name: 'Carlos Eduardo',
    subType: 'Proprietário',
    destination: 'Bl. A - Ap 1202',
    time: '14:45',
    status: 'ENTRADA'
  },
  {
    id: 'log-2',
    plate: 'XYZ-9876',
    vehicleModel: 'VW Gol',
    vehicleColor: 'Branco',
    type: 'Visitante',
    name: 'Mariana Luz',
    subType: 'Convidada',
    destination: 'Bl. C - Ap 304',
    time: '14:32',
    status: 'ENTRADA'
  },
  {
    id: 'log-3',
    plate: 'KJH-5522',
    vehicleModel: 'Fiat Argo',
    vehicleColor: 'Preto',
    type: 'Serviço',
    name: 'João Silva',
    subType: 'Net Internet',
    destination: 'Portaria Principal',
    time: '14:15',
    status: 'SAÍDA'
  }
];

export const INITIAL_SHIFTS: Shift[] = [
  {
    id: 'shift-1',
    name: 'Ricardo Silva',
    role: 'Porteiro Noturno',
    location: 'Portaria Auxiliar',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtbPd1IgCKdRgax6t5chvTDwtFUi_46ZajgQkfqLReYXJwrWU4ySdeHmuD_RN3ydlSa14lfNBIuF7a6WQbaxDBFzvhJLS68jJ23KBaCFvFG28pUFKAveJZeCR2-dXWVsJO3xOjDho8fQAR2DVOvesfQA_R1lsPEXS3p_rMOaSZZ2xrsXZdvrwovm0eIWwB8--Sv3V1e_Zidxcm_JnbYtjtBjok1vVsWN999-m8p6Eas4u9lPiUde3W3bFSO4XhSlIHNC_nAdVpSXo',
    hours: '06:00 - 18:00',
    status: 'Finalizado',
    dateLabel: 'Ontem',
    dateKey: 'ontem'
  },
  {
    id: 'shift-2',
    name: 'Marcos Oliveira',
    role: 'Supervisor de Turno',
    location: 'Portaria Principal',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsR_LYgN9zQej8BDoOcBd3Wew1-LZfxtDkU88Omh9Yt8bdNvGXvM-MD-YiXM34u2SOzA_VkNbygCbGXa9nqMcjx7lLeFDxfz2RYPtXegLINYZnhrdF5BK2Uv971QDQw3F3REmm9AdiPlN8GsRhUG1igaQntYriG9_CtEiUqU33W6hbH2agVZsjNLb7187CmbUfBacF4EWL-dFBp2PgpyFvJDSjuqa6UgjvfiQ-xNPYTo0MlKY3TJhtRCHCQTRHN3tYJ7dal4cQWdY',
    hours: '06:00 - 18:00',
    status: 'Em Andamento',
    dateLabel: 'Hoje - Plantão Atual',
    dateKey: 'hoje'
  },
  {
    id: 'shift-3',
    name: 'Ana Costa',
    role: 'Auxiliar de Segurança',
    location: 'Controle de Acesso',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDo7YCWHGy97qxtGzzuVos8AxDG_RZ2DUkQ_xIvYJBlZDJw3vQso2Mt0cidV3AJlfq1u73Gn7c67JIY25iKxVUD3YhqHqrSHxL7COVhO9dZvuDHmWRS2pF-erDlAjok6ULr52NX-_LBONeXpLU_JEaNAlcVM5_ZQIoBF3trsuceEm-VV8cFKcIbo4JBs3WevWYL7UGLgzgbHs02m4I0W9p6tiTmsix0L6AiVTnazXukxPugjYeyoxN3b3EOM7-iSKU0vselMTCuot8',
    hours: '18:00 - 06:00',
    status: 'Pendente',
    dateLabel: 'Amanhã',
    dateKey: 'amanha'
  }
];

export const INITIAL_SHIFT_SWAPS: ShiftSwap[] = [
  {
    id: 'swap-1',
    date: '11/06/2026',
    originalGuard: 'João Santos',
    substituteGuard: 'Ricardo Silva',
    reason: 'Atestado Médico',
    status: 'Aprovado'
  },
  {
    id: 'swap-2',
    date: '09/06/2026',
    originalGuard: 'Ana Costa',
    substituteGuard: 'Marcos Oliveira',
    reason: 'Troca de Turno Manual',
    status: 'Aprovado'
  },
  {
    id: 'swap-3',
    date: '05/06/2026',
    originalGuard: 'Ricardo Silva',
    substituteGuard: 'Pedro Rocha',
    reason: 'Evento Familiar',
    status: 'Recusado'
  }
];

export const DEFAULT_CONDO_CONFIG: CondoConfig = {
  name: 'Condomínio Spazio',
  address: 'Rua das Flores, 450 - São Paulo, SP',
  blocks: 4,
  apartmentsCount: 120,
  isConfigured: true
};

export const INITIAL_GUARDS: Guard[] = [
  {
    id: 'guard-1',
    name: 'Marcos Oliveira',
    role: 'Supervisor de Turno',
    phone: '(11) 98888-2222',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsR_LYgN9zQej8BDoOcBd3Wew1-LZfxtDkU88Omh9Yt8bdNvGXvM-MD-YiXM34u2SOzA_VkNbygCbGXa9nqMcjx7lLeFDxfz2RYPtXegLINYZnhrdF5BK2Uv971QDQw3F3REmm9AdiPlN8GsRhUG1igaQntYriG9_CtEiUqU33W6hbH2agVZsjNLb7187CmbUfBacF4EWL-dFBp2PgpyFvJDSjuqa6UgjvfiQ-xNPYTo0MlKY3TJhtRCHCQTRHN3tYJ7dal4cQWdY'
  },
  {
    id: 'guard-2',
    name: 'Ana Costa',
    role: 'Auxiliar de Segurança',
    phone: '(11) 97777-3333',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDo7YCWHGy97qxtGzzuVos8AxDG_RZ2DUkQ_xIvYJBlZDJw3vQso2Mt0cidV3AJlfq1u73Gn7c67JIY25iKxVUD3YhqHqrSHxL7COVhO9dZvuDHmWRS2pF-erDlAjok6ULr52NX-_LBONeXpLU_JEaNAlcVM5_ZQIoBF3trsuceEm-VV8cFKcIbo4JBs3WevWYL7UGLgzgbHs02m4I0W9p6tiTmsix0L6AiVTnazXukxPugjYeyoxN3b3EOM7-iSKU0vselMTCuot8'
  },
  {
    id: 'guard-3',
    name: 'Ricardo Silva',
    role: 'Porteiro Noturno',
    phone: '(11) 98765-4321',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtbPd1IgCKdRgax6t5chvTDwtFUi_46ZajgQkfqLReYXJwrWU4ySdeHmuD_RN3ydlSa14lfNBIuF7a6WQbaxDBFzvhJLS68jJ23KBaCFvFG28pUFKAveJZeCR2-dXWVsJO3xOjDho8fQAR2DVOvesfQA_R1lsPEXS3p_rMOaSZZ2xrsXZdvrwovm0eIWwB8--Sv3V1e_Zidxcm_JnbYtjtBjok1vVsWN999-m8p6Eas4u9lPiUde3W3bFSO4XhSlIHNC_nAdVpSXo'
  }
];

export const INITIAL_OCCURRENCES: Occurrence[] = [
  {
    id: 'occ-1',
    type: 'Defeito de Equipamento',
    reportedBy: 'Marcos Oliveira',
    description: 'Sensor de aproximação do portão veicular de entrada principal travando intermitentemente.',
    severity: 'Médio',
    date: '07/06/2026 10:14',
    location: 'Portaria Principal',
    status: 'Em Andamento'
  },
  {
    id: 'occ-2',
    type: 'Reclamação de Barulho',
    reportedBy: 'Morador Apt 402',
    description: 'Som extremamente alto vindo da unidade 404 (vizinho) após o horário de silêncio (22h).',
    severity: 'Baixo',
    date: '06/06/2026 23:45',
    location: 'Bloco B - Apto 404',
    status: 'Resolvido'
  },
  {
    id: 'occ-3',
    type: 'Invasão / Suspeito',
    reportedBy: 'Ana Costa',
    description: 'Indivíduo rondando o portão auxiliar do condomínio tirando fotos das câmeras externas.',
    severity: 'Alto',
    date: '05/06/2026 14:02',
    location: 'Portaria de Serviços',
    status: 'Pendente'
  }
];

