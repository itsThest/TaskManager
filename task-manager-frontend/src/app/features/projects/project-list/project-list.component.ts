import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProjectService } from '../../../core/services/project.service';
import { Project, ProjectStatus } from '../../../core/models/project.model';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatTableModule, MatPaginatorModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatProgressSpinnerModule
  ],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})
export class ProjectListComponent implements OnInit {
  private projectService = inject(ProjectService);

  projects: Project[] = [];
  displayedColumns = ['name', 'description', 'startDate', 'status', 'actions'];

  totalCount = 0;
  page = 1;
  pageSize = 10;
  nameFilter = '';

  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;

    this.projectService.getAll(this.page, this.pageSize, this.nameFilter).subscribe({
      next: (result) => {
        this.projects = result.items;
        this.totalCount = result.totalCount;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los proyectos. Verifica que el servidor esté disponible.';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.page = 1;
    this.load();
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.load();
  }

  statusLabel(status: ProjectStatus): string {
    const labels = {
      [ProjectStatus.Planned]: 'Planificado',
      [ProjectStatus.InProgress]: 'En progreso',
      [ProjectStatus.Completed]: 'Completado',
      [ProjectStatus.Cancelled]: 'Cancelado'
    };
    return labels[status] ?? 'Desconocido';
  }
}