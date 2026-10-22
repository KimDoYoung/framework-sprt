/**
 * 법규통제 체크리스트 사용여부 설정 창 (K04) — Ics10_Tab_Checklist의 [기본설정] → [사용여부설정]에서 연다
 * AS-IS: myApp/client/vi/ics/Ics10_Lookup_UseYn.java (311줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L82-122: 모달 1260×700 "법규통제 체크리스트", 툴바 50(대분류 160 · 중분류 200 · 사용여부 70 · 검색 150 "대분류/중분류/체크대상" · [조회][저장][전체선택][전체해제]),
 *   그리드(대분류 180 · 중분류 230 · 체크대상 645 · 상세보기 60 · 사용여부 80 편집), 아래 가운데 [닫기]. 열릴 때 곧바로 조회한다(open L76-80)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Select } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import type { AgGridReact } from 'ag-grid-react';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { IcsChecklistClassCode, IcsChecklistUser } from '@/types/ics';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Ics10_Edit_Checklist, ChecklistEditTarget } from './Ics10_Edit_Checklist';

const gb = gbFor<IcsChecklistUser>();
const ALL = '%';  // 대분류·중분류 "전체"
const USE_OPTIONS = [{ value: ALL, label: '전체' }, { value: 'true', label: '사용' }, { value: 'false', label: '미사용' }];  // UseYnCode (처음 값 "사용")

interface Props {
  open: boolean;
  /** cancleButton[닫기] — callback.execute(); hide(). 부른 쪽이 다시 조회한다 */
  onClosed: () => void;
  /** 창의 닫기(X) — callback 없이 닫는다 */
  onClose: () => void;
}

