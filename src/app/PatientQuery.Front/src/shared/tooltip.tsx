import { Tooltip as MuiTooltip, TooltipProps as MuiTooltipProps, styled } from '@mui/material';
import React from 'react';

const StyledTooltip = styled(MuiTooltip)``;

export const Tooltip: React.FC<MuiTooltipProps> = ({
  arrow = true,
  describeChild = true,
  ...props
}: MuiTooltipProps) => <StyledTooltip arrow={arrow} describeChild={describeChild} {...props} />;
