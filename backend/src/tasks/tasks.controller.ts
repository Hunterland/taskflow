import { UseGuards} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserDto } from '../auth/dto/user-dto';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';



import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }

  @Get('my-tasks') // GET /tasks/my-tasks?status=DONE
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'status', enum: TaskStatus })
  async findMyTasks(
    @GetUser() user: UserDto,
    @Query('status') status?: TaskStatus,
  ) {
    return this.tasksService.findByAssignee(user.id, { status });
  }

  @Get('project/:projectId')
  @UseGuards(JwtAuthGuard) 
  @ApiBearerAuth()
  findByProject(
    @Param('projectId') projectId: string,
    @GetUser() user: UserDto,
  ) {
    return this.tasksService.findByProject(+projectId, user.id);
  }
}
