import { AppLoggerService } from 'src/logger/logger.service';
import { PrismaService } from 'src/prisma/prisma.service';

async function main() {
  const prismaService = new PrismaService();
  const logger = new AppLoggerService();

  await prismaService.$connect();
  logger.log('Connected to database', 'Prisma');

  await prismaService.dropDatabase();
  logger.log('Dropped database', 'Prisma');

  await prismaService.seedDatabase();
  logger.log('Seeded database', 'Prisma');
}

main();
