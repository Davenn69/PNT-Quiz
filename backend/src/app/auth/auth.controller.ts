import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  AuthMeResponseDTO,
  AuthSignInRequestDTO,
  AuthSignUpRequestDTO,
  AuthTokenResponseDTO,
} from './dtos';
import { AuthGuard } from './auth.guard';
import { UserResponseDTO } from '../user/dtos';
import { UserService } from '../user/user.service';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService) { }

  @Post('sign-up')
  signUp(@Body() dto: AuthSignUpRequestDTO): Promise<void> {
    return this.authService.signUp(dto);
  }

  @Post('sign-in')
  signIn(@Body() dto: AuthSignInRequestDTO): Promise<AuthTokenResponseDTO> {
    return this.authService.signIn(dto);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@Request() request: any): Promise<UserResponseDTO> {
    const sub = request.user.sub;

    return this.userService.me(sub.id)
  }

  @Post('generate-guest')
  generateGuest(): Promise<AuthTokenResponseDTO> {
    return this.authService.generateGuest();
  }

  @Post('sign-up-guest')
  @UseGuards(AuthGuard)
  signUpGuest(
    @Request() request: any,
    @Body() dto: AuthSignUpRequestDTO,
  ): Promise<void> {
    const sub = request.user.sub;
    return this.authService.signUpGuest(dto, sub.id);
  }
}
