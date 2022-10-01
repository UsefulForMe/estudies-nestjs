import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}
  async create(req: Prisma.AdminCreateInput) {
    return this.prisma.admin.create({
      data: req,
    });
  }

  async findUnique(where: Prisma.AdminWhereUniqueInput) {
    return this.prisma.admin.findUnique({
      where,
    });
  }

  async update(
    where: Prisma.AdminWhereUniqueInput,
    data: Prisma.AdminUpdateInput,
  ) {
    return this.prisma.admin.update({
      where,
      data,
    });
  }
}
