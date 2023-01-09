import { Test, TestingModule } from '@nestjs/testing';
import { getMockRes } from '@jest-mock/express';

import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CacheModule } from '@nestjs/common';

describe('CustomerController', () => {
  let customerController: CustomerController;
  const tracks = [
    {
      TrackId: 1,
      Name: 'name',
      AlbumId: null,
      MediaTypeId: 1,
      GenreId: null,
      Composer: null,
      Milliseconds: 1,
      Bytes: null,
      UnitPrice: 1.1,
    },
  ];

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [CustomerController],
    })
      .useMocker((token) => {
        if (token === CustomerService) {
          return {
            getCustomerTracks: jest.fn().mockResolvedValue(tracks),
            getCustomersPdf: jest.fn().mockResolvedValue(new Uint8Array()),
          };
        }
      })
      .compile();

    customerController = app.get<CustomerController>(CustomerController);
  });

  it('should return customer tracks', async () => {
    expect(await customerController.getCustomerTracks(1)).toBe(tracks);
  });

  it('should return customer list in pdf as buffer', async () => {
    const { res } = getMockRes();
    await customerController.getCustomersPdf(res);
    expect(res.send).toBeCalledWith(Buffer.from(new Uint8Array()));
  });
});
