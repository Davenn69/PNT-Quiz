import {
  Logger,
  UnauthorizedException,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  OnGatewayInit,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import { SocketWithAuth } from '../types';
import { GameService } from '../game/game.service';

@WebSocketGateway({
  namespace: 'queues',
})
export class QueueGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(QueueGateway.name);
  constructor(private readonly gameService: GameService) {}

  @WebSocketServer() io: Namespace;

  afterInit(): void {
    this.logger.log(`Websocket Gateway initialized.`);
  }

  async handleConnection(client: SocketWithAuth) {
    const sockets = this.io.sockets;
    this.logger.debug(
      `Socket connected with userID: ${client.username} ${client.userId}"`,
    );
    this.logger.log(`WS Client with id: ${client.id} connected!`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);

    while (sockets.size >= 2) {
      var i = 0;
      const game = await this.gameService.createGame();
      sockets.forEach((socket: SocketWithAuth) => {
        if (i != 2) {
          if (
            this.gameService.addGameParticipant(game.secureId, socket.userId)
          ) {
            this.io.to(socket.id).emit('queue-full', { gameId: game.secureId });
            this.logger.log(socket.userId);
            socket.disconnect();
          }
        }
        i++;
      });
    }
  }

  async handleDisconnect(client: SocketWithAuth) {
    const sockets = this.io.sockets;
    this.logger.log(`Disconnected socket id: ${client.id}`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);
  }
}
