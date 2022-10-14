import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  LoginUserAuthReqDto,
  LoginUserAuthResDto,
  RegisterUserAuthDto,
} from 'src/user_auth/auth.dto';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { AppConfigService } from 'src/config/app-config.service';
import { AppLoggerService } from 'src/logger/logger.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import TimeUtil from 'src/utils/time/time';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  private readonly logger = new AppLoggerService(AuthService.name);
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly appConfig: AppConfigService,
    private readonly bryptService: BcryptService,
    private readonly mailService: MailService,
  ) {}

  async login(credentials: LoginUserAuthReqDto): Promise<LoginUserAuthResDto> {
    const user = await this.prismaService.userAuth.findFirst({
      where: {
        email: credentials.email,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.isAdmin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await this.bryptService.isEqual(
      credentials.password,
      user.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.jwtService.sign({
      sub: user.email,
      data: user,
    });

    return { access_token: accessToken };
  }

  async loginAdmin(
    credentials: LoginUserAuthReqDto,
  ): Promise<LoginUserAuthResDto> {
    const user = await this.prismaService.userAuth.findFirst({
      where: {
        email: credentials.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isAdmin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await this.bryptService.isEqual(
      credentials.password,
      user.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.jwtService.sign({
      sub: user.email,
      data: user,
    });

    return { access_token: accessToken };
  }

  async register(user: RegisterUserAuthDto): Promise<string> {
    const isExists = await this.prismaService.userAuth.findFirst({
      where: {
        email: user.email,
      },
    });

    if (isExists) {
      throw new ConflictException('Email already exists');
    }

    const verifyToken = this.jwtService.sign({
      sub: user.email,
      data: {
        email: user.email,
        password: user.password,
        type: user.type,
      },
    });

    await this.redisService.client.set(
      'verifyToken:' + verifyToken,
      verifyToken,
      'EX',
      this.appConfig.redisConfig.ex,
    );
    await this.mailService
      .sendMailConfirm(
        user.email,
        `${this.appConfig.coreConfig.url}/auth/register/verify/${verifyToken}`,
      )
      .catch((err) => {
        console.log(err);
      });
    return verifyToken;
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (err) {
      return null;
    }
  }

  async verifyRegister(verifyToken: string): Promise<boolean> {
    const key = `verifyToken:${verifyToken}`;

    const token = await this.redisService.client.get(key);

    if (token !== verifyToken) {
      throw new UnauthorizedException('Invalid token');
    }

    const payload = this.jwtService.verify(verifyToken);

    if (TimeUtil.expiredTimestamp(payload.exp)) {
      throw new UnauthorizedException('Token expired');
    }

    const hash = await this.bryptService.hashString(payload.data.password);

    await this.prismaService.userAuth.create({
      data: {
        email: payload.data.email,
        password: hash,
        type: payload.data.type,
      },
    });

    await this.redisService.client.del(key);

    return true;
  }
}
