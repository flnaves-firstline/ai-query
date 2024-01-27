import { Button as MuiButton, css, Theme, styled, ButtonProps as MuiButtonProps, buttonClasses } from '@mui/material';
import React, { forwardRef } from 'react';

export type ButtonVariant = 'primary' | 'underline' | 'underline-red' | 'table-action' | 'table-action-secondary';

export interface ButtonProps
  extends Pick<MuiButtonProps, 'size' | 'href' | 'disabled' | 'type' | 'onClick' | 'children'> {
  variant?: ButtonVariant;
}

export const buttonStyles = (theme: Theme, variant: ButtonVariant) => css`
  border-radius: 8px;
  text-transform: none;
  box-shadow: none;
  min-width: 32px;
  padding: 0.3rem 1.5rem;

  .${buttonClasses.sizeSmall} {
    padding: 0.2rem 1rem;
  }

  ${variant === 'primary' &&
  css`
    color: white;
  `}

  ${variant === 'underline' &&
  css`
    padding: 0;
    text-decoration: underline;
    color: ${theme.palette.secondary.light};
  `}

  ${variant === 'underline-red' &&
  css`
    padding: 0;
    text-decoration: underline;
    color: ${theme.palette.clinovera.rouge};
  `}

  ${variant === 'table-action' &&
  css`
    font-size: 12px;
    color: white;
    padding: 0px 12px;
    text-transform: uppercase;
    border-radius: 100px;
    background-color: ${theme.palette.secondary.main};
    :hover {
      background-color: ${theme.palette.primary.main};
    }
  `}

  ${variant === 'table-action-secondary' &&
  css`
    font-size: 12px;
    padding: 0px 12px;
    border-radius: 100px;
    background-color: transparent;
    color: ${theme.palette.secondary.main};
    border: 1px solid ${theme.palette.secondary.main};
    :hover {
      color: white;
      border: 1px solid ${theme.palette.primary.main};
      background-color: ${theme.palette.primary.main};
    }
  `}
`;

const StyledButton = styled(MuiButton)<{ buttonVariant: ButtonVariant }>(({ theme, buttonVariant }) =>
  buttonStyles(theme, buttonVariant)
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', children, size, ...rest },
  ref
) {
  return (
    <StyledButton
      ref={ref}
      buttonVariant={variant}
      variant={variant === 'primary' ? 'contained' : 'text'}
      size={size}
      {...rest}>
      {children}
    </StyledButton>
  );
});
