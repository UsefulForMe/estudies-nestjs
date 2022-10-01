/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Resource } from '@prisma/client';

@Injectable()
export class ResourceService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.resource.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        link: true,
        createdAt: true,
        subjectClass: true,
        updatedAt: true,
      },
    });
  }

  async findById(id: string): Promise<Resource> {
    return await this.prismaService.resource.findUnique({
      where: { id: id },
    });
  }

  async createResource(createResource: any): Promise<Resource> {
    return this.prismaService.resource.create({
      data: createResource,
    });
  }

  async updateResource(id: string, updateResource: any): Promise<Resource> {
    return await this.prismaService.resource.update({
      where: { id: id },
      data: updateResource,
    });
  }

  async deleteResource(id: string): Promise<Resource> {
    return await this.prismaService.resource.delete({
      where: { id: id },
    });
  }
}
