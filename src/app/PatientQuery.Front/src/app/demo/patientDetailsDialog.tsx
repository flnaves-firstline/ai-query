import { Stack, styled } from '@mui/material';
import React, { useCallback, useEffect } from 'react';

import { useGetPatientDetails } from '@/api/resourceApi';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, RepeatPanel } from '@/shared';
import { DateTime } from '@/utils/dateTime';

const Label = styled('div')`
  color: ${({ theme }) => theme.palette.primary.main};
  font-size: 18px;
  font-weight: bold;
`;

const DetailsBlock = styled('div')`
  min-width: 200px;
`;

const List = styled('div')`
  max-height: 200px;
  overflow-y: scroll;
`;

type PatientDetailsDialogProps = {
  id: number;
  onClose: () => void;
};

export const PatientDetailsDialog: React.FC<PatientDetailsDialogProps> = ({ id, onClose }) => {
  const [patient, getPatientDetailsApi] = useGetPatientDetails();

  const getPatientDetails = useCallback(() => {
    getPatientDetailsApi(id);
  }, [getPatientDetailsApi, id]);
  useEffect(getPatientDetails, [getPatientDetails]);

  return (
    <Dialog open={true} onClose={onClose} maxWidth="xl">
      <DialogTitle>Patient Details</DialogTitle>
      <DialogContent>
        <RepeatPanel actionType={useGetPatientDetails.id} action={getPatientDetails}>
          {patient && (
            <Stack gap={7}>
              <Stack gap={7} direction="row">
                <Stack gap={2}>
                  <DetailsBlock>
                    <Label>Gender</Label>
                    <div>{patient.gender || '-'}</div>
                  </DetailsBlock>
                  <DetailsBlock>
                    <Label>Birthdate</Label>
                    <div>{patient.birthDate != null ? DateTime.format(new Date(patient.birthDate), 'date') : '-'}</div>
                  </DetailsBlock>
                  <DetailsBlock>
                    <Label>Deceased</Label>
                    <div>{patient.deceased != null ? String(patient.deceased) : '-'}</div>
                  </DetailsBlock>
                  <DetailsBlock>
                    <Label>Race</Label>
                    <div>{patient.race || '-'}</div>
                  </DetailsBlock>
                  <DetailsBlock>
                    <Label>Ethnicity</Label>
                    <div>{patient.ethnicity || '-'}</div>
                  </DetailsBlock>
                </Stack>
                <DetailsBlock>
                  <Label>Observations</Label>
                  <List>
                    {patient.observationNames?.length
                      ? patient.observationNames.map((x, i) => <div key={i}>{x}</div>)
                      : '-'}
                  </List>
                </DetailsBlock>
                <DetailsBlock>
                  <Label>Conditions</Label>
                  <List>
                    {patient.conditionNames?.length
                      ? patient.conditionNames.map((x, i) => <div key={i}>{x}</div>)
                      : '-'}
                  </List>
                </DetailsBlock>
                <DetailsBlock>
                  <Label>Encounter Dates</Label>
                  <List>
                    {patient.encounterDates?.length
                      ? patient.encounterDates.map((x, i) => <div key={i}>{DateTime.format(new Date(x), 'date')}</div>)
                      : '-'}
                  </List>
                </DetailsBlock>
              </Stack>
              <Stack gap={7} direction="row">
                <DetailsBlock>
                  <Label>Procedures</Label>
                  <List>
                    {patient.procedureNames?.length
                      ? patient.procedureNames.map((x, i) => <div key={i}>{x}</div>)
                      : '-'}
                  </List>
                </DetailsBlock>
                <DetailsBlock>
                  <Label>Active Medications</Label>
                  <List>
                    {patient.activeMedicationNames?.length
                      ? patient.activeMedicationNames.map((x, i) => <div key={i}>{x}</div>)
                      : '-'}
                  </List>
                </DetailsBlock>
              </Stack>
            </Stack>
          )}
        </RepeatPanel>
      </DialogContent>
      <DialogActions>
        <Button variant="underline" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
