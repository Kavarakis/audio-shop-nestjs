import {
  CacheInterceptor,
  CacheKey,
  CacheTTL,
  Controller,
  Get,
  Param,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { Track } from '@prisma/client';
import { Response } from 'express';

import { CustomerService } from './customer.service';

/* 
  You don't need to change anything here unless you opted for Level 2.
*/
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('/:id/tracks')
  async getCustomerTracks(@Param('id') customerId: number): Promise<Track[]> {
    return await this.customerService.getCustomerTracks(customerId);
  }
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(600)
  @CacheKey('pdf')
  @Get('/pdf')
  async getCustomersPdf(@Res() res: Response): Promise<any> {
    const pdf = await this.customerService.getCustomersPdf();

    res.attachment('customers.pdf');
    res.send(Buffer.from(pdf));
  }
  // Second solution option for endpoint response optimization
  @Get('/pdf2')
  async getCustomersPdf2(@Res() res: Response): Promise<any> {
    res.attachment('customers.pdf');
    res.send(Buffer.from(this.customerService.pdf));
  }
}
