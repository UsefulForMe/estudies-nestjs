import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IFindAllAgruments } from 'src/common/interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(where?: Prisma.StudentWhereInput, args?: IFindAllAgruments) {
    return Promise.all([
      this.prisma.student.findMany({
        where,
        select: {
          id: true,
          name: true,
          address: true,
          birthday: true,
          createdAt: true,
          updatedAt: true,
        },
        ...args,
      }),
      this.prisma.student.count({ where }),
    ]);
  }

  async create(req: Prisma.StudentCreateInput) {
    return this.prisma.student.create({
      data: req,
    });
  }

  async findUnique(where: Prisma.StudentWhereUniqueInput) {
    return this.prisma.student.findUnique({
      where,
      include: {
        subjectClasses: true,
        parents: true,
      },
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
