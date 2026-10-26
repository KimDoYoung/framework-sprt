/**
 * [1042] 스케줄 > 01. 업무일정 > 업무일정 등록 (O01)
 * AS-IS: myApp/client/vi/sch/Sch01_Tab_Info.java (342줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 생성자 L71-114: center=세로 테두리 박스(툴바 50 + 그리드). 툴바 왼쪽 = 분류(콤보 150, 전체 + 내 분류) · 주기(CycleCode 콤보 100, 전체 %) · 검색(200, "스케줄명/주기구분/보고처") ·
 *   [데일리 체크리스트만 보기] · [사용스케줄만 보기](기본 켬) · [조회][등록][삭제], 오른쪽 끝 = [담당자 변경]. 그리드는 체크 다중
 * 연결: Sch01_Lookup_Info(등록·수정) · Sch01_Lookup_ManagerModi(+Run) · Sch01_Grid_RelateFile · Sch08_Lookup_Class · Sch06_Lookup_AlarmSetup · Sch03_Lookup_Short/Cycle(E01-1 재사용)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 박스 안 여백 = 11 §5(padding 10·gap 8). 초기화(UX-02)는 조건 5개에 [등록][삭제]·오른쪽 [담당자 변경]까지 한 줄이라 줄바꿈 위험이 있어 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, Modal, Select, message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { schApi } from '@/api/sch';
import { errorMessage } from '@/api/client';
import { Sch01Info, Sch08ClassCombo } from '@/types/sch';
import { Button } from '@/components/button';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Sch01_Lookup_Info, InfoWindowTarget } from './Sch01_Lookup_Info';
import { Sch01_Lookup_ManagerModi } from './Sch01_Lookup_ManagerModi';

const gb = gbFor<Sch01Info>();
const ALL_CODE: [string, string] = ['%', '전체'];   // CommonComboBoxField("CycleCode", "%", "전체")

export const Sch01_Tab_Info: React.FC = () => {
  const [classes, setClasses] = useState<Sch08ClassCombo[]>([]);
  const [classId, setClassId] = useState('');
  const [cycleCode, setCycleCode] = useState('%');
  const [searchText, setSearchText] = useState('');
  const [dailyYn, setDailyYn] = useState(false);   // dailyYnCheckBox "데일리 체크리스트만 보기" (L159)
  const [useYn, setUseYn] = useState(true);        // useYnCheckBox "사용스케줄만 보기" (L162)
  const [rows, setRows] = useState<Sch01Info[]>([]);
  const [infoWin, setInfoWin] = useState<InfoWindowTarget | null>(null);
  const [managerOpen, setManagerOpen] = useState(false);
  const gridRef = useRef<AgGridReact<Sch01Info>>(null);
  const selectFirst = useRef(false);

  // 콤보를 닫는 순간(Collapse)에는 방금 고른 값이 아직 state에 반영되지 않았을 수 있어 ref로 최신 값을 읽는다
  const latest = useRef({ classId, cycleCode, searchText, dailyYn, useYn });
  latest.current = { classId, cycleCode, searchText, dailyYn, useYn };

  // retrieve() L232-254: sch.Sch01_Info.selectByText(분류·주기·"%검색%"·데일리·사용) → 조회 뒤 첫 행 선택(grid.getSelectionModel().select(0, false))
  const retrieve = useCallback(async () => {
    const c = latest.current;
    try {
      const list = await schApi.searchInfos({ classId: c.classId ? Number(c.classId) : null, cycleCode: c.cycleCode, searchText: c.searchText, dailyYn: c.dailyYn, useYn: c.useYn });
      selectFirst.current = true;
      setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // 조회·삭제 뒤 첫 행 선택 (AS-IS: 체크박스 선택 모델이라 첫 행에 체크가 걸린다)
  useEffect(() => {
    if (!selectFirst.current) return;
    selectFirst.current = false;
    const t = setTimeout(() => gridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true), 0);
    return () => clearTimeout(t);
  }, [rows]);

  // [E0] 화면 열림 (생성자 L71-114) → settings() L116-191: 분류 콤보 "전체" — [E1] 콤보가 만들어지면 곧바로 retrieve()
  useEffect(() => {
    schApi.searchClassCombo().then(setClasses).catch(() => setClasses([])).finally(() => { void retrieve(); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E6] insertButton[등록].Select (L171) → insertRow() L256-277: 담당자 = 로그인 사용자, 사용 = true인 새 행을 만들어 목록 맨 아래에 넣고 Sch01_Lookup_Info.openNew()
  const insertRow = async () => {
    try {
      const created = await schApi.createInfo();
      setRows(prev => [...prev, created]);
      setTimeout(() => gridRef.current?.api?.ensureIndexVisible(Math.max((gridRef.current?.api?.getDisplayedRowCount() ?? 1) - 1, 0)), 0);
      setInfoWin({ mode: 'new', info: created });
    } catch (err) {
      message.error(errorMessage(err, '등록 실패'));
    }
  };

  // [E7] deleteButton[삭제].Select (L178) → deleteRow() L279-291: 확인 "선택한 내용을 삭제하시겠습니까?"(삭제확인, 폭 300) → [E9] messageBox.DialogHide [YES] (L281) → delete() L293-323:
  //   sch.Sch01_Info.checkSchInfo(이미 발생한 스케줄이면 "이미 발생한 스케줄이므로 삭제할 수 없는 정보입니다") → sch.Sch01_Info.delete → 첫 행 선택
  const deleteRow = () => {
    Modal.confirm({
      title: '삭제확인',
      content: '선택한 내용을 삭제하시겠습니까?',
      width: 300,
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        const checked = gridRef.current?.api.getSelectedRows() ?? [];
        if (checked.length === 0) return;
        try {
          await schApi.deleteInfos(checked.map(r => r.infoId));
        } catch (err) {
          message.warning(errorMessage(err, '삭제 실패'));
          return;
        }
        selectFirst.current = true;
        setRows(prev => prev.filter(r => !checked.some(c => c.infoId === r.infoId)));
      },
    });
  };

  // 수정 아이콘 → Sch01_Lookup_Info.open(model, "edit", callback): callback 결과(저장한 행)가 있으면 그 행을 바꾼다 (buildGrid() L193-230)
  // 창의 callback: 저장이면 행 교체, [닫기](null)이면 new일 때 되돌린 행을 목록에서 뺀다 (newDataRollback → grid.getStore().remove)
  const onInfoResult = (row: Sch01Info | null) => {
    if (row) {
      setRows(prev => (prev.some(r => r.infoId === row.infoId) ? prev.map(r => (r.infoId === row.infoId ? row : r)) : [...prev, row]));
      return;
    }
    if (infoWin?.mode === 'new') {
      const removed = infoWin.info.infoId;
      setRows(prev => prev.filter(r => r.infoId !== removed));
    }
  };

  const columnDefs = useMemo(() => [
    iconCell<Sch01Info>('edit', 'actionCell', 45, '수정', row => setInfoWin({ mode: 'edit', info: row })),  // L215 actionCell(Edit)
    gb.text('className', 150, '분류'),
    gb.text('title', 300, '스케줄명'),
    gb.text('deadlineName', 120, '주기구분'),
    gb.text('deadlineFullName', 150, '처리일정보'),
    gb.text('shareOrgName', 130, '공유부서'),
    gb.text('sharePersonName', 120, '공유자'),
    gb.text('alarmInfo', 200, '알람설정'),
    gb.textCenter('dailyYnName', 80, '데일리여부'),
    gb.textCenter('privateYnName', 80, '비공개여부'),
    gb.boolean('useYn', 80, '사용여부'),  // addBooleanString
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          {/* [E5] retrieveButton[조회].Select (L164) → retrieve() L232-254 */}
          <SearchBar
            onSearch={retrieve}
            extra={(
              <>
                <Button type="register" onClick={insertRow}>등록</Button>
                <Button type="delete" onClick={deleteRow}>삭제</Button>
              </>
            )}
          >
            <SearchBar.Field label="분류">
              {/* [E1] scheduleClassComboBox callbackOnCreate (L121) → retrieve(), [E2] Collapse (L131) → retrieve() */}
              <Select
                style={{ width: 150 }}
                value={classId}
                onChange={v => { latest.current.classId = v; setClassId(v); }}
                onOpenChange={open => { if (!open) void retrieve(); }}
                options={[{ value: '', label: '전체' }, ...classes.map(c => ({ value: c.code, label: c.name }))]}
              />
            </SearchBar.Field>
            <SearchBar.Field label="주기">
              {/* [E3] cycleComboBox[CycleCode].Collapse (L140) → retrieve() */}
              <SystemCodeComboBox
                kindCd="CycleCode" altCode={ALL_CODE} allowClear={false} style={{ width: 100 }}
                value={cycleCode} onChange={v => { latest.current.cycleCode = v ?? '%'; setCycleCode(v ?? '%'); }}
                onOpenChange={open => { if (!open) void retrieve(); }}
              />
            </SearchBar.Field>
            <SearchBar.Field label="검색">
              {/* [E4] searchText.KeyPress [Enter] (L149) → retrieve() — SearchBar.Input이 Enter = 조회 */}
              <SearchBar.Input style={{ width: 200 }} placeholder="스케줄명/주기구분/보고처" value={searchText}
                onChange={e => { latest.current.searchText = e.target.value; setSearchText(e.target.value); }} />
            </SearchBar.Field>
            <Checkbox checked={dailyYn} onChange={e => { latest.current.dailyYn = e.target.checked; setDailyYn(e.target.checked); }}>데일리 체크리스트만 보기</Checkbox>
            <Checkbox checked={useYn} onChange={e => { latest.current.useYn = e.target.checked; setUseYn(e.target.checked); }}>사용스케줄만 보기</Checkbox>
          </SearchBar>
          {/* [E8] managerButton[담당자 변경].Select (L185) → lookupManager() L325-333: Sch01_Lookup_ManagerModi.open(callback → retrieve()) */}
          <Button type="assign" onClick={() => setManagerOpen(true)}>담당자 변경</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<Sch01Info> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.infoId)} />
        </div>
      </div>
      <Sch01_Lookup_Info target={infoWin} onResult={onInfoResult} onClose={() => setInfoWin(null)} />
      <Sch01_Lookup_ManagerModi open={managerOpen} onClosed={() => void retrieve()} onClose={() => setManagerOpen(false)} />
    </div>
  );
};
