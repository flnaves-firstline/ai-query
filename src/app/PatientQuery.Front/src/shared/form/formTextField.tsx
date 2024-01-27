import React from 'react';
import { Controller, FieldPath, FieldValues, UseControllerProps } from 'react-hook-form';

import { TextField, TextFieldProps } from '@/shared/inputs/textField';

interface FormTextFieldProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>
  extends TextFieldProps,
    Required<Pick<UseControllerProps<TFieldValues, TName>, 'name' | 'control'>> {}

export const FormTextField = <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  name,
  control,
  ...rest
}: FormTextFieldProps<TFieldValues, TName>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <TextField {...field} error={!!error} helperText={error?.message?.toString()} {...rest} />
      )}
    />
  );
};
