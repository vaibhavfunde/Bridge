// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class LinkService {}
// // 



// src/link/link.service.ts

// import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Link, LinkDocument } from './schemas/link.schema';
import { Model } from 'mongoose';
import { CreateLinkDto } from './dto/create-link.dto';
// import { nanoid } from 'nanoid';
import * as jwt from 'jsonwebtoken';
import { LinkAnalytics, LinkAnalyticsDocument } from './schemas/analytics.schema';
import { Get, Req } from '@nestjs/common';
import { Request } from 'express'; // For type `Request`
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  GoneException,
} from '@nestjs/common';

@Injectable()
export class LinkService {
  constructor(
    @InjectModel(Link.name) private readonly linkModel: Model<LinkDocument>,
     @InjectModel(LinkAnalytics.name)
    private readonly analyticsModel: Model<LinkAnalyticsDocument>,
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


   async handleRedirectAnalytics(shortCode: string, req: Request): Promise<string> {
    const link = await this.linkModel.findOne({ shortCode });

    if (!link) {
      throw new NotFoundException('Short link not found');
    }

    if (link.expiresAt && new Date() > link.expiresAt) {
      throw new GoneException('Short link has expired');
    }

    const userAgent = req.headers['user-agent'] || 'Unknown';
    const referrer = req.headers['referer'] || 'Direct';
    const ip =
      req.headers['x-forwarded-for']?.toString().split(',')[0].trim() || req.ip;

    await this.analyticsModel.create({
      link: link._id,
      timestamp: new Date(),
      userAgent,
      referrer,
      ip,
    });

    return link.longUrl;
  }


  async getLinkStats(shortCode: string, token?: string) {
  if (!token) {
    throw new UnauthorizedException('Token is required');
  }

  let userId: string;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123') as { id: string };
    userId = decoded.id;
  } catch (err) {
    throw new UnauthorizedException('Invalid token');
  }

  // Find link
  const link = await this.linkModel.findOne({ shortCode });
  if (!link) {
    throw new NotFoundException('Short link not found');
  }

  if (!link.createdBy || link.createdBy.toString() !== userId) {
    throw new UnauthorizedException('Access denied');
  }

  // Fetch analytics
  const analytics = await this.analyticsModel.find({ link: link._id });

  const totalClicks = analytics.length;

  // Last 30 days
  const now = new Date();
  const clicksPerDay: Record<string, number> = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toISOString().split('T')[0];
    clicksPerDay[key] = 0;
  }

  const referrerCounts: Record<string, number> = {};
  const countryCounts: Record<string, number> = {};

  for (const entry of analytics) {
    const dateKey = new Date(entry.timestamp).toISOString().split('T')[0];
    if (clicksPerDay[dateKey] !== undefined) {
      clicksPerDay[dateKey]++;
    }

    const ref = entry.referrer || 'Direct';
    referrerCounts[ref] = (referrerCounts[ref] || 0) + 1;

    const country = entry.country || 'Unknown';
    countryCounts[country] = (countryCounts[country] || 0) + 1;
  }

  return {
    shortCode,
    totalClicks,
    clicksPerDay,
    referrerCounts,
    countryCounts,
  };
}

}
