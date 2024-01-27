import { ParsedQuery, parse } from 'query-string';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export const useLocationParams = <
  P extends ParsedQuery<string | number | number[] | boolean | undefined | null>
>(): P => {
  const location = useLocation();
  return useMemo(
    () =>
      Object.fromEntries(
        Object.entries(
          parse(location.search, {
            parseBooleans: true,
            parseNumbers: true,
            arrayFormat: 'bracket-separator',
          })
        ).map(([k, v]) => [k, v === 'null' ? null : v])
      ) as P,
    [location.search]
  );
};
