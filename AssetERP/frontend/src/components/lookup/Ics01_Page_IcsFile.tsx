/**
 * 법규 서식파일 목록 (E03-1) — Ics01_Lookup_ClassTreeDetail의 "서식파일" 칸
 * AS-IS: myApp/client/vi/ics/Ics01_Page_IcsFile.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 그리드 buildApprFileGrid() L34-62: 단순 그리드(행번호), 서식파일 300 · 등록일 90 · 받기 아이콘 35 · 보기 아이콘 35
 */
import React, { useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { icsApi } from '@/api/ics';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { IcsRelateFile } from '@/types/ics';
import { FileInfo } from '@/types/sys';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { Sys10_Lookup_FileViewer } from '@/pages/sys/Sys10_Lookup_FileViewer';

const gb = gbFor<IcsRelateFile>();

interface Props {
  /** AS-IS retrieve(classTreeId) — 없으면 비운다 */
  classTreeId?: number | null;
}

export const Ics01_Page_IcsFile: React.FC<Props> = ({ classTreeId }) => {
  const [rows, setRows] = useState<IcsRelateFile[]>([]);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);

  // [E0] 화면 열림 (생성자 L26-32) / retrieve() L64-75: 서비스 sys.Sys11_RelateFile.selectByParentId(parentId = 법규 ID)
  useEffect(() => {
    setRows([]);
    if (classTreeId == null) return;
    icsApi.searchLawFiles(classTreeId).then(setRows).catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [classTreeId]);

  const columnDefs = useMemo(() => [
    gb.text('fileName', 300, '서식파일'),  // L56
    gb.date('regDate', 90, '등록일'),  // L57
    // L58 downloadCell: FileDownload?fileType=file&fileId=
    iconCell<IcsRelateFile>('down', 'actionCellDown', 35, ' ', row => {
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    // L59 viewCell → Sys10_Lookup_FileViewer.open(fileId)
    iconCell<IcsRelateFile>('view', 'actionCellView', 35, ' ', row => setViewFile({ fileId: row.fileId, parentId: row.parentId ?? 0, fileNm: row.fileName ?? '' })),
  ], []);

  return (
    <>
      <SingleGrid<IcsRelateFile> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.relateFileId)} />
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
    </>
  );
};
