/**
 * [1186] 커뮤니티 > 90. 기타 > 사원별 문자발송 (Z14)
 * AS-IS: myApp/client/vi/sms/Sms03_Tab_GroupSend.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L45-75: 왼쪽(폭 500, 여백 20) = 툴바(조회·등록·삭제) + 단체문자 그리드 + 편집 폼(높이 450), 가운데 = Sms03_Page_UserList(재직 사원)
 * 단체문자 목록·편집 폼(Sms03_Edit_GroupSend)·서버(group-sends)는 C06 고객별 문자발송(Sms03_Tab_SendAdmin)과 같은 것을 쓴다.
 * 실제 문자 발송은 하지 않는다(사용자 지시) — 발송 단추는 서버가 거절 문구를 돌려준다.
 * 스타일: SGHF (docs/page-style.md) — 왼쪽 그리드+편집 폼, 오른쪽 목록
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Splitter } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { smsApi } from '@/api/sms';
import { errorMessage } from '@/api/client';
import { GroupSend } from '@/types/sms';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { Sms03_Edit_GroupSend } from './Sms03_Edit_GroupSend';
import { Sms03_Page_UserList } from './Sms03_Page_UserList';

const gb = gbFor<GroupSend>();

export const Sms03_Tab_GroupSend: React.FC = () => {
  const gridRef = useRef<AgGridReact<GroupSend>>(null);
  const [rows, setRows] = useState<GroupSend[]>([]);
  const [selected, setSelected] = useState<GroupSend>();
  const tempSeq = useRef(0);

  /** AS-IS buildGrid() L108-117 */
  const columnDefs = useMemo(() => [
    gb.text('title', 250, '제목'),        // L112
    gb.date('startDate', 100, '생성일자'),  // L113
    gb.text('note', 150, '비고'),         // L114
  ], []);

  // retrieve() L119-133: 서비스 sms.Sms03_GroupSend.selectByCompanyId(companyId = 로그인 회사 — 서버) → 첫 행 선택
  const retrieve = useCallback(async () => {
    try {
      setRows(await smsApi.searchGroupSends());
      setTimeout(() => gridRef.current?.api.getDisplayedRowAtIndex(0)?.setSelected(true, true));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (생성자 L45-75) → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  // insertRow() L135-142: 회사·생성자·생성일자를 채운 빈 행(저장 전, 서버는 저장할 때 ID를 준다)
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

  // deleteCheck() L144-163 → [E5] msgBox.DialogHide [YES] (L147) → delete() L165-169
  const deleteCheck = () => {
    Modal.confirm({
      title: '삭제',
      content: '선택한 내용을 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 300,
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
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <Splitter style={{ height: '100%' }}>
        <Splitter.Panel defaultSize={500} min={500} max={900}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <div style={{ flex: 'none', height: 50, display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px' }}>
              {/* [E1] retrieveButton[조회].Select (L78) → retrieve() */}
              <Button type="search" onClick={retrieve}>조회</Button>
              {/* [E2] insertButton[등록].Select (L84) → insertRow() */}
              <Button type="register" onClick={insertRow}>등록</Button>
              {/* [E3] deleteButton[삭제].Select (L90) → deleteCheck(): 선택 행이 있을 때만 */}
              <Button type="delete" onClick={() => { if (selected) deleteCheck(); }}>삭제</Button>
            </div>
            <div style={{ flex: 1, minHeight: 120 }}>
              {/* [E4] grid.SelectionChanged (L98) → editForm.retrieve(선택 행) · userGrid.setGroupSendId(ID) */}
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
          <Sms03_Page_UserList groupSendId={selected && selected.groupSendId > 0 ? selected.groupSendId : null} />
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
