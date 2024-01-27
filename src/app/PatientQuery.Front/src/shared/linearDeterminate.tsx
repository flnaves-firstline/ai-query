import { Box, LinearProgress } from '@mui/material';
import React from 'react';

interface LinearDeterminateProps {
  progress: number;
}

export const LinearDeterminate: React.FC<LinearDeterminateProps> = ({ progress }) => {
  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress variant="determinate" value={progress} />
    </Box>
  );
};
