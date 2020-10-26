import { Client } from "@stomp/stompjs";

export interface WebsocketStore {
  stompClient?: Client
  messages: string[]
}