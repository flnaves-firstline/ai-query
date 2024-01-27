import { Enum, createEnum } from '@/core/createEnum';

export const EligibilityResult = createEnum({
  Eligible: 1,
  NotEligible: 2,
} as const);

export type EligibilityResultEnum = Enum<typeof EligibilityResult>;
