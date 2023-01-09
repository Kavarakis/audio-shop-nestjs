import { Injectable } from '@nestjs/common';
import { Customer, Track } from '@prisma/client';
import { PDFDocument } from 'pdf-lib';
import fontKit from '@pdf-lib/fontkit';
import * as fsPromise from 'fs/promises';

import { PrismaService } from '../prisma.service';
/* 
  You don't need to change anything here unless you opted for Level 2.
*/

@Injectable()
export class CustomerService {
  robotoFont: Buffer;
  customerList: Customer[];
  pdf: Uint8Array;

  constructor(private readonly prismaService: PrismaService) {
    this.loadFonts();
    // Loading customers from a JSON file instead from the database is by design.
    //  Update: remove sync  blocking I/O loading.
    this.loadCustomerList();
    this.set_pdf();
  }
  async loadFonts() {
    this.robotoFont = await fsPromise.readFile(
      `${process.cwd()}/Roboto-Regular.ttf`
    );
  }
  async loadCustomerList() {
    this.customerList = JSON.parse(
      await fsPromise.readFile(`${process.cwd()}/customers.json`, {
        encoding: 'utf-8',
      })
    );
  }
  async set_pdf() {
    this.pdf = await this.preparePdf();
  }
  async preparePdf() {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontKit);

    const font = await pdfDoc.embedFont(this.robotoFont);
    const page = pdfDoc.addPage();
    const fontSize = 12;

    this.customerList.forEach((c, i) => {
      page.drawText(`${c.CustomerId} ${c.FirstName} ${c.LastName}`, {
        x: 5,
        y: i * fontSize * 2,
        size: fontSize,
        font,
      });
    });
    return await pdfDoc.save();
  }
  async getCustomerTracks(customerId: number): Promise<Track[]> {
    const result = await this.prismaService.customer.findMany({
      where: {
        CustomerId: customerId,
      },
      select: {
        Invoice: {
          select: {
            InvoiceLine: {
              select: {
                Track: true,
              },
            },
          },
        },
      },
    });
    if (!result.length) {
      return [];
    }
    return result[0].Invoice.map((i) => i.InvoiceLine)
      .flat()
      .map((t) => t.Track);
  }

  async getCustomersPdf() {
    return await this.preparePdf();
  }
}
