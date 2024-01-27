import React from 'react';
import { Controller, FieldPath, FieldValues, UseControllerProps } from 'react-hook-form';

import { DateTimeField, DateTimeFieldProps } from '@/shared/inputs/dateTimeField';

interface FormDateTimeFieldProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>
  extends DateTimeFieldProps,
    Required<Pick<UseControllerProps<TFieldValues, TName>, 'name' | 'control'>> {}

export const FormDateTimeField = <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  name,
  control,
  ...rest
}: FormDateTimeFieldProps<TFieldValues, TName>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <DateTimeField {...field} error={!!error} helperText={error?.message?.toString()} {...rest} />
      )}
    />
  );
};
