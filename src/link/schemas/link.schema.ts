

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
// import { User } from 'src/user/schemas/user.schema';
import { User } from '../../user/schema/user.schema';

export type LinkDocument = Link & Document;


@Schema()
export class Link extends Document {
  @Prop({ required: true })
  longUrl: string;

  @Prop({ required: true, unique: true })
  shortCode: string;

  @Prop()
  customAlias?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;

  @Prop()
  expiresAt?: Date;
}

export const LinkSchema = SchemaFactory.createForClass(Link);

