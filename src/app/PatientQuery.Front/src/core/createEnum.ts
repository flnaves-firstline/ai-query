export type Enum<T> = T[Exclude<keyof T, 'all' | 'getName'>];

export const defaultNameConverter = (name: string): string =>
  name.replace(/([A-Z]{1}[a-z]+(?=[A-Z0-9]))/g, '$1 ').replace(/([0-9](?=[A-z]))/g, '$1 ');

export const createEnum = <T extends { [key in keyof T]: Enum<T> }>(
  self: T,
  nameConverter: (id: Enum<T>, name: string) => string = (_, name) => defaultNameConverter(name)
) => {
  const entries = Object.entries(self) as [keyof T, Enum<T>][];
  const names = entries.reduce(
    (p, [name, id]) => p.set(id, nameConverter(id, name as string)),
    new Map<Enum<T>, string>()
  );
  const getName = (id: Enum<T>) => names.get(id) ?? '???';
  const all = entries.map(([, id]) => ({ id, name: getName(id) }));
  return { ...self, all, getName } as const;
};
