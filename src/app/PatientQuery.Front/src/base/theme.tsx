import { createTheme } from '@mui/material';
import { LinkProps as MuiLinkProps } from '@mui/material/Link';
import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

// eslint-disable-next-line react/display-name
const LinkBehavior = React.forwardRef<HTMLAnchorElement, Omit<LinkProps, 'to'> & { href: LinkProps['to'] }>(
  (props, ref) => {
    const { href, ...other } = props;
    // Map href (Material UI) -> to (react-router)
    return <Link ref={ref} to={href} {...other} />;
  }
);

interface ClinoveraColors {
  river?: string;
  beige?: string;
  eggshell?: string;
  rouge?: string;
  blood?: string;
  stone?: string;
  ocean?: string;
}

interface CustomColors {
  greenDark?: string;
  pink?: string;
  gray?: string;
}

declare module '@mui/material/styles' {
  interface Palette {
    clinovera: ClinoveraColors;
    custom: CustomColors;
  }

  interface PaletteOptions {
    clinovera?: ClinoveraColors;
    custom?: CustomColors;
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: '#35ce8d',
      light: '#E1F8EE',
    },
    secondary: {
      main: '#446B8B',
      light: '#4C95D8',
    },
    text: {
      primary: '#565656',
      secondary: '#446B8B',
    },
    clinovera: {
      rouge: '#be3f34',
    },
    custom: {
      pink: '#D84C7F',
      greenDark: '#259062',
      gray: '#dbdbdb',
    },
  },
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      } as MuiLinkProps,
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
  },
});
