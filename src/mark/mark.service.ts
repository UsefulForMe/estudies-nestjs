import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MarkService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.MarkCreateInput) {
    return this.prismaService.mark.create({
      data,
    });
  }

  async findAll(where?: Prisma.MarkWhereInput) {
    return this.prismaService.mark.findMany({
      where,
    });
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
