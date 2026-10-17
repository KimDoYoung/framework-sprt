/**
 * 법규 개정이력 목록 (E03-1) — Ics01_Lookup_ClassTreeDetail의 "개정이력" 칸
 * AS-IS: myApp/client/vi/ics/Ics01_Page_RevisionHistory.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 그리드 buildGrid() L28-67: 단순 그리드(행번호), 등록일 90 · 의견제출일 90 · 시행일 90 · 법규명 450 · 상세내용 아이콘 60 · 소관부처 100 · 법규반영일 90 · 첨부파일 60 · 첨부 보기 아이콘 30
 */
import React, { useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { IcsRevisionHistory } from '@/types/ics';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { Ics20_Lookup_Content } from '@/pages/ics/Ics20_Lookup_Content';
import { Ics20_Lookup_File } from '@/pages/ics/Ics20_Lookup_File';

const gb = gbFor<IcsRevisionHistory>();

interface Props {
  /** AS-IS retrieve(classTreeId) — 없으면 비운다 */
  classTreeId?: number | null;
}

export const Ics01_Page_RevisionHistory: React.FC<Props> = ({ classTreeId }) => {
  const [rows, setRows] = useState<IcsRevisionHistory[]>([]);
  const [contentRevision, setContentRevision] = useState<IcsRevisionHistory | null>(null);
  const [fileParentId, setFileParentId] = useState<number | null>(null);

  // [E0] 화면 열림 (생성자 L23-26) / retrieve() L74-85: 서비스 ics.Ics20_RevisionHistory.selectByClassTreeId
  useEffect(() => {
    setRows([]);
    if (classTreeId == null) return;
    icsApi.searchRevisionHistories(classTreeId).then(setRows).catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [classTreeId]);

  const columnDefs = useMemo(() => [
    gb.date('regDate', 90, '등록일'),  // L56
    gb.date('submissionDate', 90, '의견제출일'),  // L57
    gb.date('effectDate', 90, '시행일'),  // L58
    gb.text('title', 450, '법규명'),  // L59
    // L60 contentCell → Ics20_Lookup_Content.open(model, "user")
    iconCell<IcsRevisionHistory>('view', 'actionCellContent', 60, '상세내용', row => setContentRevision(row)),
    gb.text('financeAgencyName', 100, '소관부처'),  // L61
    gb.date('reflectionDate', 90, '법규반영일'),  // L62
    gb.longCenter('fileCount', 60, '첨부파일'),  // L63
    // L64 fileListCell → 첨부가 없으면 "첨부파일이 없습니다.", 있으면 Ics20_Lookup_File.open(revisionHistoryId)
    iconCell<IcsRevisionHistory>('view', 'actionCellFile', 30, ' ', row => {
      if (!row.fileCount) {
        message.warning('첨부파일이 없습니다.');
        return;
      }
      setFileParentId(row.revisionHistoryId);
    }),
  ], []);

  return (
    <>
      <SingleGrid<IcsRevisionHistory> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.revisionHistoryId)} />
      <Ics20_Lookup_Content revision={contentRevision} userType="user" onClose={() => setContentRevision(null)} />
      <Ics20_Lookup_File parentId={fileParentId} onClose={() => setFileParentId(null)} />
    </>
  );
};
