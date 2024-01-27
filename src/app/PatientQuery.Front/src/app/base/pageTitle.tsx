import { css, styled } from '@mui/material';

export const PageTitle = styled('div')(
  ({ theme }) => css`
    font-size: 25px;
    font-weight: 700;
    color: ${theme.palette.text.secondary};
    margin-right: 40px;
  `
);
