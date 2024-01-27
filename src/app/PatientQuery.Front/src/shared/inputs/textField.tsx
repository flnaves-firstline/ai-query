import {
  InputAdornment,
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
  styled,
  inputClasses,
  inputLabelClasses,
  formLabelClasses,
  SxProps,
  Theme,
} from '@mui/material';
import React, { forwardRef } from 'react';

const StyledInputAdornment = styled(InputAdornment)`
  height: 100%;
  align-self: flex-start;
`;

export const inputStyles: SxProps<Theme> = {
  [`& .${inputClasses.sizeSmall}`]: { height: 35, width: 220 },
  [`& :not(.${inputLabelClasses.focused}):not(.${formLabelClasses.filled}).${inputLabelClasses.sizeSmall}`]: {
    transform: 'translate(14px, 7px)',
  },
};

export interface TextFieldProps
  extends Pick<
    MuiTextFieldProps,
    | 'label'
    | 'value'
    | 'type'
    | 'multiline'
    | 'placeholder'
    | 'required'
    | 'fullWidth'
    | 'sx'
    | 'size'
    | 'rows'
    | 'minRows'
    | 'maxRows'
    | 'error'
    | 'helperText'
    | 'autoComplete'
    | 'disabled'
  > {
  onChange?: (value: string) => void;
  endAdornment?: React.ReactNode;
  readOnly?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { onChange, readOnly, endAdornment, value, ...rest },
  ref
) {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    onChange?.(event.target.value);
  };

  return (
    <MuiTextField
      ref={ref}
      value={value ?? ''}
      onChange={handleChange}
      InputProps={{
        readOnly,
        endAdornment: endAdornment && <StyledInputAdornment position="end">{endAdornment}</StyledInputAdornment>,
      }}
      sx={inputStyles}
      {...rest}
    />
  );
});
