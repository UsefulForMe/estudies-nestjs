import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IFindAllAgruments } from 'src/common/interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ParentsService {
  constructor(private readonly prisma: PrismaService) {}
  async findMany(where?: Prisma.ParentsWhereInput, args?: IFindAllAgruments) {
    return Promise.all([
      this.prisma.parents.findMany({
        where,
        select: {
          id: true,
          name: true,
          address: true,
          createdAt: true,
          updatedAt: true,
          phone: true,
          auth: true,
        },
        ...args,
      }),
      this.prisma.parents.count({ where }),
    ]);
  }
  async create(req: Prisma.ParentsCreateInput) {
    return this.prisma.parents.create({
      data: req,
    });
  }

  async findUnique(where: Prisma.ParentsWhereUniqueInput) {
    return this.prisma.parents.findUnique({
      where,
      include: {
        student: true,
      },
    });
  }

  async update(
    where: Prisma.ParentsWhereUniqueInput,
    data: Prisma.ParentsUpdateInput,
  ) {
    return this.prisma.parents.update({
      where,
      data,
    });
  }
}
