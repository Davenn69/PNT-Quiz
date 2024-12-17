import { Prisma } from '@prisma/client';
import { v4 } from 'uuid';
import {
  UnitCreateRequestDTO,
  UnitResponseDTO,
  UnitUpdateRequestDTO,
} from '../dtos';

export default class UnitMapper {
  static unitCreateRequestDTOToUnitCreateInput(
    dto: UnitCreateRequestDTO,
  ): Prisma.UnitCreateInput {
    return {
      name: dto.name,
      secureId: v4(),
      unitOrder: dto.unitOrder,
    };
  }

  static unitUpdateRequestDTOToUnitUpdateInput(
    dto: UnitUpdateRequestDTO,
  ): Prisma.UnitUpdateInput {
    return {
      name: dto.name,
      unitOrder: dto.unitOrder,
    };
  }
}
