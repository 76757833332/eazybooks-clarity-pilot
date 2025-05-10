
export type Employee = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  hire_date: string;
  position: string;
  department?: string;
  salary: number;
  hourly_rate?: number;
  status: 'active' | 'inactive' | 'on_leave' | 'terminated';
  created_at: string;
  updated_at: string;
};

export type NewEmployee = Omit<Employee, 'id' | 'created_at' | 'updated_at'>;

export type UpdateEmployee = Partial<NewEmployee>;
