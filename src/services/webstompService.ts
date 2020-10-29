import SockJS from 'sockjs-client';
import webstomp, { Message } from 'webstomp-client';
import { addClient, addMessage } from '../actions/websocketActions'
import store from '../store';

export const connectWebstompClient = (endpoint: string) => {
  console.log('connecting webstomp client')
  const socket = new SockJS(endpoint)
  const stompClient = webstomp.over(socket)
  
  stompClient.connect({/* no headers */}, () => {
    console.log('subscribing to /topic/test')
     stompClient.subscribe('/topic/test', (payload: Message) => showTextMessage(payload))
     // Puts stomp client in the Redux store
     store.dispatch<any>(addClient(stompClient));

     return stompClient
  })

  

  
  
}

const showTextMessage = (payload: Message) => {
  const message = payload.body;
  store.dispatch<any>(addMessage(message))
}