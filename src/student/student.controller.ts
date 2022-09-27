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

    return this.studentService.create(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getMyProfile(@Request() request) {
    const { user } = request;
    return this.studentService.findUnique({ authId: user.id });
  }

  @UseGuards(JwtAuthGuard)
  @Put('/me')
  async updateMyProfile(@Request() request, @Body() body: UpdateStudentReq) {
    const id = get(request, 'user.student.id');
    return this.studentService.update(
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
    const isMyProfile = get(user, 'student.id') === id;
    const isAdmin = get(user, 'isAdmin');

    if (!isTeacherOrParent && !isMyProfile && !isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to view this student profile',
      );
    }

    return this.studentService.findUnique({
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
    if (!user.isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to update this student profile',
      );
    }

    return this.studentService.update(
      {
        id,
      },
      body,
    );
  }
}
