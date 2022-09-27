import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppConfigModule } from 'src/config/app-config.module';
import { AuthModule } from 'src/user_auth/auth.module';

import { LoggerMiddleware } from 'src/logger/logger.middleware';
import { LoggerModule } from 'src/logger/logger.module';

import { MailModule } from 'src/mail/mail.module';
import { ParentsModule } from './parents/parents.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { ResourceModule } from './resource/resource.module';
import { StudentModule } from './student/student.module';
import { SubjectModule } from './subject/subject.module';

@Module({
  imports: [
    LoggerModule,
    RedisModule,
    PrismaModule,
    AppConfigModule,
    AuthModule,
    MailModule,
    ResourceModule,
    SubjectModule,
    StudentModule,
    ParentsModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
