import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IFindAllAgruments } from 'src/common/interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TeacherService {
  constructor(private readonly prisma: PrismaService) {}
  async findMany(where?: Prisma.TeacherWhereInput, args?: IFindAllAgruments) {
    return Promise.all([
      this.prisma.teacher.findMany({
        where,
        select: {
          id: true,
          name: true,
          address: true,
          createdAt: true,
          updatedAt: true,
        },
        ...args,
      }),
      this.prisma.teacher.count(),
    ]);
  }
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
