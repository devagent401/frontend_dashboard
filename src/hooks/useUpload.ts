import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadService } from '@/services/upload.service';
import { UploadedFile, UploadQueryParams } from '@/types/api';
import { useToast } from '@/components/ui/use-toast';
import { getAccessToken } from '@/lib/api-client';

/**
 * Hook to fetch all uploaded files
 */
export const useFiles = (params?: UploadQueryParams) => {
  return useQuery({
    queryKey: ['files', params],
    queryFn: () => uploadService.getFiles(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a single file by ID
 */
export const useFile = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['files', id],
    queryFn: () => uploadService.getFileById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to upload a single file
 */
export const useUploadFile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (file: File) => uploadService.uploadFile(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      toast({
        title: 'Success',
        description: 'File uploaded successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to upload file',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook to upload multiple files
 */
export const useUploadMultipleFiles = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (files: File[]) => uploadService.uploadMultipleFiles(files),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      toast({
        title: 'Success',
        description: `${data.count} file(s) uploaded successfully`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description:
          error.response?.data?.message || 'Failed to upload files',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook to update/replace a file
 */
export const useUpdateFile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      uploadService.updateFile(id, file),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['files', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
      toast({
        title: 'Success',
        description: 'File updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update file',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook to delete a file
 */
export const useDeleteFile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => uploadService.deleteFile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      toast({
        title: 'Success',
        description: 'File deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete file',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook for file upload with progress tracking
 * Provides upload functionality with progress percentage
 */
export const useFileUploadWithProgress = () => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadFile = async (file: File): Promise<UploadedFile | null> => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            setUploadProgress(Math.round(percentComplete));
          }
        });

        xhr.addEventListener('load', () => {
          setIsUploading(false);
          if (xhr.status === 201 || xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            queryClient.invalidateQueries({ queryKey: ['files'] });
            toast({
              title: 'Success',
              description: 'File uploaded successfully',
            });
            resolve(response.data);
          } else {
            const error = JSON.parse(xhr.responseText);
            toast({
              title: 'Error',
              description: error.message || 'Failed to upload file',
              variant: 'destructive',
            });
            reject(error);
          }
        });

        xhr.addEventListener('error', () => {
          setIsUploading(false);
          toast({
            title: 'Error',
            description: 'Network error occurred',
            variant: 'destructive',
          });
          reject(new Error('Network error'));
        });

        // Get token using the proper method from api-client
        const token = getAccessToken();
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

        xhr.open('POST', `${baseUrl}/upload`);
        
        // Always set the Authorization header if token exists
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        } else {
          console.error('No access token found for file upload');
          setIsUploading(false);
          toast({
            title: 'Authentication Error',
            description: 'Please login to upload files',
            variant: 'destructive',
          });
          reject(new Error('No access token'));
          return;
        }
        
        xhr.send(formData);
      });
    } catch (error: any) {
      setIsUploading(false);
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload file',
        variant: 'destructive',
      });
      return null;
    }
  };

  const uploadMultipleFiles = async (
    files: File[]
  ): Promise<UploadedFile[]> => {
    const uploadedFiles: UploadedFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uploadedFile = await uploadFile(file);
      if (uploadedFile) {
        uploadedFiles.push(uploadedFile);
      }
    }

    return uploadedFiles;
  };

  return {
    uploadFile,
    uploadMultipleFiles,
    uploadProgress,
    isUploading,
  };
};

/**
 * Combined hook for file operations
 */
export const useFileOperations = (id?: string) => {
  const files = useFiles();
  const file = useFile(id || '', !!id);
  const uploadFile = useUploadFile();
  const uploadMultipleFiles = useUploadMultipleFiles();
  const updateFile = useUpdateFile();
  const deleteFile = useDeleteFile();
  const uploadWithProgress = useFileUploadWithProgress();

  return {
    // Queries
    files,
    file,

    // Mutations
    uploadFile,
    uploadMultipleFiles,
    updateFile,
    deleteFile,

    // Upload with progress
    uploadWithProgress,

    // Helpers
    isLoading:
      files.isLoading ||
      file.isLoading ||
      uploadFile.isPending ||
      uploadMultipleFiles.isPending ||
      updateFile.isPending ||
      deleteFile.isPending,
  };
};

