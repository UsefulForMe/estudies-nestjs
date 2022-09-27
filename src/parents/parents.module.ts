import { Module } from '@nestjs/common';
import { ParentsController } from 'src/parents/parents.controller';
import { ParentsService } from './parents.service';

@Module({
  providers: [ParentsService],
  controllers: [ParentsController],
})
export class ParentsModule {}
