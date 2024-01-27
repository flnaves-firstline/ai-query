import { createAtom, useAtom } from '@/core/globalState';

export type AuthInfo = {
  id: number;
  fullName: string;
  isAdmin: boolean;
  token: string;
};

const key = 'AUTH_INFO';

export const authInfoAtom = createAtom<AuthInfo | undefined>({
  init: () => {
    const initJson = localStorage.getItem(key);
    return initJson ? ((JSON.parse(initJson) as unknown) as AuthInfo) : undefined;
  },
  set: (value) => {
    if (value == null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
    return value;
  },
});

export const useAuth = () => useAtom(authInfoAtom);
