import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TeacherService {
  constructor(private readonly prisma: PrismaService) {}

  async create(req: Prisma.TeacherCreateInput) {
    return this.prisma.teacher.create({
      data: req,
    });
  }

  async findUnique(where: Prisma.TeacherWhereUniqueInput) {
    return this.prisma.teacher.findUnique({
      where,
    });
  }

  async update(
    where: Prisma.TeacherWhereUniqueInput,
    data: Prisma.TeacherUpdateInput,
  ) {
    return this.prisma.teacher.update({
      where,
      data,
    });
  }
}
