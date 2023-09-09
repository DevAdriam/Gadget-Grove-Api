import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { loginAuth, registerAuth } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { Responser } from 'src/category/libs/Responser';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}
  async login(dto: loginAuth) {
    try {
      const { email, password } = dto;
      if (!email || !password)
        throw new BadRequestException('Please fill all input fields!');

      const userExist = await this.prisma.customer.findUnique({
        where: {
          email,
        },
      });
      if (!userExist) throw new UnauthorizedException('User not found!');

      const verifyPw = await argon.verify(userExist.password, password);
      if (!verifyPw) throw new UnauthorizedException('wrong password');

      const tokens = await this.getTokens({
        id: userExist.id,
        email: userExist.email,
      });

      const loginUser = await this.prisma.customer.update({
        where: {
          email,
        },
        data: {
          refreshToken: tokens?.refreshToken,
        },
      });

      return Responser({
        statusCode: 200,
        Message: 'User login success!',
        devMessage: 'Login success!',
        body: {
          accessToken: tokens.accessToken,
          loginUser,
        },
      });
    } catch (err) {
      throw new UnauthorizedException('Wrong credentials');
    }
  }

  async register(dto: registerAuth) {
    try {
      // hayhay
      const { username, email, phone, password, address } = dto;

      if (!username || !email || !phone || !address)
        throw new BadRequestException('Please Filled all input fields');

      if (!password) throw new BadRequestException('password not found!');
      const hashedPw = await argon.hash(password);

      const newUser = await this.prisma.customer.create({
        data: {
          username,
          email,
          phone,
          password: hashedPw,
          shippingAddress: address,
        },
        include: {
          vouchers: true,
          discountCode: true,
          orders: true,
        },
      });

      return Responser({
        statusCode: 201,
        Message: 'User register success!',
        devMessage: 'new user created!',
        body: {
          newUser,
        },
      });
    } catch (err) {
      throw new HttpException(
        {
          message: 'Registration Failed!',
          devMessage: 'Failed to register',
        },
        400,
      );
    }
  }

  async divideRole(email, role) {
    try {
      const updUserRole = await this.prisma.customer.update({
        where: {
          email,
        },
        data: {
          ROLE: role,
        },
      });

      return Responser({
        statusCode: 200,
        Message: 'role updated successfully',
        devMessage: 'role updated',
        body: {
          updUserRole,
        },
      });
    } catch (err) {
      throw new HttpException(
        {
          message: 'Cannot choose role!',
          devMessage: 'Failed to choose role',
        },
        401,
      );
    }
  }

  private async getTokens({ id, email }) {
    if (!id || !email) throw new BadRequestException();

    const payload = { id, email };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: process.env.SECRET_KEY,
        expiresIn: '1d',
      }),

      this.jwt.signAsync(
        { id },
        {
          secret: process.env.REFRESH_KEY,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
