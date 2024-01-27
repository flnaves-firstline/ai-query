import React from 'react';
import { Controller, FieldPath, FieldPathValue, FieldValues, UseControllerProps } from 'react-hook-form';

import { MultiSelectField, MultiSelectFieldProps } from '@/shared/inputs/multiSelectField';

interface FormMultiSelectFieldProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>
  extends MultiSelectFieldProps<FieldPathValue<TFieldValues, TName>[0]>,
    Required<Pick<UseControllerProps<TFieldValues, TName>, 'name' | 'control'>> {}

export const FormMultiSelectField = <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  name,
  control,
  ...rest
}: FormMultiSelectFieldProps<TFieldValues, TName>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <MultiSelectField {...field} error={!!error} helperText={error?.message?.toString()} {...rest} />
      )}
    />
  );
};
