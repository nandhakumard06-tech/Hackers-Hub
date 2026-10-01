export type EthicalHackingLevel = 'basic' | 'intermediate' | 'advanced';
export type YesNo = 'yes' | 'no';

export interface Registration {
  id?: string;
  name: string;
  email: string;
  mobile: string;
  hackingLevel: EthicalHackingLevel;
  attendedWolfCTF: YesNo;
  attendedWolfHackathons: YesNo;
  hackathonCount?: string;
  createdAt: any; // Firestore Timestamp or serializable string/number
}

export interface RegistrationFormData {
  name: string;
  email: string;
  mobile: string;
  hackingLevel: EthicalHackingLevel | '';
  attendedWolfCTF: YesNo | '';
  attendedWolfHackathons: YesNo | '';
  hackathonCount?: string;
}

export interface DashboardStats {
  total: number;
  basic: number;
  intermediate: number;
  advanced: number;
  wolfCTF: number;
  wolfHackathons: number;
}

export interface FilterState {
  search: string;
  level: string; // 'all' | 'basic' | 'intermediate' | 'advanced'
  ctf: string; // 'all' | 'yes' | 'no'
  hackathon: string; // 'all' | 'yes' | 'no'
}
