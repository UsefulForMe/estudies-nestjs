/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ResourceController } from './resource.controller';
import { ResourceService } from './resource.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ResourceDTO, ResourceSchema } from './schema/resource.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: "Resource",
        schema: ResourceSchema,
      },
    ]),
  ],
  controllers: [ResourceController],
  providers: [ResourceService],
  exports:[ResourceModule]
})
export class ResourceModule {}
