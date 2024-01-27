import SendIcon from '@mui/icons-material/Send';
import { styled, IconButton, css, Box, Stack, tooltipClasses, Tooltip, TooltipProps } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';

import { AmbiguousValues, ClarificationModel, EligiblePatientPageModel, useTest } from '@/api/eligibilityRuleApi';
import { useGetPatientResourceCount } from '@/api/resourceApi';
import { Page } from '@/app/base/page';
import { PageSubTitle } from '@/app/base/pageSubTitle';
import { CommonQueryPage } from '@/base/commonQueryPage';
import { useLoaderInfo } from '@/core/loader';
import { Button, DataGrid, RepeatPanel, TextField } from '@/shared';

import { ClarificationDialog } from './clarificationDialog';
import { PatientDetailsDialog } from './patientDetailsDialog';
import { QueryHistoryItem } from './queryHistoryItem';

const Content = styled('div')`
  width: 100%;
  display: flex;
  gap: 2rem;
`;

const Queries = styled('div')`
  width: 30%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const QueryHistory = styled('ol')`
  list-style-position: inside;
  padding: 0;
  margin: 0;
`;

const Results = styled('div')(
  ({ theme }) => css`
    padding-left: 2rem;
    border-left: 1px solid ${theme.palette.custom.gray};
    width: 70%;
    min-height: 700px;
  `
);

const ListTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} placement="bottom-start" arrow classes={{ popper: className }} />
))`
  & .${tooltipClasses.tooltip} {
    padding: 0.5rem;
    max-width: 600px;
    font-size: 14px;
  }
`;

export const DemoPage: React.FC = () => {
  const [queryHistory, setQueryHistory] = useState<string[]>([]);
  const [query, setQuery] = useState('');

  const [patientResourcesCount, getPatientResourceCountApi] = useGetPatientResourceCount();
  const getPatientResourceCount = useCallback(() => {
    getPatientResourceCountApi(undefined);
  }, [getPatientResourceCountApi]);
  useEffect(getPatientResourceCount, [getPatientResourceCount]);

  const [ambiguity, setAmbiguity] = useState<{
    values?: AmbiguousValues;
    retryFunc?: (clarification?: ClarificationModel) => void;
  }>();

  const [testResult, test, setTestResults] = useTest();

  const onTestClick = useCallback(
    (clarification?: ClarificationModel) => {
      test({ text: query, ids: testResult?.eligiblePatients?.map((x) => x.id), clarification }).then((x) => {
        if (x.isSuccess && x.data) {
          if (x.data.transformResult.ambiguousValues) {
            setAmbiguity({ retryFunc: onTestClick, values: x.data.transformResult.ambiguousValues });
          } else {
            setQueryHistory((y) => [...y, query]);
            setQuery('');
            setDataGridModel((y) => ({ ...y, page: 0 }));
            setAmbiguity(undefined);
          }
        }
        return x;
      });
    },
    [test, testResult?.eligiblePatients, query]
  );

  const [dataGridModel, setDataGridModel] = useState<CommonQueryPage<EligiblePatientPageModel>>({
    page: 0,
    pageSize: 25,
    orderBy: 'id',
  });

  const testLoader = useLoaderInfo(useTest.id);

  const [selectedPatient, setSelectedPatient] = useState<number>();

  const renderListCell = useCallback((list?: string[]) => {
    if (list) {
      return (
        <ListTooltip
          title={
            <Box slot="ul" sx={{ padding: 0, margin: 0, listStylePosition: 'inside' }}>
              {list.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </Box>
          }>
          <Box sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{list.join(', ')}</Box>
        </ListTooltip>
      );
    } else {
      return null;
    }
  }, []);

  const onResetClick = () => {
    setQueryHistory([]);
    setTestResults(undefined);
  };

  return (
    <Page>
      <Content>
        <RepeatPanel actionType={useGetPatientResourceCount.id} action={getPatientResourceCount}>
          <Queries>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <PageSubTitle>Query</PageSubTitle>
              {queryHistory.length > 0 && (
                <Button size="small" onClick={onResetClick}>
                  Reset queries
                </Button>
              )}
            </Stack>
            <TextField
              value={query}
              onChange={setQuery}
              multiline
              placeholder={queryHistory.length > 0 ? 'Type additional query here' : 'Type query here'}
              disabled={testLoader?.isWaiting}
              endAdornment={
                <IconButton
                  color="primary"
                  size="small"
                  onClick={() => onTestClick(undefined)}
                  disabled={!query || testLoader?.isWaiting}>
                  <SendIcon fontSize="small" />
                </IconButton>
              }
            />
            {queryHistory.length > 0 && (
              <QueryHistory>
                {queryHistory.map((x, i) => (
                  <QueryHistoryItem key={i}>{x}</QueryHistoryItem>
                ))}
              </QueryHistory>
            )}
          </Queries>
          <Results>
            <PageSubTitle>
              Eligible Patients{' '}
              {testResult?.eligiblePatients && (
                <span>
                  ({testResult.eligiblePatients.length} out of {patientResourcesCount})
                </span>
              )}
            </PageSubTitle>
            <Box sx={{ width: '100%', marginTop: '1.5rem' }}>
              <DataGrid
                columns={[
                  { field: 'id', headerName: 'Id', flex: 2 },
                  { field: 'gender', headerName: 'Gender', flex: 2 },
                  { field: 'race', headerName: 'Race', flex: 2 },
                  { field: 'birthDate', headerName: 'Birth Date', flex: 3 },
                  { field: 'deceased', headerName: 'Deceased', flex: 2 },
                  {
                    field: 'activeMedicationNames',
                    headerName: 'Active Medications',
                    flex: 6,
                    renderCell: (x) => renderListCell(x.row.activeMedicationNames),
                  },
                  {
                    field: 'conditionNames',
                    headerName: 'Conditions',
                    flex: 6,
                    renderCell: (x) => renderListCell(x.row.conditionNames),
                  },
                  {
                    field: 'observationNames',
                    headerName: 'Observations',
                    flex: 6,
                    renderCell: (x) => renderListCell(x.row.observationNames),
                  },
                ]}
                getRowId={(x) => x.id}
                rows={testResult?.eligiblePatients ?? []}
                rowCount={testResult?.eligiblePatients?.length ?? 0}
                loading={testLoader?.isWaiting}
                model={dataGridModel}
                onModelChange={setDataGridModel}
                paginationMode="client"
                sortingMode="client"
                maxHeight={520}
                onSelect={(x) => setSelectedPatient(x[0])}
              />
            </Box>
          </Results>
        </RepeatPanel>
      </Content>
      {ambiguity?.values && (
        <ClarificationDialog
          ambiguousValues={ambiguity.values}
          onClose={() => setAmbiguity(undefined)}
          onConfirm={(x) => ambiguity.retryFunc?.(x)}
        />
      )}
      {selectedPatient && <PatientDetailsDialog id={selectedPatient} onClose={() => setSelectedPatient(undefined)} />}
    </Page>
  );
};
