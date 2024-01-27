import { Menu as MuiMenu, styled } from '@mui/material';
import React, { useState } from 'react';

const Anchor = styled('div')`
  display: inline-block;
`;

interface MenuProps {
  anchor: React.ReactNode;
  children: React.ReactNode;
}

export const Menu: React.FC<MenuProps> = ({ anchor, children }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleAnchorClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Anchor onClick={handleAnchorClick}>{anchor}</Anchor>
      <MuiMenu anchorEl={anchorEl} open={open} onClose={handleClose} onClick={handleClose}>
        {children}
      </MuiMenu>
    </>
  );
};
