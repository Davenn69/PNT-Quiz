import { Module } from '@nestjs/common';
import { QueueGateway } from './queue.gateway';
import { GameModule } from '../game/game.module';

@Module({
  imports: [GameModule],
  controllers: [],
  providers: [QueueGateway],
})
export class QueueModule {}
