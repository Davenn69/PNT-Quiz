import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UnitController } from './unit.controller';
import { UnitService } from './unit.service';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/config/jwtConfig';
import { UnitQuestionImageModule } from '../unit-question-image/unit-question-image.module';
import { UnitQuestionTextModule } from '../unit-question-text/unit-question-text.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register(jwtConfig),
    UnitQuestionImageModule,
    UnitQuestionTextModule,
  ],
  controllers: [UnitController],
  providers: [UnitService],
})
export class UnitModule {}
