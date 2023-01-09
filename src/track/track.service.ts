import { Injectable } from '@nestjs/common';
import { Track } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TrackService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllTracks(): Promise<Track[]> {
    return this.prismaService.track.findMany();
  }
}
