import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProjectService } from '../../../core/services/project.service';
import { ProjectStatus } from '../../../core/models/project.model';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatDatepickerModule, MatNativeDateModule,
    MatButtonModule, MatProgressSpinnerModule
  ],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss'
})
export class ProjectFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  projectId: number | null = null;
  loading = false;
  error: string | null = null;

  statusOptions = [
    { value: ProjectStatus.Planned, label: 'Planificado' },
    { value: ProjectStatus.InProgress, label: 'En progreso' },
    { value: ProjectStatus.Completed, label: 'Completado' },
    { value: ProjectStatus.Cancelled, label: 'Cancelado' }
  ];

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: [''],
    startDate: [new Date(), Validators.required],
    endDate: [null as Date | null],
    status: [ProjectStatus.Planned, Validators.required]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.projectId = Number(id);
      this.loadProject(this.projectId);
    }
  }

  loadProject(id: number): void {
    this.loading = true;
    this.projectService.getById(id).subscribe({
      next: (project) => {
        this.form.patchValue({
          name: project.name,
          description: project.description ?? '',
          startDate: new Date(project.startDate),
          endDate: project.endDate ? new Date(project.endDate) : null,
          status: project.status
        });
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el proyecto.';
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
      name: value.name!,
      description: value.description || undefined,
      startDate: value.startDate!.toISOString(),
      endDate: value.endDate ? value.endDate.toISOString() : undefined,
      status: value.status!
    };

    this.loading = true;
    this.error = null;

        const request: Observable<unknown> = this.projectId
      ? this.projectService.update(this.projectId, payload)
      : this.projectService.create(payload);

    request.subscribe({
      next: () => this.router.navigate(['/projects']),
      error: () => {
        this.error = 'No se pudo guardar el proyecto.';
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/projects']);
  }
}