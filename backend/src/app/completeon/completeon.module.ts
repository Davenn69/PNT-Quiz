import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CompleteonController } from './completeon.controller';
import { CompleteonService } from './completeon.service';
import jwtConfig from 'src/config/jwtConfig';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule.register(jwtConfig)],
  controllers: [CompleteonController],
  providers: [CompleteonService],
})
export class CompleteonModule {}
