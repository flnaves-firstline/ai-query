import { LoadingButton as MuiLoadingButton } from '@mui/lab';
import { styled } from '@mui/material';
import React from 'react';
import { AppKey } from 'react-apiloader';

import { useLoaderInfo } from '@/core/loader';

import { ButtonProps, ButtonVariant, buttonStyles } from './button';

type CommonProps = Pick<ButtonProps, 'variant' | 'children' | 'disabled' | 'size' | 'onClick' | 'type'>;

type AutoLoadingButtonProps = {
  actionType: AppKey;
  mode?: AppKey;
  isLoading?: never;
};

type ManualLoadingButtonProps = {
  actionType?: never;
  mode?: never;
  isLoading: boolean;
};

type LoadingButtonProps = CommonProps & (AutoLoadingButtonProps | ManualLoadingButtonProps);

const StyledButton = styled(MuiLoadingButton)<{ buttonVariant: ButtonVariant }>(({ theme, buttonVariant }) =>
  buttonStyles(theme, buttonVariant)
);

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  actionType,
  mode,
  isLoading,
  variant,
  children,
  ...rest
}) => {
  if (actionType)
    return (
      <AutoLoadingButton actionType={actionType} mode={mode} variant={variant} {...rest}>
        {children}
      </AutoLoadingButton>
    );
  else
    return (
      <ManualLoadingButton isLoading={isLoading ?? false} variant={variant} {...rest}>
        {children}
      </ManualLoadingButton>
    );
};

const AutoLoadingButton: React.FC<CommonProps & AutoLoadingButtonProps> = ({
  variant = 'primary',
  size,
  actionType,
  mode,
  children,
  ...rest
}) => {
  const item = useLoaderInfo(actionType, mode);
  return (
    <StyledButton
      variant={variant === 'primary' ? 'contained' : 'text'}
      buttonVariant={variant}
      size={size}
      loading={item?.isWaiting}
      {...rest}>
      {children}
    </StyledButton>
  );
};

const ManualLoadingButton: React.FC<LoadingButtonProps> = ({
  variant = 'primary',
  size,
  isLoading,
  children,
  ...rest
}) => {
  return (
    <StyledButton
      variant={variant === 'primary' ? 'contained' : 'text'}
      buttonVariant={variant}
      size={size}
      loading={isLoading}
      {...rest}>
      {children}
    </StyledButton>
  );
};
