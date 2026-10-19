/**
 * 거래유형별 분개맵핑의 분개맵핑 그리드 (E30) — Act11_Tab_TrJournalMap 아래쪽 (center)
 * AS-IS: myApp/client/vi/act/Act11_Grid_TrJournalMap.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L62-79: 툴바([등록][저장][삭제]) + 분개맵핑 셀 편집 그리드(행번호, 체크박스 다중, 정렬 없음)
 * UX보강(10): 저장 = 저장(n)(UX-03)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button as AntButton, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { actApi } from '@/api/act';
import { errorMessage } from '@/api/client';
import { sysApi } from '@/api/sys';
import { JournalMap } from '@/types/act';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { Act10_Lookup_ReprAccount } from '@/components/lookup/Act10_Lookup_ReprAccount';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';

const gb = gbFor<JournalMap>();
const ALL = '%';

/** 대표계정 조회창을 연 행과 미리 넣을 검색어 (lookupReprAccount(searchText) L166-175) */
interface ReprTarget { row: JournalMap; searchText?: string }

/**
 * buildGrid() L103-164
 * - 대표계정코드: LookupTriggerField — [E4] TriggerClick (L109) → 조회창, [E5] ValueChange (L115) → 글자로 찾아 반영(없으면 조회창)
 * - 차대구분: 콤보 셀 — [E6] comboBoxDrcrField[DrcrType].Collapse (L144) → 고른 코드를 그 행의 drcrType에 반영
 */
const buildGrid = (drcr: Code[], openRepr: (t: ReprTarget) => void, onTyped: (row: JournalMap, text: string) => void) => [
  gb.textCenter('journalGroup', 120, '분개그룹', { editor: 'text' }),  // L151
  gb.long('seq', 80, '순번', { editor: 'number' }),  // L152
  gb.textCenter('reprAccountCode', 120, '대표계정코드', {  // L153
    editor: 'text',
    cellStyle: { color: '#1677ff' },
    valueSetter: p => {
      p.data.reprAccountCode = p.newValue;
      onTyped(p.data, p.newValue ?? '');
      return true;
    },
    cellRenderer: (p: { data?: JournalMap; value?: string }) => (
      <>
        <AntButton type="text" size="small" icon={<SearchOutlined />}
          onClick={e => { e.stopPropagation(); if (p.data) openRepr({ row: p.data }); }} />
        {p.value}
      </>
    ),
  }),
  gb.text('reprAccountName', 200, '대표계정명'),  // L154
  gb.textCenter('drcrTypeName', 120, '차대구분', {  // L155
    editor: 'select',
    values: drcr.map(c => c.name),
    valueSetter: p => {
      p.data.drcrTypeName = p.newValue;
      p.data.drcrType = drcr.find(c => c.name === p.newValue)?.code ?? p.data.drcrType;
      return true;
    },
  }),
  gb.text('formula', 200, '계산식', { editor: 'text' }),  // L156
  gb.text('forFormula', 200, '외화계산식', { editor: 'text' }),  // L157
  gb.text('note', 300, '비고', { editor: 'text' }),  // L158
  gb.boolean('useYn', 80, '사용', { editable: true }),  // L159
];

interface Props {
  /** retrieve(journalGroup) L211-214: 위쪽에서 고른 거래맵핑의 분개그룹 */
  journalGroup: string | null;
  /** 같은 분개그룹이라도 다시 읽게 하는 신호 (위쪽 행을 누를 때마다 올라간다) */
  nonce: number;
}

