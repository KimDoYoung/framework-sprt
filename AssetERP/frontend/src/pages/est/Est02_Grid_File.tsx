/**
 * 용역계약 첨부파일 목록 (Q09) — Est02_Edit_PfContract의 "첨부파일" 칸
 * AS-IS: myApp/client/vi/est/Est02_Grid_File.java (211줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L53-103: 위 툴바 50([파일업로드], 숨은 업로드 폼), 아래 그리드(체크 단일: 첨부파일 300 · 받기 50 · 삭제 50 · 보기 50)
 * `editable`이 false(unEnable() L206-210)면 [파일업로드]를 막고 삭제 열을 감춘 채 첨부파일 열을 350으로 넓힌다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import { fileApi, FILE_DELETE_STATUS } from '@/api/file';
import { errorMessage } from '@/api/client';
import { FileInfo } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { Sys10_Lookup_FileViewer } from '@/pages/sys/Sys10_Lookup_FileViewer';

const gb = gbFor<FileInfo>();
/** setChecked(SINGLE): 체크박스 단일 선택. 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Props {
  /** retrieve(pfContractModel, editable) L109-135 — 용역계약 ID (등록 창은 열 때 받은 새 번호) */
  parentId: number | null;
  /** 수정 가능 여부. false면 unEnable() */
  editable: boolean;
}

export const Est02_Grid_File: React.FC<Props> = ({ parentId, editable }) => {
  const [rows, setRows] = useState<FileInfo[]>([]);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);
  const fileUpload = useRef<FileUpdownFormHandle>(null);

  // retrieve() L105-135: 서비스 sys.Sys10_File.selectByParentId(parentId). 제목 파일(titleYn)은 뺀다
  const retrieve = useCallback(async () => {
    if (parentId == null || parentId <= 0) {
      setRows([]);
      return;
    }
    try {
      const list = await fileApi.searchByParentId(parentId);
      setRows(list.filter(f => String((f as unknown as { titleYn?: unknown }).titleYn) !== 'true'));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [parentId]);

  // [E0] 화면 열림 (생성자 L53-103)
  useEffect(() => { void retrieve(); }, [retrieve]);

  // [E4] uploadFileButton[파일업로드].Select (L84) → fileUpload.click(), [E1] fileUpload.Change (L59) → FileUpload?parentId={ID}
  // [E2] fileUploadForm.SubmitComplete (L68) → retrieve()
  // fileUpload는 FileUploadMulti — 여러 파일을 한 번에 고를 수 있다
  const onFilesChange = async (files: File[]) => {
    if (parentId == null || files.length === 0) return;
    try {
      for (const file of files) await fileApi.upload(parentId, file);
    } catch (err) {
      message.error(errorMessage(err, '파일 올리기 실패'));
    }
    await retrieve();
  };

  // checkFileDelete() L179-204: sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) → 1 연결만 지움 → retrieve(), 2 메시지, 3 FileDelete?fileId= → [E3] fileDeleteForm.SubmitComplete (L78) → retrieve()
  const checkFileDelete = async (row: FileInfo) => {
    try {
      const result = await fileApi.checkFileDeleteResult(row.fileId, row.parentId ?? parentId ?? 0);
      if (result.status === FILE_DELETE_STATUS.IN_USE) {
        message.warning(result.message ?? '삭제할 수 없는 파일입니다');
        return;
      }
      if (result.status === FILE_DELETE_STATUS.DELETABLE) await fileApi.deleteFile(row.fileId);
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // buildApprFileGrid() L137-177
  const columnDefs = useMemo(() => [
    gb.text('fileNm', editable ? 300 : 350, '첨부파일'),  // L171
    iconCell<FileInfo>('down', 'downloadCell', 50, '받기', row => {  // L172 downloadCell → FileDownload?fileType=file&fileId=
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    ...(editable ? [iconCell<FileInfo>('delete', 'deleteCell', 50, '삭제', row => { void checkFileDelete(row); })] : []),  // L173 deleteCell (확인 없이) — unEnable()이면 감춘다(L206-210)
    iconCell<FileInfo>('view', 'viewCell', 50, '보기', setViewFile),  // L174 viewCell → Sys10_Lookup_FileViewer.open(fileId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [retrieve, editable]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div>
        <Button type="upload" disabled={!editable} onClick={() => fileUpload.current?.click()}>파일업로드</Button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<FileInfo>
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.fileId)}
          rowSelection={SINGLE_CHECK}
        />
      </div>
      <FileUpdownForm ref={fileUpload} onChange={() => undefined} onChangeFiles={files => { void onFilesChange(files); }} />
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
    </div>
  );
};
