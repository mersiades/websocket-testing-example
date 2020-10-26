// @ts-ignore
import React from 'react';
import { useSelector } from 'react-redux';
import { WebsocketStore } from './@types/storeInterfaces';

const App = () => {
  const stompClient = useSelector(({ stompClient }: WebsocketStore) => stompClient);
  const messages = useSelector(({messages}: WebsocketStore) => messages);

  const sendMessage = () => {
    stompClient?.publish({destination: '/app/test', body: JSON.stringify({ chatId: "100000", message: "message", sender: "me"})})
  }
  
  return (
    <>
    <div>
      <button onClick={() => sendMessage()}>ADD MESSAGE</button>
    </div>
    <div>
      <p>{`Number of messages = ${messages.length}`}</p>
    </div>
    </>
  );
}

export default App;
