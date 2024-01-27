import { AlertColor } from '@mui/material';
import { useCallback } from 'react';

import { counter } from '@/core/counter';
import { createAtom, useAtom } from '@/core/globalState';

export interface Alert {
  id: number;
  text: string;
  type: AlertColor;
  lifeTimeSec: number;
  lifeTimeDuringLocation: boolean;
}

export const alertAtom = createAtom<Alert[]>({ init: [] });

export const useAlert = () => useAtom<Alert[]>(alertAtom);

export const createAlerts = (
  text: string | string[],
  type: AlertColor = 'error',
  lifeTimeSec?: number,
  lifeTimeDuringLocation = true
) => {
  const messages = Array.isArray(text) ? text : [text];
  return messages.map((x) => ({
    id: counter.next,
    text: x,
    type,
    lifeTimeSec: lifeTimeSec ?? (type === 'error' ? 15 : 7),
    lifeTimeDuringLocation,
  }));
};

export const useAddAlert = (): ((
  text: string | string[],
  type?: AlertColor,
  lifeTimeSec?: number,
  lifeTimeDuringLocation?: boolean
) => void) => {
  const [, setAlert] = useAlert();
  return useCallback(
    (text: string | string[], type: AlertColor = 'error', lifeTimeSec?: number, lifeTimeDuringLocation = true) => {
      setAlert((items) => items.concat(createAlerts(text, type, lifeTimeSec, lifeTimeDuringLocation)));
    },
    [setAlert]
  );
};

export const useDeleteAlert = (): ((id: number) => void) => {
  const [, setAlert] = useAlert();
  return useCallback((id: number) => setAlert((items) => items.filter((x) => x.id !== id)), [setAlert]);
};
