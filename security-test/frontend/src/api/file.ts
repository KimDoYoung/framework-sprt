import { apiClient } from './client';
import { ApiResponse, FileItem } from '../types/auth';

export const fileApi = {
  upload: async (file: File): Promise<ApiResponse<FileItem>> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await apiClient.post<ApiResponse<FileItem>>('/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  },

  list: async (): Promise<ApiResponse<FileItem[]>> => {
    const res = await apiClient.get<ApiResponse<FileItem[]>>('/file/list');
    return res.data;
  },

  getDownloadUrl: (fileId: string): string => {
    return `/api/file/download/${fileId}`;
  }
};
