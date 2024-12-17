import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  UnitQuestionTextCreateRequestDTO,
  UnitQuestionTextUpdateRequestDTO,
} from './dtos';
import UnitQuestionTextMapper from './mapper/unit-question-text.mapper';

@Injectable()
export class UnitQuestionTextService {
  constructor(private prisma: PrismaService) {}

  async create(dto: UnitQuestionTextCreateRequestDTO): Promise<void> {
    const unit = await this.prisma.unit.findFirstOrThrow({
      where: {
        secureId: dto.unitId,
      },
    });

    await this.prisma.unitQuestionText.create({
      data: UnitQuestionTextMapper.fromUnitQuestionTextCreateRequestDTOToUnitQuestionTextCreateInput(
        dto,
        {
          connect: unit,
        },
      ),
    });
  }

  async update(
    secureId: string,
    dto: UnitQuestionTextUpdateRequestDTO,
  ): Promise<void> {
    await this.prisma.unitQuestionText.update({
      where: {
        secureId: secureId,
      },
      data: UnitQuestionTextMapper.fromUnitQuestionTextUpdateRequestDTOToUnitQuestionTextUpdateInput(
        dto,
      ),
    });
  }

  async delete(secureId: string): Promise<void> {
    await this.prisma.unitQuestionText.delete({
      where: {
        secureId: secureId,
      },
    });
  }
}
