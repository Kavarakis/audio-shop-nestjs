import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { Employee } from '@prisma/client';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { EmployeeService } from './employee/employee.service';
import { EmployeeDto } from './employee/dto/employee.dto';
import { UserLoginDto } from './employee/dto/userLogin.dto';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly employeeService: EmployeeService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('test')
  async getTest(): Promise<Employee> {
    return this.employeeService.getEmployeeByEmail('robert@chinookcorp.com');
  }
  @Post('signup')
  async postSignup(@Body() user: EmployeeDto): Promise<Employee> {
    return this.employeeService.createEmployee(user);
  }
  @Post('login')
  @HttpCode(200)
  async postLogin(@Body() user: UserLoginDto): Promise<any> {
    const res: EmployeeDto | null = await this.authService.validateEmployee(
      user,
    );
    if (!res) {
      throw new UnauthorizedException();
    }

    return this.authService.loginWithCredentials(res);
  }
}
