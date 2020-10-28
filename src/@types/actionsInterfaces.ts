import { Action } from 'redux';
import { Client } from 'webstomp-client';

export interface AddClient extends Action<'ADD_CLIENT'> {
  stompClient: Client;
}

export interface AddMessage extends Action<'ADD_MESSAGE'> {
  message: string
}

export type WebsocketActions = AddClient | AddMessage