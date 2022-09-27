import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ParentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(req: Prisma.ParentsCreateInput) {
    return this.prisma.parents.create({
      data: req,
    });
  }

  async findUnique(where: Prisma.ParentsWhereUniqueInput) {
    return this.prisma.parents.findUnique({
      where,
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
