// import { Controller } from '@nestjs/common';

// @Controller('link')
// export class LinkController {}



// src/link/link.controller.ts

import { Controller, Post, Body, Headers, Param , Get, Req } from '@nestjs/common';
import { LinkService } from './link.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { Request } from 'express';

@Controller('links')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Post('/shorten')
  async createLink(
    @Body() createLinkDto: CreateLinkDto,
    @Headers('authorization') authHeader?: string
  ) {
    const token = authHeader?.replace('Bearer ', '');
    return this.linkService.createLink(createLinkDto, token);
  }



// async getLink(
//   @Param('shortCode') shortCode: string,
//   @Headers('user-agent') userAgent: string,
//   @Headers('referer') referrer: string,
//   @Req() req: Request,
// ) {
//   return this.linkService.handleRedirectAnalytics(
//     shortCode,
//     userAgent || 'Unknown',
//     referrer || 'Direct',
//     req
//   );
// }
  @Get(':shortCode')
  async getLink(
    @Param('shortCode') shortCode: string,
    @Req() req: Request,
  ) {
    return this.linkService.handleRedirectAnalytics(shortCode, req);
  }

  @Get(':shortCode/stats')
async getLinkStats(
  @Param('shortCode') shortCode: string,
  @Headers('authorization') authHeader?: string,
) {
  const token = authHeader?.replace('Bearer ', '');
  return this.linkService.getLinkStats(shortCode, token);
}



}
