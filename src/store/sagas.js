import { spawn } from 'redux-saga/effects';
import weatherSaga from '../Features/Weather/saga';
import MetricSaga from '../Features/MetricSelector/saga';

export default function* root() {
  yield spawn([weatherSaga, MetricSaga]);
}
