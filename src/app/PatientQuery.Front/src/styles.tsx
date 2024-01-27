import { css, Global } from '@emotion/react';
import React from 'react';

export const GlobalStyles: React.FC = () => {
  return (
    <Global
      styles={css`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,500;0,700;1,400&display=swap');

        html,
        body {
          padding: 0;
          margin: 0;
          font-family: Roboto, sans-serif;
          color: #565656;
          height: 100%;
        }

        body {
          overflow-y: scroll;
        }

        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }

        ::-webkit-scrollbar-thumb {
          border-radius: 100px;
          background-clip: padding-box;
          background-color: #dbdbdb;

          :hover {
            background-color: #adadad;
          }
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        button {
          background-color: transparent;
          border: none;
        }

        td {
          padding: 0;
        }
      `}
    />
  );
};
