import { IsDefined, IsEmail, IsString, MinLength } from 'class-validator';

export class UserLoginDto {
  @IsEmail({
    message: 'Email is not correct',
  })
  @IsDefined({ message: 'Email is mandatory attribute' })
  Email: string;
  @IsDefined({ message: 'Password is mandatory attribute' })
  @IsString({ message: 'Password is not String format' })
  @MinLength(6, { message: 'Password needs to be at least 6 characters long' })
  Password: string;
}
