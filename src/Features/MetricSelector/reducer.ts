import { createSlice, PayloadAction } from 'redux-starter-kit';

export type Metric = {
  label: string;
  value: string;
  isChecked: boolean;
};

export type Measurement = {
  metric: string;
  measurements: {
    at: number;
    metric: string;
    unit: string;
    value: 822.97;
  };
};

export type ApiErrorAction = {
  error: string;
};

const initialState = {
  instruments: [] as Metric[],
  measurements: [] as Measurement[],
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
      state.measurements = action.payload;
      return state;
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