export const Ics10_Lookup_UseYn: React.FC<Props> = ({ open, onClosed, onClose }) => {
  const gridRef = useRef<AgGridReact<IcsChecklistUser>>(null);
  // settings() L124-201: 대분류·중분류 "전체", 사용여부 "사용", 검색어 빈칸
  const [lClass, setLClass] = useState(ALL);
  const [mClass, setMClass] = useState(ALL);
  const [useYn, setUseYn] = useState('true');
  const [searchText, setSearchText] = useState('');
  const [lCodes, setLCodes] = useState<IcsChecklistClassCode[]>([]);
  const [mCodes, setMCodes] = useState<IcsChecklistClassCode[]>([]);
  const [rows, setRows] = useState<IcsChecklistUser[]>([]);
  /** 사용여부를 바꾼(addChange) 체크리스트 id */
  const dirty = useRef<Set<number>>(new Set());
  const [viewTarget, setViewTarget] = useState<ChecklistEditTarget | null>(null);

  // retrieve() L256-277: ics.Ics10_Checklist.selectBySearchText(companyId(서버), 대분류·중분류 id(전체면 없음), useYn(콤보 값), "%검색어%", 기준일 오늘)
  const retrieve = useCallback(async (over?: { l?: string; m?: string; y?: string; text?: string }) => {
    const l = over?.l ?? lClass;
    const m = over?.m ?? mClass;
    try {
      const list = await icsApi.searchChecklistsForCompany({
        checklistLClassId: l === ALL ? null : Number(l),
        checklistMClassId: m === ALL ? null : Number(m),
        useYn: over?.y ?? useYn,
        searchText: over?.text ?? searchText,
      });
      dirty.current = new Set();
      setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [lClass, mClass, useYn, searchText]);

  // refreshCode() L203-215: 대분류에 맞춰 중분류 콤보를 다시 읽고 retrieve()
  const refreshCode = async (l: string) => {
    try { setMCodes(await icsApi.searchChecklistMCodes(l === ALL ? null : Number(l))); } catch (err) { message.error(errorMessage(err, '조회 실패')); }
    await retrieve({ l, m: ALL });
  };

  // [E0] 화면 열림 (생성자 L82-122, open() L76-80) → settings(), show(), retrieve()
  useEffect(() => {
    if (!open) return;
    setLClass(ALL); setMClass(ALL); setUseYn('true'); setSearchText('');
    icsApi.searchChecklistLCodes().then(setLCodes).catch(err => message.error(errorMessage(err, '조회 실패')));
    icsApi.searchChecklistMCodes(null).then(setMCodes).catch(() => undefined);
    void retrieve({ l: ALL, m: ALL, y: 'true', text: '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E7] selectAllButton[전체선택].Select (L181) → selectAll() L242-247 / [E8] releaseAllButton[전체해제].Select (L187) → releaseAll() L249-254: 모든 행의 사용여부를 바꾼다
  const setAllUseYn = (yn: 'true' | 'false') => {
    rows.forEach(r => dirty.current.add(r.checklistId));
    setRows(prev => prev.map(r => ({ ...r, useYn: yn })));
  };

  // [E6] updateButton[저장].Select (L175) → update() L279-302: 바꾼 행으로 ics.Ics11_ChecklistCompany.updateUseYn → "설정이 저장되었습니다" → retrieve()
  const update = async () => {
    const changed = rows.filter(r => dirty.current.has(r.checklistId)).map(r => ({ checklistId: r.checklistId, useYn: r.useYn ?? 'true' }));
    try {
      await icsApi.updateChecklistUseYn(changed);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
      return;
    }
    message.success('설정이 저장되었습니다');
    await retrieve();
  };

  // buildGrid() L217-240
  const columnDefs = useMemo(() => [
    gb.text('checkLClassName', 180, '대분류'),  // L233
    gb.text('checkMClassName', 230, '중분류'),  // L234
    gb.textArea('content', 645, '체크대상'),  // L235
    iconCell<IcsChecklistUser>('view', 'actionCell', 60, '상세보기', row => setViewTarget({ model: row })),  // L236 Ics10_Edit_Checklist.open(selectModel, callback → retrieve())
    gb.boolean('useYn', 80, '사용여부', { editable: true }),  // L237
  ], []);

  return (
    <LookupModal
      open={open}
      title="법규통제 체크리스트"
      width={1300}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E9] cancleButton[닫기].Select (L194) → callback.execute(); hide() */}
          <Button type="close" onClick={() => { onClosed(); onClose(); }}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 540, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E5] retrieveButton[조회].Select (L169) → retrieve(), [E4] searchText.KeyPress [Enter] (L161) → retrieve() */}
        <SearchBar
          onSearch={() => retrieve()}
          extra={
            <>
              <Button type="save" onClick={update}>저장</Button>
              <Button type="addRow" onClick={() => setAllUseYn('true')}>전체선택</Button>
              <Button type="removeRow" onClick={() => setAllUseYn('false')}>전체해제</Button>
            </>
          }
        >
          <SearchBar.Field label="대분류">
            {/* [E1] checkLClassName[sys.Sys09_Code.selectByIcs21].Collapse (L132) → 중분류를 "전체"로 되돌리고 refreshCode() */}
            <Select style={{ width: 160 }} value={lClass} onChange={v => { setLClass(v); setMClass(ALL); void refreshCode(v); }}
              options={[{ value: ALL, label: '전체' }, ...lCodes.map(c => ({ value: c.code, label: c.name }))]} />
          </SearchBar.Field>
          <SearchBar.Field label="중분류">
            {/* [E2] checkMClassName[sys.Sys09_Code.selectByIcs23].Collapse (L144) → retrieve() */}
            <Select style={{ width: 200 }} value={mClass} onChange={v => { setMClass(v); void retrieve({ m: v }); }}
              options={[{ value: ALL, label: '전체' }, ...mCodes.map(c => ({ value: c.code, label: c.name }))]} />
          </SearchBar.Field>
          <SearchBar.Field label="사용여부">
            {/* [E3] useYnComboBox[UseYnCode].Collapse (L152) → retrieve() */}
            <Select style={{ width: 90 }} value={useYn} onChange={v => { setUseYn(v); void retrieve({ y: v }); }} options={USE_OPTIONS} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 150 }} placeholder="대분류/중분류/체크대상" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<IcsChecklistUser>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.checklistId)}
            onCellValueChanged={e => { if (e.colDef.field === 'useYn' && e.data) dirty.current.add(e.data.checklistId); }}
          />
        </div>
      </div>
      <Ics10_Edit_Checklist target={viewTarget} readOnly onClosed={() => { void retrieve(); }} onClose={() => setViewTarget(null)} />
    </LookupModal>
  );
};
