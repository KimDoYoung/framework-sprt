/**
 * 개정내역 첨부파일 창 (E01) — Ics20_Lookup_RevisionHistory 그리드의 첨부파일 [보기] 아이콘에서 연다.
 * AS-IS: myApp/client/vi/ics/Ics20_Lookup_File.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L38-65: 모달 680×300 "첨부파일", 그리드(첨부파일명 440·다운로드 80·미리보기 80, 체크박스 단일), 아래 가운데 [닫기]
 */
import React, { useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { FileInfo } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { Sys10_Lookup_FileViewer } from '../sys/Sys10_Lookup_FileViewer';

const gb = gbFor<FileInfo>();

interface Props {
  /** open(parentId) L38-65 — 값이 있으면 열린다 */
  parentId: number | null;
  onClose: () => void;
}

export const Ics20_Lookup_File: React.FC<Props> = ({ parentId, onClose }) => {
  const [rows, setRows] = useState<FileInfo[]>([]);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);

  // retrieve(parentId) L99-111: 서비스 sys.Sys10_File.selectByParentId(parentId)
  useEffect(() => {
    if (parentId == null) return;
    setRows([]);
    fileApi.searchByParentId(parentId).then(setRows).catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [parentId]);

  // buildApprFileGrid() L67-97
  const columnDefs = useMemo(() => [
    gb.text('fileNm', 440, '첨부파일명'),  // L92
    // L93 downloadCell: FileDownload?fileType=file&fileId=
    iconCell<FileInfo>('down', 'actionCellDown', 80, '다운로드', row => {
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    iconCell<FileInfo>('view', 'actionCellView', 80, '미리보기', row => setViewFile(row)),  // L94 Sys10_Lookup_FileViewer.open(fileId)
  ], []);

  return (
    <LookupModal
      open={parentId != null}
      title="첨부파일"
      width={720}
      maskClosable={false}
      onCancel={onClose}
      footer={<div style={{ textAlign: 'center' }}>{/* [E1] closeButton[닫기].Select (L46) → hide() */}<Button type="close" onClick={onClose}>닫기</Button></div>}
    >
      <div style={{ height: 200 }}>
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
