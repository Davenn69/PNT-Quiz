import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Min } from 'class-validator';

export class UnitQuestionTextCreateRequestDTO {
  @IsNotEmpty()
  @ApiProperty()
  unitId: string;

  @Min(0)
  @ApiProperty()
  questionOrder: number;

  @IsNotEmpty()
  @ApiProperty()
  questionText: string;
}
