import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeService } from './employee.service';
import {
  MockContext,
  Context,
  createMockContext,
} from '../../test/mocks/prisma.mock';
import { PrismaService } from '../prisma.service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { EmployeeDto } from './dto/employee.dto';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let mockCtx: MockContext;
  let ctx: Context;
  beforeEach(async () => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeService],
    })
      .useMocker((token) => {
        if (token == PrismaService) {
          return ctx.prisma;
        }
      })
      .compile();

    service = module.get<EmployeeService>(EmployeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should get employee', async () => {
    const employee: EmployeeDto = {
      EmployeeId: 7,
      LastName: 'King',
      FirstName: 'Robert',
      Title: 'IT Staff',
      ReportsTo: 6,
      BirthDate: '1970-05-29T00:00:00.000Z' as any,
      HireDate: '2004-01-02T00:00:00.000Z' as any,
      Address: '590 Columbia Boulevard West',
      City: 'Lethbridge',
      State: 'AB',
      Country: 'Canada',
      PostalCode: 'T1K 5N8',
      Phone: '+1 (403) 456-9986',
      Fax: '+1 (403) 456-8485',
      Email: 'robert@chinookcorp.com',
      Password: 'Povio$',
    };
    mockCtx.prisma.employee.findFirst.mockResolvedValue(employee);
    await expect(
      service.getEmployeeByEmail('robert@chinookcorp.com'),
    ).resolves.toEqual(employee);
  });

  it('should create employee', async () => {
    const user: object = {
      LastName: 'Salkic',
      FirstName: 'Semir',
      Email: 'semir@test.com',
      Password: 'Semir$',
      Title: null,
      ReportsTo: null,
      BirthDate: null,
      HireDate: null,
      Address: null,
      City: null,
      State: null,
      Country: null,
      PostalCode: null,
      Phone: null,
      Fax: null,
    };

    mockCtx.prisma.employee.create.mockResolvedValue(user as EmployeeDto);
    await expect(service.createEmployee(user as EmployeeDto)).resolves.toEqual(
      user,
    );
  });

  it('reject bad password', async () => {
    const user: object = {
      LastName: 'Salkic',
      FirstName: 'Semir',
      Email: 'semir@test.com',
      Password: 'Povio',
    };
    const dtoObject = plainToInstance(EmployeeDto, user);
    const errors = JSON.stringify(await validate(dtoObject));
    expect(errors).toContain('Password needs to be at least 6 characters long');
    expect(errors).toContain(
      'Password must contain at least one special character',
    );
  });

  it('reject bad email', async () => {
    const user: object = {
      LastName: 'Salkic',
      FirstName: 'Semir',
      Email: 'semir@test',
      Password: 'Povio$',
    };
    const dtoObject = plainToInstance(EmployeeDto, user);
    const errors = JSON.stringify(await validate(dtoObject));
    expect(errors).toContain('Email must be an email');
  });
});
