import styled from '@emotion/styled';
import React from 'react';

import { useAlert } from '@/base/alerts';

import { Alert } from './alert';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 500px;
  padding: 0.5rem;
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 1500;
`;

export const AlertContainer: React.FC = () => {
  const [alerts] = useAlert();
  return (
    <Container>
      {alerts.map((x) => (
        <Alert key={x.id} data={x} />
      ))}
    </Container>
  );
};
