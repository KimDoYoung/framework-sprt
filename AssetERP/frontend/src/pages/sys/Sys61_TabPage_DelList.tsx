/**
 * 삭제된 첨부파일 목록 (V05) — 첨부파일 추가/삭제 창의 오른쪽 탭과 삭제된 첨부파일 내역 창이 같이 쓴다.
 * AS-IS: myApp/client/vi/sys/Sys61_TabPage_DelList.java · Sys61_Lookup_DelList.buildGrid() L91-129 — 첨부파일 270 · 보기 50 · 받기 50 · 삭제자 100 · 삭제일시 150 · 사유 50
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { aprAttachApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { fileApi } from '@/api/file';
import { AprFileDel } from '@/types/apr';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { AreaMessage } from '@/components/lookup/AreaMessage';
import { Sys10_Lookup_FileViewer } from '@/pages/sys/Sys10_Lookup_FileViewer';

const gb = gbFor<AprFileDel>();

interface Props {
  /** AS-IS retrieve(parentId) — 없으면 비운다 */
  parentId: number | null;
  /** 값이 바뀌면 다시 읽는다(삭제한 뒤) */
  nonce?: number;
}

export const Sys61_TabPage_DelList: React.FC<Props> = ({ parentId, nonce = 0 }) => {
  const [rows, setRows] = useState<AprFileDel[]>([]);
  const [viewFile, setViewFile] = useState<AprFileDel | null>(null);
  const [reason, setReason] = useState<string | null>(null);

  // retrieve() L79-89: sys.Sys61_FileDel.selectByParentId(parentId)
  const retrieve = useCallback(async () => {
    if (parentId == null) { setRows([]); return; }
    try {
      setRows(await aprAttachApi.getFileDels(parentId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [parentId]);
  useEffect(() => { void retrieve(); }, [retrieve, nonce]);

  const columnDefs = useMemo(() => [
    gb.text('fileName', 270, '첨부파일'),  // L121
    iconCell<AprFileDel>('view', 'viewCell', 50, '보기', setViewFile),  // L122 viewCell → Sys10_Lookup_FileViewer.open(fileId)
    iconCell<AprFileDel>('down', 'downloadCell', 50, '받기', row => {  // L123 downloadCell → FileDownload?fileType=file&fileId=
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    gb.textCenter('personName', 100, '삭제자'),  // L124
    gb.dateTime('delDate', 150, '삭제일시'),  // L125
    iconCell<AprFileDel>('view', 'reasonCell', 50, '사유', row => setReason(row.reason ?? '')),  // L126 actionCell → AreaMessage.open("사유", reason)
  ], []);

  return (
    <>
      <SingleGrid<AprFileDel>
        rowData={rows}
        columnDefs={columnDefs}
        getRowId={p => String(p.data.fileDelId)}
        rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
      />
      <Sys10_Lookup_FileViewer file={viewFile ? { fileId: viewFile.fileId, parentId: viewFile.parentId, fileNm: viewFile.fileName } : null} onClose={() => setViewFile(null)} />
      <AreaMessage open={reason != null} title="사유" value={reason} readOnly width={450} height={250} onClose={() => setReason(null)} />
    </>
  );
};
