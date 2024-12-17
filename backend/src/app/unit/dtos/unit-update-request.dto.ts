import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Min } from 'class-validator';

export class UnitUpdateRequestDTO {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @Min(0)
  @ApiProperty()
  unitOrder: number;
}
