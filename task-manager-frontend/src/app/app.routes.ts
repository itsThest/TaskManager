import { Routes } from '@angular/router';

export const routes: Routes = [
    
 { path: '', redirectTo: 'projects', pathMatch: 'full' },
  {
    path: 'projects',
    loadComponent: () => import('./features/projects/project-list/project-list.component')
      .then(m => m.ProjectListComponent)
  },

 {
    path: 'projects/new',
    loadComponent: () => import('./features/projects/project-form/project-form.component')
      .then(m => m.ProjectFormComponent)
  },
  {
    path: 'projects/:id/edit',
    loadComponent: () => import('./features/projects/project-form/project-form.component')
      .then(m => m.ProjectFormComponent)
  }

];
