import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IFindAllAgruments } from 'src/common/interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FeedbackService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(where?: Prisma.FeedbackWhereInput, args?: IFindAllAgruments) {
    return Promise.all([
      this.prismaService.feedback.findMany({
        where: where,
        select: {
          id: true,
          message: true,
          time: true,
          user: true,
          userId: true,
        },
        ...args,
      }),
      this.prismaService.feedback.count({ where }),
    ]);
  }

  async findById(where: Prisma.FeedbackWhereUniqueInput) {
    return await this.prismaService.feedback.findUnique({
      where: where,
      include: {
        user: true,
      },
    });
  }

  async create(data: Prisma.FeedbackCreateInput) {
    return this.prismaService.feedback.create({
      data,
    });
  }
}
