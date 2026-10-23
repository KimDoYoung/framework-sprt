/**
 * 첨부파일 창 — 그리드 행의 첨부자료 [보기] 아이콘에서 연다 (M01 Ics35_Tab_ExtrActivity가 처음 쓴다. 다른 도메인 crm·mkt도 같은 창)
 * AS-IS: myApp/client/vi/sys/Sys10_Lookup_File.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L45-77: 모달 450×350 "첨부파일", 그리드(첨부파일 270·보기 50·받기 50, 체크박스 단일), 아래 가운데 [닫기]
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
import { Sys10_Lookup_FileViewer } from './Sys10_Lookup_FileViewer';

const gb = gbFor<FileInfo>();

interface Props {
  /** open(parentId) L40-43 — 값이 있으면 열린다 */
  parentId: number | null;
  onClose: () => void;
}

export const Sys10_Lookup_File: React.FC<Props> = ({ parentId, onClose }) => {
  const [rows, setRows] = useState<FileInfo[]>([]);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);

  // [E0] 화면 열림 (생성자 L45-77) → show()
  // retrieve() L79-88: 서비스 sys.Sys10_File.selectByParentId(parentId)
  useEffect(() => {
    if (parentId == null) return;
    setRows([]);
    fileApi.searchByParentId(parentId).then(setRows).catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [parentId]);

  // buildApprFileGrid() L90-119
  const columnDefs = useMemo(() => [
    gb.text('fileNm', 270, '첨부파일'),  // L113
    iconCell<FileInfo>('view', 'viewCell', 50, '보기', row => setViewFile(row)),  // L114 viewCell → Sys10_Lookup_FileViewer.open(fileId)
    iconCell<FileInfo>('down', 'downloadCell', 50, '받기', row => {  // L115 downloadCell → FileDownload?fileType=file&fileId=
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
  ], []);

  return (
    <LookupModal
      open={parentId != null}
      title="첨부파일"
      width={560}
      maskClosable={false}
      onCancel={onClose}
      footer={<div style={{ textAlign: 'center' }}>{/* [E1] closeButton[닫기].Select (L52) → hide() */}<Button type="close" onClick={onClose}>닫기</Button></div>}
    >
      <div style={{ height: 240 }}>
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
