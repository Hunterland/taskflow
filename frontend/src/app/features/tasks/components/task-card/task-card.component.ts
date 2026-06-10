import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import type { TaskResponseDto } from '../../../../core/api/generated/model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css',
})
export class TaskCardComponent {
  task = input.required<TaskResponseDto>();

  edit = output<number>();
  remove = output<number>();
  open = output<number>();

  onEdit(): void {
    this.edit.emit(this.task().id);
  }

  onRemove(): void {
    this.remove.emit(this.task().id);
  }

  onOpen(): void {
    this.open.emit(this.task().id);
  }

  assigneeName(): string {
    return this.task().assignee?.name ?? 'Sem responsável';
  }

  projectName(): string {
    return this.task().project?.name ?? 'Sem projeto';
  }
}
