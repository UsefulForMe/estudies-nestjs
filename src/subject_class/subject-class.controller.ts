import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Query,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { SubjectService } from 'src/subject/subject.service';
import {
  CreateSubjectClassReq,
  UpdateSubjectClassReq,
} from 'src/subject_class/subject-class.dto';
import { SubjectClassService } from 'src/subject_class/subject-class.service';
import { JwtAuthGuard } from 'src/user_auth/jwt-auth.guard';
import HelperUtil from 'src/utils/helper/helper';

@Controller('subject-class')
export class SubjectClassController {
  constructor(
    private readonly subjectClassService: SubjectClassService,
    private readonly subjectService: SubjectService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllSubjectClass(@Res() res, @Query() query) {
    const { range } = query;
    const [skip, take] = range ? JSON.parse(range) : [];
    const params = {};
    if (skip) {
      params['skip'] = skip;
    }
    if (take) {
      params['take'] = take - skip + 1;
    }
    const [data, total] = await this.subjectClassService.findAll({}, params);
    res.header('Content-Range', `X-Total-Count: 0-${data.length}/${total}`);

    const output = data.map((item) => {
      return {
        ...item,
        teacher: item.teacher.name,
        subject: item.subject.name,
        students: item.students.length,
      };
    });

    res.header('Access-Control-Expose-Headers', 'Content-Range');
    res.json(output);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createNewSubjectClass(
    @Body() body: CreateSubjectClassReq,
    @Request() req,
  ) {
    const { subjectId, teacherId, startAt, endAt } = body;
    const { user } = req;

    if (!user.isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to create a new subject class',
      );
    }

    const subject = await this.subjectService.findById(subjectId);

    if (!subject) {
      throw new InternalServerErrorException('Subject not found');
    }
    const year = new Date().getFullYear();
    const randNum = HelperUtil.randomNumberWithLength(4);
    const name = `SC${randNum}-${subject.name}`;
    const code = HelperUtil.getSymbolOfText(subject.name) + year + randNum;
    const input = {
      code,
      name,
      startAt: new Date(startAt),
      endAt: new Date(endAt),
      teacher: {
        connect: {
          id: teacherId,
        },
      },
      subject: {
        connect: {
          id: subjectId,
        },
      },
    };

    const subjectClass = await this.subjectClassService.create(input);
    return subjectClass;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/teacher/:id')
  async getSubjectClassByTeacherId(@Param('id') id: string) {
    return this.subjectClassService.findAll({ teacherId: id });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/subject/:id')
  async getSubjectClassBySubjectId(@Param('id') id: string) {
    return this.subjectClassService.findAll({ subjectId: id });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/student/:id')
  async getSubjectClassByStudentId(@Param('id') id: string) {
    return this.subjectClassService.findAll({
      studentIds: {
        has: id,
      },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getSubjectClass(@Param('id') id: string) {
    return this.subjectClassService.findUnique({ id });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateSubjectClass(
    @Param('id') id: string,
    @Body() body: UpdateSubjectClassReq,
    @Request() req,
  ) {
    const { user } = req;

    if (!user.isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to update this subject class',
      );
    }

    return this.subjectClassService.update(
      {
        id,
      },
      body,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/add-students')
  async addStudentsToSubjectClass(
    @Param('id') id: string,
    @Body() body: { studentIds: string[] },
    @Request() req,
  ) {
    const { user } = req;

    if (!user.isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to update this subject class',
      );
    }

    const { studentIds } = body;
    const input = {
      students: {
        connect: studentIds.map((id) => ({ id })),
      },
    };
    return this.subjectClassService.update(
      {
        id,
      },
      input,
    );
  }
}
