import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import MockStompBroker from "mock-stomp-broker";
import App from './App';
import { createStore } from 'redux';
import { websocketReducer } from './reducers/websocketReducer';
import { Provider } from 'react-redux';


let wrappedApp: ReactWrapper
let props: any;

const createTestProps = (props: any) => ({ ...props });

const getEndpoint = (port: number) => `ws://localhost:${port}/websocket`;

export function makeTestStore(initialState: any) {
  const store = createStore(websocketReducer, initialState);
  const origDispatch = store.dispatch;
  store.dispatch = jest.fn(origDispatch);
  return store;
}

describe('Rendering App', () => {
  let broker: MockStompBroker;

  beforeEach(() => {
    const store = makeTestStore({ messages: []});
    broker = new MockStompBroker()
    
    props = createTestProps({ endpoint: getEndpoint(broker.getPort())});

    wrappedApp = mount(<Provider store={store}><App { ...props }/></Provider>);
    
  });

  afterEach(() => {
    wrappedApp.unmount();
    broker.kill()
  });

  test('should render before websocket connects', () => {
    expect(wrappedApp.text()).toEqual("Websocket: Not connected")
  });

  test('should render App after ws connection', async () => {
    // Wait for mock server to connect to STOMP client
    const [sessionId] = await broker.newSessionsConnected()
    await broker.subscribed(sessionId)

    // At this point, stompClient should be in the store, but it isn't
    const store = wrappedApp.find(Provider).prop('store')
    console.log('store.stompEndpoint', store.getState().stompEndpoint)
    
    // useSelector hook doesn't find stompClient in Redux store, so App doesn't render properly.
    expect(wrappedApp.find('button').text()).toEqual('ADD MESSAGE');  // Fails to find the button element.
    expect(wrappedApp.find('h3').text()).toEqual('Number of messages:');
    expect(wrappedApp.find('[data-test="message-count"]').text()).toEqual('0');
  });

  test('should increment message count', async () => {
    // Wait for mock server to connect to STOMP client
    const [sessionId] = await broker.newSessionsConnected()
    await broker.subscribed(sessionId)

    // Simulate button click
    const wrappedButton = wrappedApp.find('button')
    // @ts-ignore
    act(() => wrappedButton && wrappedButton.props().onClick({}))
    
    // Wait for mock server to receive message from real STOMP client
    // No apparent way to do this with mock-stomp-broker

    // Send response message from mock server to STOMP client
    const messageId = broker.scheduleMessage(`topics/test`, "return message");
    await broker.messageSent(messageId);

    // Test that UI has been updated
    expect(wrappedApp.find('[data-test="message-count"]').text()).toEqual('1');
  });

})
