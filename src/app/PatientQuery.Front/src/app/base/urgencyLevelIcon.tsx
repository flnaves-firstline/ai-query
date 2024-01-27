import CircleIcon from '@mui/icons-material/Circle';
import { Stack } from '@mui/material';
import React from 'react';

import { UrgencyLevel, UrgencyLevelEnum } from '@/enums/urgencyLevel';

interface UrgencyLevelIconProps {
  urgencyLevel: UrgencyLevelEnum;
}

export const UrgencyLevelIcon: React.FC<UrgencyLevelIconProps> = ({ urgencyLevel }) => {
  return (
    <Stack alignItems="center" direction="row" spacing={1}>
      <CircleIcon
        color={
          urgencyLevel === UrgencyLevel.Low
            ? 'success'
            : urgencyLevel === UrgencyLevel.Medium
            ? 'info'
            : urgencyLevel === UrgencyLevel.Urgent
            ? 'warning'
            : 'error'
        }
      />
      <span>{UrgencyLevel.getName(urgencyLevel)}</span>
    </Stack>
  );
};
