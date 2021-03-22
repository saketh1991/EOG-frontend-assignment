import { createSlice, PayloadAction } from 'redux-starter-kit';

export type Metric = {
  label: string;
  value: string;
  isChecked: boolean;
};

export type ApiErrorAction = {
  error: string;
};

const initialState = [] as Metric[];

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    metricsDataRecevied: (state, action: PayloadAction<string[]>) => {
      state = action.payload.map((metric: string) => ({
        label: metric,
        value: metric,
        isChecked: false, 
      }))
      return state;
    },    
    metricsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
    updateMetricSelection: (state, action: PayloadAction<Metric>) => {
      state = state.map(metric => 
        {
          if(metric.value === action.payload.value) {
            return { ...metric, isChecked: !action.payload.isChecked }
          }
          return metric
        })
      return state;
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
