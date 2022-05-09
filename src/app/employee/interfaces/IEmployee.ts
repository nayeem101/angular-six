import { ISkill } from './ISkill';

export interface IEmployee {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  contactPref: string;
  skills: ISkill[];
}
