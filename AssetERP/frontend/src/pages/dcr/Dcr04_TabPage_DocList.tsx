/**
 * 사원별 권한현황 오른쪽 — 고른 사원의 예외 문서분류 목록과 삭제 (EE08, Dcr04_Lookup_DocList의 tabPage)
 * AS-IS: myApp/client/vi/dcr/Dcr04_TabPage_DocList.java (166줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 생성자 L46-67: 툴바 50(검색 · 입력 200 "문서분류명" · [조회][삭제]) + 그리드(문서분류명 600, 체크 다중)
 * 부모(Dcr04_Lookup_DocList)가 고른 사원 ID를 prop으로 받는다(AS-IS retrieve(personId, callback)). 삭제가 끝나면 onDeleted()
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Modal, Typography } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { dcrEmpAuthApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { DcrEmpAuthClass } from '@/types/dcr';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';

const gb = gbFor<DcrEmpAuthClass>();

interface Props {
  /** 왼쪽 그리드에서 고른 사원. 없으면 빈 목록 */
  personId: number | null;
  /** AS-IS callback.execute(): 삭제 뒤 부모가 사원 목록을 다시 읽는다 */
  onDeleted: () => void;
}

export const Dcr04_TabPage_DocList: React.FC<Props> = ({ personId, onDeleted }) => {
  const gridRef = useRef<AgGridReact<DcrEmpAuthClass>>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<DcrEmpAuthClass[]>([]);
  const [loading, setLoading] = useState(false);

  // retrieve() L106-130: dcr.Dcr04_EmpAuth.getTargetClassTreeList(personId, "%"+searchText+"%")
  const retrieve = async (id: number | null = personId, text = searchText) => {
    if (id == null) { setRows([]); return; }
    setLoading(true);  // grid.mask("Loading")
    try {
      setRows(await dcrEmpAuthApi.searchByPerson(id, text));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E0] 생성자 L46-67 → settings(), retrieve() — 부모가 사원을 고를 때마다 다시 조회
  useEffect(() => { void retrieve(personId); }, [personId]);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E3] deleteButton[삭제].Select (L86) → deleteChk() L132-150: "삭제"/"n건을 삭제하시겠습니까?"(폭 300) → [E4] msgBox.DialogHide [YES] (L135) → deleteRow() L152-161
  const deleteChk = () => {
    const checked = gridRef.current?.api?.getSelectedRows() ?? [];
    if (checked.length === 0) { message.warning('삭제할 행을 선택하세요.'); return; }  // 05 §8
    Modal.confirm({
      title: '삭제',
      content: `${checked.length}건을 삭제하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 300,
      onOk: async () => {
        try {
          await dcrEmpAuthApi.delete(checked.map(r => r.empAuthId));
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
          return;
        }
        const gone = new Set(checked.map(r => r.empAuthId));
        setRows(prev => prev.filter(r => !gone.has(r.empAuthId)));
        onDeleted();
      },
    });
  };

  // buildGrid() L93-98
  const columnDefs = useMemo(() => [
    gb.text('classTreeFullName', 600, '문서분류명'),  // L96
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 50, display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', flex: 'none', overflowX: 'auto', overflowY: 'hidden', whiteSpace: 'nowrap' }}>
        <Typography.Text strong style={{ flex: 'none' }}>검색</Typography.Text>
        {/* [E1] searchText.KeyPress [Enter] (L72) → retrieve() */}
        <Input style={{ width: 200, flex: 'none' }} allowClear placeholder="문서분류명" value={searchText}
          onChange={e => setSearchText(e.target.value)} onPressEnter={() => void retrieve()} />
        {/* [E2] retrieveButton[조회].Select (L80) → retrieve() */}
        <Button type="search" onClick={() => void retrieve()}>조회</Button>
        <Button type="delete" onClick={deleteChk}>삭제</Button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiGrid<DcrEmpAuthClass>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.empAuthId)}
          loading={loading}
        />
      </div>
    </div>
  );
};
