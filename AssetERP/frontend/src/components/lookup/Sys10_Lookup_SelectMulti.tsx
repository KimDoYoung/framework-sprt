/**
 * 첨부파일 패널 (EE81) — 창 안에 끼워 넣는 파일 목록·올리기·내려받기·지우기 (AS-IS `Sys10_Lookup_SelectMulti`는 이름과 달리 Window가 아니라 ContentPanel)
 * AS-IS: myApp/client/vi/sys/Sys10_Lookup_SelectMulti.java (198줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 (parentId, editYn, height) L38-49 · makeLayout() L55-100: 위 [파일등록] / 그리드 높이 height(파일명 300 · Size(KB) 60 · 파일받기 80 · 파일삭제 80)
 *   editYn "Y"가 아니면 [파일등록]과 파일삭제 열을 감추고 파일명 열을 370으로, 높이는 height + 35
 * [E2] [파일등록] → fileUpload() L102: FileUpload?parentId= 로 올리고 [E1] 끝나면 retrieve()
 * 삭제 아이콘 → checkFileDelete() L172: sys.Sys11_RelateFile.checkFileDelete — 1 연결만 지움 → retrieve, 2 안내 문구, 3 FileDelete → [E3] retrieve (확인 창 없이 바로)
 * 쓰는 곳: Bbs01_Lookup_BoardInsert·BoardUpdate (미변환 목록 53번의 첨부파일 패널)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, message } from 'antd';
import { errorMessage } from '@/api/client';
import { FILE_DELETE_STATUS, fileApi } from '@/api/file';
import { FileInfo } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { FileUpdownForm, type FileUpdownFormHandle } from '@/components/form/FileUpdownForm';

const gb = gbFor<FileInfo>();

interface Props {
  /** 파일이 붙는 글 번호. null이면 빈 목록 */
  parentId: number | null;
  /** 생성자 editYn: true면 [파일등록]·파일삭제 열을 쓴다 */
  editYn?: boolean;
  /** 그리드 높이(px), 기본 105 */
  height?: number;
}

export const Sys10_Lookup_SelectMulti: React.FC<Props> = ({ parentId, editYn = false, height = 105 }) => {
  const [rows, setRows] = useState<FileInfo[]>([]);
  const upload = useRef<FileUpdownFormHandle>(null);

  // retrieve() L157: sys.Sys10_File.selectByParentId(parentId)
  const retrieve = useCallback(async () => {
    if (parentId == null) { setRows([]); return; }
    try {
      setRows(await fileApi.searchByParentId(parentId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [parentId]);
  useEffect(() => { void retrieve(); }, [retrieve]);

  // fileUploadField.Change [E4] (L110) → submit → [E1] uploadForm.SubmitComplete (L60) → retrieve()
  const onFile = async (file: File | undefined) => {
    if (parentId == null || !file) return;
    try {
      await fileApi.upload(parentId, file);
    } catch (err) {
      message.error(errorMessage(err, '파일 올리기 실패'));
    }
    await retrieve();
  };

  // checkFileDelete() L172-197
  const checkFileDelete = async (row: FileInfo) => {
    try {
      const { status, message: text } = await fileApi.checkFileDeleteResult(row.fileId, row.parentId);
      if (status === FILE_DELETE_STATUS.RELATE_DELETED) {
        await retrieve();
      } else if (status === FILE_DELETE_STATUS.IN_USE) {
        Modal.info({ title: '확인', content: text ?? '해당 파일은 삭제할 수 없습니다', okText: '확인' });
      } else if (status === FILE_DELETE_STATUS.DELETABLE) {
        await fileApi.deleteFile(row.fileId);  // [E3] fileDeleteForm.SubmitComplete (L85) → retrieve()
        await retrieve();
      }
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // buildGrid() L121-151
  const columnDefs = useMemo(() => [
    gb.text('fileNm', editYn ? 300 : 370, '파일명'),  // L127
    gb.double('size', 60, 'Size(KB)'),                // L128
    iconCell<FileInfo>('down', 'downloadCell', 80, '파일받기', row => {  // L140 → FileDownload?fileType=file&fileId=
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    ...(editYn ? [iconCell<FileInfo>('delete', 'deleteCell', 80, '파일삭제', row => void checkFileDelete(row))] : []),  // L148
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [editYn, retrieve]);

  return (
    <div>
      {editYn && (
        <div style={{ marginBottom: 6 }}>
          <Button type="upload" onClick={() => upload.current?.click()}>파일등록</Button>
        </div>
      )}
      <div style={{ height: editYn ? height : height + 35 }}>
        <SingleGrid<FileInfo> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.fileId)} />
      </div>
      <FileUpdownForm ref={upload} onChange={f => void onFile(f)} />
    </div>
  );
};
