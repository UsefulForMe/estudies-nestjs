import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type ResourceDocument = ResourceDTO & Document;

@Schema({ collection: 'Resource' })
export class ResourceDTO {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  nameResource: string;

  @Prop()
  type: string;

  @Prop({ required: true })
  links: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop()
  completedAt?: Date;
  //    thay ai cho nay
  //   @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'SubjectClass' })
  //   subjectClassId: "0123123"; //id
  @Prop({ required: true })
  subjectClassId: string; //id
}

export const ResourceSchema = SchemaFactory.createForClass(ResourceDTO);
