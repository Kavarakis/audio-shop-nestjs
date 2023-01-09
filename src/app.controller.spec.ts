import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { PrismaService } from './prisma.service';
import { JwtService } from '@nestjs/jwt';

import {
  MockContext,
  Context,
  createMockContext,
} from '../test/mocks/prisma.mock';
import { EmployeeDto } from './employee/dto/employee.dto';
import { UserLoginDto } from './employee/dto/userLogin.dto';

describe('AppController', () => {
  let appController: AppController;
  let mockCtx: MockContext;
  let ctx: Context;
  const newEmployee: EmployeeDto = {
    LastName: 'Salkic',
    FirstName: 'Semir',
    Email: 'semir-mock@test.com',
    Password: 'Semir$',
    EmployeeId: 1,
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
  const user: object = {
    LastName: 'Salkic',
    FirstName: 'Semir',
    Email: 'semir-mock@test.com',
    Password: 'Semir$',
  };
  beforeEach(async () => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;
    const app: TestingModule = await Test.createTestingModule({
      imports: [EmployeeModule, AuthModule],
      controllers: [AppController],
      providers: [AppService, PrismaService],
    })
      .useMocker((token) => {
        if (token === AppService) {
          return {
            postSignup: jest.fn().mockResolvedValue(newEmployee),
          };
        }
        if (token == PrismaService) {
          return ctx.prisma;
        }
      })
      .compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });

    it('should  register new employee/user', async () => {
      mockCtx.prisma.employee.create.mockResolvedValue(newEmployee);
      expect(await appController.postSignup(user as EmployeeDto)).toBe(
        newEmployee,
      );
    });

    it('should login with credentials', async () => {
      type loginRes = { access_token: string };
      type decodedToken = {
        username: string;
        sub: number;
      };
      mockCtx.prisma.employee.findFirst.mockResolvedValue(newEmployee);
      const token: loginRes = await appController.postLogin(
        user as UserLoginDto,
      );
      const jwtService = new JwtService({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: process.env.JWT_EXPIRES_IN,
        },
      });
      const decoded: decodedToken = jwtService.decode(
        token.access_token,
      ) as decodedToken;
      expect(decoded.username).toEqual(newEmployee.Email);
      expect(decoded.sub).toEqual(newEmployee.EmployeeId);
    });
  });
});
