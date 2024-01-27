/* eslint-disable import/no-default-export */
declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.csv' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  import { ReactElement, SVGProps } from 'react';

  const content: (props: SVGProps<SVGElement>) => ReactElement;
  export default content;
}
