import keyBy from 'lodash/keyBy';
import union from 'lodash/union';

type Key = string | number;

export const fullOuterJoin = <TKey extends Key, X, Y, Z>(
  collection1: X[],
  keySelector1: (item: X) => TKey,
  collection2: Y[],
  keySelector2: (item: Y) => TKey,
  objectSelector: (item1?: X, item2?: Y) => Z
): Z[] => {
  const indexedCollection1 = keyBy(collection1, keySelector1);
  const indexedCollection2 = keyBy(collection2, keySelector2);
  const keys = union(Object.keys(indexedCollection1), Object.keys(indexedCollection2));

  return keys.map((key) => {
    const item1 = indexedCollection1[key];
    const item2 = indexedCollection2[key];
    return objectSelector(item1, item2);
  });
};

export const leftJoin = <TKey extends Key, X, Y, Z>(
  collection1: X[],
  keySelector1: (item: X) => TKey,
  collection2: Y[],
  keySelector2: (item: Y) => TKey,
  objectSelector: (item1: X, item2?: Y) => Z
): Z[] => {
  const indexedCollection2 = keyBy(collection2, keySelector2);

  return collection1.map((item1) => {
    const key = keySelector1(item1);
    const item2 = indexedCollection2[key];
    return objectSelector(item1, item2);
  });
};
