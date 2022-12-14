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
import { CreateTeacherReq, UpdateTeacherReq } from 'src/teacher/teacher.dto';
import { TeacherService } from 'src/teacher/teacher.service';
import { JwtAuthGuard } from 'src/user_auth/jwt-auth.guard';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async findManyTeacher(@Request() request, @Res() res, @Query() query) {
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

    const [data, total] = await this.teacherService.findMany(where, params);
    res.header('Content-Range', `X-Total-Count: 0-${data.length}/${total}`);
    res.header('Access-Control-Expose-Headers', 'Content-Range');
    res.json(data);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async createTeacher(@Request() request, @Body() body: CreateTeacherReq) {
    const { user } = request;

    const req = {
      ...body,
      auth: {
        connect: {
          id: user.id,
        },
      },
    };

    return this.teacherService.create(req);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/me')
  async getMyProfile(@Request() request) {
    const { user } = request;
    return this.teacherService.findUnique({ authId: user.id });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('/me')
  async updateMyProfile(@Request() request, @Body() body: UpdateTeacherReq) {
    const id = get(request, 'user.teacher.id');
    return this.teacherService.update(
      {
        id,
      },
      body,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async getTeacher(@Param('id') id: string, @Request() request) {
    const { user } = request;

    const isMyProfile = get(user, 'teacher.id') === id;
    const isAdmin = get(user, 'isAdmin');

    if (!isMyProfile && !isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to view this teacher profile',
      );
    }

    return this.teacherService.findUnique({
      id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(':id')
  async updateTeacher(
    @Param('id') id: string,
    @Request() request,
    @Body() body: UpdateTeacherReq,
  ) {
    const { user } = request;
    if (!user.isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to update this teacher profile',
      );
    }

    return this.teacherService.update(
      {
        id,
      },
      body,
    );
  }
}
