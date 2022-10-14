import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  Response,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SortOrderMap } from 'src/common/interface';
import { CreateExamReq, UpdateExamReq } from 'src/exam/exam.dto';
import { ExamService } from 'src/exam/exam.service';
import { JwtAuthGuard } from 'src/user_auth/jwt-auth.guard';

@Controller('exam')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async findAll(@Response() res, @Query() query) {
    const { range } = query;
    const [skip, take] = range ? JSON.parse(range) : [];
    const params = {};
    if (skip) {
      params['skip'] = skip;
    }
    if (take) {
      params['take'] = take - skip + 1;
    }

    const { sort, filter } = query;
    const [sortField, sortOrder] = sort ? JSON.parse(sort) : [];
    if (sortField && sortOrder) {
      const sortFields = sortField.split('.');
      if (sortFields.length === 1) {
        params['orderBy'] = {
          [sortField]: SortOrderMap[sortOrder],
        };
      } else {
        params['orderBy'] = {
          [sortFields[0]]: {
            [sortFields[1]]: SortOrderMap[sortOrder],
          },
        };
      }
    }

    const { name, type, factor } = filter
      ? JSON.parse(filter)
      : {
          name: '',
          type: '',
          factor: '',
        };
    let where = {};

    if (name) {
      where = {
        name: {
          contains: name.trim(),
        },
      };
    }
    if (type) {
      where = {
        ...where,
        type: {
          contains: type.trim(),
        },
      };
    }
    if (factor) {
      where = {
        ...where,
        factor: {
          equals: factor,
        },
      };
    }
    const [data, total] = await this.examService.findAll(where, params);
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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async createExam(@Body() data: CreateExamReq, @Request() req) {
    const { user } = req;
    const isTeacher = user.type === 'teacher';
    if (!isTeacher && !user.isAdmin) {
      throw new UnauthorizedException("You don't have permission to do this");
    }

    const { subjectClassId, duration, name, factor, type } = data;
    const input = {
      duration,
      name,
      factor,
      type,
      subjectClass: {
        connect: {
          id: subjectClassId,
        },
      },
    };

    return this.examService.create(input);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('subject-class/:id')
  async findBySubjectClass(@Param('id') id: string) {
    const [data] = await this.examService.findAll({ subjectClassId: id });
    const output = data.map((item) => {
      return {
        ...item,
        subjectClass: item.subjectClass.name,
      };
    });
    return output;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findUnique(@Param('id') id: string) {
    return this.examService.findUnique({ id });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(':id')
  async updateExam(
    @Param('id') id: string,
    @Body() data: UpdateExamReq,
    @Request() req,
  ) {
    const { user } = req;
    const isTeacher = user.type === 'teacher';
    if (!isTeacher && !user.isAdmin) {
      throw new UnauthorizedException("You don't have permission to do this");
    }

    return this.examService.update({ id }, data);
  }
}
