import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TaskService } from '../../../core/services/task.service';
import { TaskItem, TaskItemStatus, TaskPriority } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatPaginatorModule,
    MatButtonModule, MatProgressSpinnerModule, MatSnackBarModule
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  private taskService = inject(TaskService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  projectId!: number;
  tasks: TaskItem[] = [];
  displayedColumns = ['title', 'description', 'status', 'priority', 'createdAt', 'actions'];

  totalCount = 0;
  page = 1;
  pageSize = 10;

  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    // El id del proyecto viene de la URL: /projects/:id/tasks
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;

    this.taskService.getByProject(this.projectId, this.page, this.pageSize).subscribe({
      next: (result) => {
        this.tasks = result.items;
        this.totalCount = result.totalCount;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar las tareas.';
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.load();
  }

  statusLabel(status: TaskItemStatus): string {
    const labels = {
      [TaskItemStatus.Pending]: 'Pendiente',
      [TaskItemStatus.InProgress]: 'En progreso',
      [TaskItemStatus.Done]: 'Completada'
    };
    return labels[status] ?? 'Desconocido';
  }

  priorityLabel(priority: TaskPriority): string {
    const labels = {
      [TaskPriority.Low]: 'Baja',
      [TaskPriority.Medium]: 'Media',
      [TaskPriority.High]: 'Alta'
    };
    return labels[priority] ?? 'Desconocida';
  }

  newTask(): void {
    this.router.navigate(['/projects', this.projectId, 'tasks', 'new']);
  }

  editTask(id: number): void {
    this.router.navigate(['/tasks', id, 'edit']);
  }

  deleteTask(id: number): void {
    if (!confirm('¿Seguro que deseas eliminar esta tarea?')) return;

    this.taskService.delete(id).subscribe({
      next: () => {
        this.snackBar.open('Tarea eliminada', 'Cerrar', { duration: 3000 });
        this.load();
      },
      error: () => {
        this.snackBar.open('No se pudo eliminar la tarea.', 'Cerrar', { duration: 5000 });
      }
    });
  }

  backToProjects(): void {
    this.router.navigate(['/projects']);
  }
}