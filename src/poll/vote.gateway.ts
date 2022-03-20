import { Injectable } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PollEntity } from '../database/poll.entity';

@Injectable()
@WebSocketGateway({
  namespace: 'live',
  allowEIO3: true,
})
export class VoteGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleDisconnect(client: Socket) {
    console.log(`user ${client.id} disconnected`);
    console.log(client.rooms);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    console.log(client);
    console.log(args);
    for (const arg of args) {
      if (arg.room) {
        await client.join(arg.room);
        console.log(`Client ${client.id} joined room ${arg.room}`);
        break;
      }
    }
  }

  vote(poll: PollEntity) {
    this.server.to(poll.id).emit('vote', poll);
  }
}
