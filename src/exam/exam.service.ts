import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExamService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(data: Prisma.ExamCreateInput) {
    return this.prismaService.exam.create({
      data,
    });
  }

  async findAll(where?: Prisma.ExamWhereInput) {
    return this.prismaService.exam.findMany({
      where,
      select: {
        id: true,
        name: true,
        duration: true,
        type: true,
        factor: true,
        createdAt: true,
        updatedAt: true,
        subjectClass: true,
      },
    });
  }

  async findUnique(where: Prisma.ExamWhereUniqueInput) {
    return this.prismaService.exam.findUnique({
      where,
    });
  }

  async update(
    where: Prisma.ExamWhereUniqueInput,
    data: Prisma.ExamUpdateInput,
  ) {
    return this.prismaService.exam.update({
      where,
      data,
    });
  }
}
