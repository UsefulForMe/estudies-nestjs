import { Injectable } from '@nestjs/common';
import { Prisma, Subject } from '@prisma/client';
import { IFindAllAgruments } from 'src/common/interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubjectService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(where: Prisma.SubjectWhereInput, args?: IFindAllAgruments) {
    return Promise.all([
      this.prismaService.subject.findMany({
        where: where,
        ...args,
      }),
      this.prismaService.subject.count({
        where,
      }),
    ]);
  }

  async findById(id: string): Promise<Subject> {
    return await this.prismaService.subject.findUnique({
      where: { id: id },
    });
  }

  async createResource(createResource: any): Promise<Subject> {
    return this.prismaService.subject.create({
      data: createResource,
    });
  }

  async updateResource(id: string, updateResource: any): Promise<Subject> {
    return await this.prismaService.subject.update({
      where: { id: id },
      data: updateResource,
    });
  }

  async deleteResource(id: string): Promise<Subject> {
    return await this.prismaService.subject.delete({
      where: { id: id },
    });
  }
}
