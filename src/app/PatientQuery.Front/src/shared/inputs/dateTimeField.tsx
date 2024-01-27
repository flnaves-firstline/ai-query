import { TextFieldProps } from '@mui/material';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';
import React from 'react';

import { inputStyles } from './textField';

export interface DateTimeFieldProps
  extends Pick<DatePickerProps<Date>, 'label' | 'value' | 'disableFuture' | 'minDate' | 'maxDate'>,
    Pick<TextFieldProps, 'size' | 'error' | 'helperText'> {
  onChange?: (value?: Date) => void;
}

export const DateTimeField: React.FC<DateTimeFieldProps> = ({
  onChange,
  value = null,
  size,
  error,
  helperText,
  ...rest
}) => {
  const handleChange = (value: Date | null) => {
    onChange?.(value ?? undefined);
  };

  // TODO: Replace with DateTimePicker
  return (
    <DatePicker
      onChange={handleChange}
      value={value}
      slotProps={{ textField: { size, error, helperText } }}
      sx={inputStyles}
      {...rest}
    />
  );
};
