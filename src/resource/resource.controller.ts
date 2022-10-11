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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/user_auth/jwt-auth.guard';
import { ResourceService } from './resource.service';

@Controller('resource')
export class ResourceController {
  constructor(private readonly service: ResourceService) {}
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/subject-class/:id')
  async getResourceBySubjectClassId(@Param('id') id: string) {
    const [data] = await this.service.findAll(
      {},
      {
        subjectClassId: id,
      },
    );
    const output = data.map((item) => {
      return {
        ...item,
        subjectClass: item.subjectClass.name,
      };
    });
    return output;
  }
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
    const output = data.map((item) => {
      return {
        ...item,
        subjectClass: item.subjectClass.name,
      };
    });
    res.header('Content-Range', `X-Total-Count: 0-${output.length}/${total}`);
    res.header('Access-Control-Expose-Headers', 'Content-Range');
    res.json(output);
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
