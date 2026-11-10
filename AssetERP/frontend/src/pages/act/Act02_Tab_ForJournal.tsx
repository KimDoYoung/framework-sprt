/**
 * [1177] 관리회계 > 21. 회계장부 > 분개장(외화) (X16) — X15 분개장의 외화 판
 * AS-IS: myApp/client/vi/act/Act02_Tab_ForJournal.java (488줄) + Act02_Lookup_ModiForJournal (pages/act) + Act80_Lookup_RelateAppr (pages/act)
 *   + Ast05_Lookup_TrCode·Sys15_Lookup_Corp (components/lookup) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L77-115: X15와 같은 짜임 — 조회는 abroType "2"(국외), 그리드에 통화 60이 더해지고 금액이 외화금액(실수 150)·원화금액(150) 쌍, 출력은 mrd Act02_Rd_ForJournal
 * 스타일: SG (견본 Tdm01_Tab_Hr — docs/page-style.md). 원본의 바깥 테두리(vlc.setBorders)는 SG 규칙대로 두지 않는다
 * UX보강(10): 툴바 = SearchBar(UX-01·04)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import type { ICellRendererParams } from 'ag-grid-community';
import { actApi } from '@/api/act';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { JournalDtlList } from '@/types/act';
import { Corp } from '@/types/sys';
import { TrCode } from '@/types/ast';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { RdViewer } from '@/components/lookup/RdViewer';
import { Ast05_Lookup_TrCode } from '@/components/lookup/Ast05_Lookup_TrCode';
import { Sys15_Lookup_Corp } from '@/components/lookup/Sys15_Lookup_Corp';
import { Act02_Lookup_ModiForJournal } from './Act02_Lookup_ModiForJournal';
import { Act80_Lookup_RelateAppr, ActRelateApprTarget } from './Act80_Lookup_RelateAppr';

/** 화면 행 — 서버 행 + 출력 체크(printYn, 화면에서만 쓴다) + 번호·전표 머리글 줄(AS-IS GroupSummaryView.groupBy(journalDateNo)) */
type Row = JournalDtlList & { printYn: boolean; __no?: number; __group?: boolean; groupTitle?: string };
const gb = gbFor<Row>();
const FORMAT = 'YYYY-MM-DD';
const ALL_LABEL = '전체';
const WINDOW_CLASS_NAME = 'Act02_Tab_ForJournal';
const DR = { color: '#456EA6', fontWeight: 'bold' };
const CR = { color: '#DD5E5E', fontWeight: 'bold' };

const GroupHeader: React.FC<ICellRendererParams<Row>> = ({ data }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%', paddingBottom: 4, borderBottom: '1px solid #8fb4e3', color: '#15428b', fontWeight: 'bold', fontSize: 11 }}>
    {data?.groupTitle}
  </div>
);

