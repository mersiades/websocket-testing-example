import { createStore } from 'redux';
import { websocketReducer } from '../reducers/websocketReducer';

const store = createStore(websocketReducer);

export default store;