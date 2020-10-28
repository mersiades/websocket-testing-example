import { Client } from "webstomp-client";

export interface WebsocketStore {
  stompClient?: Client
  messages: string[]
}