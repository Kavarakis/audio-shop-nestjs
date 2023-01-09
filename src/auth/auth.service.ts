import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Employee } from '@prisma/client';
import { EmployeeService } from '../employee/employee.service';
import { EmployeeDto } from '../employee/dto/employee.dto';
import { UserLoginDto } from '../employee/dto/userLogin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly jwtTokenService: JwtService,
  ) {}
  async validateEmployee(user: UserLoginDto): Promise<EmployeeDto | null> {
    const employee: Employee = await this.employeeService.getEmployeeByEmail(
      user.Email,
    );
    if (employee && employee.Password == user.Password) {
      return employee;
    }
    return null;
  }

  loginWithCredentials(user: EmployeeDto) {
    const payload = { username: user.Email, sub: user.EmployeeId };
    return { access_token: this.jwtTokenService.sign(payload) };
  }
}
