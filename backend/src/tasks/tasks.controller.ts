import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserDto } from '../auth/dto/user-dto';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from '@prisma/client';

@ApiTags('Tasks')  // Agrupa no Swagger
@Controller('tasks')
@UseGuards(JwtAuthGuard)  // Protege TODO controller
@ApiBearerAuth('JWT-auth')  // Swagger auth button
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Cria task em projeto (owner only)' })
  create(@Body() createTaskDto: CreateTaskDto, @GetUser() user: UserDto) {
    return this.tasksService.create({ ...createTaskDto, ownerId: user.id });
  }

  @Get()
  @ApiOperation({ summary: 'Lista SUAS tasks (por ownerId)' })
  findAll(@GetUser() user: UserDto) {
    return this.tasksService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhes task (owner only)' })
  findOne(@Param('id') id: string, @GetUser() user: UserDto) {
    return this.tasksService.findOne(+id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza task (status/dueDate, owner only)' })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @GetUser() user: UserDto) {
    return this.tasksService.update(+id, updateTaskDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove task (owner only)' })
  remove(@Param('id') id: string, @GetUser() user: UserDto) {
    return this.tasksService.remove(+id, user.id);
  }

  @Get('my-tasks')
  @ApiQuery({ name: 'status', enum: TaskStatus, required: false })
  @ApiOperation({ summary: 'Minhas tasks como assignee (filtros)' })
  findMyTasks(@GetUser() user: UserDto, @Query('status') status?: TaskStatus) {
    return this.tasksService.findByAssignee(user.id, { status });
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Tasks de projeto (kanban, owner project)' })
  findByProject(@Param('projectId') projectId: string, @GetUser() user: UserDto) {
    return this.tasksService.findByProject(+projectId, user.id);
  }
}
