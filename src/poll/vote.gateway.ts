import { Injectable } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
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
  }

  async handleConnection(client: Socket, ...args: any[]) {
    console.log(`user ${client.id} connected with args ${args}`);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(@ConnectedSocket() client: Socket, @MessageBody() room: any) {
    await client.join(room);
    console.log(`Client ${client.id} joined room ${room}`);
  }

  vote(poll: PollEntity) {
    console.log(`poll ${poll.id} broadcasted`);
    const res = this.server.in(poll.id).emit('vote', [poll]);
    console.log(`successfully meitted with ${res}`);
  }
}
