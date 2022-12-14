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
import { ApiBearerAuth } from '@nestjs/swagger';
import { groupBy, reduce } from 'lodash';
import { SortOrderMap } from 'src/common/interface';
import { ExamService } from 'src/exam/exam.service';
import { CreateMarkReq, UpdateMarkReq } from 'src/mark/mark.dto';
import { MarkService } from 'src/mark/mark.service';
import { JwtAuthGuard } from 'src/user_auth/jwt-auth.guard';

@Controller('mark')
export class MarkController {
  constructor(
    private readonly markService: MarkService,
    private readonly examService: ExamService,
  ) {}
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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

    const { exam, student, score, subject } = filter
      ? JSON.parse(filter)
      : {
          exam: '',
          score: '',
          student: '',
          subject: '',
        };
    let where = {};

    if (exam) {
      where = {
        exam: {
          name: {
            contains: exam,
          },
        },
      };
    }
    if (student) {
      where = {
        ...where,
        student: {
          name: {
            contains: student,
          },
        },
      };
    }
    if (subject) {
      where = {
        ...where,
        exam: {
          subjectClass: {
            name: {
              contains: subject,
            },
          },
        },
      };
    }
    if (score) {
      where = {
        ...where,
        score: {
          equals: score,
        },
      };
    }
    const [data, total] = await this.markService.findAll(where, params);
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
  @ApiBearerAuth()
  @Get('me')
  async me(@Request() req) {
    const { user } = req;

    if (user.type !== 'student') {
      return [];
    }

    const [data] = await this.markService.findAll({
      studentId: user.student.id,
    });
    const output = data.map((item) => {
      return {
        ...item,
        student: item.student.name,
        exam: item.exam.name,
        subject: item.exam.subjectClass.subject.name,
        subjectClass: item.exam.subjectClass.name,
        studentId: item.student.id,
        examId: item.exam.id,
        subjectClassId: item.exam.subjectClass.id,
        subjectId: item.exam.subjectClass.subject.id,
      };
    });
    return output;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('student/:studentId')
  async findByStudent(@Param('studentId') studentId: string) {
    const [data] = await this.markService.findAll({
      studentId,
    });
    const output = data.map((item) => {
      return {
        ...item,
        student: item.student.name,
        exam: item.exam.name,
        subject: item.exam.subjectClass.subject.name,
        subjectClass: item.exam.subjectClass.name,
        studentId: item.student.id,
        examId: item.exam.id,
        subjectClassId: item.exam.subjectClass.id,
        subjectId: item.exam.subjectClass.subject.id,
      };
    });
    return output;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
  @ApiBearerAuth()
  @Get(':id')
  async findUnique(@Param('id') id: string) {
    return this.markService.findUnique({ id });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('student/:studentId/exam/:examId')
  async findByStudentAndExam(
    @Param('studentId') studentId: string,
    @Param('examId') examId: string,
  ) {
    const [data] = await this.markService.findAll({ studentId, examId });
    const output = data.map((item) => {
      return {
        ...item,
        student: item.student.name,
        exam: item.exam.name,
        subject: item.exam.subjectClass.name,
      };
    });
    return output;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('subject-class/:subjectClassId')
  async findBySubjectClass(@Param('subjectClassId') subjectClassId: string) {
    const [exams] = await this.examService.findAll({ subjectClassId });
    const examIds = exams.map((item) => item.id);
    const [data] = await this.markService.findAll({
      examId: {
        in: examIds,
      },
    });
    const output = data.map((item) => {
      return {
        ...item,
        student: item.student.name,
        exam: item.exam.name,
        subject: item.exam.subjectClass.name,
        studentId: item.student.id,
        examId: item.exam.id,
        subjectId: item.exam.subjectClass.id,
      };
    });

    const groupStudents = groupBy(output, 'studentId');
    const result = reduce(
      groupStudents,
      (result, value) => {
        if (!value.length) {
          return result;
        }

        const item = {
          student: value[0].student,
          studentId: value[0].studentId,
          subject: value[0].subject,
          exams: value.map((item) => {
            return {
              exam: item.exam,
              examId: item.examId,
              score: item.score,
              markId: item.id,
            };
          }),
        };
        result.push(item);
        return result;
      },
      [],
    );

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
