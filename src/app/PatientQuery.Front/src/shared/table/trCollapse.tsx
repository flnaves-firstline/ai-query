import styled from '@emotion/styled';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Collapse, IconButton } from '@mui/material';
import React, { useState } from 'react';

import { Td, Tr } from './trthtd';

const ContentContainer = styled('div')`
  padding: 0px 10px 10px 48px;
`;

interface TrCollapseProps {
  content: React.ReactNode;
  children?: React.ReactNode;
}

export const TrCollapse: React.FC<TrCollapseProps> = ({ content, children }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <>
      <Tr>
        <Td width={5}>
          <IconButton sx={{ padding: 0 }} size="small" onClick={() => setCollapsed((x) => !x)}>
            {collapsed ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </Td>
        {children}
      </Tr>
      <tr>
        <td colSpan={100}>
          <Collapse in={collapsed}>
            <ContentContainer>{content}</ContentContainer>
          </Collapse>
        </td>
      </tr>
    </>
  );
};
