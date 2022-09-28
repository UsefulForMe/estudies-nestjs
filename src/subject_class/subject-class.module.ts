import { Module } from '@nestjs/common';
import { SubjectService } from 'src/subject/subject.service';
import { SubjectClassController } from './subject-class.controller';
import { SubjectClassService } from './subject-class.service';

@Module({
  controllers: [SubjectClassController],
  providers: [SubjectClassService, SubjectService],
})
export class SubjectClassModule {}
