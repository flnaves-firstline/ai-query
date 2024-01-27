import { FormControlLabel, Checkbox as MuiCheckbox, CheckboxProps as MuiCheckboxProps, styled } from '@mui/material';
import React from 'react';

const StyledFormControlLabel = styled(FormControlLabel)`
  margin-top: -11px;
  margin-bottom: -11px;
`;

export interface CheckboxProps extends Pick<MuiCheckboxProps, 'disabled'> {
  label: React.ReactNode;
  value?: boolean;
  onChange?: (value: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, value, onChange, ...rest }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.checked);
  };

  return (
    <StyledFormControlLabel control={<MuiCheckbox checked={value} onChange={handleChange} {...rest} />} label={label} />
  );
};
