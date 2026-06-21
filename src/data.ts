import { Resident, AccessLog, Shift, ShiftSwap, CondoConfig, Guard, Occurrence } from './types';

export const INITIAL_RESIDENTS: Resident[] = [];

export const INITIAL_ACCESS_LOGS: AccessLog[] = [];

export const INITIAL_SHIFTS: Shift[] = [];

export const INITIAL_SHIFT_SWAPS: ShiftSwap[] = [];

export const DEFAULT_CONDO_CONFIG: CondoConfig = {
  name: '',
  address: '',
  blocks: 0,
  apartmentsCount: 0,
  isConfigured: false
};

export const INITIAL_GUARDS: Guard[] = [];

export const INITIAL_OCCURRENCES: Occurrence[] = [];

