import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UnitQuestionTextController } from './unit-question-text.controller';
import { UnitQuestionTextService } from './unit-question-text.service';

@Module({
  imports: [PrismaModule],
  controllers: [UnitQuestionTextController],
  providers: [UnitQuestionTextService],
  exports: [UnitQuestionTextService],
})
export class UnitQuestionTextModule {}
