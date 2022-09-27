import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(req: Prisma.StudentCreateInput) {
    return this.prisma.student.create({
      data: req,
    });
  }

  async findUnique(where: Prisma.StudentWhereUniqueInput) {
    return this.prisma.student.findUnique({
      where,
    });
  }

  async update(
    where: Prisma.StudentWhereUniqueInput,
    data: Prisma.StudentUpdateInput,
  ) {
    return this.prisma.student.update({
      where,
      data,
    });
  }
}
