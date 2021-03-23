import React from 'react';
import { useSelector } from 'react-redux';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { Provider } from 'urql';
import { Measurement } from '../Features/MetricSelector/reducer';
import { IState } from '../store';
import { client } from '../utils/client';
import { colors } from '../utils/constants';

interface Color {
  [key: string]: string;
}

function Chart() {
  const selectedMetricsMeasurements: { [key: string]: Measurement[] } = useSelector((state: IState) => state.metrics.measurements);
  return (
    <LineChart width={1000} height={600}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="at" type="category" allowDuplicatedCategory={false} />
      <YAxis dataKey="value" />
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
  );
}

export default () => {
  return (
    <Provider value={client}>
      <Chart />
    </Provider>
  );
};
