export type Paths<T> = T extends Array<infer U>
  ? `${Paths<U>}`
  : // eslint-disable-next-line @typescript-eslint/ban-types
  T extends object
  ? {
      [K in keyof T & (string | number)]: K extends string ? `${K}` | `${K}.${Paths<T[K]>}` : never;
    }[keyof T & (string | number)]
  : never;

export type ExtractType<T, U extends Partial<T>> = T extends T ? (U extends Partial<T> ? T : never) : never;
