import { FormControl, FormControlLabel, FormLabel, Radio, styled, FormHelperText, FormGroup } from '@mui/material';
import React, { useMemo } from 'react';

import { ValueType, Option } from './selectField';

const StyledFormControlLabel = styled(FormControlLabel)`
  margin-bottom: -11px;
`;

export interface RadioGroupFieldProps<TValue extends ValueType> {
  label?: React.ReactNode;
  options: Option<TValue>[];
  value?: TValue;
  onChange?: (value: TValue) => void;
  required?: boolean;
  error?: boolean;
  helperText?: React.ReactNode;
}

let idCounter = 0;

export const RadioGroupField = <TValue extends ValueType>({
  label,
  options,
  value,
  onChange,
  required,
  error,
  helperText,
}: RadioGroupFieldProps<TValue>) => {
  const labelId = useMemo(() => `radio-group-label-${idCounter++}`, []);

  const handleClick = (optionValue: TValue) => () => {
    onChange?.(optionValue);
  };

  return (
    <FormControl error={error}>
      {label && <FormLabel id={labelId}>{label}</FormLabel>}
      <FormGroup row aria-labelledby={labelId} aria-required={required}>
        {options.map((x) => (
          <StyledFormControlLabel
            key={x.value}
            label={x.label}
            value={String(x.value)}
            control={<Radio checked={value === x.value} onClick={handleClick(x.value)} />}
          />
        ))}
      </FormGroup>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
