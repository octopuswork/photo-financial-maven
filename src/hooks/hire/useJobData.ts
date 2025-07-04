import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchJobs, addJob, updateJob, deleteJob } from "./api/jobApi";
import { Job, JobFormData } from "@/types/hire";
import { useToast } from "@/hooks/use-toast";

export function useJobData() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [isEditJobModalOpen, setIsEditJobModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Fetch jobs
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
    onError: (error: any) => {
      console.error("Error fetching jobs:", error);
      toast({
        title: "Error",
        description: "Failed to load job postings",
        variant: "destructive"
      });
    }
  });

  // Add job mutation
  const addJobMutation = useMutation({
    mutationFn: (jobData: JobFormData) => addJob(jobData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast({
        title: "Job Posted",
        description: "Your job has been posted successfully"
      });
      setIsAddJobModalOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to post job",
        variant: "destructive"
      });
    }
  });

  // Update job mutation
  const updateJobMutation = useMutation({
    mutationFn: ({ id, jobData }: { id: string; jobData: JobFormData }) => 
      updateJob(id, jobData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast({
        title: "Job Updated",
        description: "Your job posting has been updated successfully"
      });
      setIsEditJobModalOpen(false);
      setSelectedJob(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to update job posting",
        variant: "destructive"
      });
    }
  });

  // Delete job mutation
  const deleteJobMutation = useMutation({
    mutationFn: (id: string) => deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast({
        title: "Job Deleted",
        description: "Your job posting has been deleted successfully"
      });
      setIsDeleteConfirmOpen(false);
      setSelectedJob(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to delete job posting",
        variant: "destructive"
      });
    }
  });

  // Handle adding a new job
  const handleAddJob = (jobData: JobFormData) => {
    addJobMutation.mutate(jobData);
  };

  // Handle updating a job
  const handleUpdateJob = (jobData: JobFormData) => {
    if (!selectedJob) return;
    updateJobMutation.mutate({ id: selectedJob.id, jobData });
  };

  // Handle deleting a job
  const handleDeleteJob = () => {
    if (!selectedJob) return;
    deleteJobMutation.mutate(selectedJob.id);
  };

  // Open edit modal for a job
  const handleEditJob = (job: Job) => {
    setSelectedJob(job);
    setIsEditJobModalOpen(true);
  };

  // Open delete confirmation for a job
  const handleConfirmDeleteJob = (job: Job) => {
    setSelectedJob(job);
    setIsDeleteConfirmOpen(true);
  };

  return {
    jobs,
    isLoading,
    selectedJob,
    isAddJobModalOpen,
    isEditJobModalOpen,
    isDeleteConfirmOpen,
    setIsAddJobModalOpen,
    setIsEditJobModalOpen,
    setIsDeleteConfirmOpen,
    handleAddJob,
    handleUpdateJob,
    handleDeleteJob,
    handleEditJob,
    handleConfirmDeleteJob
  };
}