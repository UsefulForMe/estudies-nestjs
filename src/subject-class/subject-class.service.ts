import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubjectClassService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.SubjectClassCreateInput) {
    return this.prismaService.subjectClass.create({
      data,
    });
  }

  async findAll(where?: Prisma.SubjectClassWhereInput) {
    return this.prismaService.subjectClass.findMany({
      where,
      include: {
        subject: true,
        teacher: true,
      },
    });
  }

  async findUnique(where: Prisma.SubjectClassWhereUniqueInput) {
    return this.prismaService.subjectClass.findUnique({
      where,
      include: {
        subject: true,
        teacher: true,
      },
    });
  }

  async update(
    where: Prisma.SubjectClassWhereUniqueInput,
    data: Prisma.SubjectClassUpdateInput,
  ) {
    return this.prismaService.subjectClass.update({
      where,
      data,
    });
  }

  async addStudents(
    where: Prisma.SubjectClassWhereUniqueInput,
    data: Prisma.StudentCreateInput[],
  ) {
    return this.prismaService.subjectClass.update({
      where,
      data: {
        students: {
          create: data,
        },
      },
    });
  }
}
