import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma.service';
import {
  MockContext,
  Context,
  createMockContext,
} from '../../test/mocks/prisma.mock';
import { CustomerService } from './customer.service';

describe('CustomerService', () => {
  let service: CustomerService;
  let mockCtx: MockContext;
  let ctx: Context;

  beforeEach(async () => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return ctx.prisma;
        }
      })
      .compile();

    service = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get customer tracks', async () => {
    const track = {
      TrackId: 208,
      Name: 'Terra',
      AlbumId: 21,
      MediaTypeId: 1,
      GenreId: 7,
      Composer: 'Caetano Veloso',
      Milliseconds: 482429,
      Bytes: 15889054,
      UnitPrice: 0.99,
    };
    const result = [
      {
        Invoice: [
          {
            InvoiceLine: [
              {
                Track: {
                  ...track,
                },
              },
            ],
          },
        ],
      },
    ];

    mockCtx.prisma.customer.findMany.mockResolvedValue(result as any);

    await expect(service.getCustomerTracks(1)).resolves.toEqual([track]);
  });

  it('should get customers pdf in Uint8Array', async () => {
    expect((await service.getCustomersPdf()).constructor.name).toEqual(
      'Uint8Array',
    );
  });
});
