import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthSignInRequestDTO, AuthTokenResponseDTO } from './dtos';
import { AuthSignUpRequestDTO } from './dtos/auth-sign-up-request.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import UserMapper from '../user/mapper/user.mapper';
import { Prisma } from '@prisma/client';
import Constants from 'src/constants';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { v4 } from 'uuid';
import { generateGuestRandomUsername } from 'src/helper';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
  ) { }

  async signUp(dto: AuthSignUpRequestDTO): Promise<void> {
    const user = await this.userService.findUserByUsername(dto.username);

    if (user) {
      throw new BadRequestException(
        Constants.ErrorMessages.Auth.USERNAME_IS_ALREADY_TAKEN,
      );
    }

    const data: Prisma.UserCreateInput =
      await UserMapper.authSignUpRequestDTOToUserCreateInput(dto);
    await this.prisma.user.create({ data });
  }

  async signIn(dto: AuthSignInRequestDTO): Promise<AuthTokenResponseDTO> {
    const user = await this.userService.findUserByUsername(dto.username);
    if (!user) {
      throw new NotFoundException(
        Constants.ErrorMessages.Auth.USERNAME_NOT_FOUND,
      );
    }

    const passwordIsCorrect = await bcrypt.compare(dto.password, user.password);
    if (!passwordIsCorrect) {
      throw new UnauthorizedException(
        Constants.ErrorMessages.Auth.INVALID_PASSWORD,
      );
    }

    return {
      access_token: await this.jwtService.signAsync({
        sub: UserMapper.userToMeResponseDTO(user),
      }),
    };
  }

  async generateGuest(): Promise<AuthTokenResponseDTO> {
    const user = await this.prisma.user.create({
      data: {
        secureId: v4(),
        username: generateGuestRandomUsername(),
        password: null,
        mmr: 0,
      },
    });

    return {
      access_token: await this.jwtService.signAsync({
        sub: UserMapper.userToMeResponseDTO(user),
      }),
    };
  }

  async signUpGuest(dto: AuthSignUpRequestDTO, userId: string): Promise<void> {
    const uniqueUser = await this.userService.findUserByUsername(dto.username);

    if (uniqueUser) {
      throw new BadRequestException(
        Constants.ErrorMessages.Auth.USERNAME_IS_ALREADY_TAKEN,
      );
    }

    const data: Prisma.UserCreateInput =
      await UserMapper.authSignUpRequestDTOToUserCreateInput(dto);
    await this.prisma.user.update({
      where: {
        secureId: userId,
      },
      data,
    });
  }


}
