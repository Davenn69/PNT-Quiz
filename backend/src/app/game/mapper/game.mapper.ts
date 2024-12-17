import { Game, Prisma } from '@prisma/client';
import { v4 } from 'uuid';
import { GameResponseDto } from '../dtos/game-response.dto';

export default class GameMapper {
  static gameToGameResponseDto(game: {
    secureId: string;
    question: string;
    expired: bigint;
    gameParticipants: {
      successes: number[];
      skips: number[];
      user: {
        secureId: string;
        username: string;
      };
    }[];
  }): GameResponseDto {
    return {
      secureId: game.secureId,
      question: game.question,
      expired: game.expired.toString(),
      gameParticipants: game.gameParticipants.map((gameParticipant) => {
        return {
          userId: gameParticipant.user.secureId,
          username: gameParticipant.user.username,
          skips: gameParticipant.skips,
          successes: gameParticipant.successes,
        };
      }),
    };
  }
}
