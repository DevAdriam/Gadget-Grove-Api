import {
  BadRequestException,
  Body,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Responser } from 'src/category/libs/Responser';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAdminDto, updateAdminDto } from './dto/admin.dto';
import * as argon from 'argon2';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllAdmins() {
    try {
      const allAdmins = await this.prisma.admin.findMany();

      if (!allAdmins.length) {
        return Responser({
          statusCode: 204,
          Message: 'No admins are created yet!Try & create One!',
          devMessage: 'success! no admins are created yet',
          body: {
            allAdmins,
          },
        });
      } else {
        return Responser({
          statusCode: 200,
          Message: 'All admins got successfully!',
          devMessage: 'success!',
          body: {
            allAdmins,
          },
        });
      }
    } catch (err) {
      throw new HttpException(
        {
          message: 'Failed to get all admins',
          devMessage: 'Failed to get all admins',
        },
        401,
      );
    }
  }

  async getAdminDetail(id: string) {
    console.log(id);
    try {
      const adminExist = await this.prisma.admin.findUnique({
        where: {
          id,
        },
        include: {
          vouchers: true,
        },
      });

      console.log(adminExist);

      return Responser({
        statusCode: 200,
        Message: 'get admin detail successfully!',
        devMessage: 'success',
        body: adminExist,
      });
    } catch (err) {
      throw new HttpException(
        {
          message: 'admin not found',
          devMessage: 'something wrong with your id',
        },
        400,
      );
    }
  }

  async createAdmin(dto: CreateAdminDto) {
    const { email, password, username } = dto;
    if (!email || !password || !username)
      throw new BadRequestException('Please fill all input fields');

    try {
      const adminExist = await this.prisma.admin.findFirst({
        where: {
          email: dto.email,
        },
      });

      if (adminExist) throw new UnauthorizedException('admin already created!');

      const hashedpw = await argon.hash(password);
      const newAdmin = await this.prisma.admin.create({
        data: {
          email,
          username,
          password: hashedpw,
        },
      });

      return Responser({
        statusCode: 201,
        Message: 'new admin created!',
        devMessage: 'admin create success!',
        body: newAdmin,
      });
    } catch (err) {
      throw new HttpException(
        {
          message: 'failed to create admin',
          devMessage: 'bad request',
        },
        400,
      );
    }
  }

  async updateAdmin(id: string, dto: updateAdminDto) {
    try {
      const updateAdmin = await this.prisma.admin.update({
        where: {
          id,
        },
        data: {
          email: dto.email,
          username: dto.username,
        },
      });

      return Responser({
        statusCode: 201,
        Message: 'admin updated succesfully!',
        devMessage: 'admin updated success!',
        body: updateAdmin,
      });
    } catch (err) {
      throw new HttpException(
        {
          message: 'update failed',
          devMessage: 'update failed!',
        },
        401,
      );
    }
  }

  async deleteAdmin(id: string) {
    try {
      const deletedAdmin = await this.prisma.admin.delete({
        where: {
          id,
        },
      });

      return Responser({
        statusCode: 200,
        devMessage: 'deleted admin successfully',
        Message: 'admin deleted successfully!',
        body: deletedAdmin,
      });
    } catch (err) {
      throw new HttpException(
        {
          message: 'failed to delete Admin',
          devMessage: 'Cannot delete admin',
        },
        400,
      );
    }
  }
}
