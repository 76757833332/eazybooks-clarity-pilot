
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'canceled';

export type LeaveType = 'vacation' | 'sick' | 'personal' | 'bereavement' | 'unpaid';

export type LeaveApplication = {
  id: string;
  employee_id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  leave_type: string;
  reason?: string;
  status: LeaveStatus;
  created_at: string;
  updated_at: string;
};

export type NewLeaveApplication = Omit<LeaveApplication, 'id' | 'status' | 'created_at' | 'updated_at'>;
