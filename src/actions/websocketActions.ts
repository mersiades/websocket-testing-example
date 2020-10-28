import { Client } from 'webstomp-client';
import {
  AddClient, AddMessage,
} from '../@types/actionsInterfaces';

export const addClient = (stompClient: Client): AddClient => {
  console.log('sending client to reducer: ', stompClient )
  return { type: 'ADD_CLIENT', stompClient }
};

export const addMessage = (message: string): AddMessage => ({ type: 'ADD_MESSAGE', message});