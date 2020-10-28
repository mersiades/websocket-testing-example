import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import WS from 'jest-websocket-mock';
import App from './App';
import { createStore } from 'redux';
import { websocketReducer } from './reducers/websocketReducer';
import { Provider } from 'react-redux';
// import { connectStompClient } from './services/websocketService';


let wrappedApp: any
let props: any;

const createTestProps = (props: any) => ({ ...props });

export function makeTestStore(initialState: any) {
  const store = createStore(websocketReducer, initialState);
  const origDispatch = store.dispatch;
  store.dispatch = jest.fn(origDispatch);
  return store;
}

describe('Rendering App', () => {
  let server: WS;

  beforeEach(() => {
    const store = makeTestStore({ messages: []});
    // server = new WS('ws://localhost:8081/chat', { jsonProtocol: true });
    server = new WS('ws://localhost:8081/chat');
    
    props = createTestProps({});

    wrappedApp = mount(<Provider store={store}><App { ...props }/></Provider>);
    
  });

  afterEach(() => {
    wrappedApp.unmount();
    WS.clean();
  });

  test('should render before websocket connects', () => {
    expect(wrappedApp.text()).toEqual("Websocket: Not connected")
  });

  test('should render App after ws connection', async () => {
    // Wait for mock server to connect to STOMP client
    await server.connected
    
    expect(wrappedApp.find('button').text()).toEqual('ADD MESSAGE');
    expect(wrappedApp.find('h3').text()).toEqual('Number of messages:');
    expect(wrappedApp.find('[data-test="message-count"]').text()).toEqual('0');
  });

  test('should increment message count', async () => {
    // Wait for mock server to connect to STOMP client
    await server.connected
    

    // Simulate button click
    const wrappedButton = wrappedApp.find('button')
    act(() => wrappedButton.props().onClick({}))
    
    // Wait for mock server to receive message from real STOMP client
    await expect(server).toReceiveMessage({ chatId: "100000", message: "message", sender: "me"})

    // Send response message from mock server to STOMP client
    server.send("return message")

    
    wrappedApp.update()

    // Test that UI has been updated
    expect(wrappedApp.find('[data-test="message-count"]').text()).toEqual('1');
  });

})
