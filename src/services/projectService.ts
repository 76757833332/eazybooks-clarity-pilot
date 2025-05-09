
import { supabase } from "@/integrations/supabase/client";
import { 
  Project, 
  CreateProjectInput, 
  UpdateProjectInput,
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  Service,
  CreateServiceInput,
  UpdateServiceInput,
  JobRequest,
  CreateJobRequestInput,
  UpdateJobRequestInput
} from "@/types/project";

export const projectService = {
  // Projects
  getProjects: async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from("projects")
      .select("*, customers:client_id(*)")
      .eq("user_id", user.user.id)
      .order("created_at", { ascending: false });
      
    if (error) throw error;
    return data as Project[];
  },
  
  getProjectById: async (id: string) => {
    const { data, error } = await supabase
      .from("projects")
      .select("*, customers:client_id(*)")
      .eq("id", id)
      .single();
      
    if (error) throw error;
    return data as Project;
  },
  
  createProject: async (project: CreateProjectInput) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from("projects")
      .insert([{ ...project, user_id: user.user.id }])
      .select("*")
      .single();
      
    if (error) throw error;
    return data as Project;
  },
  
  updateProject: async (id: string, project: UpdateProjectInput) => {
    const { data, error } = await supabase
      .from("projects")
      .update(project)
      .eq("id", id)
      .select("*")
      .single();
      
    if (error) throw error;
    return data as Project;
  },
  
  deleteProject: async (id: string) => {
    // Will cascade delete tasks and related records
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    return true;
  },
  
  // Tasks
  getTasksByProject: async (projectId: string) => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("project_id", projectId)
      .order("due_date", { ascending: true });
      
    if (error) throw error;
    return data as Task[];
  },
  
  getAllTasks: async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.user.id)
      .order("due_date", { ascending: true });
      
    if (error) throw error;
    return data as Task[];
  },
  
  getTaskById: async (id: string) => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .single();
      
    if (error) throw error;
    return data as Task;
  },
  
  createTask: async (task: CreateTaskInput) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from("tasks")
      .insert([{ ...task, user_id: user.user.id, time_spent: task.time_spent || 0 }])
      .select("*")
      .single();
      
    if (error) throw error;
    return data as Task;
  },
  
  updateTask: async (id: string, task: UpdateTaskInput) => {
    const { data, error } = await supabase
      .from("tasks")
      .update(task)
      .eq("id", id)
      .select("*")
      .single();
      
    if (error) throw error;
    return data as Task;
  },
  
  deleteTask: async (id: string) => {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    return true;
  },
  
  // Services
  getServices: async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("user_id", user.user.id)
      .order("name");
      
    if (error) throw error;
    return data as Service[];
  },
  
  getServiceById: async (id: string) => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("id", id)
      .single();
      
    if (error) throw error;
    return data as Service;
  },
  
  createService: async (service: CreateServiceInput) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from("services")
      .insert([{ ...service, user_id: user.user.id }])
      .select("*")
      .single();
      
    if (error) throw error;
    return data as Service;
  },
  
  updateService: async (id: string, service: UpdateServiceInput) => {
    const { data, error } = await supabase
      .from("services")
      .update(service)
      .eq("id", id)
      .select("*")
      .single();
      
    if (error) throw error;
    return data as Service;
  },
  
  deleteService: async (id: string) => {
    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    return true;
  },
  
  // Job Requests
  getJobRequests: async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from("job_requests")
      .select("*, customers:client_id(*)")
      .eq("user_id", user.user.id)
      .order("created_at", { ascending: false });
      
    if (error) throw error;
    return data as JobRequest[];
  },
  
  getJobRequestById: async (id: string) => {
    const { data, error } = await supabase
      .from("job_requests")
      .select("*, customers:client_id(*)")
      .eq("id", id)
      .single();
      
    if (error) throw error;
    return data as JobRequest;
  },
  
  createJobRequest: async (jobRequest: CreateJobRequestInput) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from("job_requests")
      .insert([{ 
        ...jobRequest, 
        user_id: user.user.id, 
        status: 'new' 
      }])
      .select("*")
      .single();
      
    if (error) throw error;
    return data as JobRequest;
  },
  
  updateJobRequest: async (id: string, jobRequest: UpdateJobRequestInput) => {
    const { data, error } = await supabase
      .from("job_requests")
      .update(jobRequest)
      .eq("id", id)
      .select("*")
      .single();
      
    if (error) throw error;
    return data as JobRequest;
  },
  
  deleteJobRequest: async (id: string) => {
    const { error } = await supabase
      .from("job_requests")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    return true;
  },
  
  convertJobRequestToProject: async (jobRequestId: string, projectData: CreateProjectInput) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");
    
    // Start a transaction
    // 1. Create new project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert([{ ...projectData, user_id: user.user.id }])
      .select()
      .single();
      
    if (projectError) throw projectError;
    
    // 2. Update job request with project reference
    const { error: updateError } = await supabase
      .from("job_requests")
      .update({ 
        converted_to_project: project.id,
        status: 'approved' 
      })
      .eq("id", jobRequestId);
      
    if (updateError) throw updateError;
    
    return project as Project;
  }
};
