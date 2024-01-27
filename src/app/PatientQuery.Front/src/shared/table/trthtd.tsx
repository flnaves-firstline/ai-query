import { TableCell, TableRow, css, styled, tableRowClasses } from '@mui/material';

export const Tr = styled(TableRow)<{ selected?: boolean }>(
  ({ selected, theme }) => css`
    &:not(.${tableRowClasses.head}):not(.${tableRowClasses.footer}) {
      :hover {
        background-color: ${theme.palette.primary.light};
      }
      ${selected &&
      css`
        background-color: ${theme.palette.primary.light};
      `}
    }
  `
);

const commonCellStyles = css`
  padding: 6px 10px;
  border-width: 0px;

  &:first-child {
    padding-left: 4px;
  }

  &:last-child {
    padding-right: 4px;
  }
`;

export const Th = styled(TableCell)(
  ({ theme }) => css`
    ${commonCellStyles}
    font-size: 16px;
    color: ${theme.palette.secondary.main};
    border-bottom: 1px solid rgba(152, 152, 152, 0.48);

    & > *[title] {
      text-decoration: underline dashed;
      text-underline-offset: 3px;
      text-decoration-thickness: 1px;
    }
  `
);

export const Td = styled(TableCell)<{ color?: string }>(
  ({ color }) => css`
    ${commonCellStyles}
    font-size: 15px;
    color: ${color};
  `
);
