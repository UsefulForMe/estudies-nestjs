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
import { CreateParentsReq, UpdateParentsReq } from 'src/parents/parents.dto';
import { ParentsService } from 'src/parents/parents.service';
import { UpdateStudentReq } from 'src/student/student.dto';

import { JwtAuthGuard } from 'src/user_auth/jwt-auth.guard';

@Controller('parents')
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @UseGuards(JwtAuthGuard)
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
  @Get('/me')
  async getMyProfile(@Request() request) {
    const { user } = request;
    return this.parentsService.findUnique({ authId: user.id });
  }

  @UseGuards(JwtAuthGuard)
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