export const Act11_Grid_TrJournalMap: React.FC<Props> = ({ journalGroup, nonce }) => {
  const user = useLoginUser();
  const [drcr, setDrcr] = useState<Code[]>([]);
  const [reprTarget, setReprTarget] = useState<ReprTarget | null>(null);
  const selectFirst = useRef(false);
  const group = useRef<string | null>(journalGroup);
  group.current = journalGroup;
  const typed = useRef<(row: JournalMap, text: string) => void>(() => undefined);

  const columnDefs = useMemo(
    () => buildGrid(drcr, setReprTarget, (row, text) => typed.current(row, text)),
    [drcr],
  );

  const crud = useGridCrud<JournalMap>({
    idField: 'journalMapId',
    // retrieve() L217-231: 로그인 회사, 분개그룹 → act.Act12_JournalMap.selectByJournalGroup
    search: useCallback(() => actApi.searchJournalMaps(group.current ?? ''), []),
    // update() L234-237: GridUpdate → act.Act12_JournalMap.update
    save: useCallback((rows: JournalMap[]) => actApi.updateJournalMaps(rows), []),
    remove: useCallback((ids: number[]) => actApi.deleteJournalMaps(ids), []),
    // insertRow() L240-247: 회사 = 로그인 회사, 분개그룹 = 지금 보는 분개그룹, 사용 켬
    newRow: useCallback(() => ({ companyId: user.companyId, journalGroup: group.current, useYn: 'true' }), [user.companyId]),
    firstEditField: 'journalGroup',
    // preUpdate() L183-209: 바뀐 행마다 분개그룹 → 순번 → 대표계정코드 → 차대구분 순으로 필수 검사
    validate: (changed: JournalMap[]) => {
      for (const r of changed) {
        if (r.journalGroup == null || r.journalGroup === '') return '분개그룹은 필수입력 항목입니다.';
        if (r.seq == null) return '순번은 필수입력 항목입니다.';
        if (r.reprAccountCode == null || r.reprAccountCode === '') return '대표계정코드는 필수입력 항목입니다.';
        if (r.drcrType == null || r.drcrType === '') return '차대구분은 필수입력 항목입니다.';
      }
      return undefined;
    },
    // deleteRow() L250-276: "확인"/"n건의 분개맵핑 정보를 삭제하시겠습니까?" → [E7] msgBox.DialogHide [YES] (L258)
    deleteConfirm: (n: number) => `${n}건의 분개맵핑 정보를 삭제하시겠습니까?`,
  });

  // [E0] 화면 열림 (생성자 L62-79) → settings(): 차대구분 콤보 코드
  useEffect(() => {
    sysApi.searchCodes('DrcrType').then(setDrcr).catch(() => undefined);
  }, []);

  // retrieve(journalGroup) L211-231: 위쪽에서 행을 고를 때마다 읽고 첫 행을 고른다
  useEffect(() => {
    if (journalGroup == null && nonce === 0) return;
    selectFirst.current = true;
    void crud.retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [journalGroup, nonce]);

  /** 대표계정을 그 행에 반영한다 — setReprAccount() L177-181 (변경으로 친다) */
  const setReprAccount = (row: JournalMap, code: string | null, name: string | null) =>
    crud.updateRow(row.journalMapId, { reprAccountCode: code, reprAccountName: name });

  // [E5] lookupReprAccountField.ValueChange (L115): 비우면 지우고, 글자가 있으면 "%글자%"로 찾아 첫 행을 반영, 없으면 그 글자로 조회창
  typed.current = async (row, text) => {
    if (text === '') {
      setReprAccount(row, null, null);
      return;
    }
    try {
      const list = await actApi.searchReprAccounts(ALL, text);
      if (list.length > 0) setReprAccount(row, list[0].reprAccountCode, list[0].reprAccountName);
      else setReprTarget({ row, searchText: text });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E3] deleteButton[삭제].Select (L95) → deleteRow() L250-276: 선택이 없으면 "삭제할 분개 맵핑정보를 선택해주세요"
  const deleteRow = () => {
    if ((crud.gridRef.current?.api.getSelectedRows().length ?? 0) === 0) {
      message.warning('삭제할 분개 맵핑정보를 선택해주세요');
      return;
    }
    crud.deleteChecked();
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', gap: 5 }}>
        {/* [E1] insertButton[등록].Select (L83) → insertRow() */}
        <Button type="register" onClick={crud.addRow}>등록</Button>
        {/* [E2] updateButton[저장].Select (L89) → preUpdate(). 저장(n)은 UX-03 */}
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
        <Button type="delete" onClick={deleteRow}>삭제</Button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<JournalMap>
          crud={crud}
          columnDefs={columnDefs}
          onRowDataUpdated={e => {
            // 처음 그릴 때의 빈 데이터 갱신은 건너뛴다 — 조회 결과가 들어온 뒤에 첫 행을 고른다
            if (!selectFirst.current || e.api.getDisplayedRowCount() === 0) return;
            selectFirst.current = false;
            e.api.getDisplayedRowAtIndex(0)?.setSelected(true);
          }}
        />
      </div>
      {/* [E4] lookupReprAccountField.TriggerClick (L109) → lookupReprAccount() L166-175: 고른 대표계정의 코드·이름을 그 행에 */}
      <Act10_Lookup_ReprAccount
        open={reprTarget !== null}
        searchText={reprTarget?.searchText}
        onResult={r => { if (reprTarget) setReprAccount(reprTarget.row, r.reprAccountCode, r.reprAccountName); setReprTarget(null); }}
        onClose={() => setReprTarget(null)}
      />
    </div>
  );
};
