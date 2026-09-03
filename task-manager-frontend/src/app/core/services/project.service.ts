import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Project, ProjectRequest, PagedResult } from '../models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/projects`;

  getAll(page: number, pageSize: number, name?: string): Observable<PagedResult<Project>> {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    if (name) {
      params = params.set('name', name);
    }

    return this.http.get<PagedResult<Project>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  create(project: ProjectRequest): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project);
  }

  update(id: number, project: ProjectRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, project);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}