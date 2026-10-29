/**
 * 증빙자료 창 — Bbs20_Tab_FloralRequestMng 증빙자료 칸 옆 [보기] 아이콘에서 연다 (T21)
 * AS-IS: myApp/client/vi/bbs/Bbs20_Lookup_RelateFile.java (112줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L42-65: 모달 560×350 "증빙자료", 그리드(첨부파일명 400·받기 40·보기 40, 체크박스 단일), 아래 가운데 [닫기]
 */
import React, { useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { errorMessage } from '@/api/client';
import { fileApi } from '@/api/file';
import { FileInfo } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Sys10_Lookup_FileViewer } from '../sys/Sys10_Lookup_FileViewer';

const gb = gbFor<FileInfo>();

interface Props {
  /** open(parentId) L37-40 — 값이 있으면 열린다 */
  parentId: number | null;
  onClose: () => void;
}

export const Bbs20_Lookup_RelateFile: React.FC<Props> = ({ parentId, onClose }) => {
  const [rows, setRows] = useState<FileInfo[]>([]);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);

  // [E0] 화면 열림 (생성자 L42-65) → show(). retrieve() L96-107: 서비스 sys.Sys10_File.selectByParentId(parentId)
  useEffect(() => {
    if (parentId == null) return;
    setRows([]);
    fileApi.searchByParentId(parentId).then(setRows).catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [parentId]);

  // buildApprFileGrid() L67-94
  const columnDefs = useMemo(() => [
    gb.text('fileNm', 400, '첨부파일명'),  // L90
    iconCell<FileInfo>('down', 'downloadCell', 40, '받기', row => {  // L91 FileDownload?fileType=file&fileId=
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    iconCell<FileInfo>('view', 'viewCell', 40, '보기', row => setViewFile(row)),  // L92 Sys10_Lookup_FileViewer.open(fileId)
  ], []);

  return (
    <LookupModal
      open={parentId != null}
      title="증빙자료"
      width={690}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={<div style={{ textAlign: 'center' }}>{/* [E1] closeButton[닫기].Select (L50) → hide() */}<Button type="close" onClick={onClose}>닫기</Button></div>}
    >
      <div style={{ height: 250 }}>
        <SingleGrid<FileInfo>
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.fileId)}
          rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
        />
      </div>
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
    </LookupModal>
  );
};
