import { Body, Controller, HttpCode, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginAuth, registerAuth } from './dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('login')
  @ApiOperation({
    summary: 'user login',
  })
  @ApiBody({
    description: 'login payload',
    type: loginAuth,
  })
  Login(@Body() dto: loginAuth) {
    return this.authService.login(dto);
  }

  @Post('register')
  @ApiOperation({ summary: 'user register' })
  @ApiBody({
    description: 'Register payload',
    type: registerAuth,
  })
  Register(@Body() dto: registerAuth) {
    return this.authService.register(dto);
  }
}
