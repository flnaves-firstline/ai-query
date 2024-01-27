import { css, styled } from '@mui/material';

export const PageSubTitle = styled('div')(
  ({ theme }) => css`
    font-size: 18px;
    font-weight: 700;
    color: ${theme.palette.text.secondary};
    margin-right: 40px;
    min-height: 34px;
  `
);
