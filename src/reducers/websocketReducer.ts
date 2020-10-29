import { Reducer } from 'redux';
import { WebsocketActions } from '../@types/actionsInterfaces';
import { WebsocketStore } from '../@types/storeInterfaces';

export const subscriptionsStoreInitialState: WebsocketStore = {
  messages: []
};

export const websocketReducer: Reducer<WebsocketStore, WebsocketActions> = (
  state: WebsocketStore = subscriptionsStoreInitialState,
  action: WebsocketActions
) => {
  switch (action.type) {
    case 'ADD_CLIENT':
      return {
        ...state,
        stompClient: action.stompClient,
      };
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.message]
      }
    default:
      return state;
  }
};
