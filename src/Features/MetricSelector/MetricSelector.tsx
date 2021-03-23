import { useLazyQuery } from '@apollo/client';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { gql, Provider, useQuery } from 'urql';
import Checkbox from '../../components/Checkbox';
import { IState } from '../../store';
import { client } from '../../utils/client';
import { actions, Measurement, Metric } from './reducer';

const useStyles = makeStyles({
  container: {
    paddingTop: "20px",
    alignItems: 'center',
    display: "flex"
  },
  card: {
    background: 'white',
    padding: '10px',
    borderRadius: '4px',
    textAlign: 'center',
    fontWeight: 'bold',
    margin: '10px',
    height: 40
  }
});


const getMetricsQuery = `
query {
  getMetrics
}
`;

const getMeasurementsQuery = gql`
query($input: [MeasurementQuery]) {
  getMultipleMeasurements(input: $input) {
    metric
    measurements {
      at
      value
      unit
    }
  }
}
`;

const calcThirtyMinutesAgo = () => {
    return (new Date()).getTime() - 30 * 60 * 1000;
}

function MetricSelectorImpl(props: { client: any }) {
    const dispatch = useDispatch();

    const metrics = useSelector((state: IState) => state.metrics.instruments);
    const selectedMetrics: Metric[] = useSelector((state: IState) => state.metrics.instruments.filter(m => m.isChecked));
    const measurementsData: { [key: string]: Measurement[] } = useSelector((state: IState) => state.metrics.measurements);

    let selectedMetricObject: { [key: string]: boolean; } = {};

    selectedMetrics.forEach((metric: Metric) => {
        const { value } = metric;
        selectedMetricObject[value] = true;
    });

    const [result] = useQuery({ query: getMetricsQuery });
    const { data, error } = result;

    useEffect(() => {
        if (error) {
            dispatch(actions.metricsApiErrorReceived({ error: error.message }));
            return;
        }
        if (!data) return;
        const { getMetrics } = data;
        dispatch(actions.metricsDataRecevied(getMetrics));
    }, [dispatch, data, error]);


    const [loadMeasurements, { data: measurements }] = useLazyQuery(
        getMeasurementsQuery
    );

    useEffect(() => {
        if (measurements) {
            dispatch(actions.metricMeasurementsRecieved(measurements.getMultipleMeasurements));
        }
    }, [dispatch, measurements]);

    const handleChange = async (metric: Metric) => {
        dispatch(actions.updateMetricSelection(metric))
        const after = calcThirtyMinutesAgo();

        let input = selectedMetrics.map(m => ({ metricName: m.value, after }))
        if (metric.isChecked) { // is now uncheked then remove current item
            const index = selectedMetrics.findIndex(m => m.value === metric.value);
            input.splice(index, 1);
        } else { // is now checked so add new item in variables
            input.push({ metricName: metric.value, after })
        }

        loadMeasurements({ variables: { input } })
    }

    const classes = useStyles();

    return (
        <FormControl className={classes.container} component="fieldset">
            <FormGroup aria-label="position" row>
                {metrics.map((metric, index) => <div key={index}> 
                    <Checkbox key={metric.value} metric={metric} handleChange={handleChange} />
                    {measurementsData[metric.value]?.slice(-1)[0] && <div className={classes.card} key={`${metric.value}-card`}>{(measurementsData[metric.value]?.slice(-1)[0] as any)?.value}</div>}
                </div>
                )}
            </FormGroup>
        </FormControl>
    );
}

export default () => {
    return (
        <Provider value={client}>
            <MetricSelectorImpl client={client} />
        </Provider>
    );
};
