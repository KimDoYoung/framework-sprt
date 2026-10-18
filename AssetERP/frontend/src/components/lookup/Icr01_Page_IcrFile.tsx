/**
 * 내규 서식파일 목록 (E13-3) — Icr01_Lookup_ClassTreeDetail의 "서식파일" 칸
 * AS-IS: myApp/client/vi/icr/Icr01_Page_IcrFile.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 그리드 buildApprFileGrid() L33-52: 단순 그리드(행번호), 서식파일 320 · 등록일 95 · 받기 아이콘 45
 */
import React, { useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { FileInfo } from '@/types/sys';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';

const gb = gbFor<FileInfo>();

interface Props {
  /** AS-IS retrieve(parentId) L54-65 — 없으면 비운다 */
  classTreeId?: number | null;
}

export const Icr01_Page_IcrFile: React.FC<Props> = ({ classTreeId }) => {
  const [rows, setRows] = useState<FileInfo[]>([]);

  // [E0] 화면 열림 (생성자 L26-32) / retrieve(): 서비스 sys.Sys10_File.selectByParentId(parentId = 내규 ID)
  useEffect(() => {
    setRows([]);
    if (classTreeId == null) return;
    fileApi.searchByParentId(classTreeId).then(setRows).catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [classTreeId]);

  const columnDefs = useMemo(() => [
    gb.text('fileNm', 320, '서식파일'),  // L47
    gb.date('regDate', 95, '등록일'),  // L48
    // L49 downloadCell: FileDownload?fileType=file&fileId=
    iconCell<FileInfo>('down', 'actionCell', 45, ' ', row => {
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
  ], []);

  return <SingleGrid<FileInfo> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.fileId)} />;
};
