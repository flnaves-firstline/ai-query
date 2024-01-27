import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  SelectChangeEvent,
  SelectProps,
} from '@mui/material';
import React, { useMemo } from 'react';

export type ValueType = number | string;

export type Option<TValue extends ValueType> = {
  value: TValue;
  label: string;
};

export interface SelectFieldProps<TValue extends ValueType> extends Pick<SelectProps, 'label' | 'required'> {
  options: Option<TValue>[];
  value?: TValue;
  onChange?: (value: TValue) => void;
  error?: boolean;
  helperText?: React.ReactNode;
}

let idCounter = 0;

export const SelectField = <TValue extends ValueType>({
  label,
  options,
  value,
  onChange,
  required,
  error,
  helperText,
}: SelectFieldProps<TValue>) => {
  const labelId = useMemo(() => `select-label-${idCounter++}`, []);

  const handleChange = (event: SelectChangeEvent) => {
    onChange?.(event.target.value as TValue);
  };

  return (
    <FormControl sx={{ minWidth: 200 }} error={error}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <MuiSelect
        labelId={labelId}
        value={value?.toString() ?? ''}
        label={label}
        onChange={handleChange}
        autoWidth
        required={required}>
        {options.map((option) => (
          <MenuItem key={option.value.toString()} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
