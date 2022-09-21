import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update.resource.dto';
import { ResourceService } from './resource.service';

@Controller('resource')
export class ResourceController {
  constructor(private readonly service: ResourceService) {}
  @Get()
  async index() {
    return await this.service.findAll();
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    return await this.service.findById(id);
  }

  @Post('create')
  async create(@Body() createResource: CreateResourceDto) {
    return await this.service.createResource(createResource);
  }
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateResource: UpdateResourceDto,
  ) {
    return await this.service.updateResource(id, updateResource);
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.service.deleteResource(id);
  }
}
