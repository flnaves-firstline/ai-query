import { FormControl, FormControlLabel, FormLabel, Checkbox, FormGroup, styled, FormHelperText } from '@mui/material';
import React, { useMemo } from 'react';

import { ValueType, Option } from './selectField';

const StyledFormControlLabel = styled(FormControlLabel)`
  margin-bottom: -11px;
`;

export interface CheckboxGroupFieldProps<TValue extends ValueType> {
  label?: React.ReactNode;
  options: Option<TValue>[];
  value?: TValue[];
  onChange?: (value: TValue[]) => void;
  required?: boolean;
  error?: boolean;
  helperText?: React.ReactNode;
  disabled?: boolean;
}

let idCounter = 0;

export const CheckboxGroupField = <TValue extends ValueType>({
  label,
  options,
  value = [],
  onChange,
  required,
  error,
  helperText,
  disabled,
}: CheckboxGroupFieldProps<TValue>) => {
  const labelId = useMemo(() => `checkbox-group-label-${idCounter++}`, []);

  const handleChange = (optionValue: TValue) => (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.checked ? value.concat(optionValue) : value.filter((x) => x !== optionValue));
  };

  return (
    <FormControl error={error}>
      {label && <FormLabel id={labelId}>{label}</FormLabel>}
      <FormGroup row aria-labelledby={labelId} aria-required={required}>
        {options.map((x) => (
          <StyledFormControlLabel
            key={x.value}
            label={x.label}
            value={x.value}
            control={
              <Checkbox checked={value.includes(x.value)} onChange={handleChange(x.value)} disabled={disabled} />
            }
          />
        ))}
      </FormGroup>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
