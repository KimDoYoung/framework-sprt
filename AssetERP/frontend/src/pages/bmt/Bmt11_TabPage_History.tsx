/**
 * 사용자 이력 (W18) — Bmt10_Lookup_History 왼쪽 800 영역 (장비를 쓴 사원의 시작일·메신저·웹사이트)
 * AS-IS: myApp/client/vi/bmt/Bmt11_TabPage_History.java (193줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L51-68: 위 툴바 45("▶ 사용자" · [조회][등록][삭제][저장]) + 셀 편집 그리드(행번호, 체크박스 없음), 테두리
 * 12 원칙: 선은 하나(바깥 테두리), 툴바와 그리드 사이는 간격 8
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button as AntButton, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { bmtHistoryApi } from '@/api/bmt';
import { BmtHistory } from '@/types/bmt';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<BmtHistory>();
/** setChecked 없음 → 체크박스 없는 단일 선택. 상수로 둬야 선택이 풀리지 않는다 */
const SINGLE_SELECTION = { mode: 'singleRow', checkboxes: false } as const;

interface Props {
  /** 장비 ID — 없으면 비어 있다 */
  infoId: number | null;
}

export const Bmt11_TabPage_History: React.FC<Props> = ({ infoId }) => {
  const infoIdRef = useRef<number | null>(infoId);
  const [pickRowId, setPickRowId] = useState<number | null>(null);
  infoIdRef.current = infoId;

  const crud = useGridCrud<BmtHistory>({
    idField: 'historyId',
    // retrieve(infoId) L133-147: bmt.Bmt11_History.selectByInfoId(companyId, infoId)
    search: useCallback(async () => (infoIdRef.current == null ? [] : bmtHistoryApi.search(infoIdRef.current)), []),
    // update() L185-188: GridUpdate → bmt.Bmt11_History.update
    save: useCallback(async rows => bmtHistoryApi.save(infoIdRef.current as number, rows), []),
    // delete() L179-183: GridDeleteData → bmt.Bmt11_History.delete
    remove: bmtHistoryApi.remove,
    // deleteCheck() L158-177: "해당 이력을 삭제하시겠습니까?"(폭 400)
    //   [E6] msgBox.DialogHide [YES] (L161) → delete() L179-183 (훅의 삭제 확인 뒤 remove)
    deleteConfirm: '해당 이력을 삭제하시겠습니까?',
    // insert() L149-156: 회사·장비 ID·시작일자(오늘)를 넣은 새 행
    newRow: useCallback(() => ({ infoId: infoIdRef.current ?? 0, startDate: dayjs().format('YYYY-MM-DD') }), []),
    firstEditField: 'startDate',
  });

  // [E0] 화면 열림 (생성자 L51-68) → settings() / Bmt10_Lookup_History.open()이 tabPage.retrieve(infoId)를 부른다
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void crud.retrieve(); }, [infoId]);

  // [E5] lookupEmp.TriggerClick [result != null] (L101) → Emp00_Lookup_SelectSingle.open(true, 오늘, true, cb): 고른 사원의 이름·ID를 선택 행에 넣는다(고르지 않으면 비운다)
  const onPickEmp = (emp: TransInfo | null) => {
    const id = pickRowId;
    setPickRowId(null);
    if (id == null) return;
    crud.updateRow(id, { personId: emp ? emp.personId : null, personName: emp ? emp.korNm : null });
  };

  // [E3] deleteButton[삭제].Select (L83) → deleteCheck(): 선택한 행이 없으면 서버에 보낼 것이 없다
  const deleteRow = () => {
    if (!crud.gridRef.current?.api?.getSelectedRows().length) return;
    crud.deleteChecked();
  };

  // buildGrid() L97-131
  const columnDefs = useMemo(() => [
    gb.date('startDate', 120, '시작일자', { editor: 'date' }),  // L123 (UX-08: 편집 날짜 열 120)
    gb.textCenter('personName', 80, '사원명', {  // L124 (LookupTriggerField)
      cellStyle: { color: '#1677ff' },
      cellRenderer: (p: { data?: BmtHistory; value?: string }) => (
        <>
          <AntButton type="text" size="small" icon={<SearchOutlined />}
            onClick={e => { e.stopPropagation(); if (p.data) setPickRowId(p.data.historyId); }} />
          {p.value}
        </>
      ),
    }),
    gb.textArea('messenger', 200, '사용 메신저', { editor: 'largeText' }),  // L125
    gb.textArea('website', 200, '사용 웹사이트', { editor: 'largeText' }),  // L126
    gb.textArea('note', 180, '비고', { editor: 'largeText' }),  // L127
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 10, boxSizing: 'border-box', border: '1px solid #d9d9d9' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontWeight: 600, marginRight: 8 }}>▶ 사용자</span>
        {/* [E1] retrieveButton[조회].Select (L71) → retrieve() */}
        <Button type="search" onClick={() => crud.retrieve()}>조회</Button>
        {/* [E2] insertButton[등록].Select (L77) → insert() */}
        <Button type="register" onClick={() => { if (infoId == null) { message.warning('장비를 먼저 선택해주세요'); return; } crud.addRow(); }}>등록</Button>
        <Button type="delete" onClick={deleteRow}>삭제</Button>
        {/* [E4] updateButton[저장].Select (L89) → update(). 저장(n)은 UX-03 */}
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<BmtHistory> crud={crud} columnDefs={columnDefs} rowSelection={SINGLE_SELECTION} />
      </div>
      <Emp00_Lookup_SelectSingle open={pickRowId != null} separateAddTitle noneLabel="선택안함" transDate={dayjs().format('YYYY-MM-DD')} onResult={onPickEmp} onClose={() => setPickRowId(null)} />
    </div>
  );
};
