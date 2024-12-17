import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, ParseFilePipe, Put, Query, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginationParamDTO, PaginationResponseDTO } from 'src/dtos';
import { UserRankResponseDTO, UserResponseDTO } from './dtos';
import { UserService } from './user.service';
import { PaginationParamDTOPipeTransform } from 'src/transforms/pagination-param-dto.pipe-transform';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

const storage = diskStorage({
  destination: 'uploads',
  filename: (req, file, cb) => {
    const name = file.originalname.split('.')[0];
    const extension = extname(file.originalname);
    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
    const fileName = `${name}-${randomName}${extension}`
    req.body.profilePicture = fileName;
    cb(null, fileName);
  },
});

@ApiTags('User')
@ApiBearerAuth()
@Controller()
export class UserController {
  constructor(private userService: UserService) { }

  @Get('users')
  @UseGuards(AuthGuard)
  list(
    @Query(new PaginationParamDTOPipeTransform())
    paginationParams: PaginationParamDTO,
  ): Promise<PaginationResponseDTO<UserResponseDTO>> {
    return this.userService.list(paginationParams);
  }

  @Get('rank')
  @UseGuards(AuthGuard)
  rank(@Request() request: any): Promise<UserRankResponseDTO[]> {
    return this.userService.rank(request.user.sub.id);
  }

  @Put('users/upload-profile-picture')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', { storage }))
  uploadProfilePicture(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File, @Request() request: any): Promise<UserResponseDTO> {
    const sub = request.user.sub
    const profilePicture = request.body.profilePicture
    return this.userService.updateProfilePicture(profilePicture, sub.id);
  }
}
