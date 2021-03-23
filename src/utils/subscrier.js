import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Provider, useSubscription } from 'urql';
import { actions } from '../Features/MetricSelector/reducer';
import { client } from './client';

const subscriptionQuery = `
subscription {
  newMeasurement {metric, at, value, unit}
}
`;

let count = 1;
let bufferedItems = [];

function SubscriberImpl() {
  const dispatch = useDispatch();

  const [subscriptionResponse] = useSubscription({ query: subscriptionQuery });

  useEffect(() => {
    if (subscriptionResponse.data) {
      if(count < 15) {
        count++;
        bufferedItems.push(subscriptionResponse.data.newMeasurement);
      } else {
        const items = bufferedItems;
        bufferedItems = [];
        dispatch(actions.metricNewMeasurementsRecieved(items));
        count = 0;
      }
    }
  }, [dispatch, subscriptionResponse]);

  return null;
}

export default () => {
  return (
    <Provider value={client}>
      <SubscriberImpl client={client} />
    </Provider>
  );
};
