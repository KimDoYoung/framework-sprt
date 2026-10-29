/**
 * 증빙자료 파일 목록 — Bbs20_Edit_FloralRequest 아래 칸에 붙는 조각 (T21)
 * AS-IS: myApp/client/vi/bbs/Bbs20_Grid_RelateFile.java (261줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L53-101: 툴바 [업로드](경조구분에 따라 이름이 바뀐다 setButtonName L150-188, 숨은 파일 선택) + 파일 그리드(buildApprFileGrid L113-148: 체크박스 단일, 첨부파일명 300 · 받기 40 · 삭제 40 · 보기 40)
 * disabled() L190-193: 보기 모드는 삭제 열만 숨긴다 (업로드 단추는 그대로)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import { errorMessage } from '@/api/client';
import { FILE_DELETE_STATUS, fileApi } from '@/api/file';
import { FileInfo } from '@/types/sys';
import { Button } from '@/components/button';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { Sys10_Lookup_FileViewer } from '../sys/Sys10_Lookup_FileViewer';

const gb = gbFor<FileInfo>();

interface Props {
  /** retrieve(floralRequestId) — 신청 ID */
  parentId: number | null;
  /** setButtonName(code, enable) — 경조구분 코드 */
  occasionsCode?: string | null;
  /** disabled() — 삭제 열 숨김 */
  disabled?: boolean;
}

/** setButtonName() L150-188 */
const uploadLabel = (code?: string | null) => {
  switch (code) {
    case '10': return '청접장 업로드';
    case '20': return '부고장 업로드';
    case '30': case '40': return '인사자료 등 업로드';
    case '50': case '60': return '보도자료 등 업로드';
    default: return '증빙 업로드';
  }
};

export const Bbs20_Grid_RelateFile: React.FC<Props> = ({ parentId, occasionsCode, disabled }) => {
  const fileForm = useRef<FileUpdownFormHandle>(null);
  const [rows, setRows] = useState<FileInfo[]>([]);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);

  // retrieve() L195-207: 서비스 sys.Sys10_File.selectByParentId(parentId)
  const retrieve = useCallback(async () => {
    if (parentId == null) { setRows([]); return; }
    try {
      setRows(await fileApi.searchByParentId(parentId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [parentId]);

  // [E0] 화면 열림 (생성자 L53-101) → settings()
  useEffect(() => { void retrieve(); }, [retrieve]);

  // [E2] fileUpload.Change (L71) → FileUpload?parentId= 제출 → [E1] fileUploadForm.SubmitComplete (L63) → resetFileUpload(), retrieve()
  const onFiles = async (files: File[]) => {
    if (parentId == null) return;
    try {
      for (const file of files) await fileApi.upload(parentId, file);
    } catch (err) {
      message.error(errorMessage(err, '파일 업로드 실패'));
    }
    await retrieve();
  };

  // [E5 생략] fileUpload.Change (L216) — resetFileUpload()가 다시 만든 파일 선택에 같은 처리를 다는 것. FileUpdownForm은 고른 뒤 값을 비워 다시 쓰므로 필요 없다
  // checkFileDelete() L226-251: 연결만 지움(1) → retrieve / 사용 중(2) → 서버 문구 / 지워도 됨(3) → FileDelete → [E3] fileDeleteForm.SubmitComplete (L81) → retrieve()
  const checkFileDelete = async (row: FileInfo) => {
    try {
      const result = await fileApi.checkFileDeleteResult(row.fileId, row.parentId);
      if (result.status === FILE_DELETE_STATUS.RELATE_DELETED) {
        await retrieve();
      } else if (result.status === FILE_DELETE_STATUS.IN_USE) {
        message.warning(result.message);
      } else if (result.status === FILE_DELETE_STATUS.DELETABLE) {
        await fileApi.deleteFile(row.fileId);
        await retrieve();
      }
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // buildApprFileGrid() L113-148
  const columnDefs = useMemo(() => [
    gb.text('fileNm', 300, '첨부파일명'),  // L142
    iconCell<FileInfo>('down', 'downloadCell', 40, '받기', row => {  // L143 FileDownload?fileType=file&fileId=
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    ...(disabled ? [] : [iconCell<FileInfo>('delete', 'deleteCell', 40, '삭제', row => { void checkFileDelete(row); })]),  // L144 (disabled()면 숨김)
    iconCell<FileInfo>('view', 'viewCell', 40, '보기', setViewFile),  // L145 Sys10_Lookup_FileViewer.open(fileId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [disabled, retrieve]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div>
        {/* [E4] updateButton[파일업로드].Select (L105) → fileUpload.click() */}
        <Button type="upload" onClick={() => fileForm.current?.click()}>{uploadLabel(occasionsCode)}</Button>
      </div>
      <FileUpdownForm ref={fileForm} onChange={() => undefined} onChangeFiles={onFiles} />
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<FileInfo>
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.fileId)}
          rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
        />
      </div>
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
    </div>
  );
};
