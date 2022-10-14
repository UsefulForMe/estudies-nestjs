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
import { get } from 'lodash';
import { SortOrderMap } from 'src/common/interface';
import { CreateStudentReq, UpdateStudentReq } from 'src/student/student.dto';
import { StudentService } from 'src/student/student.service';
import { JwtAuthGuard } from 'src/user_auth/jwt-auth.guard';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async findManyStudents(@Request() request, @Res() res, @Query() query) {
    const { range, sort, filter } = query;

    const [skip, take] = range ? JSON.parse(range) : [];
    const [sortField, sortOrder] = sort ? JSON.parse(sort) : [];

    const { user } = request;
    if (!user.isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to view all student profiles',
      );
    }

    const params = {};
    if (skip) {
      params['skip'] = skip;
    }
    if (take) {
      params['take'] = take - skip + 1;
    }

    if (sortField && sortOrder) {
      params['orderBy'] = {
        [sortField]: SortOrderMap[sortOrder],
      };
    }

    const { name, address } = filter
      ? JSON.parse(filter)
      : {
          name: '',
          address: '',
        };
    let where = {};

    if (name) {
      where = {
        name: {
          contains: name.trim(),
        },
      };
    }
    if (address) {
      where = {
        ...where,
        address: {
          contains: address.trim(),
        },
      };
    }

    const [data, total] = await this.studentService.findMany(where, params);
    res.header('Content-Range', `X-Total-Count: 0-${data.length}/${total}`);
    res.header('Access-Control-Expose-Headers', 'Content-Range');
    res.json(data);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
  @ApiBearerAuth()
  @Get('/me')
  async getMyProfile(@Request() request) {
    const { user } = request;
    return this.studentService.findUnique({ authId: user.id });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
  @ApiBearerAuth()
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
  @ApiBearerAuth()
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
