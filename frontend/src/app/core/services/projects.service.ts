import { Injectable } from '@angular/core';
import {
  projectsControllerCreate,
  projectsControllerFindAll,
  projectsControllerFindOne,
  projectsControllerUpdate,
  projectsControllerRemove,
} from '../api/generated/projects/projects';
import { CreateProjectDto, UpdateProjectDto } from '../../../app/core/api/generated/model';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  findAll() {
    return projectsControllerFindAll();
  }

  findOne(id: string) {
    return projectsControllerFindOne(id);
  }

  create(dto: CreateProjectDto) {
    return projectsControllerCreate(dto);
  }

  update(id: string, dto: UpdateProjectDto) {
    return projectsControllerUpdate(id, dto);
  }

  remove(id: string) {
    return projectsControllerRemove(id);
  }
}
