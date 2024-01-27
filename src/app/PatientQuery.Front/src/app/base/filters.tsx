import { Stack } from '@mui/material';
import React from 'react';

interface FiltersProps {
  children: React.ReactNode;
}

export const Filters: React.FC<FiltersProps> = ({ children }) => {
  return (
    <Stack direction="row" alignItems="flex-start" spacing={2}>
      {children}
    </Stack>
  );
};
