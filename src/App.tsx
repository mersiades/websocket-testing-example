import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { WebsocketStore } from './@types/storeInterfaces';

const App: FC = (props) => {
  const stompClient = useSelector(({ stompClient }: WebsocketStore) => stompClient);
  const messages = useSelector(({messages}: WebsocketStore) => messages);

  const sendMessage = () => {
    console.log('clicked')
    stompClient?.publish({destination: '/app/test', body: JSON.stringify({ chatId: "100000", message: "message", sender: "me"})})
  }
  
  return (
    <>
    <div>
      <button onClick={() => sendMessage()}>ADD MESSAGE</button>
    </div>
    <div>
      <h3>Number of messages:</h3>
      <h4 data-test="message-count">{messages.length}</h4>
    </div>
    </>
  );
}

export default App;
