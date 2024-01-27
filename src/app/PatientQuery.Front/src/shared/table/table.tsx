import { TableContainer, TableTypeMap, Table as MuiTable, styled } from '@mui/material';
import React from 'react';

const StyledTableContainer = styled(TableContainer)`
  border-bottom: 1px solid rgba(152, 152, 152, 0.48);
`;

interface TableProps extends Pick<TableTypeMap['props'], 'stickyHeader'> {
  maxHeight?: string;
  children?: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ stickyHeader, maxHeight, children }) => {
  return (
    <StyledTableContainer sx={{ maxHeight }}>
      <MuiTable stickyHeader={stickyHeader}>{children}</MuiTable>
    </StyledTableContainer>
  );
};
