import { Injectable } from '@nestjs/common';
import { PaginationParamDTO, PaginationResponseDTO } from 'src/dtos';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRankQueryDTO, UserRankResponseDTO, UserResponseDTO } from './dtos';
import UserMapper from './mapper/user.mapper';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async findUserByUsername(username: string) {
    return await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });
  }

  async list(
    paginationParams: PaginationParamDTO,
  ): Promise<PaginationResponseDTO<UserResponseDTO>> {
    const [users, total] = await Promise.all([
      this.prisma.user.findMany(paginationParams.toPrismaFindManyArgs()),
      this.prisma.user.count(),
    ]);

    return {
      data: users.map((user) => ({
        id: user.secureId,
        mmr: user.mmr,
        username: user.username,
        profilePicture: user.profilePicture,
        type: user.password == null ? "Guest" : "NotGuest"
      })),
      total: total,
    };
  }

  async rank(userId: string): Promise<UserRankResponseDTO[]> {
    const users: UserRankQueryDTO[] = await this.prisma.$queryRaw`
      WITH "RankedUsers" AS (
        SELECT
          "secureId" as "id",
          "username",
          "password",
          "mmr",
          cast(RANK() OVER (ORDER BY "mmr" DESC, "id" ASC) as int8) AS "rank",
          "profilePicture"
        FROM
          "users"
      )
      SELECT 
        "id",
        "username",
        "password",
        "mmr",
        "rank"::varchar,
        "profilePicture"
      FROM "RankedUsers"
      WHERE "rank" IN (
        (SELECT "rank" FROM "RankedUsers" WHERE "id" = ${userId}) - 1,
        (SELECT "rank" FROM "RankedUsers" WHERE "id" = ${userId}),
        (SELECT "rank" FROM "RankedUsers" WHERE "id" = ${userId}) + 1
      )
      ORDER BY "rank";
    `;

    return users.map((user) => ({
      id: user.id,
      mmr: user.mmr,
      username: user.username,
      rank: parseInt(user.rank),
      profilePicture: user.profilePicture,
      type: user.password == null ? "Guest" : "NotGuest"
    }));
  }

  async updateProfilePicture(profilePictureLink: string, userId: string) {
    const user = await this.prisma.user.update({
      where: {
        secureId: userId
      },
      data: {
        profilePicture: profilePictureLink
      }
    })

    return {
      id: user.secureId,
      mmr: user.mmr,
      username: user.username,
      profilePicture: user.profilePicture,
      type: user.password == null ? "Guest" : "NotGuest"
    }
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        secureId: userId
      },
    })


    return {
      id: user.secureId,
      mmr: user.mmr,
      username: user.username,
      profilePicture: user.profilePicture,
      type: user.password == null ? "Guest" : "NotGuest"
    }
  }
}
