import React from 'react';
import { Controller, FieldPath, FieldValues, UseControllerProps, FieldPathValue } from 'react-hook-form';

import { CheckboxGroupField, CheckboxGroupFieldProps } from '@/shared/inputs/checkboxGroupField';

interface FormCheckboxGroupFieldProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>
  extends CheckboxGroupFieldProps<FieldPathValue<TFieldValues, TName>[0]>,
    Required<Pick<UseControllerProps<TFieldValues, TName>, 'name' | 'control'>> {}

export const FormCheckboxGroupField = <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  name,
  control,
  ...rest
}: FormCheckboxGroupFieldProps<TFieldValues, TName>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <CheckboxGroupField {...field} error={!!error} helperText={error?.message?.toString()} {...rest} />
      )}
    />
  );
};
