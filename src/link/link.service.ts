// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class LinkService {}
// // 



// src/link/link.service.ts

import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Link, LinkDocument } from './schemas/link.schema';
import { Model } from 'mongoose';
import { CreateLinkDto } from './dto/create-link.dto';
// import { nanoid } from 'nanoid';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class LinkService {
  constructor(
    @InjectModel(Link.name) private readonly linkModel: Model<LinkDocument>,
  ) {}

  async createLink(createLinkDto: CreateLinkDto, token?: string): Promise<any> {
    const { longUrl, customAlias, expiresAt } = createLinkDto;

    // Generate or use custom shortCode
    const shortCode = customAlias || `${Math.random().toString(36).substring(2, 8)}`;

    // Check for existing shortCode
    const existing = await this.linkModel.findOne({ shortCode });
    if (existing) {
      throw new ConflictException('Short code already exists');
    }

    // Decode JWT to get userId (if token provided)
    let userId: string | undefined;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123') as { id: string };
        userId = decoded.id;
      } catch (err) {
        throw new UnauthorizedException('Invalid token');
      }
    }

    const expiryDate = expiresAt ? new Date(expiresAt) : new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);

    const newLink = new this.linkModel({
      longUrl,
      shortCode,
      customAlias,
      createdBy: userId,
      expiresAt: expiryDate,
    });

    const saved = await newLink.save();

    return {
      message: 'Short URL created successfully',
      shortUrl: `${process.env.DOMAIN || 'http://localhost:3000'}/shortcode/${shortCode}`,
      expiresAt: saved.expiresAt,
    };
  }
}
