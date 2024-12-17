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
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { GameService } from './game.service';
import { SocketWithAuth } from '../types';
import { GameFinishRequestDto, GameUserSuccessSkipRequestDto } from './dtos';

@WebSocketGateway({
  namespace: 'games',
})
export class GameGateaway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(GameGateaway.name);
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

    const roomName = client.handshake.query['roomName'];

    if (
      !this.gameService.checkValidParticipant(
        roomName.toString(),
        client.userId,
      )
    ) {
      client.disconnect();
    }

    client.join(roomName);
    this.logger.debug(
      `userID: ${client.userId} joined room with name: ${roomName}`,
    );
    const connectedClients =
      this.io.adapter.rooms?.get(roomName.toString())?.size ?? 0;

    this.logger.debug(
      `Total clients connected to room '${roomName}': ${connectedClients}`,
    );

    if (connectedClients == 2) {
      this.io.to(roomName).emit('start-game');
    }
  }

  async handleDisconnect(client: SocketWithAuth) {
    const sockets = this.io.sockets;
    this.logger.log(`Disconnected socket id: ${client.id}`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);
  }

  @SubscribeMessage('participant-success')
  async participantSuccess(
    @MessageBody() dto: GameUserSuccessSkipRequestDto,
    @ConnectedSocket() client: SocketWithAuth,
  ): Promise<void> {
    await this.gameService.participantSuccess(
      client.userId,
      dto.gameId,
      parseInt(dto.index.toString()),
    );
    client.to(dto.gameId).emit('another-participant-success', { index: dto.index });
  }

  @SubscribeMessage('participant-skip')
  async participantSkip(
    @MessageBody() dto: GameUserSuccessSkipRequestDto,
    @ConnectedSocket() client: SocketWithAuth,
  ): Promise<void> {
    await this.gameService.participantSkip(
      client.userId,
      dto.gameId,
      parseInt(dto.index.toString()),
    );
    client.to(dto.gameId).emit('another-participant-skip', { index: dto.index });
  }

  @SubscribeMessage('finish-game')
  async finishGame(
    @MessageBody() dto: GameFinishRequestDto,
    @ConnectedSocket() client: SocketWithAuth,
  ): Promise<void> {
    await this.gameService.finishGame(dto.gameId);
    client.disconnect();
  }
}
