import React from 'react';
import { Controller, FieldPath, FieldValues, UseControllerProps, FieldPathValue } from 'react-hook-form';

import { RadioGroupField, RadioGroupFieldProps } from '@/shared/inputs/radioGroupField';

interface FormRadioGroupFieldProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>
  extends RadioGroupFieldProps<FieldPathValue<TFieldValues, TName>>,
    Required<Pick<UseControllerProps<TFieldValues, TName>, 'name' | 'control'>> {}

export const FormRadioGroupField = <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  name,
  control,
  ...rest
}: FormRadioGroupFieldProps<TFieldValues, TName>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <RadioGroupField {...field} error={!!error} helperText={error?.message?.toString()} {...rest} />
      )}
    />
  );
};
