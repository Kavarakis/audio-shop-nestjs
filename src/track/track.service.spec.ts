import { Test, TestingModule } from '@nestjs/testing';
import {
  MockContext,
  Context,
  createMockContext,
} from '../../test/mocks/prisma.mock';
import { PrismaService } from '../prisma.service';
import { TrackService } from './track.service';

describe('TrackService', () => {
  let service: TrackService;
  let mockCtx: MockContext;
  let ctx: Context;

  beforeEach(async () => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrackService],
    })
      .useMocker((token) => {
        if (token == PrismaService) {
          return ctx.prisma;
        }
      })
      .compile();

    service = module.get<TrackService>(TrackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
