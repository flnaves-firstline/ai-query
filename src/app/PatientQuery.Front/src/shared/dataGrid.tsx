import { styled } from '@mui/material';
import {
  DataGrid as MuiDataGrid,
  DataGridProps as MuiDataGridProps,
  GridColDef,
  GridRowId,
  GridSortModel,
  GridPaginationModel,
  GridRowParams,
  GridActionsCellItemProps,
} from '@mui/x-data-grid';
import React, { useCallback, useMemo } from 'react';

const StyledMuiDataGrid = styled(MuiDataGrid)`
  width: 100%;
` as typeof MuiDataGrid;

export type Column<TRow extends Record<string, unknown>> = Pick<
  GridColDef<TRow>,
  | 'headerName'
  | 'filterable'
  | 'sortable'
  | 'resizable'
  | 'flex'
  | 'valueFormatter'
  | 'valueGetter'
  | 'renderCell'
  | 'width'
  | 'align'
  | 'headerAlign'
> &
  (
    | {
        field: keyof TRow;
      }
    | {
        type: 'actions';
        getActions: (params: GridRowParams<TRow>) => React.ReactElement<GridActionsCellItemProps>[];
      }
  );

type Model<TRow extends Record<string, unknown>> = {
  page?: number;
  pageSize?: number;
  orderBy?: keyof TRow;
  sortBy?: 'asc' | 'desc';
};

interface DataGridProps<TRow extends Record<string, unknown>, TId extends GridRowId, TModel extends Model<TRow>>
  extends Pick<
    MuiDataGridProps<TRow>,
    | 'rows'
    | 'rowCount'
    | 'checkboxSelection'
    | 'paginationMode'
    | 'sortingMode'
    | 'hideFooterPagination'
    | 'disableColumnFilter'
    | 'disableColumnMenu'
    | 'disableColumnSelector'
    | 'loading'
  > {
  getRowId: (row: TRow) => TId;
  columns: Column<TRow>[];
  onSelect?: (ids: TId[]) => void;
  model?: TModel;
  onModelChange?: (model: TModel) => void;
  minHeight?: number;
  maxHeight?: number;
}

export const DataGrid = <TRow extends Record<string, unknown>, TId extends GridRowId, TModel extends Model<TRow>>({
  rows,
  columns,
  paginationMode = 'server',
  sortingMode = 'server',
  onSelect,
  minHeight,
  maxHeight,
  disableColumnFilter = true,
  disableColumnMenu = true,
  disableColumnSelector = true,
  model,
  onModelChange,
  ...rest
}: DataGridProps<TRow, TId, TModel>) => {
  const cols = useMemo(
    () =>
      columns.map(
        (x) =>
          ({
            filterable: false,
            flex: 1,
            ...x,
            field: 'type' in x ? 'actions' : x.field.toString(),
          } as GridColDef<TRow>)
      ),
    [columns]
  );

  const paginationModel = useMemo(
    () =>
      model && {
        page: model.page ?? 0,
        pageSize: model.pageSize ?? 25,
      },
    [model]
  );

  const onPaginationModelChange = useCallback(
    (paginationModel: GridPaginationModel) => {
      if (model) {
        onModelChange?.({
          ...model,
          page: paginationModel.page,
          pageSize: paginationModel.pageSize,
        });
      }
    },
    [model, onModelChange]
  );

  const sortModel = useMemo(
    () =>
      model?.orderBy && [
        {
          field: model.orderBy.toString(),
          sort: model.sortBy,
        },
      ],
    [model]
  );

  const onSortModelChange = useCallback(
    (sortModel: GridSortModel) => {
      if (model) {
        onModelChange?.({
          ...model,
          orderBy: sortModel[0].field,
          sortBy: sortModel[0].sort ?? undefined,
        });
      }
    },
    [model, onModelChange]
  );

  return (
    <StyledMuiDataGrid
      rows={rows}
      columns={cols}
      onRowSelectionModelChange={(x) => onSelect?.(x as TId[])}
      paginationMode={paginationMode}
      pageSizeOptions={[25]}
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      sortingMode={sortingMode}
      sortingOrder={['asc', 'desc']}
      sortModel={sortModel}
      onSortModelChange={onSortModelChange}
      disableColumnFilter={disableColumnFilter}
      disableColumnMenu={disableColumnMenu}
      disableColumnSelector={disableColumnSelector}
      autoHeight={!rows.length || (maxHeight == null && minHeight == null)}
      sx={{
        minHeight,
        maxHeight,
      }}
      {...rest}
    />
  );
};
