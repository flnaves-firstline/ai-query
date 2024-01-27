import { AppBar, css, styled } from '@mui/material';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { basePageRoutes } from '@/consts/routes';

const StyledAppBar = styled(AppBar)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4rem;
  padding: 0.5rem 1rem;
  color: white;
`;

const ProjectLogo = styled('div')(
  () => css`
    font-size: 22px;
    font-weight: 600;
  `
);

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const goToMainPage = useCallback(() => navigate(basePageRoutes.demoPage), [navigate]);

  return (
    <StyledAppBar position="sticky">
      <ProjectLogo onClick={goToMainPage}>Patient Query</ProjectLogo>
    </StyledAppBar>
  );
};
