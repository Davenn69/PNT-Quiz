import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthSignInRequestDTO {
  @IsNotEmpty()
  @ApiProperty({ example: 'admin' })
  username: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'admin' })
  password: string;
}
