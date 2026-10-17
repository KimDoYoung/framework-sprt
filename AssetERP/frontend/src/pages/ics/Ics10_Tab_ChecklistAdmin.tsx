/**
 * [1232] 기초자료 > 00. 내부통제 > 내부통제 체크리스트(관리자) (E04)
 * AS-IS: myApp/client/vi/ics/Ics10_Tab_ChecklistAdmin.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L67-119: north = 툴바(대분류 180 · 중분류 210 · 사용여부 100 · 검색 250 "대분류/중분류/체크내용/근거" · [조회][등록][삭제] · [분류관리]),
 *   center = 체크리스트 그리드(행번호, 체크박스 다중), east(500, 늘일 수 있음) = 선택한 체크리스트의 연관 내부통제(Sch05_Page_RelateIcs)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 줄바꿈이 늘어 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Select, Splitter } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { IcsChecklist, IcsChecklistClassCode } from '@/types/ics';
import { Button } from '@/components/button';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Sch05_Page_RelateIcs, Sch05_Page_RelateIcsHandle } from '@/components/lookup/Sch05_Page_RelateIcs';
import { Ics10_Edit_Checklist, ChecklistEditTarget } from './Ics10_Edit_Checklist';
import { Ics21_Lookup_CheckList } from './Ics21_Lookup_CheckList';

const gb = gbFor<IcsChecklist>();
const ALL = '%';  // 대분류·중분류 "전체"
const USE_OPTIONS = [{ value: ALL, label: '전체' }, { value: 'true', label: '사용' }, { value: 'false', label: '미사용' }];  // useYnComboBox 전체·사용·미사용

export const Ics10_Tab_ChecklistAdmin: React.FC = () => {
  const gridRef = useRef<AgGridReact<IcsChecklist>>(null);
  const relateRef = useRef<Sch05_Page_RelateIcsHandle>(null);
  // settings() L121-225: 대분류·중분류·사용여부 "전체", 검색어 빈칸
  const [lClass, setLClass] = useState(ALL);
  const [mClass, setMClass] = useState(ALL);
  const [useYn, setUseYn] = useState(ALL);
  const [searchText, setSearchText] = useState('');
  const [lCodes, setLCodes] = useState<IcsChecklistClassCode[]>([]);
  const [mCodes, setMCodes] = useState<IcsChecklistClassCode[]>([]);
  const [rows, setRows] = useState<IcsChecklist[]>([]);
  const [editTarget, setEditTarget] = useState<ChecklistEditTarget | null>(null);
  const [classOpen, setClassOpen] = useState(false);

  const loadLCodes = useCallback(async () => {
    try { setLCodes(await icsApi.searchChecklistLCodes()); } catch (err) { message.error(errorMessage(err, '조회 실패')); }
  }, []);

  // retrieve() L270-302: 서비스 ics.Ics10_Checklist.selectByAdmin(companyId(서버), 대분류·중분류 id(전체면 없음), useYn(전체 %·사용 true·미사용 false), "%검색어%", 기준일 오늘)
  const retrieve = useCallback(async (over?: { l?: string; m?: string; y?: string }) => {
    const l = over?.l ?? lClass;
    const m = over?.m ?? mClass;
    try {
      setRows(await icsApi.searchChecklists({
        checklistLClassId: l === ALL ? null : Number(l),
        checklistMClassId: m === ALL ? null : Number(m),
        useYn: over?.y ?? useYn,
        searchText,
      }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [lClass, mClass, useYn, searchText]);

  // refreshCode() L227-239: 대분류에 맞춰 중분류 콤보를 다시 읽고 retrieve()
  const refreshCode = async (l: string) => {
    try { setMCodes(await icsApi.searchChecklistMCodes(l === ALL ? null : Number(l))); } catch (err) { message.error(errorMessage(err, '조회 실패')); }
    await retrieve({ l, m: ALL });
  };

  // [E0] 화면 열림 (생성자 L67-119) → settings(): 대분류 콤보를 읽는다. 열릴 때 조회는 없다(콤보를 고르거나 [조회])
  useEffect(() => { void loadLCodes(); void icsApi.searchChecklistMCodes(null).then(setMCodes).catch(() => undefined); }, [loadLCodes]);

  // [E1] grid.RowClick (L112) → retrievePage() L304-310: 고른 체크리스트의 연관 내부통제를 읽는다
  const retrievePage = (row?: IcsChecklist) => { if (row) void relateRef.current?.retrieve(row.checklistId); };

  // [E7] insertButton[등록].Select (L200) → insertRow() L312-336: 회사·사용 true인 새 체크리스트(id는 미리 받는다)로 Ics10_Edit_Checklist를 연다
  const insertRow = async () => {
    try {
      setEditTarget({ model: { checklistId: await icsApi.getChecklistNextId(), useYn: 'true' }, isNew: true });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E8] deleteButton[삭제].Select (L206) → deleteChk() L338-356: "n건의 항목을 삭제하시겠습니까?"(제목 "삭제", 폭 300) → [E10] msgBox.DialogHide [YES] (L341) → deleteRow() L358-367: ics.Ics10_Checklist.delete → retrieve()
  const deleteChk = () => {
    const checked = gridRef.current?.api?.getSelectedRows() ?? [];
    Modal.confirm({
      title: '삭제',
      content: `${checked.length}건의 항목을 삭제하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 300,
      onOk: async () => {
        try {
          await icsApi.deleteChecklists(checked.map(r => r.checklistId));
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
        await retrieve();
      },
    });
  };

  // Ics10_Edit_Checklist 콜백: 저장하면 그 행을 그리드에 넣는다 (AS-IS grid.getStore().update(result)). 새 행은 맨 위에
  const onSaved = (saved: IcsChecklist) => {
    setRows(prev => prev.some(r => r.checklistId === saved.checklistId)
      ? prev.map(r => (r.checklistId === saved.checklistId ? saved : r))
      : [saved, ...prev]);
  };

  // buildGrid() L241-268
  const columnDefs = useMemo(() => [
    iconCell<IcsChecklist>('edit', 'actionCell', 60, '수정', row => setEditTarget({ model: row })),  // L260 Ics10_Edit_Checklist.edit(selectModel, callback → grid.getStore().update)
    gb.text('checkLClassName', 140, '대분류'),  // L261
    gb.text('checkMClassName', 210, '중분류'),  // L262
    gb.textArea('content', 400, '체크대상'),  // L263
    gb.textArea('criterion', 300, '근거'),  // L264
    gb.boolean('useYn', 60, '사용', { editable: true }),  // L265 addBoolean — 체크박스(클릭하면 값이 바뀌지만 이 화면에는 저장이 없다 — 원본도 같다)
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E6] retrieveButton[조회].Select (L194) → retrieve(), [E5] searchText.KeyPress [Enter] (L185) → retrieve(). 초기화(UX-02)는 줄바꿈이 늘어 넣지 않는다 */}
      <SearchBar
        onSearch={() => retrieve()}
        extra={
          <>
            <Button type="register" onClick={insertRow}>등록</Button>
            <Button type="delete" onClick={deleteChk}>삭제</Button>
            {/* [E9] checkListButton[분류관리].Select (L212) → Ics21_Lookup_CheckList.open(callback → 대분류 콤보 다시 읽기 + refreshCode()) */}
            <Button type="register" onClick={() => setClassOpen(true)}>분류관리</Button>
          </>
        }
      >
        <SearchBar.Field label="대분류">
          {/* [E2] icsChecklistLComboBox[sys.Sys09_Code.selectByIcs21].Collapse (L143) → 중분류를 "전체"로 되돌리고 refreshCode() */}
          <Select style={{ width: 180 }} value={lClass} onChange={v => { setLClass(v); setMClass(ALL); void refreshCode(v); }}
            options={[{ value: ALL, label: '전체' }, ...lCodes.map(c => ({ value: c.code, label: c.name }))]} />
        </SearchBar.Field>
        <SearchBar.Field label="중분류">
          {/* [E3] icsChecklistMComboBox[sys.Sys09_Code.selectByIcs23].Collapse (L161) → retrieve() */}
          <Select style={{ width: 210 }} value={mClass} onChange={v => { setMClass(v); void retrieve({ m: v }); }}
            options={[{ value: ALL, label: '전체' }, ...mCodes.map(c => ({ value: c.code, label: c.name }))]} />
        </SearchBar.Field>
        <SearchBar.Field label="사용여부">
          {/* [E4] useYnComboBox[전체].Collapse (L176) → retrieve() */}
          <Select style={{ width: 100 }} value={useYn} onChange={v => { setUseYn(v); void retrieve({ y: v }); }} options={USE_OPTIONS} />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 250 }} placeholder="대분류/중분류/체크내용/근거" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <Splitter style={{ flex: 1, minHeight: 0 }}>
        <Splitter.Panel min={400}>
          <MultiGrid<IcsChecklist>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.checklistId)}
            onRowClicked={e => retrievePage(e.data)}
          />
        </Splitter.Panel>
        <Splitter.Panel defaultSize={500} min={300} max={700}>
          <div style={{ height: '100%', paddingLeft: 8, boxSizing: 'border-box' }}>
            <Sch05_Page_RelateIcs ref={relateRef} />
          </div>
        </Splitter.Panel>
      </Splitter>
      <Ics10_Edit_Checklist target={editTarget} onSaved={onSaved} onClose={() => setEditTarget(null)} />
      <Ics21_Lookup_CheckList
        open={classOpen}
        onClosed={() => { void loadLCodes(); void refreshCode(lClass); }}
        onClose={() => setClassOpen(false)}
      />
    </div>
  );
};
