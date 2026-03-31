import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  
  // Endpoints de autenticação e registro de usuários
  @Post('register')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiCreatedResponse({ description: 'Usuário registrado com sucesso' })
  @ApiBadRequestResponse({ description: 'Dados inválidos para registro' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
   
  // Endpoint de login para autenticar usuários e gerar tokens JWT
  @Post('login')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Autenticar usuário com email e senha' })
  @ApiOkResponse({ description: 'Login realizado com sucesso' })
  @ApiUnauthorizedResponse({ description: 'Credenciais inválidas' })
  @ApiBadRequestResponse({ description: 'Dados inválidos para login' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
  
  // Endpoint para renovar tokens JWT usando refresh tokens
  @Post('refresh')
  @ApiOperation({ summary: 'Gerar novo access token com refresh token' })
  @ApiOkResponse({ description: 'Token renovado com sucesso' })
  @ApiUnauthorizedResponse({ description: 'Refresh token inválido ou expirado' })
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }
  
  // endpoint de teste para verificar se o backend está funcionando corretamente
  @Get('test')
  @ApiOperation({ summary: 'Teste simples de funcionamento do backend' })
  @ApiOkResponse({ description: 'Backend funcionando corretamente' })
  test() {
    return { message: 'Backend funcionando' };
  }
}