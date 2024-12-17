import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import UserMapper from '../user/mapper/user.mapper';
import { AuthGuard } from '../auth/auth.guard';
import { GameService } from './game.service';
import { GameResponseDto } from './dtos/game-response.dto';

@ApiTags('Game')
@ApiBearerAuth()
@Controller('games')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get(':id')
  @UseGuards(AuthGuard)
  get(
    @Param('id') id: string,
    @Request() request: any,
  ): Promise<GameResponseDto> {
    return this.gameService.getGame(id);
  }
}
