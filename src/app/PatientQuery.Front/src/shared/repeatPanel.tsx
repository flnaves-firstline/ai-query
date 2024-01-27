import styled from '@emotion/styled';
import { CircularProgress } from '@mui/material';
import React from 'react';
import { AppKey } from 'react-apiloader';

import { useLoaderInfo } from '@/core/loader';
import { Button } from '@/shared/button';

interface Props {
  actionType: AppKey;
  mode?: AppKey;
  action: () => void;
  className?: string;
  children?: React.ReactNode;
}

const RepeatPanelStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const RepeatPanel: React.FC<Props> = ({ actionType, mode, action, children, className }) => {
  const item = useLoaderInfo(actionType, mode);
  if (item?.isWaiting)
    return (
      <RepeatPanelStyled className={className}>
        <CircularProgress />
      </RepeatPanelStyled>
    );
  if (item?.isError)
    return (
      <RepeatPanelStyled className={className}>
        <div>Can{`'`}t get data from server</div>
        <div>{Array.isArray(item.error.description) ? item.error.description.join(' ') : item.error.description}</div>
        <Button onClick={action}>Repeat</Button>
      </RepeatPanelStyled>
    );
  return <>{children}</>;
};
