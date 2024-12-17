import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompleteonCreateRequestDTO } from './dtos';

@Injectable()
export class CompleteonService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CompleteonCreateRequestDTO, userId: string): Promise<void> {
    const user = await this.prisma.user.findFirstOrThrow({
      where: {
        secureId: userId,
      },
    });

    const unit = await this.prisma.unit.findFirstOrThrow({
      where: {
        secureId: dto.unitId,
      },
    });

    const completeon = await this.prisma.completeon.findFirst({
      where: {
        unitId: unit.id,
        userId: user.id,
      },
    });

    if (completeon) {
      return;
    }

    await this.prisma.completeon.create({
      data: {
        unit: {
          connect: unit,
        },
        user: {
          connect: user,
        },
      },
    });
  }

  async listByUser(userId: string): Promise<string[]> {
    const user = await this.prisma.user.findFirstOrThrow({
      where: {
        secureId: userId,
      },
      include: {
        completeons: {
          include: {
            unit: true,
          },
        },
      },
    });

    return user.completeons.flatMap((completeon) => completeon.unit.secureId);
  }
}
