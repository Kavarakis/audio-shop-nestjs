import { Test, TestingModule } from '@nestjs/testing';
import { Track } from '@prisma/client';
import {
  Context,
  createMockContext,
  MockContext,
} from '../../test/mocks/prisma.mock';
import { PrismaService } from '../prisma.service';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';

describe('TrackController', () => {
  let trackController: TrackController;
  let mockCtx: MockContext;
  let ctx: Context;

  const tracks: Track[] = [
    {
      TrackId: 3,
      Name: 'Fast As a Shark',
      AlbumId: 3,
      MediaTypeId: 2,
      GenreId: 1,
      Composer: 'F. Baltes, S. Kaufman, U. Dirkscneider & W. Hoffman',
      Milliseconds: 230619,
      Bytes: 3990994,
      UnitPrice: 0.99 as any,
    },
    {
      TrackId: 4,
      Name: 'Restless and Wild',
      AlbumId: 3,
      MediaTypeId: 2,
      GenreId: 1,
      Composer:
        'F. Baltes, R.A. Smith-Diesel, S. Kaufman, U. Dirkscneider & W. Hoffman',
      Milliseconds: 252051,
      Bytes: 4331779,
      UnitPrice: 0.99 as any,
    },
  ];
  beforeEach(async () => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrackController],
      providers: [TrackService],
    })
      .useMocker((token) => {
        if (token === TrackService) {
          return {
            getTracks: jest.fn().mockResolvedValue(tracks),
          };
        }
        if (token == PrismaService) {
          return ctx.prisma;
        }
      })
      .compile();

    trackController = module.get<TrackController>(TrackController);
  });

  it('should be defined', () => {
    expect(trackController).toBeDefined();
  });
  it('should retrieve tracks', async () => {
    mockCtx.prisma.track.findMany.mockResolvedValue(tracks);
    expect(await trackController.getTracks()).toBe(tracks);
  });
});
