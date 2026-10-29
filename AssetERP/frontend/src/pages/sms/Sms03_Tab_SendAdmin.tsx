/**
 * [1367] 관리자 > 01. 고객관리 > 고객별 문자발송 (C06)
 * AS-IS: myApp/client/vi/sms/Sms03_Tab_SendAdmin.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L47-77: 왼쪽(폭 500, 여백 20) = 툴바(조회·등록·삭제) + 단체문자 그리드 + 편집 폼(높이 450), 가운데 = Sms03_Page_UserListAdmin
 * 실제 문자 발송은 하지 않는다(사용자 지시) — 발송 단추는 서버가 거절 문구를 돌려준다.
 * 스타일: GDP (docs/page-style.md) — 왼쪽 아래에 편집 폼이 더 있는 변형
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Splitter } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { smsApi } from '@/api/sms';
import { errorMessage } from '@/api/client';
import { GroupSend } from '@/types/sms';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { Sms03_Edit_GroupSend } from './Sms03_Edit_GroupSend';
import { Sms03_Page_UserListAdmin } from './Sms03_Page_UserListAdmin';
import { Sms04_Lookup_History } from './Sms04_Lookup_History';

const gb = gbFor<GroupSend>();

export const Sms03_Tab_SendAdmin: React.FC = () => {
  const gridRef = useRef<AgGridReact<GroupSend>>(null);
  const [rows, setRows] = useState<GroupSend[]>([]);
  const [selected, setSelected] = useState<GroupSend>();
  const [historyGroupSendId, setHistoryGroupSendId] = useState<number>();
  const tempSeq = useRef(0);

  /** AS-IS buildGrid() L115-132: 전송기록 아이콘 = 선택 행의 groupSendId로 Sms04_Lookup_History.open */
  const columnDefs = useMemo(() => [
    iconCell<GroupSend>('view', 'actionCell', 40, ' ', row => setHistoryGroupSendId(row.groupSendId)),
    gb.text('title', 250, '제목'),
    gb.date('startDate', 100, '생성일자'),
    gb.text('note', 150, '비고'),
  ], []);

  // retrieve() L134-148: 서비스 sms.Sms03_GroupSend.selectByCompanyId(companyId = 로그인 회사 — 서버) → 첫 행 선택
  const retrieve = useCallback(async () => {
    try {
      setRows(await smsApi.searchGroupSends());
      setTimeout(() => gridRef.current?.api.getDisplayedRowAtIndex(0)?.setSelected(true, true));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (생성자 L47-77) → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  // insertRow() L150-157: 회사·생성자·생성일자를 채운 빈 행(저장 전, 서버는 저장할 때 ID를 준다)
  const insertRow = async () => {
    try {
      const init = await smsApi.newGroupSendRow();
      const row: GroupSend = { ...init, groupSendId: --tempSeq.current };
      setRows(prev => [...prev, row]);  // 맨 아래(03 원칙 17)
      setTimeout(() => {
        const node = gridRef.current?.api.getRowNode(String(row.groupSendId));
        node?.setSelected(true, true);
        if (node?.rowIndex != null) gridRef.current?.api.ensureIndexVisible(node.rowIndex);
      });
    } catch (err) {
      message.error(errorMessage(err, '등록 실패'));
    }
  };

  // deleteCheck() L159-178 → [E5] msgBox.DialogHide [YES] (L162) → delete() L180-184
  const deleteCheck = () => {
    Modal.confirm({
      title: '삭제',
      content: '선택한 내용을 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        const checked = gridRef.current?.api.getSelectedRows() ?? [];
        const ids = checked.map(r => r.groupSendId);
        try {
          const savedIds = ids.filter(id => id > 0);
          if (savedIds.length > 0) await smsApi.deleteGroupSends(savedIds);
          setRows(prev => prev.filter(r => !ids.includes(r.groupSendId)));
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // Sms03_Edit_GroupSend.update() 콜백: 저장된 행으로 그리드 행을 바꾼다(저장 전 임시 행이면 새 ID로), 없으면 끝에 넣는다
  const onSaved = (saved: GroupSend, previousId?: number) => {
    setRows(prev => {
      const at = previousId == null ? -1 : prev.findIndex(r => r.groupSendId === previousId);
      return at < 0 ? [...prev, saved] : prev.map((r, i) => (i === at ? saved : r));
    });
    setTimeout(() => gridRef.current?.api.getRowNode(String(saved.groupSendId))?.setSelected(true, true));
  };

  return (
    <>
    <Splitter style={{ height: '100%', background: '#fff' }}>
      <Splitter.Panel defaultSize={540} min={540} max={1000}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 20, boxSizing: 'border-box' }}>
        <div style={{ flex: 'none', height: 50, display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* [E1] retrieveButton[조회].Select (L80) → retrieve() */}
          <Button type="search" onClick={retrieve}>조회</Button>
          {/* [E2] insertButton[등록].Select (L86) → insertRow() */}
          <Button type="register" onClick={insertRow}>등록</Button>
          {/* [E3] deleteButton[삭제].Select (L92) → deleteCheck(): 선택 행이 있을 때만 */}
          <Button type="delete" onClick={() => { if (selected) deleteCheck(); }}>삭제</Button>
        </div>
        <div style={{ flex: 1, minHeight: 120 }}>
          {/* [E4] grid.SelectionChanged (L100) → 선택이 1건이면 editForm.retrieve(선택 행)·userGrid.setGroupSendId(ID), 아니면 둘 다 비움 */}
          <SingleGrid<GroupSend>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.groupSendId)}
            onSelect={setSelected}
          />
        </div>
        <div style={{ flex: 'none', height: 450, marginTop: -2 }}>
          <Sms03_Edit_GroupSend key={selected?.groupSendId ?? 'none'} model={selected} onSaved={onSaved} />
        </div>
      </div>
      </Splitter.Panel>
      <Splitter.Panel min={300}>
        <div style={{ height: '100%', padding: '20px 20px 20px 0', boxSizing: 'border-box' }}>
          <Sms03_Page_UserListAdmin groupSendId={selected && selected.groupSendId > 0 ? selected.groupSendId : null} />
        </div>
      </Splitter.Panel>
    </Splitter>
    <Sms04_Lookup_History open={historyGroupSendId != null} groupSendId={historyGroupSendId} onClose={() => setHistoryGroupSendId(undefined)} />
    </>
  );
};
