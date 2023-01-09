import { Controller, Get, UseGuards } from '@nestjs/common';
import { Track } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TrackService } from './track.service';

@Controller('tracks')
@UseGuards(JwtAuthGuard)
export class TrackController {
  constructor(private readonly trackService: TrackService) {}
  @Get()
  async getTracks(): Promise<Track[]> {
    return this.trackService.getAllTracks();
  }
}
