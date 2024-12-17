import { Prisma } from '@prisma/client';
import { AuthSignUpRequestDTO } from 'src/app/auth/dtos/auth-sign-up-request.dto';
import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import { AuthMeResponseDTO } from 'src/app/auth/dtos';
import { UserResponseDTO } from '../dtos';

export default class UserMapper {
  static async authSignUpRequestDTOToUserCreateInput(
    dto: AuthSignUpRequestDTO,
  ): Promise<Prisma.UserCreateInput> {
    const password = await bcrypt.hash(dto.password, 10);

    return {
      username: dto.username,
      password: password,
      secureId: v4(),
      mmr: 0,
    };
  }

  static userToMeResponseDTO(user: any): AuthMeResponseDTO {
    return {
      id: user.secureId,
      username: user.username,
    };
  }

  static userToUserResponseDto(user: any): UserResponseDTO {
    return {
      id: user.secureId,
      mmr: user.mmr,
      profilePicture: user.profilePicture,
      username: user.username,
      type: user.type
    }
  }
}
