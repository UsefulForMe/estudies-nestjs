import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { SubjectService } from './subject.service';

@Controller('subject')
export class SubjectController {
  constructor(private readonly service: SubjectService) {}

  @Get()
  async index(@Res() res, @Query() query) {
    const { range } = query;
    const [skip, take] = range ? JSON.parse(range) : [];
    const params = {};
    if (skip) {
      params['skip'] = skip;
    }
    if (take) {
      params['take'] = take - skip + 1;
    }
    const [data, total] = await this.service.findAll(params);
    res.header('Content-Range', `X-Total-Count: 0-${data.length}/${total}`);
    res.header('Access-Control-Expose-Headers', 'Content-Range');
    res.json(data);
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    return await this.service.findById(id);
  }

  @Post()
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
