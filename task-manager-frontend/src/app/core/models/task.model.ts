export enum TaskItemStatus {
  Pending = 0,
  InProgress = 1,
  Done = 2
}

export enum TaskPriority {
  Low = 0,
  Medium = 1,
  High = 2
}

export interface TaskItem {
  id: number;
  title: string;
  description?: string;
  status: TaskItemStatus;
  priority: TaskPriority;
  createdAt: string;
  projectId: number;
}

export interface TaskRequest {
  title: string;
  description?: string;
  status: TaskItemStatus;
  priority: TaskPriority;
  projectId: number;
}