import { Module } from '@nestjs/common';
import { ExamService } from 'src/exam/exam.service';
import { MarkController } from './mark.controller';
import { MarkService } from './mark.service';

@Module({
  controllers: [MarkController],
  providers: [MarkService, ExamService],
})
export class MarkModule {}
