import React from 'react';
import { Controller, FieldPath, FieldPathValue, FieldValues, UseControllerProps } from 'react-hook-form';

import { SelectField, SelectFieldProps } from '@/shared/inputs/selectField';

interface FormSelectFieldProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>
  extends SelectFieldProps<FieldPathValue<TFieldValues, TName>>,
    Required<Pick<UseControllerProps<TFieldValues, TName>, 'name' | 'control'>> {}

export const FormSelectField = <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  name,
  control,
  ...rest
}: FormSelectFieldProps<TFieldValues, TName>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <SelectField {...field} error={!!error} helperText={error?.message?.toString()} {...rest} />
      )}
    />
  );
};
