import { createApiHookWithState } from '@/core/loader';

export type TestResult = {
  transformResult: {
    ambiguousValues?: AmbiguousValues;
  };
  eligiblePatients?: EligiblePatientPageModel[];
};

export type EligiblePatientPageModel = {
  id: number;
  gender?: string;
  race?: string;
  birthDate?: string;
  deceased?: boolean;
  activeMedicationNames?: string[];
  conditionNames?: string[];
  observationNames?: string[];
};

export type AmbiguousValues = {
  medications: string[];
};

type TestCommand = {
  text: string;
  ids?: number[];
  clarification?: ClarificationModel;
};

export type ClarificationModel = {
  medicationBrandNames: string[];
};

const baseUrl = 'eligibilityRule/';

export const useTest = createApiHookWithState<TestResult | undefined, TestCommand>(
  (http, command) => http.post<TestResult>(baseUrl + 'Test', command),
  undefined
);
