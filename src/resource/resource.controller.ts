import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { ResourceService } from './resource.service';

@Controller('resource')
export class ResourceController {
  constructor(private readonly service: ResourceService) {}
  @Get()
  async index(@Res() res) {
    const data = await this.service.findAll();
    const output = data.map((item) => {
      return {
        ...item,
        subjectClass: item.subjectClass.name,
      };
    });
    res.header(
      'Content-Range',
      `X-Total-Count: 0-${output.length}/${output.length}`,
    );
    res.header('Access-Control-Expose-Headers', 'Content-Range');
    res.json(output);
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    return await this.service.findById(id);
  }

  @Post('create')
  async create(@Body() createResource: any) {
    return await this.service.createResource(createResource);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateResource: any) {
    return await this.service.updateResource(id, updateResource);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.service.deleteResource(id);
  }
}
