import {
  INestApplication,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import { camelCase, flattenDeep, snakeCase } from 'lodash';
import * as path from 'path';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private logger: Logger;

  constructor() {
    super();
    this.logger = new Logger(PrismaService.name);
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma connected');
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
      this.logger.log('Primsa disconnected');
    });
  }

  async close() {
    await this.$disconnect();
  }

  async dropDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot drop database in production');
    }

    const modelKeys = Prisma.dmmf.datamodel.models.map((m) => m.name);
    for (const model of modelKeys) {
      await this[camelCase(model)].deleteMany();
    }
  }

  async seedDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot seed database in production');
    }

    const modelKeys = Prisma.dmmf.datamodel.models.map((m) => m.name);

    await Promise.all(
      modelKeys.map((model) => {
        const isHasDir = fs.existsSync(
          path.resolve(__dirname, `../${snakeCase(model)}/mocks`),
        );

        console.log(
          isHasDir,
          path.resolve(__dirname, `../${snakeCase(model)}/mocks`),
        );

        if (!isHasDir) {
          return;
        }

        const files = fs.readdirSync(
          path.resolve(__dirname, `../${snakeCase(model)}/mocks`),
        );

        const modelData = [];

        files.forEach((file) => {
          const fileName = path.resolve(
            __dirname,
            `../${snakeCase(model)}/mocks`,
            file,
          );
          const data = fs.readFileSync(fileName, 'utf8');

          modelData.push(JSON.parse(data));
        });

        return this[camelCase(model)].createMany({
          data: flattenDeep(modelData),
        });
      }),
    );
  }
}
