import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserDto } from '../auth/dto/user-dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth('JWT')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  // endpoint para obter os dados do usuário autenticado usando o token JWT,
  //  e endpoints para listar e atualizar usuários,
  //  protegidos por guardas de autenticação e autorização (apenas ADMIN pode acessar)
  @Get('me')
  @ApiOperation({ summary: 'Obter dados do usuário autenticado' })
  @ApiOkResponse({ description: 'Usuário autenticado retornado com sucesso' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  findMe(@GetUser() user: UserDto) {
    return this.usersService.findById(user.id);
  }
  
  // endpoint para listar todos os usuários,
  // protegido por guardas de autenticação e autorização (apenas ADMIN pode acessar)
  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Listar todos os usuários (apenas ADMIN)' })
  @ApiOkResponse({ description: 'Lista de usuários retornada com sucesso' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Acesso permitido apenas para ADMIN' })
  findAll() {
    return this.usersService.findAll();
  }

  // endpoint para atualizar um usuário por ID, protegido por guardas de autenticação e autorização
  //  (apenas ADMIN pode acessar)
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Atualizar usuário por ID (apenas ADMIN)' })
  @ApiOkResponse({ description: 'Usuário atualizado com sucesso' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Acesso permitido apenas para ADMIN' })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }
}