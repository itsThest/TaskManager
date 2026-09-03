import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TaskItem, TaskRequest } from '../models/task.model';
import { PagedResult } from '../models/project.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getByProject(projectId: number, page: number, pageSize: number): Observable<PagedResult<TaskItem>> {
    const params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    return this.http.get<PagedResult<TaskItem>>(
      `${this.apiUrl}/projects/${projectId}/tasks`,
      { params }
    );
  }

  getById(id: number): Observable<TaskItem> {
    return this.http.get<TaskItem>(`${this.apiUrl}/tasks/${id}`);
  }

  create(task: TaskRequest): Observable<TaskItem> {
    return this.http.post<TaskItem>(`${this.apiUrl}/tasks`, task);
  }

  update(id: number, task: TaskRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/tasks/${id}`, task);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tasks/${id}`);
  }
}