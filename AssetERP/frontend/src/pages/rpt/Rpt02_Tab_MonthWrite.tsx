/**
 * [1260] 커뮤니티 > 04. 업무보고 > 월간회의자료 (Z10)
 * AS-IS: myApp/client/vi/rpt/Rpt02_Tab_MonthWrite.java (329줄) + Rpt02_Edit_MonthWrite (204줄, 등록/수정 창) + Rpt02_Lookup_FileList (248줄, 파일목록) + Org00_Lookup_SelectSingle(공용) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L79-111: north = 툴바 50(기준년월 연 45 + 월 콤보 60 · 본부(부서) 180 · 검색 250 "본부(부서)/업무내용/비고" · [조회][등록][삭제][출력/다운로드]), center = 월간회의자료 그리드(행번호, 체크박스 다중)
 * 스타일: SGP (견본 — docs/page-style/SGP/Chk02_Tab_DailyList.tsx, 편집 팝업 Rpt02_Edit_MonthWrite)
 * RD: [출력/다운로드]는 `sys99_print`를 채워 `RdViewer`로 mrd Rpt02_Rd_Month를 띄운다(docs/RD-대책.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 조건이 3개이나 줄바꿈 위험이 있어 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Modal } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { rptMonthApi } from '@/api/rpt';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { RptMonth } from '@/types/rpt';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Org00_Lookup_SelectSingle } from '@/components/lookup/Org00_Lookup_SelectSingle';
import { RdViewer } from '@/components/lookup/RdViewer';
import { SearchBar } from '@/components/search';
import { Rpt02_Edit_MonthWrite, RptMonthEdit } from './Rpt02_Edit_MonthWrite';
import { Rpt02_Lookup_FileList } from './Rpt02_Lookup_FileList';

const gb = gbFor<RptMonth>();
const ALL_MONTH: [string, string][] = [['%', '전체']];

export const Rpt02_Tab_MonthWrite: React.FC = () => {
  const gridRef = useRef<AgGridReact<RptMonth>>(null);
  const [rows, setRows] = useState<RptMonth[]>([]);
  const [editTarget, setEditTarget] = useState<RptMonthEdit | null>(null);
  const [fileTarget, setFileTarget] = useState<RptMonth | null>(null);
  const [rdUrl, setRdUrl] = useState<string | null>(null);
  const [orgOpen, setOrgOpen] = useState(false);

  // settings() L113-139: 기준년월 = 오늘 연·월, 본부 없음(전체), 검색어 빈칸
  const [year, setYear] = useState(() => dayjs().format('YYYY'));
  const [month, setMonth] = useState<string>(() => dayjs().format('MM'));
  const [orgCodeId, setOrgCodeId] = useState<number | null>(null);
  const [orgName, setOrgName] = useState('');
  const [searchText, setSearchText] = useState('');
  const cur = useRef({ year, month, orgCodeId, searchText });
  cur.current = { year, month, orgCodeId, searchText };

  // retrieve() L266-279: 서비스 rpt.Rpt02_Month.selectByText(companyId, yyyyMm = 연 + "." + 월 코드, orgCodeId, "%검색어%")
  const retrieve = useCallback(async (over?: Partial<typeof cur.current>) => {
    const v = { ...cur.current, ...over };
    try {
      setRows(await rptMonthApi.search(`${v.year}.${v.month}`, v.orgCodeId, v.searchText));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (생성자 L79-111) → settings() · [E1] monthComboBox.callbackOnCreate (L62) → retrieve()
  useEffect(() => {
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E3] orgField.TriggerClick (L131) → lookupOrg() L302-324: 월이 '%'(전체)면 기준일 오늘, 아니면 그 달 1일 → Org00_Lookup_SelectSingle.open(기준일, 전체 버튼)
  const orgBaseDate = month === '%' ? dayjs().format('YYYY-MM-DD') : `${year}-${month}-01`;

  // [E7]·[E8] deleteButton[삭제].Select [YES] (L161) · msgBox.DialogHide [YES] (L166) → deleteRow() L291-300
  const deleteRow = () => {
    const checked = gridRef.current?.api?.getSelectedRows() ?? [];
    Modal.confirm({
      title: '확인',
      content: `${checked.length}건의 내용을 삭제하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 310,
      onOk: async () => {
        if (checked.length === 0) { message.warning('대상을 먼저 선택해주세요'); return; }
        try {
          await rptMonthApi.delete(checked.map(r => r.monthId));
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
          return;
        }
        await retrieve();
      },
    });
  };

  // [E9] downLoadButton[출력/다운로드].Select (L185) → 서비스 sys.Sys99_Print.insertRdMonth(windowClassName "Rpt02_Tab_MonthWrite", companyId, personId, yyyyMm, orgCodeId, searchText)
  //   → 성공이면 RDViewer.viewer(dns admin · CommonViewer.html · mrd Rpt02_Rd_Month · options "/rhtmlimportopt [2]" · rv rdGroupId·companyId·personId)
  const downLoad = async () => {
    const v = cur.current;
    try {
      const groupId = await rptMonthApi.rdPrint(`${v.year}.${v.month}`, v.orgCodeId, v.searchText);
      const res = await rdApi.buildUrl({
        kind: 'viewer',
        mrd: 'Rpt02_Rd_Month',
        options: '/rhtmlimportopt [2]',
        rv: { rdGroupId: groupId },
      });
      setRdUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    }
  };

  // buildGrid() L224-264
  const columnDefs = useMemo(() => [
    gb.textCenter('orgName', 150, '본부(부서)'),  // L248
    gb.textCenter('yyyyMm', 100, '기준년월'),  // L249
    gb.textArea('content', 650, '업무내용'),  // L250 addTextLimitArea
    gb.textArea('note', 500, '비고'),  // L251 addTextLimitArea
    // [E10] editCell (ImageCell "Edit").callbackOnCreate (L231) → Rpt02_Edit_MonthWrite.edit(선택 행, callback → retrieve())
    iconCell<RptMonth>('edit', 'actionCell', 80, '수정', row => setEditTarget(row)),  // L252
    gb.longCenter('fileCount', 80, '첨부파일'),  // L253
    // [E11] uploadCell (ImageCell "Upload").callbackOnCreate (L245) → Rpt02_Lookup_FileList.open(monthId, callback → retrieve())
    iconCell<RptMonth>('upload', 'actionCell01', 30, ' ', row => setFileTarget(row)),  // L254
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E5] retrieveButton[조회].Select (L149) → retrieve(), [E4] searchText.KeyPress [Enter] (L141) → retrieve() */}
      <SearchBar
        onSearch={() => retrieve()}
        extra={
          <>
            {/* [E6] insertButton[등록].Select (L155) → insertRow() L281-289: Rpt02_Edit_MonthWrite.insert(callback → retrieve()) */}
            <Button type="register" onClick={() => setEditTarget({})}>등록</Button>
            <Button type="delete" onClick={deleteRow}>삭제</Button>
            <Button type="download" onClick={downLoad}>출력/다운로드</Button>
          </>
        }
      >
        <SearchBar.Field label="기준년월">
          <Input style={{ width: 60 }} maxLength={4} value={year} onChange={e => setYear(e.target.value)} />
          {/* [E2] monthComboBox[MonthsCode].Collapse (L122) → retrieve() */}
          <SystemCodeComboBox
            kindCd="MonthsCode"
            addCodes={ALL_MONTH}
            allowClear={false}
            style={{ width: 80 }}
            value={month}
            onChange={c => { if (c) { setMonth(c); void retrieve({ month: c }); } }}
          />
        </SearchBar.Field>
        <SearchBar.Field label="본부(부서)">
          <LookupInput width={180} value={orgName} onOpen={() => setOrgOpen(true)} />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 250 }} placeholder="본부(부서)/업무내용/비고" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiGrid<RptMonth>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.monthId)}
        />
      </div>
      <Rpt02_Edit_MonthWrite model={editTarget} onClose={() => setEditTarget(null)} onDone={() => { void retrieve(); }} />
      <Rpt02_Lookup_FileList open={fileTarget != null} parentId={fileTarget?.monthId} onClose={() => { setFileTarget(null); void retrieve(); }} />
      {orgOpen && (
        <Org00_Lookup_SelectSingle
          baseDate={orgBaseDate}
          fixDate={false}
          allButton
          onAll={() => { setOrgCodeId(null); setOrgName(''); }}
          onClose={() => setOrgOpen(false)}
          onSelect={org => { setOrgCodeId(org.orgCodeId); setOrgName(org.korNm ?? ''); }}
        />
      )}
      <RdViewer url={rdUrl} title="월간회의자료" onClose={() => setRdUrl(null)} />
    </div>
  );
};
