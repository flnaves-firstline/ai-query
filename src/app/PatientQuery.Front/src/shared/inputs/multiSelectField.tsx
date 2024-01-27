import {
  styled,
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  SelectProps,
  SelectChangeEvent,
  Box,
  Chip,
  css,
  chipClasses,
  FormHelperText,
} from '@mui/material';
import React, { useMemo } from 'react';

import { ValueType, Option } from './selectField';

const SelectedOption = styled(Chip)(
  ({ theme }) => css`
    background-color: ${theme.palette.primary.light};
    & .${chipClasses.deleteIcon} {
      color: ${theme.palette.primary.main};
    }
  `
);

export interface MultiSelectFieldProps<TValue extends ValueType> extends Pick<SelectProps, 'label' | 'required'> {
  options: Option<TValue>[];
  value?: TValue[];
  onChange?: (value: TValue[]) => void;
  error?: boolean;
  helperText?: React.ReactNode;
}

let idCounter = 0;

export const MultiSelectField = <TValue extends ValueType>({
  label,
  options,
  value = [],
  onChange,
  required,
  error,
  helperText,
}: MultiSelectFieldProps<TValue>) => {
  const labelId = useMemo(() => `multi-select-label-${idCounter++}`, []);

  const handleChange = (event: SelectChangeEvent<TValue[]>) => {
    onChange?.(event.target.value as TValue[]);
  };

  const handleDelete = (option: TValue) => {
    if (value) onChange?.(value?.filter((x) => x !== option));
  };

  return (
    <FormControl sx={{ minWidth: 200 }} error={error}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <MuiSelect
        labelId={labelId}
        value={value ?? []}
        label={label}
        onChange={handleChange}
        autoWidth
        multiple
        required={required}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((x) => (
              <SelectedOption
                key={x}
                label={options.find((y) => y.value === x)?.label}
                onDelete={() => handleDelete(x)}
              />
            ))}
          </Box>
        )}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
