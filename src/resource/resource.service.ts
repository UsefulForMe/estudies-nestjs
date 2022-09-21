/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ResourceDocument, ResourceDTO } from './schema/resource.schema';

import { Model } from 'mongoose';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update.resource.dto';

@Injectable()
export class ResourceService {
  constructor(
    @InjectModel("Resource")
    private readonly modelResource: Model<ResourceDocument>,
  ) {}

  async findAll(): Promise<ResourceDTO[]> {
    return await this.modelResource.find().exec();
  }

  async findById(id: string): Promise<ResourceDTO> {
    return await this.modelResource.findById(id).exec();
  }

  async createResource(
    createResource: CreateResourceDto,
  ): Promise<ResourceDTO> {
    return await new this.modelResource({
      ...createResource,
      createdAt: new Date(),
    }).save();
  }

  async updateResource(
    id: string,
    updateResource: UpdateResourceDto,
  ): Promise<ResourceDTO> {
    return await this.modelResource
      .findByIdAndUpdate(id, updateResource)
      .exec();
  }

  async deleteResource(id: string): Promise<ResourceDTO> {
    return await this.modelResource.findByIdAndDelete(id).exec();
  }
}
