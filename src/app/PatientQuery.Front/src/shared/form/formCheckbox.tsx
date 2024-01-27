import React from 'react';
import { Controller, FieldPath, FieldValues, UseControllerProps } from 'react-hook-form';

import { Checkbox, CheckboxProps } from '@/shared/inputs/checkbox';

interface FormCheckboxProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>
  extends CheckboxProps,
    Required<Pick<UseControllerProps<TFieldValues, TName>, 'name' | 'control'>> {}

export const FormCheckbox = <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  name,
  control,
  ...rest
}: FormCheckboxProps<TFieldValues, TName>) => {
  return <Controller control={control} name={name} render={({ field }) => <Checkbox {...field} {...rest} />} />;
};
