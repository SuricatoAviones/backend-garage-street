import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Permite conexiones desde cualquier origen
  },
})
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  sendNotification(event: string, payload: any) {
    this.server.emit(event, payload);
  }
}