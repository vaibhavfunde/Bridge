import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Link } from './link.schema';

export type LinkAnalyticsDocument = LinkAnalytics & Document;

@Schema({ timestamps: false })
export class LinkAnalytics {
  @Prop({ type: Types.ObjectId, ref: 'Link', required: true, index: true })
  link: Types.ObjectId | Link;

  @Prop({ type: Date, default: Date.now, index: true })
  timestamp: Date;

  @Prop()
  userAgent: string;

  @Prop()
  referrer?: string;

  @Prop()
  ip: string;

  @Prop()
  country?: string;
}

export const LinkAnalyticsSchema = SchemaFactory.createForClass(LinkAnalytics);
