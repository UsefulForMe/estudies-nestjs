import { Module } from '@nestjs/common';
import { SubjectClassController } from './subject-class.controller';
import { SubjectClassService } from './subject-class.service';

@Module({
  controllers: [SubjectClassController],
  providers: [SubjectClassService],
})
export class SubjectClassModule {}
