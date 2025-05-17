export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bank_accounts: {
        Row: {
          account_name: string
          account_number: string
          account_type: string
          balance: number
          bank_name: string
          created_at: string
          currency: string
          id: string
          last_four: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_name: string
          account_number: string
          account_type: string
          balance?: number
          bank_name: string
          created_at?: string
          currency?: string
          id?: string
          last_four: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_name?: string
          account_number?: string
          account_type?: string
          balance?: number
          bank_name?: string
          created_at?: string
          currency?: string
          id?: string
          last_four?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      businesses: {
        Row: {
          address: string | null
          business_type: string | null
          city: string | null
          country: string | null
          created_at: string | null
          currency: string | null
          default_invoice_terms: string | null
          default_tax_percentage: number | null
          description: string | null
          email: string | null
          id: string
          industry: string | null
          legal_name: string | null
          logo_url: string | null
          name: string
          owner_id: string
          phone: string | null
          postal_code: string | null
          state: string | null
          tax_id: string | null
          type: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          business_type?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          default_invoice_terms?: string | null
          default_tax_percentage?: number | null
          description?: string | null
          email?: string | null
          id?: string
          industry?: string | null
          legal_name?: string | null
          logo_url?: string | null
          name: string
          owner_id: string
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          tax_id?: string | null
          type?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          business_type?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          default_invoice_terms?: string | null
          default_tax_percentage?: number | null
          description?: string | null
          email?: string | null
          id?: string
          industry?: string | null
          legal_name?: string | null
          logo_url?: string | null
          name?: string
          owner_id?: string
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          tax_id?: string | null
          type?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      deduction_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_percentage: boolean
          name: string
          rate: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_percentage?: boolean
          name: string
          rate?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_percentage?: boolean
          name?: string
          rate?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      employees: {
        Row: {
          created_at: string
          department: string | null
          email: string
          first_name: string
          hire_date: string
          hourly_rate: number | null
          id: string
          last_name: string
          phone: string | null
          position: string
          salary: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          email: string
          first_name: string
          hire_date?: string
          hourly_rate?: number | null
          id?: string
          last_name: string
          phone?: string | null
          position: string
          salary: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          department?: string | null
          email?: string
          first_name?: string
          hire_date?: string
          hourly_rate?: number | null
          id?: string
          last_name?: string
          phone?: string | null
          position?: string
          salary?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      expense_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          description: string | null
          expense_date: string
          id: string
          payment_method: string | null
          receipt_url: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          description?: string | null
          expense_date?: string
          id?: string
          payment_method?: string | null
          receipt_url?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          description?: string | null
          expense_date?: string
          id?: string
          payment_method?: string | null
          receipt_url?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      incomes: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          income_date: string
          notes: string | null
          source: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          id?: string
          income_date: string
          notes?: string | null
          source: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          income_date?: string
          notes?: string | null
          source?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      invitations: {
        Row: {
          business_id: string
          created_at: string | null
          email: string
          employee_role: string | null
          expires_at: string | null
          id: string
          inviter_id: string
          role: string
          status: string
        }
        Insert: {
          business_id: string
          created_at?: string | null
          email: string
          employee_role?: string | null
          expires_at?: string | null
          id?: string
          inviter_id: string
          role: string
          status?: string
        }
        Update: {
          business_id?: string
          created_at?: string | null
          email?: string
          employee_role?: string | null
          expires_at?: string | null
          id?: string
          inviter_id?: string
          role?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitations_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          invoice_id: string
          price: number
          quantity: number
          updated_at: string
        }
        Insert: {
          amount?: number
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          price?: number
          quantity?: number
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          price?: number
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_invoice_items_invoices"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string
          customer_id: string | null
          due_date: string
          id: string
          invoice_number: string
          issue_date: string
          notes: string | null
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          due_date: string
          id?: string
          invoice_number: string
          issue_date?: string
          notes?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          due_date?: string
          id?: string
          invoice_number?: string
          issue_date?: string
          notes?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_invoices_customers"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      job_requests: {
        Row: {
          client_id: string
          converted_to_project: string | null
          created_at: string
          description: string
          due_date: string | null
          id: string
          priority: string | null
          requested_services: string[] | null
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id: string
          converted_to_project?: string | null
          created_at?: string
          description: string
          due_date?: string | null
          id?: string
          priority?: string | null
          requested_services?: string[] | null
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string
          converted_to_project?: string | null
          created_at?: string
          description?: string
          due_date?: string | null
          id?: string
          priority?: string | null
          requested_services?: string[] | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_requests_converted_to_project_fkey"
            columns: ["converted_to_project"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_applications: {
        Row: {
          created_at: string
          employee_id: string
          end_date: string
          id: string
          leave_type: string
          reason: string | null
          start_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          employee_id: string
          end_date: string
          id?: string
          leave_type: string
          reason?: string | null
          start_date: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          employee_id?: string
          end_date?: string
          id?: string
          leave_type?: string
          reason?: string | null
          start_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_applications_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_deductions: {
        Row: {
          amount: number
          created_at: string
          deduction_type_id: string
          id: string
          payroll_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          deduction_type_id: string
          id?: string
          payroll_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          deduction_type_id?: string
          id?: string
          payroll_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payroll_deductions_deduction_type_id_fkey"
            columns: ["deduction_type_id"]
            isOneToOne: false
            referencedRelation: "deduction_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_deductions_payroll_id_fkey"
            columns: ["payroll_id"]
            isOneToOne: false
            referencedRelation: "payrolls"
            referencedColumns: ["id"]
          },
        ]
      }
      payrolls: {
        Row: {
          created_at: string
          deductions: number
          employee_id: string
          gross_amount: number
          id: string
          net_amount: number
          notes: string | null
          pay_period_end: string
          pay_period_start: string
          payment_date: string
          status: string
          taxes: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deductions?: number
          employee_id: string
          gross_amount: number
          id?: string
          net_amount: number
          notes?: string | null
          pay_period_end: string
          pay_period_start: string
          payment_date?: string
          status?: string
          taxes?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deductions?: number
          employee_id?: string
          gross_amount?: number
          id?: string
          net_amount?: number
          notes?: string | null
          pay_period_end?: string
          pay_period_start?: string
          payment_date?: string
          status?: string
          taxes?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payrolls_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          belongs_to_business_id: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: string
          subscription_tier: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          belongs_to_business_id?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string
          subscription_tier?: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          belongs_to_business_id?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string
          subscription_tier?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      project_files: {
        Row: {
          created_at: string
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          project_id: string | null
          task_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          project_id?: string | null
          task_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          project_id?: string | null
          task_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_files_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          budget: number | null
          client_id: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          name: string
          start_date: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          budget?: number | null
          client_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          name: string
          start_date?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          budget?: number | null
          client_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          name?: string
          start_date?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string
          delivery_time: number | null
          description: string | null
          id: string
          is_hourly: boolean | null
          name: string
          rate: number
          tax_rate: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          delivery_time?: number | null
          description?: string | null
          id?: string
          is_hourly?: boolean | null
          name: string
          rate: number
          tax_rate?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          delivery_time?: number | null
          description?: string | null
          id?: string
          is_hourly?: boolean | null
          name?: string
          rate?: number
          tax_rate?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      task_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          task_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          task_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          billable: boolean | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          name: string
          priority: string | null
          project_id: string | null
          service_id: string | null
          start_date: string | null
          status: string
          time_spent: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          billable?: boolean | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          name: string
          priority?: string | null
          project_id?: string | null
          service_id?: string | null
          start_date?: string | null
          status?: string
          time_spent?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          billable?: boolean | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          name?: string
          priority?: string | null
          project_id?: string | null
          service_id?: string | null
          start_date?: string | null
          status?: string
          time_spent?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      taxes: {
        Row: {
          amount: number
          category: string
          created_at: string
          due_date: string
          id: string
          name: string
          notes: string | null
          payment_date: string | null
          period_end: string | null
          period_start: string | null
          status: string
          tax_authority: string | null
          tax_id_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          due_date: string
          id?: string
          name: string
          notes?: string | null
          payment_date?: string | null
          period_end?: string | null
          period_start?: string | null
          status: string
          tax_authority?: string | null
          tax_id_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          due_date?: string
          id?: string
          name?: string
          notes?: string | null
          payment_date?: string | null
          period_end?: string | null
          period_start?: string | null
          status?: string
          tax_authority?: string | null
          tax_id_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      time_logs: {
        Row: {
          created_at: string
          duration: number | null
          end_time: string | null
          id: string
          notes: string | null
          start_time: string
          task_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration?: number | null
          end_time?: string | null
          id?: string
          notes?: string | null
          start_time: string
          task_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration?: number | null
          end_time?: string | null
          id?: string
          notes?: string | null
          start_time?: string
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_logs_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          bank_account_id: string
          category: string | null
          created_at: string
          description: string
          id: string
          transaction_date: string
          transaction_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          bank_account_id: string
          category?: string | null
          created_at?: string
          description: string
          id?: string
          transaction_date: string
          transaction_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          bank_account_id?: string
          category?: string | null
          created_at?: string
          description?: string
          id?: string
          transaction_date?: string
          transaction_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_invitation: {
        Args: {
          p_inviter_id: string
          p_business_id: string
          p_email: string
          p_role: string
          p_employee_role: string
          p_status: string
        }
        Returns: undefined
      }
      employee_has_permission: {
        Args: { permission: string }
        Returns: boolean
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      user_belongs_to_business: {
        Args: { business_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
