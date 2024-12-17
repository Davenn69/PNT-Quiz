import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { generateRandomString } from 'src/helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 } from 'uuid';
import GameMapper from './mapper/game.mapper';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);
  constructor(private prisma: PrismaService) { }

  async createGame() {
    return await this.prisma.game.create({
      data: {
        secureId: v4(),
        expired: Date.now() + 1 * 60 * 1000,
        question: generateRandomString(10),
        isMmrCalculated: false,
      },
    });
  }

  async getGame(gameSecureId: string) {
    const game = await this.prisma.game.findUnique({
      where: {
        secureId: gameSecureId,
      },
      select: {
        secureId: true,
        question: true,
        gameParticipants: {
          select: {
            successes: true,
            skips: true,
            user: {
              select: {
                secureId: true,
                username: true,
              },
            },
          },
        },
        expired: true,
      },
    });

    return GameMapper.gameToGameResponseDto(game);
  }

  async addGameParticipant(gameSecureId: string, participantSecureId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        secureId: participantSecureId,
      },
    });

    return await this.prisma.game.update({
      where: {
        secureId: gameSecureId,
      },
      data: {
        gameParticipants: {
          create: {
            userId: user.id,
            skips: [],
            successes: [],
          },
        },
      },
    });
  }

  async checkValidParticipant(gameSecureId: string, userSecureId: string) {
    const game = await this.prisma.game.findUnique({
      where: {
        secureId: gameSecureId,
      },
    });

    const user = await this.prisma.user.findUnique({
      where: {
        secureId: userSecureId,
      },
    });
    return await this.prisma.gameParticipant.findFirst({
      where: {
        gameId: game.id,
        userId: user.id,
      },
    });
  }

  async participantSuccess(
    userSecureId: string,
    gameSecureId: string,
    index: number,
  ) {
    const game = await this.prisma.game.findUnique({
      where: {
        secureId: gameSecureId,
      },
    });

    const user = await this.prisma.user.findUnique({
      where: {
        secureId: userSecureId,
      },
    });
    const gameParticipant = await this.prisma.gameParticipant.findFirst({
      where: {
        gameId: game.id,
        userId: user.id,
      }
    })

    if (!gameParticipant.successes.includes(index) && !gameParticipant.skips.includes(index)) {
      return await this.prisma.gameParticipant.updateMany({
        where: {
          gameId: game.id,
          userId: user.id,
        },
        data: {
          successes: {
            push: index,
          },
        },
      });
    }
  }

  async participantSkip(
    userSecureId: string,
    gameSecureId: string,
    index: number,
  ) {
    const game = await this.prisma.game.findUnique({
      where: {
        secureId: gameSecureId,
      },
    });

    const user = await this.prisma.user.findUnique({
      where: {
        secureId: userSecureId,
      },
    });

    const gameParticipant = await this.prisma.gameParticipant.findFirst({
      where: {
        gameId: game.id,
        userId: user.id,
      }
    })

    if (!gameParticipant.successes.includes(index) && !gameParticipant.skips.includes(index)) {
      return await this.prisma.gameParticipant.updateMany({
        where: {
          gameId: game.id,
          userId: user.id,
        },
        data: {
          skips: {
            push: index,
          },
        },
      });
    }
  }

  async finishGame(gameSecureId: string): Promise<void> {
    const game = await this.prisma.game.update({
      where: {
        secureId: gameSecureId,
        expired: {
          lte: Date.now(),
        },
      },
      data: {
        isMmrCalculated: true,
      },
    });

    const gameParticipants: string[] = await this.prisma.$queryRaw`
        SELECT "userId", array_length("successes", 1) as "correctAmount"
        FROM "gameParticipants"
        WHERE "gameId" = ${game.id}
        ORDER BY array_length("successes", 1) DESC;
      `;


    if (gameParticipants[0]["correctAmount"] != gameParticipants[1]["correctAmound"]) {
      await this.prisma.user.update({
        where: {
          id: gameParticipants[0]['userId'],
        },
        data: {
          mmr: {
            increment: 25,
          },
        },
      });

      await this.prisma.user.update({
        where: {
          id: gameParticipants[1]['userId'],
          mmr: {
            gte: 25
          }
        },
        data: {
          mmr: {
            decrement: 25,
          },
        },
      });
    }
  }

  async finishAllUnfinishedGame() {
    const games = await this.prisma.game.findMany({
      where: {
        isMmrCalculated: false,
        expired: {
          lte: Date.now(),
        },
      },
    });
    games.forEach((game) => {
      this.finishGame(game.secureId);
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  finishGameScheduler() {
    this.finishAllUnfinishedGame();
    this.logger.debug('game finished');
  }
}
