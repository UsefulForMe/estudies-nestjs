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
import { get } from 'lodash';
import { CreateStudentReq, UpdateStudentReq } from 'src/student/student.dto';
import { StudentService } from 'src/student/student.service';
import { JwtAuthGuard } from 'src/user_auth/jwt-auth.guard';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createStudent(@Request() request, @Body() body: CreateStudentReq) {
    const { user } = request;

    const req = {
      ...body,
      auth: {
        connect: {
          id: user.id,
        },
      },
    };

    return this.studentService.createStudent(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getMyProfile(@Request() request) {
    const { user } = request;
    return this.studentService.getStudent({ authId: user.id });
  }

  @UseGuards(JwtAuthGuard)
  @Put('/me')
  async updateMyProfile(@Request() request, @Body() body: UpdateStudentReq) {
    const id = get(request, 'user.student.id');
    return this.studentService.updateStudent(
      {
        id,
      },
      body,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getStudent(@Param('id') id: string, @Request() request) {
    const { user } = request;

    const isTeacherOrParent = get(user, 'teacher') || get(user, 'parent');

    if (!isTeacherOrParent) {
      throw new UnauthorizedException(
        'You are not authorized to view this student profile',
      );
    }

    return this.studentService.getStudent({
      id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateStudent(
    @Param('id') id: string,
    @Request() request,
    @Body() body: UpdateStudentReq,
  ) {
    const { user } = request;

    if (get(user, 'student.id') !== id) {
      throw new UnauthorizedException(
        'You are not authorized to update this student profile',
      );
    }

    return this.studentService.updateStudent(
      {
        id,
      },
      body,
    );
  }
}
