import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UnitQuestionImageController } from './unit-question-image.controller';
import { UnitQuestionImageService } from './unit-question-image.service';

@Module({
  imports: [PrismaModule],
  controllers: [UnitQuestionImageController],
  providers: [UnitQuestionImageService],
  exports: [UnitQuestionImageService],
})
export class UnitQuestionImageModule {}
