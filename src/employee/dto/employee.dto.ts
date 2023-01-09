import { Employee } from '@prisma/client';
import {
  IsDefined,
  IsEmail,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class EmployeeDto implements Employee {
  EmployeeId: number;
  @IsString({
    message: 'LastName is not String format',
  })
  @IsDefined({ message: 'LastName is mandatory attribute' })
  LastName: string;
  @IsString({
    message: 'FirstName is not String format',
  })
  @IsDefined({ message: 'FirstName is mandatory attribute' })
  FirstName: string;
  Title: string | null;
  ReportsTo: number | null;
  BirthDate: Date | null;
  HireDate: Date | null;
  Address: string | null;
  City: string | null;
  State: string | null;
  Country: string | null;
  PostalCode: string | null;
  Phone: string | null;
  Fax: string | null;
  @IsEmail({
    message: 'Email is not correct',
  })
  @IsDefined({ message: 'Email is mandatory attribute' })
  Email: string | null;
  @IsDefined({ message: 'Password is mandatory attribute' })
  @IsString({ message: 'Password is not String format' })
  @MinLength(6, { message: 'Password needs to be at least 6 characters long' })
  @Matches(new RegExp('(?=.*[A-Z])'), {
    message: 'Password must contain at least one upper case letter',
  })
  @Matches(new RegExp("(?=.*[#%'*/<()>}{:`;,!& .?_$+-])"), {
    message: 'Password must contain at least one special character',
  })
  Password: string;
}
