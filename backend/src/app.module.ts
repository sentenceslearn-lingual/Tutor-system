import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';
import { PrismaModule } from './prisma/prisma.module';
import { LessonsModule } from './lessons/lessons.module';
import { AuthModule } from './auth/auth.module';
import { TutorsModule } from './tutors/tutors.module';

@Module({
  imports: [
    StudentsModule,
    PrismaModule,
    LessonsModule,
    AuthModule,
    TutorsModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
  ],
})
export class AppModule {}
