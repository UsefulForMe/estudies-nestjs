import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Injectable,
  Param,
  Post,
  Query,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AppConfigService } from 'src/config/app-config.service';
import {
  LoginUserAuthReqDto,
  RegisterUserAuthDto,
} from 'src/user_auth/auth.dto';
import { AuthService } from 'src/user_auth/auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly appConfigService: AppConfigService,
  ) {}

  @Post('login')
  @ApiBody({
    type: LoginUserAuthReqDto,
    examples: {
      empty_body: {
        value: {} as LoginUserAuthReqDto,
      },
      valid_body: {
        value: {
          email: 'student1@gmail.com',
          password: '123456',
        } as LoginUserAuthReqDto,
      },
    },
  })
  async login(@Body() body: LoginUserAuthReqDto) {
    const token = await this.authService.login(body);
    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data: token,
    };
  }

  @Post('login/admin')
  @ApiBody({
    type: LoginUserAuthReqDto,
    examples: {
      empty_body: {
        value: {} as LoginUserAuthReqDto,
      },
      valid_body: {
        value: {
          email: 'admin@gmail.com',
          password: '123456',
        } as LoginUserAuthReqDto,
      },
    },
  })
  async loginAdmin(@Body() body: LoginUserAuthReqDto) {
    const token = await this.authService.loginAdmin(body);
    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data: token,
    };
  }

  @Post('register')
  @ApiBody({
    type: RegisterUserAuthDto,
    examples: {
      empty_body: {
        value: {} as RegisterUserAuthDto,
      },
      valid_body: {
        value: {
          email: 'admin@gmail.com',
          password: '123456',
        } as RegisterUserAuthDto,
      },
    },
  })
  async register(@Body() body: RegisterUserAuthDto) {
    const token = await this.authService.register(body);
    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data: {
        verify_token: token,
      },
    };
  }

  @Get('register/verify/:token')
  async verifyRegister(@Param('token') token: string) {
    const isVerified = await this.authService.verifyRegister(token);
    if (!isVerified) {
      throw new UnauthorizedException();
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('verify')
  async verifyToken(@Request() request, @Res() res, @Query() query) {
    const { user } = request;
    res.json(user);
  }
}
