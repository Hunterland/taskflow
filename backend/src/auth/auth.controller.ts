import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import { Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Endpoints para registro e login usando email e senha,
  // com validação de dados usando DTOs e pipes de validação
  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // login usando email e senha,
  // com validação de dados usando DTOs e pipes de validação
  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // endpoint para refresh de token JWT usando refresh token
  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  // endpoint de teste para verificar se o backend está funcionando
  @Get('test')
  test() {
    return { message: 'Backend funcionando' };
  }
}
