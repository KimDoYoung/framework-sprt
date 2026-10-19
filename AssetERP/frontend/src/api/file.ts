import { apiClient, API_BASE_URL } from './client';
import { ApiResponse } from '../types/auth';
import { FileInfo } from '../types/sys';

/**
 * 파일 공통 API (B10) — AS-IS 서블릿 FileUpload·FileDownload·FileDelete, 서비스 sys.Sys10_File.selectByParentId·sys.Sys11_RelateFile.checkFileDelete
 * 백엔드 `/api/v1/sys/files` (로그인만)
 */

/** checkFileDelete 결과 (AS-IS result.getStatus()) */
export const FILE_DELETE_STATUS = {
  /** 연관파일 연결만 지움 → 다시 조회 */
  RELATE_DELETED: 1,
  /** "해당 파일은 다른 상신문서에서 사용 중이므로 삭제할 수 없습니다" */
  IN_USE: 2,
  /** 지워도 됨 → fileApi.deleteFile */
  DELETABLE: 3,
} as const;

/** blob 응답의 오류 본문(JSON)을 읽어 errorMessage()가 쓰는 모양으로 바꾼다 */
export const readBlobError = async (err: any) => {
  const data = err?.response?.data;
  if (data instanceof Blob) {
    try {
      err.response.data = JSON.parse(await data.text());
    } catch {
      // JSON이 아니면 그대로
    }
  }
  return err;
};

/** Content-Disposition `filename="…"`(URL 인코딩, AS-IS FileDownload.download)에서 이름을 꺼낸다 */
const fileNameOf = (disposition: string | undefined, fallback: string) => {
  const m = disposition?.match(/filename="?([^";]+)"?/);
  return m ? decodeURIComponent(m[1]) : fallback;
};

export const fileApi = {
  /** AS-IS sys.Sys10_File.selectByParentId */
  searchByParentId: async (parentId: number): Promise<FileInfo[]> => {
    const res = await apiClient.get<ApiResponse<FileInfo[]>>('v1/sys/files', { params: { parentId } });
    return res.data.data ?? [];
  },

  /** AS-IS FileUpload?parentId=&[mode=emp01]&[fileYn=] → 저장된 행 */
  upload: async (parentId: number, file: File, opts?: { mode?: 'emp01'; fileYn?: boolean }): Promise<FileInfo> => {
    const form = new FormData();
    form.append('file', file);
    const res = await apiClient.post<ApiResponse<FileInfo>>('v1/sys/files', form, {
      params: { parentId, mode: opts?.mode, fileYn: opts?.fileYn == null ? undefined : String(opts.fileYn) },
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  /** AS-IS FileDownload?fileType=file&fileId= → 브라우저 저장 (실패하면 서버 메시지로 throw) */
  download: async (fileId: number): Promise<void> => {
    try {
      const res = await apiClient.get<Blob>(`v1/sys/files/${fileId}`, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileNameOf(res.headers['content-disposition'], String(fileId));
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      throw await readBlobError(err);
    }
  },

  /** 미리보기용: 파일 내용을 blob으로 받는다(저장하지 않음). 형식은 부르는 쪽이 확장자로 정한다 */
  fetchBlob: async (fileId: number): Promise<Blob> => {
    try {
      const res = await apiClient.get<Blob>(`v1/sys/files/${fileId}`, { responseType: 'blob' });
      return res.data;
    } catch (err) {
      throw await readBlobError(err);
    }
  },

  /**
   * AS-IS FileDownload?fileType=image&(fileId=|parentId=)&time= — `<img src>`에 넣는 주소 (인증은 쿠키).
   * time은 원본처럼 캐시를 피하려고 붙인다 — 사진을 바꾼 뒤 다시 부르면 새 주소가 된다
   */
  imageUrl: (by: { fileId?: number; parentId?: number }): string => {
    const q = new URLSearchParams();
    if (by.fileId != null) q.set('fileId', String(by.fileId));
    if (by.parentId != null) q.set('parentId', String(by.parentId));
    q.set('time', String(Date.now()));
    return `${API_BASE_URL}/v1/sys/files/image?${q}`;
  },

  /** AS-IS sys.Sys11_RelateFile.checkFileDelete → FILE_DELETE_STATUS */
  checkFileDelete: async (fileId: number, parentId: number): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>(`v1/sys/files/${fileId}/check-delete`, null, { params: { parentId } });
    return res.data.data;
  },

  /** AS-IS FileDelete?fileId= */
  deleteFile: async (fileId: number): Promise<void> => {
    await apiClient.delete(`v1/sys/files/${fileId}`);
  },

  /** AS-IS FileDownload?fileType=selectList&selectList=id,id,… → "Asset-ERP.zip" 브라우저 저장 */
  downloadZip: async (fileIds: number[]): Promise<void> => {
    try {
      const res = await apiClient.get<Blob>('v1/sys/files/zip', { params: { fileIds: fileIds.join(',') }, responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileNameOf(res.headers['content-disposition'], 'Asset-ERP.zip');
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      throw await readBlobError(err);
    }
  },
};
