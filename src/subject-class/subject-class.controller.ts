import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  CreateSubjectClassReq,
  UpdateSubjectClassReq,
} from 'src/subject-class/subject-class.dto';
import { SubjectClassService } from 'src/subject-class/subject-class.service';
import { JwtAuthGuard } from 'src/user_auth/jwt-auth.guard';

@Controller('subject-class')
export class SubjectClassController {
  constructor(private readonly subjectClassService: SubjectClassService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllSubjectClass() {
    return this.subjectClassService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createNewSubjectClass(
    @Body() body: CreateSubjectClassReq,
    @Request() req,
  ) {
    const { subjectId, teacherId, name } = body;
    const { user } = req;

    if (!user.isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to create a new subject class',
      );
    }

    const input = {
      name,
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
