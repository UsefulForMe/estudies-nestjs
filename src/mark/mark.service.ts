import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IFindAllAgruments } from 'src/common/interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MarkService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.MarkCreateInput) {
    return this.prismaService.mark.create({
      data,
    });
  }

  async findAll(where?: Prisma.MarkWhereInput, args?: IFindAllAgruments) {
    return Promise.all([
      this.prismaService.mark.findMany({
        where,
        select: {
          id: true,
          score: true,
          createdAt: true,
          updatedAt: true,
          exam: {
            select: {
              id: true,
              name: true,
              subjectClass: {
                select: {
                  id: true,
                  subject: true,
                  name: true,
                },
              },
            },
          },
          student: true,
        },
        ...args,
      }),
      this.prismaService.mark.count({
        where,
      }),
    ]);
  }

  async findUnique(where: Prisma.MarkWhereUniqueInput) {
    return this.prismaService.mark.findUnique({
      where,
    });
  }

  async update(
    where: Prisma.MarkWhereUniqueInput,
    data: Prisma.MarkUpdateInput,
  ) {
    return this.prismaService.mark.update({
      where,
      data,
    });
  }
}
