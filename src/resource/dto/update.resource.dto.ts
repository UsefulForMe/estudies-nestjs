import { BaseResourceDto } from './base-resource.dto';

export class UpdateResourceDto extends BaseResourceDto {
  completedAt: Date;
}
