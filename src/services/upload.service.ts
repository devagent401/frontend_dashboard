import apiClient from '@/lib/api-client';
import {
  ApiResponse,
  UploadedFile,
  UploadQueryParams,
} from '@/types/api';

/**
 * Upload Service - Comprehensive API integration for file upload operations
 * Based on API Documentation /api/v1/upload endpoints
 */
export const uploadService = {
  /**
   * Upload a single file
   * @param file - File to upload
   * @returns Promise with uploaded file details
   */
  uploadFile: async (file: File): Promise<UploadedFile> => {
    const formData = new FormData();
    formData.append('file', file);

    // Don't set Content-Type manually - let axios set it with boundary
    const response = await apiClient.post<ApiResponse<UploadedFile>>(
      '/upload',
      formData
    );
    return response.data.data!;
  },

  /**
   * Upload multiple files at once (max 10 files)
   * @param files - Array of files to upload
   * @returns Promise with uploaded files details
   */
  uploadMultipleFiles: async (
    files: File[]
  ): Promise<{ files: UploadedFile[]; count: number }> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    // Don't set Content-Type manually - let axios set it with boundary
    const response = await apiClient.post<
      ApiResponse<{ files: UploadedFile[]; count: number }>
    >('/upload/multiple', formData);
    return response.data.data!;
  },

  /**
   * Get all uploaded files with pagination and filtering
   * @param params - Query parameters for filtering and pagination
   * @returns Promise with files list and pagination metadata
   */
  getFiles: async (
    params?: UploadQueryParams
  ): Promise<ApiResponse<UploadedFile[]>> => {
    const response = await apiClient.get<ApiResponse<UploadedFile[]>>(
      '/upload',
      {
        params,
      }
    );
    return response.data;
  },

  /**
   * Get a single file by ID
   * @param id - File ID
   * @returns Promise with file details
   */
  getFileById: async (id: string): Promise<UploadedFile> => {
    const response = await apiClient.get<ApiResponse<UploadedFile>>(
      `/upload/${id}`
    );
    return response.data.data!;
  },

  /**
   * Get preview URL for a file (public access)
   * @param filename - File filename
   * @returns Preview URL string
   */
  getPreviewUrl: (filename: string): string => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    return `${baseUrl}/upload/preview/${filename}`;
  },

  /**
   * Download a file by ID
   * @param id - File ID
   * @param originalName - Original filename for download
   */
  downloadFile: async (id: string, originalName: string): Promise<void> => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const token = localStorage.getItem('access_token');

    const response = await fetch(`${baseUrl}/upload/download/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Download failed');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = originalName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  },

  /**
   * Update/replace an existing file
   * @param id - File ID
   * @param file - New file to replace the existing one
   * @returns Promise with updated file details
   */
  updateFile: async (id: string, file: File): Promise<UploadedFile> => {
    const formData = new FormData();
    formData.append('file', file);

    // Don't set Content-Type manually - let axios set it with boundary
    const response = await apiClient.put<ApiResponse<UploadedFile>>(
      `/upload/${id}`,
      formData
    );
    return response.data.data!;
  },

  /**
   * Delete a file by ID
   * @param id - File ID
   * @returns Promise<void>
   */
  deleteFile: async (id: string): Promise<void> => {
    await apiClient.delete(`/upload/${id}`);
  },
};

