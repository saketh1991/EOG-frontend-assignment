import { createSlice, PayloadAction } from 'redux-starter-kit';
import _ from 'lodash';
import produce from 'immer';

export type Metric = {
  label: string;
  value: string;
  isChecked: boolean;
};

export type Measurement = {
  metric: string;
  measurements: Measure[];
};

export type Measure = {
    at: number;
    unit: string;
    value: number;
};

export type ApiErrorAction = {
  error: string;
};

const initialState = {
  instruments: [] as Metric[],
  measurements: {} as { [key: string]: Measurement[] },
};

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    metricsDataRecevied: (state, action: PayloadAction<string[]>) => {
      state.instruments = action.payload.map((metric: string) => ({
        label: metric,
        value: metric,
        isChecked: false,
      }));
      return state;
    },
    metricsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
    updateMetricSelection: (state, action: PayloadAction<Metric>) => {
      state.instruments = state.instruments.map(metric => {
        if (metric.value === action.payload.value) {
          return { ...metric, isChecked: !action.payload.isChecked };
        }
        return metric;
      });
      return state;
    },
    metricMeasurementsRecieved: (state, action: PayloadAction<Measurement[]>) => {
      state.measurements = action.payload.reduce((acc: { [key: string]: any }, m) => {
        acc[m.metric] = m.measurements;
        return acc;
      }, {});

      return state;
    },
    metricNewMeasurementsRecieved: (state, action: PayloadAction<Measurement>) => {
      return produce(state, draftState => {
        draftState = state;
        const groupedData = _.groupBy(action.payload, 'metric');
        Object.keys(draftState.measurements).forEach(key => {
          draftState.measurements[key]= [...draftState.measurements[key], ...groupedData[key]] as Measurement[];
        });
      });
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
