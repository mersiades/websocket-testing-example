import { Client, IFrame, IMessage } from '@stomp/stompjs';
import { addClient, addMessage } from '../actions/websocketActions'
import store from '../store';

export const connectStompClient = () => {
 
    const stompClient = new Client({
      brokerURL: 'ws://localhost:8081/chat',
      debug: console.log,
      reconnectDelay: 0,
    });

    stompClient.onConnect = (frame: IFrame) => {
      console.log('frame', frame)
      stompClient.subscribe('/topic/test', (payload: IMessage) => showTextMessage(payload))
    };

    stompClient.activate();

    // Puts stomp client in the Redux store
    store.dispatch<any>(addClient(stompClient));

    return stompClient;
  
};

const showTextMessage = (payload: IMessage) => {
  const message = payload.body;
  store.dispatch<any>(addMessage(message))
}

