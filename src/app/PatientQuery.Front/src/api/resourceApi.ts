import { createApiHookWithState } from '@/core/loader';

export type PatientDetails = {
  id: number;
  deceased?: boolean;
  gender?: string;
  birthDate?: string;
  race?: string;
  ethnicity?: string;
  conditionNames?: string[];
  observationNames?: string[];
  procedureNames?: string[];
  activeMedicationNames?: string[];
  encounterDates?: string[];
};

const baseUrl = 'resource/';

export const useGetPatientResourceCount = createApiHookWithState<number | undefined, undefined>(
  (http) => http.get<number>(baseUrl + 'GetPatientResourceCount'),
  undefined
);

export const useGetPatientDetails = createApiHookWithState<PatientDetails | undefined, number>(
  (http, id) => http.get<PatientDetails>(baseUrl + 'GetPatientDetails', { id }),
  undefined
);
