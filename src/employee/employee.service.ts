import { Injectable } from '@nestjs/common';
import { Employee } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class EmployeeService {
  constructor(private readonly prismaService: PrismaService) {}
  async createEmployee(employee: Employee): Promise<Employee> {
    return await this.prismaService.employee.create({
      data: employee,
    });
  }
  async getEmployeeByEmail(email: string): Promise<Employee> {
    const result = await this.prismaService.employee.findFirst({
      where: {
        Email: email,
      },
    });
    if (!result) {
      return {} as Employee;
    }
    return result;
  }
}
