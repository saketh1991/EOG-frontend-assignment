import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import React from 'react';

export type Metric = {
  label: string;
  value: string;
  isChecked: boolean;
};


export default function CheckboxSelector(props: { metric: Metric; handleChange: (data: Metric) => void; }) {
  const {metric, metric: { label, isChecked }, handleChange } = props;

  return (
    <FormControlLabel
      value="top"
      control={
        <Switch
          checked={isChecked}
          color="primary"
          inputProps={{ 'aria-label': 'primary checkbox' }}
          onChange={() => handleChange(metric)}
        />
      }
      label={label}
      labelPlacement="top"
    />
  );
}
