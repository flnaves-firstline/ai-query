import { css, styled } from '@mui/material';

export const QueryHistoryItem = styled('li')(
  ({ theme }) => css`
    font-size: 18px;
    padding: 1rem 0;
    border-bottom: 1px solid ${theme.palette.custom.gray};

    ::marker {
      color: ${theme.palette.custom.gray};
    }
  `
);
