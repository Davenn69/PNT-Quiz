import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Min } from 'class-validator';

export class UnitCreateRequestDTO {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @Min(0)
  @ApiProperty()
  unitOrder: number;
}
