import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ example: 'admin1' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'admin123@gmail.com' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'admin123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginAdminDto {
  @ApiProperty({ example: 'admin123@gmail.com' })
  email: string;

  @ApiProperty({ example: 'admin123' })
  password: string;
}

export class updateAdminDto {
  @ApiProperty({ required: false })
  email: string;

  @ApiProperty({ required: false })
  username: string;
}
