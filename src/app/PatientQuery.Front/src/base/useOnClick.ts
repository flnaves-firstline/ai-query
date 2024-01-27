import { RefObject, useEffect } from 'react';

export const useOnClick = (elRef: RefObject<HTMLElement>, onClick: () => unknown) => {
  useEffect(() => {
    if (elRef.current) {
      elRef.current.addEventListener('click', onClick);
      return () => {
        if (elRef.current) {
          elRef.current.removeEventListener('click', onClick);
        }
      };
    }
  }, [elRef, onClick]);
};
