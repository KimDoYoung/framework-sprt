/**
 * 개정이력 조회창 (E01) — Ics01_Grid_IcsType 그리드의 개정이력 [보기] 아이콘에서 연다.
 * AS-IS: myApp/client/vi/ics/Ics20_Lookup_RevisionHistory.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L50-87: 모달 1150×450 "개정이력", 위 오른쪽 새로고침 아이콘(retrieve) + 그리드(체크박스 단일), 아래 가운데 [닫기]
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Modal } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { IcsRevisionHistory } from '@/types/ics';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { Ics20_Lookup_Content } from './Ics20_Lookup_Content';
import { Ics20_Lookup_File } from './Ics20_Lookup_File';

const gb = gbFor<IcsRevisionHistory>();

interface Props {
  /** open(classTreeId) L44-48 — 값이 있으면 열린다 */
  classTreeId: number | null;
  onClose: () => void;
}

export const Ics20_Lookup_RevisionHistory: React.FC<Props> = ({ classTreeId, onClose }) => {
  const [rows, setRows] = useState<IcsRevisionHistory[]>([]);
  const [contentTarget, setContentTarget] = useState<IcsRevisionHistory | null>(null);
  const [fileParentId, setFileParentId] = useState<number | null>(null);

  // retrieve() L134-138: 서비스 ics.Ics20_RevisionHistory.selectByClassTreeId(classTreeId)
  const retrieve = useCallback(async () => {
    if (classTreeId == null) return;
    try {
      setRows(await icsApi.searchRevisionHistories(classTreeId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [classTreeId]);

  // [E0] 화면 열림 (생성자 L40-42) → open() L44-48: makeLayout(), retrieve()
  useEffect(() => { setRows([]); void retrieve(); }, [retrieve]);

  // buildGrid() L90-132
  const columnDefs = useMemo(() => [
    gb.date('regDate', 90, '등록일'),  // L121
    gb.date('submissionDate', 90, '의견제출일'),  // L122
    gb.date('effectDate', 90, '시행일'),  // L123
    gb.text('title', 450, '법규명'),  // L124
    iconCell<IcsRevisionHistory>('view', 'actionCellContent', 60, '상세내용', row => setContentTarget(row)),  // L125 Ics20_Lookup_Content.open(model, "user")
    gb.text('financeAgencyName', 100, '소관부처'),  // L126
    gb.date('reflectionDate', 90, '법규반영일'),  // L127
    gb.longCenter('fileCount', 60, '첨부파일'),  // L128
    iconCell<IcsRevisionHistory>('view', 'actionCellFile', 30, ' ', row => {  // L129 fileListCell
      if (!row.fileCount) { message.warning('첨부파일이 없습니다.'); return; }
      setFileParentId(row.revisionHistoryId);
    }),
  ], []);

  return (
    <Modal
      open={classTreeId != null}
      title="개정이력"
      width={1190}
      maskClosable={false}
      onCancel={onClose}
      footer={<div style={{ textAlign: 'center' }}>{/* [E2] closeButton[닫기].Select (L66) → hide() */}<Button type="close" onClick={onClose}>닫기</Button></div>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: 300, gap: 6 }}>
        <div style={{ textAlign: 'right', paddingRight: 8 }}>
          {/* [E1] anchor.MouseDown (L59) → retrieve() */}
          <ReloadOutlined style={{ cursor: 'pointer' }} title="새로고침" onMouseDown={() => { void retrieve(); }} />
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<IcsRevisionHistory>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.revisionHistoryId)}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
          />
        </div>
      </div>
      <Ics20_Lookup_Content revision={contentTarget} userType="user" onClose={() => setContentTarget(null)} />
      <Ics20_Lookup_File parentId={fileParentId} onClose={() => setFileParentId(null)} />
    </Modal>
  );
};
