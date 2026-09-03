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
    path: 'projects/:projectId/tasks/new',
    loadComponent: () => import('./features/tasks/task-form/task-form.component')
      .then(m => m.TaskFormComponent)
  },
  {
    path: 'projects/:id/tasks',
    loadComponent: () => import('./features/tasks/task-list/task-list.component')
      .then(m => m.TaskListComponent)
  },
  {
    path: 'projects/:id/edit',
    loadComponent: () => import('./features/projects/project-form/project-form.component')
      .then(m => m.ProjectFormComponent)
  },
  
  {
    path: 'tasks/:id/edit',
    loadComponent: () => import('./features/tasks/task-form/task-form.component')
      .then(m => m.TaskFormComponent)
  }
  
   
  

];
