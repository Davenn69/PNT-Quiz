import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './app/auth/auth.module';
import { CompleteonModule } from './app/completeon/completeon.module';
import { GameModule } from './app/game/game.module';
import { QueueModule } from './app/queue/queue.module';
import { UnitQuestionImageModule } from './app/unit-question-image/unit-question-image.module';
import { UnitQuestionTextModule } from './app/unit-question-text/unit-question-text.module';
import { UnitModule } from './app/unit/unit.module';
import { UserModule } from './app/user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import jwtConfig from './config/jwtConfig';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ScheduleModule } from '@nestjs/schedule';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    UnitModule,
    UnitQuestionImageModule,
    UnitQuestionTextModule,
    CompleteonModule,
    QueueModule,
    GameModule,
    JwtModule.register(jwtConfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
