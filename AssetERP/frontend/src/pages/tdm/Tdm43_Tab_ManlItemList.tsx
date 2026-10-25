/**
 * [1468] 책무 > 90. 책무관리현황 > 매뉴얼 규정/양식 연결 (N27)
 * AS-IS: myApp/client/vi/tdm/Tdm43_Tab_ManlItemList.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L67-100: 위 툴바(기준일 · 검색 · [조회][법규연결][내규연결][양식연결][문서분류연결]) + 가운데 점검항목 그리드(체크박스 다중) + 오른쪽 340 `Tdm45_TabPage_Relate`
 * 함께: Tdm45_TabPage_Relate·Tdm43_Lookup_RefBasis·Tdm43_Lookup_EtcModify(신규) / Tdm43_Edit_Manl(view)·Tdm43_Lookup_RelateFormFileList·Tdm43_Lookup_ExctDuty(기존)
 *   / Ics01_Lookup_SelectMulti·Icr01_Lookup_SelectMulti·Dcr01_Lookup_SelectMulti(다른 도메인, 기존)
 * UX보강(10): 툴바 = SearchBar(UX-01, 버튼이 많아 UX-02 초기화는 뺀다)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmManlFormFile, TdmManlList } from '@/types/tdm';
import { Button } from '@/components/button';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Dcr01_Lookup_SelectMulti } from '../dcr/Dcr01_Lookup_SelectMulti';
import { Icr01_Lookup_SelectMulti } from '../icr/Icr01_Lookup_SelectMulti';
import { Ics01_Lookup_SelectMulti } from '../ics/Ics01_Lookup_SelectMulti';
import { Tdm43_Edit_Manl } from './Tdm43_Edit_Manl';
import { Tdm43_Lookup_EtcModify } from './Tdm43_Lookup_EtcModify';
import { Tdm43_Lookup_RelateFormFileList } from './Tdm43_Lookup_RelateFormFileList';
import { Tdm45_TabPage_Relate } from './Tdm45_TabPage_Relate';

const gb = gbFor<TdmManlList>();

type LinkKind = 'ics' | 'icr' | 'form' | 'dcr';

export const Tdm43_Tab_ManlItemList: React.FC = () => {
  const [stdDate, setStdDate] = useState<Dayjs>(dayjs());   // settings() L102-104: 기준일 = LoginUser.getToday()
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<TdmManlList[]>([]);
  const [loading, setLoading] = useState(false);
  const gridRef = useRef<AgGridReact<TdmManlList>>(null);
  const [checkedIds, setCheckedIds] = useState<number[]>([]);
  const [selectFirst, setSelectFirst] = useState(0);
  const [nonce, setNonce] = useState(0);
  const [view, setView] = useState<TdmManlList | null>(null);
  const [etc, setEtc] = useState<TdmManlList | null>(null);
  const [lookup, setLookup] = useState<LinkKind | null>(null);

  // retrieve() L225-242: tdm.Tdm43_Manl.selectByDate(companyId, stdDate, "%검색어%") → 첫 행이 있으면 선택
  const retrieve = useCallback(async (d: Dayjs = stdDate, text: string = searchText) => {
    setLoading(true);
    try {
      const list = await tdmApi.searchManlsByDate(d.format('YYYY-MM-DD'), text);
      setRows(list);
      setCheckedIds([]);
      setSelectFirst(n => n + 1);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [stdDate, searchText]);

  // 읽은 뒤 첫 행 선택: grid.getSelectionModel().select(0, false)
  useEffect(() => {
    if (selectFirst === 0) return;
    const t = setTimeout(() => {
      const api = gridRef.current?.api;
      api?.deselectAll();
      api?.getDisplayedRowAtIndex(0)?.setSelected(true);
    }, 0);
    return () => clearTimeout(t);
  }, [selectFirst]);

  // [E0] 화면 열림 (생성자 L67-100) → settings(), retrieve()
  useEffect(() => { void retrieve(); }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  // 한 건만 골랐을 때만 오른쪽 목록이 켜진다 — [E7] grid.SelectionChanged (L167) → tabPage.setEnabled(size == 1), tabPage.retrieve()
  const selected = checkedIds.length === 1 ? rows.find(r => r.manlId === checkedIds[0]) ?? null : null;

  // manlGrid.getStore().update(model)
  const updateRows = (list: TdmManlList[]) => {
    const byId = new Map(list.map(r => [r.manlId, r]));
    setRows(prev => prev.map(r => byId.get(r.manlId) ?? r));
  };

  // insertEnd() L341-352
  const insertEnd = (list: TdmManlList[]) => {
    message.success('연결이 완료되었습니다');
    updateRows(list);
    if (list.length === 1) setNonce(n => n + 1);   // 다건 선택시 비활성화되므로 1건인 경우만 tabPage.retrieve()
  };

  // insertIcsList() L244-266 · insertIcrList() L268-290 · insertFormList() L292-315 · insertDcrList() L317-339 → 조회창 → 서버 insertList
  const link = async (kind: LinkKind, relateIds: number[]) => {
    try {
      insertEnd(await tdmApi.linkManlRelates(kind, checkedIds, relateIds));
    } catch (err) {
      message.error(errorMessage(err, '연결 실패'));
    }
  };

  // [E3] addIcsButton[법규연결].Select [선택>0] (L123) · [E4] addIcrButton[내규연결] (L134) · [E5] addFormButton[양식연결] (L145) · [E6] addDcrButton[문서분류연결] (L156)
  const openLookup = (kind: LinkKind) => {
    if (checkedIds.length === 0) { message.warning('점검항목을 선택해주세요'); return; }
    setLookup(kind);
  };

  // buildGrid() L180-223 (setChecked MULTI) — viewCell L181-189(상세) · etcEditCell L191-204(허용항목 수정)
  const columnDefs = useMemo(() => [
    iconCell<TdmManlList>('view', 'view', 40, '상세', row => setView(row)),  // L209 → Tdm43_Edit_Manl.view
    gb.text('roleName', 150, '직책'),  // L210
    gb.text('orgName', 150, '점검부서'),  // L211
    gb.textArea('taskRelateDutyName', 300, '관리의무'),  // L212
    gb.textArea('checkItemAddCode', 350, '점검항목'),  // L213
    gb.textCenter('icsCntStr', 65, '연관법규'),  // L214
    gb.textCenter('icrCntStr', 65, '연관내규'),  // L215
    gb.textCenter('formFileCntStr', 65, '연관양식'),  // L216
    gb.textCenter('dcrCntStr', 65, '연관문서'),  // L217
    gb.booleanYn2('unuseYn', 65, '미사용'),  // L218
    iconCell<TdmManlList>('edit', 'etcEdit', 65, '허용항목<br>수정', row => setEtc(row)),  // L219 → Tdm43_Lookup_EtcModify.open
    gb.text('jobName', 250, '매뉴얼작업명'),  // L220
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10 }}>
        {/* [E1] searchText.KeyPress [Enter] (L108)·[E2] retrieveButton[조회].Select (L117) → retrieve() */}
        <SearchBar
          onSearch={() => retrieve()}
          extra={
            <>
              <Button type="register" onClick={() => openLookup('ics')}>법규연결</Button>
              <Button type="register" onClick={() => openLookup('icr')}>내규연결</Button>
              <Button type="register" onClick={() => openLookup('form')}>양식연결</Button>
              <Button type="register" onClick={() => openLookup('dcr')}>문서분류연결</Button>
            </>
          }
        >
          <SearchBar.Field label="기준일">
            <DatePicker style={{ width: 120 }} format="YYYY.MM.DD" allowClear={false} value={stdDate} onChange={d => d && setStdDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 350 }} placeholder="직책/담당부서/관리의무/점검항목코드/점검항목" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <MultiGrid<TdmManlList>
              gridRef={gridRef}
              rowData={rows}
              columnDefs={columnDefs}
              loading={loading}
              getRowId={p => String(p.data.manlId)}
              onCheckedChange={list => setCheckedIds(list.map(r => r.manlId))}
            />
          </div>
          <div style={{ width: 340, border: '1px solid #d9d9d9', boxSizing: 'border-box', marginLeft: 2 }}>
            <Tdm45_TabPage_Relate manl={selected} nonce={nonce} onRowChanged={row => updateRows([row])} />
          </div>
        </div>
      </div>
      <Tdm43_Edit_Manl mode="view" manl={view} onClose={() => setView(null)} />
      <Tdm43_Lookup_EtcModify
        target={etc ? { manl: etc, stdDate: stdDate.format('YYYY-MM-DD') } : null}
        onSaved={row => { updateRows([row]); setEtc(row); }}
        onClose={() => setEtc(null)}
      />
      <Ics01_Lookup_SelectMulti open={lookup === 'ics'} actionCode="classTree"
        onResult={list => void link('ics', list.map(m => m.classTreeId))} onClose={() => setLookup(null)} />
      <Icr01_Lookup_SelectMulti open={lookup === 'icr'} actionCode="classTree"
        onResult={list => void link('icr', list.map(m => m.classTreeId))} onClose={() => setLookup(null)} />
      <Tdm43_Lookup_RelateFormFileList relateId={lookup === 'form' ? 0 : null}
        onResult={(list: TdmManlFormFile[]) => void link('form', list.map(m => m.fileId))} onClose={() => setLookup(null)} />
      <Dcr01_Lookup_SelectMulti open={lookup === 'dcr'}
        onResult={list => void link('dcr', list.map(m => m.classTreeId))} onClose={() => setLookup(null)} />
    </div>
  );
};
