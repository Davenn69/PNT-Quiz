import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GameService } from './game.service';
import { GameGateaway } from './game.gateway';
import { GameController } from './game.controller';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/config/jwtConfig';

@Module({
  imports: [PrismaModule, AuthModule, JwtModule.register(jwtConfig)],
  controllers: [GameController],
  providers: [GameService, GameGateaway],
  exports: [GameService],
})
export class GameModule {}
