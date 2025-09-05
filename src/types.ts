export interface TaskType {
  id: number | string;
  name: string;
  color: string;
  description?: string;
  group_id: number | string | null;
  order: number;
}

export interface TaskGroup {
  id: number | string;
  name: string;
  color?: string;
  order: number;
}

export interface TaskTypeFormData {
  name: string;
  color: string;
  description: string;
  group_id: number | string | null;
}