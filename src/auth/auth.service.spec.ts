import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeModule } from '../employee/employee.module';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import {
  MockContext,
  Context,
  createMockContext,
} from '../../test/mocks/prisma.mock';

describe('AuthService', () => {
  let service: AuthService;
  let mockCtx: MockContext;
  let ctx: Context;
  beforeEach(async () => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: process.env.JWT_EXPIRES_IN,
          },
        }),
        EmployeeModule,
      ],
      providers: [AuthService],
    })

      .useMocker((token) => {
        if (token === PrismaService) {
          return ctx.prisma;
        }
      })
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
