import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Min } from 'class-validator';

export class UnitQuestionImageUpdateRequestDTO {
  @Min(0)
  @ApiProperty()
  questionOrder: number;

  @IsNotEmpty()
  @ApiProperty()
  questionImage: string;

  @IsNotEmpty()
  @ApiProperty()
  questionAnswer: string;
}
