import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CreateMarkReq, UpdateMarkReq } from 'src/mark/mark.dto';
import { MarkService } from 'src/mark/mark.service';
import { JwtAuthGuard } from 'src/user_auth/jwt-auth.guard';

@Controller('mark')
export class MarkController {
  constructor(private readonly markService: MarkService) {}
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Res() res, @Query() query) {
    const { range } = query;
    const [skip, take] = range ? JSON.parse(range) : [];
    const params = {};
    if (skip) {
      params['skip'] = skip;
    }
    if (take) {
      params['take'] = take - skip + 1;
    }
    const [data, total] = await this.markService.findAll({}, params);
    const output = data.map((item) => {
      return {
        ...item,
        student: item.student.name,
        exam: item.exam.name,
        subject: item.exam.subjectClass.name,
      };
    });

    res.header('Content-Range', `X-Total-Count: 0-${data.length}/${total}`);
    res.header('Access-Control-Expose-Headers', 'Content-Range');
    res.json(output);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/student/:studentId/exam/:examId')
  async createMark(
    @Body() data: CreateMarkReq,
    @Request() req,
    @Param('studentId') studentId: string,
    @Param('examId') examId: string,
  ) {
    const { user } = req;
    const isTeacher = user.type === 'teacher';
    if (!isTeacher && !user.isAdmin) {
      throw new UnauthorizedException("You don't have permission to do this");
    }

    const input = {
      ...data,

      student: {
        connect: {
          id: studentId,
        },
      },
      exam: {
        connect: {
          id: examId,
        },
      },
    };

    return this.markService.create(input);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findUnique(@Param('id') id: string) {
    return this.markService.findUnique({ id });
  }

  @UseGuards(JwtAuthGuard)
  @Get('student/:studentId/exam/:examId')
  async findByStudentAndExam(
    @Param('studentId') studentId: string,
    @Param('examId') examId: string,
  ) {
    const [data] = await this.markService.findAll({ studentId, examId });
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateMark(
    @Param('id') id: string,
    @Body() data: UpdateMarkReq,
    @Request() req,
  ) {
    const { user } = req;
    const isTeacher = user.type === 'teacher';
    if (!isTeacher && !user.isAdmin) {
      throw new UnauthorizedException("You don't have permission to do this");
    }

    return this.markService.update({ id }, data);
  }
}
