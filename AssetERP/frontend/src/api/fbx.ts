import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { FbxBox, FbxBoxSaveReq, FbxFile, FbxHistory } from '../types/fbx';
import { readBlobError } from './file';

/** fbx(파일보관함) 화면 API (F11~) — 백엔드 `/api/v1/fbx/*` */
export const fbxApi = {
  // ── F11 파일등록 (Fbx01_Tab_Document) ──

  /** AS-IS fbx.Fbx01_Box.selectByCompanyId: 로그인 회사, 제목 "%검색어%" */
  searchBoxes: async (searchText: string): Promise<FbxBox[]> => {
    const res = await apiClient.get<ApiResponse<FbxBox[]>>('v1/fbx/boxes', { params: { searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS fbx.Fbx01_Box.update: 추가·변경 행 → 저장된 행(요청 순서) */
  updateBoxes: async (rows: FbxBoxSaveReq[]): Promise<FbxBox[]> => {
    // 날짜 편집기는 'YYYY-MM-DD'를 주므로 서버의 일시 형식으로 맞춘다
    const body = rows.map(r => ({ ...r, crtDate: r.crtDate && r.crtDate.length === 10 ? `${r.crtDate}T00:00:00` : r.crtDate }));
    const res = await apiClient.put<ApiResponse<FbxBox[]>>('v1/fbx/boxes', body);
    return res.data.data ?? [];
  },

  /** AS-IS fbx.Fbx01_Box.delete → 지운 건수 */
  deleteBoxes: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/fbx/boxes', { data: ids });
    return res.data.data;
  },

  /** AS-IS fbx.Fbx02_History.selectByBoxId (Fbx02_Popup_History) */
  searchHistories: async (boxId: number): Promise<FbxHistory[]> => {
    const res = await apiClient.get<ApiResponse<FbxHistory[]>>('v1/fbx/histories', { params: { boxId } });
    return res.data.data ?? [];
  },

  /** AS-IS fbx.Fbx03_File.selectByOrgAuth: 고른 문서분류와 그 하위, 문서권한(조직·사원) 또는 내가 올린 파일 */
  searchFiles: async (boxId: number, classTreeId: number): Promise<FbxFile[]> => {
    const res = await apiClient.get<ApiResponse<FbxFile[]>>('v1/fbx/files', { params: { boxId, classTreeId } });
    return res.data.data ?? [];
  },

  /** AS-IS fbx.Fbx03_File.selectByBoxId (F12 파일조회): 보관함의 파일 전체, 문서분류/파일명·등록자 "%검색어%" */
  searchFilesByBox: async (boxId: number, fileName: string, regEmpName: string): Promise<FbxFile[]> => {
    const res = await apiClient.get<ApiResponse<FbxFile[]>>('v1/fbx/files/by-box', { params: { boxId, fileName, regEmpName } });
    return res.data.data ?? [];
  },

  /** AS-IS FileUpload?mode=filebox&boxId&classId (파일 여러 개) → 올린 건수 */
  uploadFiles: async (boxId: number, classTreeId: number, files: File[]): Promise<number> => {
    const form = new FormData();
    files.forEach(f => form.append('files', f));
    const res = await apiClient.post<ApiResponse<number>>('v1/fbx/files', form, {
      params: { boxId, classTreeId },
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  /** AS-IS FileDelete?mode=filebox&fileId&boxId */
  deleteFile: async (boxId: number, fileId: number): Promise<void> => {
    await apiClient.delete(`v1/fbx/files/${fileId}`, { params: { boxId } });
  },

  /** AS-IS FileDownload?fileType=fbxFile&fileId&boxId → 브라우저 저장 (실패하면 서버 메시지로 throw) */
  downloadFile: async (boxId: number, fileId: number): Promise<void> => {
    try {
      const res = await apiClient.get<Blob>(`v1/fbx/files/${fileId}/download`, { params: { boxId }, responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      const m = (res.headers['content-disposition'] as string | undefined)?.match(/filename="?([^";]+)"?/);
      a.href = url;
      a.download = m ? decodeURIComponent(m[1]) : String(fileId);
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      throw await readBlobError(err);
    }
  },
};
