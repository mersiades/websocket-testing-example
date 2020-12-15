import SockJS from 'sockjs-client';
import webstomp, { Client, Frame, Message } from 'webstomp-client';
import { addClient, addMessage } from '../actions/websocketActions'
import store from '../store';

export const connectWebstompClient = () => {
  console.log('connecting webstomp client')
  const websocketsAreNotAvailableInTheBrowser = typeof WebSocket !== 'function';
  let stompClient: Client
  if (websocketsAreNotAvailableInTheBrowser) {
    stompClient = webstomp.over(new SockJS('http://localhost:8081/test'))
  } else {
    stompClient = webstomp.client('ws://localhost:8081/test', {
      // heartbeat: { incoming: 10000, outgoing: 10000},
      heartbeat: false,
      protocols: webstomp.VERSIONS.supportedProtocols()
    })
  }
  
  stompClient.connect({/* no headers */}, () => onConnect(), (error: Frame | CloseEvent) => onError(error))

  const onConnect = () => {
    console.log('subscribing to /topic/test')
    stompClient.subscribe('/topic/test', (payload: Message) => showTextMessage(payload))
     
    // Puts stomp client in the Redux store
    store.dispatch<any>(addClient(stompClient));
  }

  const onError = (error: Frame | CloseEvent) => console.error(error)

  return stompClient
}

const showTextMessage = (payload: Message) => {
  const message = payload.body;
  store.dispatch<any>(addMessage(message))
}