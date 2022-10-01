import {
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import { JwtAuthGuard } from 'src/user_auth/jwt-auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async myProfile(@Req() req) {
    const { user } = req;
    const data = await this.adminService.findUnique({
      authId: user.id,
    });
    if (!data) {
      throw new NotFoundException('Profile not found');
    }

    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Post('me')
  createProfile(@Req() req) {
    const { user } = req;
    if (!user.isAdmin) {
      throw new UnauthorizedException('You are not an admin');
    }

    return this.adminService.create({
      name: user.email,
      auth: {
        connect: {
          id: user.id,
        },
      },
    });
  }
}