export const Act02_Tab_ForJournal: React.FC = () => {
  const user = useLoginUser();
  const gridRef = useRef<AgGridReact<Row>>(null);
  // [E0] 화면 열림 (생성자 L77-115) → settings() L117-228: 조회기간 = 오늘 ~ 오늘, 거래처·거래유형 "전체" → retrieve()
  const [startDate, setStartDate] = useState<Dayjs>(dayjs());
  const [closeDate, setCloseDate] = useState<Dayjs>(dayjs());
  const [corp, setCorp] = useState<{ id: number | null; name: string }>({ id: null, name: '' });
  const [tr, setTr] = useState<{ code: string | null; name: string }>({ code: null, name: '' });
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [corpOpen, setCorpOpen] = useState(false);
  const [trOpen, setTrOpen] = useState(false);
  const [rdUrl, setRdUrl] = useState<string | null>(null);
  const [modiJournalId, setModiJournalId] = useState<number | null>(null);
  const [relateTarget, setRelateTarget] = useState<ActRelateApprTarget | null>(null);
  const gridIndex = useRef(0);   // [변경] 뒤 다시 읽을 때 그 행을 다시 고르려고 기억하는 위치(AS-IS gridIndex)

  /** retrieve()·lookupRd()가 읽는 조건 — 거래처를 바꾸자마자 조회해도 새 값으로 간다 */
  const condRef = useRef({ startDate, closeDate, corp, tr, searchText });
  condRef.current = { startDate, closeDate, corp, tr, searchText };

  const params = (c = condRef.current) => ({
    startDate: c.startDate.format(FORMAT), closeDate: c.closeDate.format(FORMAT),
    corpId: c.corp.id, searchText: c.searchText, trCode: c.tr.code, abroType: '2',
  });

  // retrieve() L318-363: act.Act03_JournalDtl.selectByCompanyId(companyId, startDate, closeDate, 거래처ID("%"), 검색어("%…%"), 거래유형("%"), abroType "2" 국외)
  //   → 끝나면 [변경]에서 돌아온 경우 기억한 위치의 행, 아니면 첫 행을 고른다
  const retrieve = useCallback(async (c = condRef.current) => {
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await actApi.searchJournalDtlList(params(c));
      const data = list.map(r => ({ ...r, printYn: false }));
      setRows(data);
      const idx = gridIndex.current > 0 ? gridIndex.current : 0;
      gridIndex.current = 0;
      const target = data[idx] ?? data[0];
      if (target) setTimeout(() => gridRef.current?.api?.getRowNode(String(target.journalDtlId))?.setSelected(true), 0);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E3] corpLookupField.TriggerClick (L165) → lookupCorp() L381-395: Sys15_Lookup_Corp.openSearch(…, true): 고르면 거래처, [전체]면 비운다("전체")
  // [E4] corpLookupField.ValueChange (L171) → lookupCorp(), retrieve() — 거래처가 바뀌면 바로 조회한다
  const onCorpResult = (c: Corp | null) => {
    const next = c ? { id: c.corpId, name: c.corpName ?? '' } : { id: null, name: '' };
    setCorp(next);
    setCorpOpen(false);
    void retrieve({ ...condRef.current, corp: next });
  };
  // [E1] trLookupField.TriggerClick (L127) / [E2] ValueChange (L133) → lookupTrCode() L365-379: Ast05_Lookup_TrCode.open("view","1",null,…): 고르면 거래유형, [전체]면 비운다("전체")
  const onTrResult = (t: TrCode | null) => {
    setTr(t ? { code: t.trCode ?? null, name: t.trName ?? '' } : { code: null, name: '' });
    setTrOpen(false);
  };

  // [E7] downLoadButton[전체출력/다운로드].Select (L216) → lookupRd("All") / [E8] checkDownLoadButton[출력/다운로드].Select (L222) → lookupRd("Checked") L397-476:
  //   Checked는 출력 체크한 전표가 없으면 "출력 전표를 선택해주세요" → sys.Sys99_Print.insertRdJournal → RDViewer(mrd Act02_Rd_Journal, rv rdGroupId·companyId·personId·startDate·closeDate "yyyy-MM-dd")
  const lookupRd = async (actionName: 'All' | 'Checked') => {
    const journalIds: number[] = [];
    if (actionName === 'Checked') {
      gridRef.current?.api.forEachNode(n => { if (n.data && !n.data.__group && n.data.printYn) journalIds.push(n.data.journalId); });
      if (journalIds.length === 0) { message.info('출력 전표를 선택해주세요'); return; }
    }
    setLoading(true);
    try {
      const p = params();
      const groupId = await actApi.insertJournalDtlRd({ windowClassName: WINDOW_CLASS_NAME, ...p, searchText: p.searchText, journalIds });
      const res = await rdApi.buildUrl({
        kind: 'viewer', mrd: 'Act02_Rd_ForJournal', options: '/rhtmlimportopt [2]',
        rv: { rdGroupId: String(groupId), companyId: String(user.companyId), personId: String(user.userId), startDate: p.startDate, closeDate: p.closeDate },
      });
      setRdUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    } finally {
      setLoading(false);
    }
  };

  // 전표(journalDateNo)가 바뀔 때마다 머리글 줄을 끼우고, 분개 줄에는 번호를 매긴다
  const displayRows = useMemo<Row[]>(() => {
    const out: Row[] = [];
    let prev: string | null | undefined;
    let no = 0;
    rows.forEach((r, i) => {
      if (i === 0 || r.journalDateNo !== prev) {
        out.push({ ...r, journalDtlId: -(i + 1), __group: true, groupTitle: r.journalDateNo ?? '' });
        prev = r.journalDateNo;
      }
      out.push(Object.assign(r, { __no: ++no }));
    });
    return out;
  }, [rows]);

  // buildGrid() L230-316 (GridGroupBuilder): 행번호(전표 줄은 세지 않는다) · 빈 칸 30 · 차변(456EA6) · 대변(DD5E5E) · [변경] · [연관문서] · 출력 체크
  const columnDefs = useMemo(() => [
    { colId: '__no', headerName: 'No', width: 40, pinned: 'left' as const, lockPosition: 'left' as const, sortable: false, resizable: false, suppressMovable: true, cellClass: 'gb-rownum', valueGetter: (p: { data?: Row }) => p.data?.__no ?? '' },
    { colId: 'empty', headerName: '', width: 30, sortable: false, valueGetter: () => '' },  // empty 30 (GXT 그룹 들여쓰기 칸)
    gb.textCenter('curCode', 60, '통화'),  // 통화
    gb.textCenter('drAccountCode', 120, '차변 계정코드', { headerStyle: DR }),
    gb.textArea('drAccountName', 300, '차변 계정과목', { headerStyle: DR }),
    gb.double('drForAmt', 150, '차변 외화금액', { headerStyle: DR }),
    gb.long('drAmt', 150, '차변 원화금액', { headerStyle: DR }),
    gb.textCenter('crAccountCode', 120, '대변 계정코드', { headerStyle: CR }),
    gb.textArea('crAccountName', 300, '대변 계정과목', { headerStyle: CR }),
    gb.double('crForAmt', 150, '대변 외화금액', { headerStyle: CR }),
    gb.long('crAmt', 150, '대변 원화금액', { headerStyle: CR }),
    // addCell(ImageCell "Edit") → Act02_Lookup_ModiForJournal.open(선택한 행): 닫으면 retrieve(). AS-IS는 누른 행이 아니라 선택된 행을 열지만 누른 행으로 한다(원본-이상한점)
    iconCell<Row>('edit', 'editAction', 60, '변경', row => {
      gridIndex.current = Math.max(0, rows.findIndex(r => r.journalDtlId === row.journalDtlId));
      setModiJournalId(row.journalId);
    }),
    // addCell(ImageCell "View") → Act80_Lookup_RelateAppr.open(제목, "journalId", journalId): 제목 = 일자 + " 거래처" + " 적요"
    iconCell<Row>('view', 'viewAction', 60, '연관문서', row => {
      setRelateTarget({
        title: `${row.date}${row.corpName ? ' ' + row.corpName : ''}${row.note ? ' ' + row.note : ''}`,
        code: 'journalId', relateId: row.journalId,
      });
    }),
    gb.boolean('printYn', 50, '출력', { editable: true }),  // addBoolean — 출력/다운로드 대상 전표
  ], [rows]);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E6] retrieveButton[조회].Select (L210) / [E5] searchText.KeyPress [Enter] (L201) → retrieve() */}
        <SearchBar
          onSearch={() => retrieve()}
          loading={loading}
          extra={<>
            <Button type="download" onClick={() => lookupRd('All')}>전체출력/다운로드</Button>
            <Button type="download" onClick={() => lookupRd('Checked')}>출력/다운로드</Button>
          </>}
        >
          <SearchBar.Field label="조회기간">
            <DatePicker style={{ width: 120 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
            <span style={{ margin: '0 4px' }}>~</span>
            <DatePicker style={{ width: 120 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="거래처">
            <LookupInput value={corp.name} width={200} placeholder={ALL_LABEL} onOpen={() => setCorpOpen(true)} onClear={() => onCorpResult(null)} />
          </SearchBar.Field>
          <SearchBar.Field label="거래유형">
            <LookupInput value={tr.name} width={200} placeholder={ALL_LABEL} onOpen={() => setTrOpen(true)} onClear={() => onTrResult(null)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} placeholder="거래유형/거래처/적요/계정" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<Row>
            gridRef={gridRef}
            rowData={displayRows}
            columnDefs={columnDefs}
            rowNumber={false}
            getRowId={p => String(p.data.journalDtlId)}
            loading={loading}
            isFullWidthRow={p => !!p.rowNode.data?.__group}
            fullWidthCellRenderer={GroupHeader}
            getRowHeight={p => (p.data?.__group ? 28 : undefined)}
          />
        </div>
      </div>
      <Sys15_Lookup_Corp open={corpOpen} empYn onResult={onCorpResult} onClose={() => setCorpOpen(false)} />
      <Ast05_Lookup_TrCode open={trOpen} mode="view" assetType="1" financeYn={null} onResult={onTrResult} onClose={() => setTrOpen(false)} />
      <Act02_Lookup_ModiForJournal journalId={modiJournalId} onSaved={() => void retrieve()} onClose={() => setModiJournalId(null)} />
      <Act80_Lookup_RelateAppr target={relateTarget} onClose={() => setRelateTarget(null)} />
      <RdViewer url={rdUrl} title="분개장(외화)" onClose={() => setRdUrl(null)} />
    </div>
  );
};
