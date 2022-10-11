import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FeedbackService } from 'src/feedback/feedback.service';
import { JwtAuthGuard } from 'src/user_auth/jwt-auth.guard';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly service: FeedbackService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async getAll(@Res() res, @Query() query) {
    const { range } = query;
    const [skip, take] = range ? JSON.parse(range) : [];
    const params = {};
    if (skip) {
      params['skip'] = skip;
    }
    if (take) {
      params['take'] = take - skip + 1;
    }

    const [data, total] = await this.service.findAll({}, params);
    const output = data.map((item) => {
      return {
        ...item,
        user: item.user.email,
      };
    });
    res.header('Content-Range', `X-Total-Count: 0-${output.length}/${total}`);
    res.header('Access-Control-Expose-Headers', 'Content-Range');
    res.json(output);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async find(@Param('id') id: string) {
    return await this.service.findById({ id });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async create(@Body() data: any, @Request() req) {
    const { user } = req;
    const input = {
      ...data,
      user: {
        connect: {
          id: user.id,
        },
      },
    };
    return await this.service.create(input);
  }
}
