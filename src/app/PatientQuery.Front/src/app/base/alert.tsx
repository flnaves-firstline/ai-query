import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Alert as MuiAlert } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { Alert as AlertInfo, useDeleteAlert } from '@/base/alerts';

const hideDuration = 5;

const StyledAlert = styled(MuiAlert)<{ isHiding: boolean }>(
  ({ isHiding }) =>
    css`
      margin-bottom: 0.5rem;
      transition-property: opacity;
      transition-duration: ${hideDuration}s;

      ${isHiding &&
      css`
        opacity: 0;
      `}
    `
);

export const Alert: React.FC<{ data: AlertInfo }> = ({ data }) => {
  const deleteAlert = useDeleteAlert();
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    const timeoutId1 = window.setTimeout(() => setIsHiding(true), (data.lifeTimeSec - hideDuration) * 1000);
    const timeoutId2 = window.setTimeout(() => deleteAlert(data.id), data.lifeTimeSec * 1000);
    return () => {
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId1);
    };
  }, [data.id, data.lifeTimeSec, deleteAlert, data]);

  return (
    <StyledAlert severity={data.type} variant="filled" isHiding={isHiding} onClose={() => deleteAlert(data.id)}>
      {data.text}
    </StyledAlert>
  );
};
