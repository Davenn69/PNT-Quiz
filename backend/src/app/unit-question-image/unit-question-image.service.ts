import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import UnitQuestionImageMapper from './mapper/unit-question-image.mapper';
import {
  UnitQuestionImageCreateRequestDTO,
  UnitQuestionImageUpdateRequestDTO,
} from './dtos';

@Injectable()
export class UnitQuestionImageService {
  constructor(private prisma: PrismaService) {}

  async create(dto: UnitQuestionImageCreateRequestDTO): Promise<void> {
    const unit = await this.prisma.unit.findFirstOrThrow({
      where: {
        secureId: dto.unitId,
      },
    });

    await this.prisma.unitQuestionImage.create({
      data: UnitQuestionImageMapper.unitQuestionImageCreateRequestDTOToUnitQuestionImageCreateInput(
        dto,
        {
          connect: unit,
        },
      ),
    });
  }

  async update(
    secureId: string,
    dto: UnitQuestionImageUpdateRequestDTO,
  ): Promise<void> {
    await this.prisma.unitQuestionImage.update({
      where: {
        secureId: secureId,
      },
      data: UnitQuestionImageMapper.unitQuestionImageUpdateRequestDTOToUnitQuestionImageUpdateInput(
        dto,
      ),
    });
  }

  async delete(secureId: string): Promise<void> {
    await this.prisma.unitQuestionImage.delete({
      where: {
        secureId: secureId,
      },
    });
  }
}
