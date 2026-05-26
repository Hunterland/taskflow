import { Controller, Get, Patch, Param, Body, UseGuards, Query } from '@nestjs/common';
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
import { SearchUsersQueryDto } from './dto/search-users-query.dto';
import { UserOptionResponseDto } from './dto/user-option-response.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth('JWT')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Obter dados do usuário autenticado' })
  @ApiOkResponse({
    description: 'Usuário autenticado retornado com sucesso',
    type: UserDto,
  })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  findMe(@GetUser() user: UserDto) {
    return this.usersService.findById(user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Listar todos os usuários (apenas ADMIN)' })
  @ApiOkResponse({
    description: 'Lista de usuários retornada com sucesso',
    type: UserDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Acesso permitido apenas para ADMIN' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('options')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Buscar usuários por nome ou e-mail para seleção em projetos (apenas ADMIN)',
  })
  @ApiOkResponse({
    description: 'Lista de opções de usuários retornada com sucesso',
    type: UserOptionResponseDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Acesso permitido apenas para ADMIN' })
  findOptions(@Query() query: SearchUsersQueryDto) {
    return this.usersService.findOptions(query);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Atualizar usuário por ID (apenas ADMIN)' })
  @ApiOkResponse({
    description: 'Usuário atualizado com sucesso',
    type: UserDto,
  })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Acesso permitido apenas para ADMIN' })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }
}