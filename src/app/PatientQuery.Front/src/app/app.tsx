import React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import { Header } from '@/app/header';
import { basePageRoutes } from '@/consts/routes';

import { DemoPage } from './demo/demoPage';

const getRoutes = () => [
  {
    path: `${basePageRoutes.demoPage}/*`,
    element: <DemoPage />,
  },
  {
    path: `*`,
    element: <Navigate to={basePageRoutes.demoPage} replace />,
  },
];

export const App: React.FC = () => {
  return (
    <>
      <Header />
      {useRoutes(getRoutes())}
    </>
  );
};
