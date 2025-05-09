
export interface Project {
  id: string;
  user_id: string;
  client_id: string | null;
  name: string;
  description: string | null;
  start_date: string | null;
  due_date: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  budget: number | null;
  created_at: string;
  updated_at: string;
  // Join data
  customers?: Customer;
}

export type CreateProjectInput = Omit<Project, 'id' | 'created_at' | 'updated_at' | 'user_id'>;
export type UpdateProjectInput = Partial<CreateProjectInput>;

// Related types
export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
}

export interface Task {
  id: string;
  user_id: string;
  project_id: string | null;
  service_id: string | null;
  name: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to: string | null;
  start_date: string | null;
  due_date: string | null;
  time_spent: number;
  billable: boolean;
  created_at: string;
  updated_at: string;
}

export type CreateTaskInput = Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'time_spent'> & {
  time_spent?: number;
};

export type UpdateTaskInput = Partial<CreateTaskInput>;

export interface TaskComment {
  id: string;
  user_id: string;
  task_id: string;
  content: string;
  created_at: string;
}

export interface Service {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  rate: number;
  is_hourly: boolean | null;
  delivery_time: number | null;
  tax_rate: number | null;
  created_at: string;
  updated_at: string;
}

export type CreateServiceInput = Omit<Service, 'id' | 'created_at' | 'updated_at' | 'user_id'>;
export type UpdateServiceInput = Partial<CreateServiceInput>;

export interface JobRequest {
  id: string;
  user_id: string;
  client_id: string;
  title: string;
  description: string;
  requested_services: string[] | null;
  due_date: string | null;
  priority: 'low' | 'medium' | 'high' | 'urgent' | null;
  status: 'new' | 'approved' | 'rejected' | 'in_progress' | 'completed';
  converted_to_project: string | null;
  created_at: string;
  updated_at: string;
  // Join data
  customers?: Customer;
}

export type CreateJobRequestInput = Omit<JobRequest, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'status' | 'converted_to_project'>;
export type UpdateJobRequestInput = Partial<Omit<JobRequest, 'id' | 'created_at' | 'updated_at' | 'user_id'>>;

export interface ProjectFile {
  id: string;
  user_id: string;
  project_id: string | null;
  task_id: string | null;
  file_name: string;
  file_url: string;
  file_size: number | null;
  file_type: string | null;
  created_at: string;
}

export interface TimeLog {
  id: string;
  user_id: string;
  task_id: string;
  start_time: string;
  end_time: string | null;
  duration: number | null;
  notes: string | null;
  created_at: string;
}
