import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TaskService } from '../../../core/services/task.service';
import { TaskItemStatus, TaskPriority } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatProgressSpinnerModule
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  taskId: number | null = null;
  projectId!: number;
  loading = false;
  error: string | null = null;

  statusOptions = [
    { value: TaskItemStatus.Pending, label: 'Pendiente' },
    { value: TaskItemStatus.InProgress, label: 'En progreso' },
    { value: TaskItemStatus.Done, label: 'Completada' }
  ];

  priorityOptions = [
    { value: TaskPriority.Low, label: 'Baja' },
    { value: TaskPriority.Medium, label: 'Media' },
    { value: TaskPriority.High, label: 'Alta' }
  ];

  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(150)]],
    description: [''],
    status: [TaskItemStatus.Pending, Validators.required],
    priority: [TaskPriority.Medium, Validators.required]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const projectIdParam = this.route.snapshot.paramMap.get('projectId');

    if (id) {
      // Modo edición: se carga la tarea y de ella se obtiene el proyecto
      this.taskId = Number(id);
      this.loadTask(this.taskId);
    } else {
      // Modo creación: el proyecto viene en la URL
      this.projectId = Number(projectIdParam);
    }
  }

  loadTask(id: number): void {
    this.loading = true;
    this.taskService.getById(id).subscribe({
      next: (task) => {
        this.projectId = task.projectId;
        this.form.patchValue({
          title: task.title,
          description: task.description ?? '',
          status: task.status,
          priority: task.priority
        });
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar la tarea.';
        this.loading = false;
      }
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload = {
      title: value.title!,
      description: value.description || undefined,
      status: value.status!,
      priority: value.priority!,
      projectId: this.projectId
    };

    this.loading = true;
    this.error = null;

    const request: Observable<unknown> = this.taskId
      ? this.taskService.update(this.taskId, payload)
      : this.taskService.create(payload);

    request.subscribe({
      next: () => this.router.navigate(['/projects', this.projectId, 'tasks']),
      error: () => {
        this.error = 'No se pudo guardar la tarea.';
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/projects', this.projectId, 'tasks']);
  }
}