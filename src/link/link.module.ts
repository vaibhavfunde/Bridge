import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LinkController } from './link.controller';
import { LinkService } from './link.service';

import { Link, LinkSchema } from './schemas/link.schema';
import { LinkAnalytics, LinkAnalyticsSchema } from './schemas/analytics.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Link.name, schema: LinkSchema },
      { name: LinkAnalytics.name, schema: LinkAnalyticsSchema },
    ]),
  ],
  controllers: [LinkController],
  providers: [LinkService],
})
export class LinkModule {}
