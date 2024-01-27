import React, { useState } from 'react';

import { AmbiguousValues, ClarificationModel } from '@/api/eligibilityRuleApi';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, RadioGroupField } from '@/shared';

interface ClarificationDialogProps {
  ambiguousValues: AmbiguousValues;
  onClose: () => void;
  onConfirm: (clarification: ClarificationModel) => void;
}

export const ClarificationDialog: React.FC<ClarificationDialogProps> = ({ ambiguousValues, onClose, onConfirm }) => {
  const [clarification, setClarification] = useState<ClarificationModel>({
    medicationBrandNames: ambiguousValues.medications,
  });

  const onConfirmClick = () => {
    onConfirm(clarification);
    onClose();
  };

  const onChange = (medication: string, value: boolean) => {
    if (!value) {
      setClarification((x) => ({ ...x, medicationBrandNames: x.medicationBrandNames.filter((y) => y !== medication) }));
    } else {
      setClarification((x) => ({ ...x, medicationBrandNames: [...x.medicationBrandNames, medication] }));
    }
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>We found an ambiguity in your request. Please clarify</DialogTitle>
      <DialogContent>
        {ambiguousValues.medications.map((x) => (
          <RadioGroupField
            key={x}
            label={x}
            options={[
              { value: 1, label: 'Brand name' },
              { value: 0, label: 'Drug generic/class name' },
            ]}
            value={Number(!!clarification.medicationBrandNames?.includes(x))}
            onChange={(value) => onChange(x, Boolean(value))}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button variant="underline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onConfirmClick}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};
