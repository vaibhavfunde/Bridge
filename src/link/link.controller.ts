// import { Controller } from '@nestjs/common';

// @Controller('link')
// export class LinkController {}



// src/link/link.controller.ts

import { Controller, Post, Body, Headers, Param } from '@nestjs/common';
import { LinkService } from './link.service';
import { CreateLinkDto } from './dto/create-link.dto';

@Controller('links')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Post()
  async createLink(
    @Body() createLinkDto: CreateLinkDto,
    @Headers('authorization') authHeader?: string
  ) {
    const token = authHeader?.replace('Bearer ', '');
    return this.linkService.createLink(createLinkDto, token);
  }

//    @Post("/:token")
//    async createLink(@Param('token') token: string, @Body() createLinkDto: CreateLinkDto) {
//      return this.linkService.createLink(createLinkDto, token);
//    }
}
