import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CompleteonCreateRequestDTO {
  @IsNotEmpty()
  @ApiProperty()
  unitId: string;
}
