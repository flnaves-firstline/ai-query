import styled from '@emotion/styled';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Button, Collapse } from '@mui/material';
import React, { useState } from 'react';

const Container = styled('div')``;

const ContentContainer = styled('div')``;

interface CollapsibleProps {
  label: React.ReactNode;
  children?: React.ReactNode;
}

export const Collapsible: React.FC<CollapsibleProps> = ({ label, children }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Container>
      <Button
        startIcon={collapsed ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        onClick={() => setCollapsed((x) => !x)}>
        {label}
      </Button>
      <Collapse in={collapsed}>
        <ContentContainer>{children}</ContentContainer>
      </Collapse>
    </Container>
  );
};
