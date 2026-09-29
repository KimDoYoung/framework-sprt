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

  /**
   * axios로 받아 저장한다. 링크(href) 방식은 인터셉터를 거치지 않아 Access Token 만료 시 자동 갱신이 되지 않는다.
   */
  download: async (fileId: string, filename: string): Promise<void> => {
    const res = await apiClient.get<Blob>(`/file/download/${fileId}`, { responseType: 'blob' });
    const url = URL.createObjectURL(res.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
};
