import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { PAGINATION_DIRECTION } from 'src/enums';

export class PaginationParamDTO {
  @Type(() => Number)
  @ApiProperty({ required: false })
  public readonly pageNumber: number = 1;

  @Type(() => Number)
  @ApiProperty({ required: false })
  public readonly perPage: number = 10;

  @ApiProperty({ required: false })
  public readonly orderBy: string = '';

  @Type()
  @ApiProperty({ required: false })
  public readonly direction: PAGINATION_DIRECTION = 'ASC';

  public getPrismaDirection(): Prisma.SortOrder {
    return this.direction === 'DESC'
      ? Prisma.SortOrder.desc
      : Prisma.SortOrder.asc;
  }

  public toPrismaFindManyArgs(): Prisma.UserFindManyArgs {
    const orderBy = {};
    if (this.orderBy) {
      orderBy[this.orderBy] = this.getPrismaDirection();
    }

    return {
      skip: (this.pageNumber - 1) * this.perPage,
      take: this.perPage,
      orderBy: [
        {
          ...orderBy
        },
        {
          id: 'asc'
        }
      ],

    };
  }
}
