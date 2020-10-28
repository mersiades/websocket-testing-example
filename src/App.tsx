import React, { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { WebsocketStore } from './@types/storeInterfaces';
import { connectWebstompClient } from './services/webstompService';

interface AppProps {
  // Dependency injection for testing
  endpoint?: string
}

const App: FC<AppProps> = ({ endpoint = 'ws://localhost:8081/chat'}) => {
  const stompClient = useSelector(({ stompClient }: WebsocketStore) => stompClient);
  const messages = useSelector(({messages}: WebsocketStore) => messages);

  useEffect(() => {
    !stompClient && connectWebstompClient(endpoint)
  }, [stompClient, endpoint])

  const sendMessage = () => {
    console.log('clicked ADD MESSAGE')
    stompClient?.send('/app/test', JSON.stringify({ chatId: "100000", message: "message", sender: "me"}))
  }

  console.log('stompClient', stompClient)
  if (!!stompClient && stompClient.connected) {
    return (
    <>
      <p>Websocket: Connected</p>
      <div>
        <button disabled={!stompClient} onClick={() => sendMessage()}>ADD MESSAGE</button>
      </div>
      <div>
        <h3>Number of messages: <span data-test="message-count">{messages.length}</span></h3>
      </div>
    </>
    )
  } else {
    return <p>Websocket: Not connected</p>
  }
}

export default App;
