export enum ProjectStatus {
  Planned = 0,
  InProgress = 1,
  Completed = 2,
  Cancelled = 3
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  status: ProjectStatus;
}

export interface ProjectRequest {
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  status: ProjectStatus;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}