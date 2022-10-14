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
import { CreateParentsReq, UpdateParentsReq } from 'src/parents/parents.dto';
import { ParentsService } from 'src/parents/parents.service';
import { UpdateStudentReq } from 'src/student/student.dto';

import { JwtAuthGuard } from 'src/user_auth/jwt-auth.guard';

@Controller('parents')
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async findManyParents(@Request() request, @Res() res, @Query() query) {
    const { range } = query;
    const [skip, take] = range ? JSON.parse(range) : [];
    const { user } = request;
    if (!user.isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to view all parents profiles',
      );
    }
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
    const [data, total] = await this.parentsService.findMany(where, params);
    res.header('Content-Range', `X-Total-Count: 0-${data.length}/${total}`);
    res.header('Access-Control-Expose-Headers', 'Content-Range');
    res.json(data);
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async createParents(@Request() request, @Body() body: CreateParentsReq) {
    const { user } = request;

    const req = {
      ...body,
      auth: {
        connect: {
          id: user.id,
        },
      },
    };

    return this.parentsService.create(req);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/me')
  async getMyProfile(@Request() request) {
    const { user } = request;
    return this.parentsService.findUnique({ authId: user.id });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('/me')
  async updateMyProfile(@Request() request, @Body() body: UpdateParentsReq) {
    const id = get(request, 'user.parents.id');
    return this.parentsService.update(
      {
        id,
      },
      body,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async getParents(@Param('id') id: string, @Request() request) {
    const { user } = request;

    const parentId = get(user, 'parents.id');
    const isMyProfile = parentId === id;

    const isTeacher = get(user, 'teacher');
    const isAdmin = get(user, 'isAdmin');

    if (!isTeacher && !isMyProfile && !isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to view this parents profile',
      );
    }

    return this.parentsService.findUnique({
      id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(':id')
  async updateParents(
    @Param('id') id: string,
    @Request() request,
    @Body() body: UpdateStudentReq,
  ) {
    const { user } = request;
    if (!user.isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to update this parents profile',
      );
    }

    return this.parentsService.update(
      {
        id,
      },
      body,
    );
  }
}
