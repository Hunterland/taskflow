import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './project-details.html',
  styleUrl: './project-details.css',
})
export class ProjectDetailsComponent {
  private route = inject(ActivatedRoute);

  projectId = this.route.snapshot.paramMap.get('id');
}
