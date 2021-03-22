import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Provider, useQuery } from 'urql';
import Checkbox from '../../components/Checkbox';
import { IState } from '../../store';
import client from '../../utils/client';
import { actions, Metric } from './reducer';

const query = `
query {
  getMetrics
}
`;

function MetricSelectorImpl() {

    const dispatch = useDispatch();

    const metrics = useSelector((state: IState) => state.metrics);

    const [result] = useQuery({ query });
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

    const handleChange = (metric: Metric) => {
        dispatch(actions.updateMetricSelection(metric))
    }

    return (
        <FormControl component="fieldset">
            <FormGroup aria-label="position" row>
                {metrics.map(metric => <Checkbox key={metric.value} metric={metric} handleChange={handleChange} />)}
            </FormGroup>
        </FormControl>
    );
}

export default () => {
    return (
        <Provider value={client}>
            <MetricSelectorImpl />
        </Provider>
    );
};
