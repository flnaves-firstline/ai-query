export interface CommonQueryPage<TItem extends Record<string, unknown>> {
  page?: number;
  pageSize?: number;
  orderBy: keyof TItem;
  sortBy?: 'asc' | 'desc';
}
