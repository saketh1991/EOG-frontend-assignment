import { makeStyles } from "@material-ui/core/styles";
import React from 'react';
import { useSelector } from 'react-redux';
import { CartesianGrid, Label, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Provider } from 'urql';
import { Measurement } from '../Features/MetricSelector/reducer';
import { IState } from '../store';
import { client } from '../utils/client';
import { colors } from '../utils/constants';

const useStyles = makeStyles({
  message: {
    height: '80%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '22px',
    color: '#969598'
  }
});

interface Color {
  [key: string]: string;
}

function Chart() {

  const classes = useStyles();

  const selectedMetricsMeasurements: { [key: string]: Measurement[] } = useSelector((state: IState) => state.metrics.measurements);
  if (!Object.keys(selectedMetricsMeasurements).length) {
    return <div className={classes.message}>
      Please Select An Instrument.
    </div>;
  }
  return (
    <ResponsiveContainer width="100%" height="70%">
      <LineChart >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" type="category" allowDuplicatedCategory={false} style={{ margin: '10px' }} format="date">
          <Label value="Time" offset={0} position="insideBottom" />
        </XAxis>
        <YAxis dataKey="value">
          <Label value="PSI" offset={0} position="insideLeft" />
        </YAxis>
        <Tooltip />
        <Legend layout="vertical" verticalAlign="middle" align="right" />
        {Object.keys(selectedMetricsMeasurements).map(instrument => {
          return (
            <Line
              dataKey="value"
              data={selectedMetricsMeasurements[instrument]}
              name={instrument}
              key={instrument}
              dot={false}
              stroke={(colors as Color)[instrument]}
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>

  );
}

export default () => {
  return (
    <Provider value={client}>
      <Chart />
    </Provider>
  );
};
