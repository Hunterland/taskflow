import { Injectable } from '@angular/core';
import {
  projectsControllerCreate,
  projectsControllerFindAll,
  projectsControllerFindOne,
  projectsControllerUpdate,
  projectsControllerRemove,
} from '../api/generated/projects/projects';
import type {
  CreateProjectDto,
  ProjectResponseDto,
  UpdateProjectDto,
} from '../api/generated/model';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  findAll(): Promise<ProjectResponseDto[]> {
    return projectsControllerFindAll();
  }

  findOne(id: string): Promise<ProjectResponseDto> {
    return projectsControllerFindOne(id);
  }

  create(dto: CreateProjectDto): Promise<ProjectResponseDto> {
    return projectsControllerCreate(dto);
  }

  update(id: string, dto: UpdateProjectDto): Promise<ProjectResponseDto> {
    return projectsControllerUpdate(id, dto);
  }

  remove(id: string): Promise<ProjectResponseDto> {
    return projectsControllerRemove(id);
  }
}
