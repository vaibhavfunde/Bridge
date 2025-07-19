

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
