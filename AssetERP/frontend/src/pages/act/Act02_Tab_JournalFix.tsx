/**
 * [1207] 관리회계 > 10. 전표입력 > 전표승인처리 (X02)
 * AS-IS: myApp/client/vi/act/Act02_Tab_JournalFix.java (477줄) + Act02_Grid_JournalFix (pages/act) + Act80_Lookup_RelateAppr (pages/act)
 *   + Ast05_Lookup_TrCode·Sys15_Lookup_Corp (components/lookup) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L86-113: BorderLayout 북쪽 88(여백 20,20,0,20, 고정) = 툴바 두 줄(조회기간 100~100 · 거래유형 · 거래처 200 · [조회][승인][승인취소] /
 *   검색 "거래처/거래유형/적요" · 발생구분 100 · "미승인 전표만 보기"), 가운데 0.5(여백 -2,20,-2,20) = 전표 그리드(체크 다중, 13열, 합계 행 "계"),
 *   남쪽 0.5(여백 0,20,20,20, 크기 조절) = 분개 그리드 Act02_Grid_JournalFix
 * 열 때 한 번 조회한다(지난달 1일 ~ 말일). 조회하면 첫 행을 고르고 그 전표의 분개를 아래에 보여 준다. 행을 누르면 그 전표의 분개를 다시 읽는다
 * 스타일: GG (견본 — docs/page-style.md). 툴바가 두 줄이라 SearchPanel(R03)
 * UX보강(10): 툴바 = SearchPanel(UX-01), 읽기 전용 날짜 열 폭 90(UX-08, 원본 100)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message, Modal, Splitter } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { actApi } from '@/api/act';
import { errorMessage } from '@/api/client';
import { JournalFix } from '@/types/act';
import { Corp } from '@/types/sys';
import { TrCode } from '@/types/ast';
import { Button } from '@/components/button';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { SearchPanel } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Ast05_Lookup_TrCode } from '@/components/lookup/Ast05_Lookup_TrCode';
import { Sys15_Lookup_Corp } from '@/components/lookup/Sys15_Lookup_Corp';
import { Act02_Grid_JournalFix } from './Act02_Grid_JournalFix';
import { Act80_Lookup_RelateAppr, ActRelateApprTarget } from './Act80_Lookup_RelateAppr';

const gb = gbFor<JournalFix>();
const FORMAT = 'YYYY-MM-DD';
const ALL_LABEL = '전체';
/** 콤보 "전체"(trOccType: ComboBoxField("TrOccType", "%", "전체")) */
const ALL_CODE: [string, string] = ['%', '전체'];
const SUM_ROW = { labelField: 'date', label: '계', sum: ['journalAmt'] };

/** settings() L116-125: 조회기간 = 지난달 1일 ~ 지난달 말일 */
const lastMonthStart = () => dayjs().subtract(1, 'month').startOf('month');

export const Act02_Tab_JournalFix: React.FC = () => {
  // [E0] 화면 열림 (생성자 L86-113) → settings(), retrieve()
  const [startDate, setStartDate] = useState<Dayjs>(lastMonthStart());
  const [closeDate, setCloseDate] = useState<Dayjs>(lastMonthStart().add(1, 'month').subtract(1, 'day'));
  const [corp, setCorp] = useState<{ id: number | null; name: string }>({ id: null, name: '' });
  const [tr, setTr] = useState<{ code: string | null; name: string }>({ code: null, name: '' });
  const [searchText, setSearchText] = useState('');
  const [trOccType, setTrOccType] = useState('%');
  const [unFixYn, setUnFixYn] = useState(false);
  const [rows, setRows] = useState<JournalFix[]>([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState<JournalFix | null>(null);
  const [nonce, setNonce] = useState(0);
  const [corpOpen, setCorpOpen] = useState(false);
  const [trOpen, setTrOpen] = useState(false);
  const [relateTarget, setRelateTarget] = useState<ActRelateApprTarget | null>(null);
  const gridRef = useRef<AgGridReact<JournalFix>>(null);
  const relateId = useRef<number | null>(null);

  /** retrieve()가 읽는 조건 — 콤보·체크를 바꾸자마자 조회해도 새 값으로 간다 */
  const condRef = useRef({ startDate, closeDate, corp, tr, searchText, trOccType, unFixYn });
  condRef.current = { startDate, closeDate, corp, tr, searchText, trOccType, unFixYn };

  // retrievePage() L353-360: 고른 전표가 없으면 분개 그리드를 비우고, 있으면 그 분개를 읽는다
  const retrievePage = (row: JournalFix | null) => { setCurrent(row); setNonce(n => n + 1); };

  // retrieve() L308-351: act.Act02_Journal.selectByDateAll(companyId, startDate, closeDate, 검색어("%"), 거래처ID("%"), 거래유형("%"), 미승인만, 발생구분) → 첫 행 선택 → retrievePage()
  const retrieve = useCallback(async () => {
    const c = condRef.current;
    setLoading(true);
    try {
      const list = await actApi.searchJournalFixes({
        startDate: c.startDate.format(FORMAT), closeDate: c.closeDate.format(FORMAT), searchText: c.searchText,
        corpId: c.corp.id, trCode: c.tr.code, unFixYn: c.unFixYn, trOccType: c.trOccType,
      });
      setRows(list);
      if (list[0]) {
        setTimeout(() => gridRef.current?.api?.getRowNode(String(list[0].journalId))?.setSelected(true), 0);
        retrievePage(list[0]);
      } else {
        retrievePage(null);
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E1] corpName.TriggerClick (L132) → Sys15_Lookup_Corp.open(false, true, …): 고르면 거래처, [전체]면 비운다("전체")
  const onCorpResult = (c: Corp | null) => {
    setCorp(c ? { id: c.corpId, name: c.corpName ?? '' } : { id: null, name: '' });
    setCorpOpen(false);
  };
  // [E2] trName.TriggerClick (L155) → Ast05_Lookup_TrCode.open("1", …): 고르면 거래유형, [전체]면 비운다("전체")
  const onTrResult = (t: TrCode | null) => {
    setTr(t ? { code: t.trCode ?? null, name: t.trName ?? '' } : { code: null, name: '' });
    setTrOpen(false);
  };

  // updateConfirm(procType) L362-468: 선택이 없으면 안내 → 승인(P)은 이미 승인된 전표가 있으면 막고, 승인취소(C)는 미승인 전표가 있으면 막는다
  //   → 확인(320) "n건의 항목을 승인하시겠습니까?"/"…승인취소하시겠습니까?" → [E9]·[E10] YES → act.Act02_Journal.updateFixYn → 바뀐 행을 갱신하고 retrievePage()
  const updateConfirm = (procType: 'P' | 'C') => {
    const list = gridRef.current?.api.getSelectedRows() ?? [];
    if (list.length === 0) { message.info('전표를 선택해주세요.'); return; }
    const fixCnt = list.filter(r => r.fixYn).length;
    const unFixCnt = list.length - fixCnt;
    if (procType === 'P' && fixCnt > 0) { message.info('이미 승인된 전표가 포함되어 있습니다.'); return; }
    if (procType === 'C' && unFixCnt > 0) { message.info('미승인 전표가 포함되어 있습니다.'); return; }
    const label = procType === 'P' ? '승인' : '승인취소';
    Modal.confirm({
      title: label, content: `${list.length}건의 항목을 ${label}하시겠습니까?`, width: 320, okText: '예', cancelText: '아니오',
      onOk: async () => {
        try {
          const updated = await actApi.confirmJournalFixes(procType, list.map(r => r.journalId));
          const byId = new Map(updated.map(u => [u.journalId, u]));
          setRows(prev => prev.map(r => byId.get(r.journalId) ?? r));
          const sel = gridRef.current?.api.getSelectedRows()[0];
          retrievePage(sel ? byId.get(sel.journalId) ?? sel : null);
        } catch (err) {
          message.info(errorMessage(err, `${label} 실패`));
        }
      },
    });
  };

  /** 한 행을 다시 읽어 바꾼다 (grid.getStore().update(selectById 결과)) */
  const refreshRow = async (id: number) => {
    try {
      const fresh = await actApi.getJournalFix(id);
      setRows(prev => prev.map(r => (r.journalId === id ? fresh : r)));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // buildGrid() L248-306: setChecked(MULTI), 합계 행 "계"(일자 열, 금액 합)
  const columnDefs = useMemo(() => [
    gb.date('date', 90, '일자'),  // L285 (UX-08: 100 → 90)
    gb.textCenter('journalNoStr', 85, '전표번호'),  // L286
    gb.text('corpName', 200, '거래처'),  // L287
    gb.text('trName', 200, '거래유형'),  // L288
    gb.textArea('note', 400, '적요'),  // L289
    gb.textCenter('curCode', 50, '통화'),  // L290
    gb.long('journalAmt', 150, '금액'),  // L291
    gb.textCenter('personName', 100, '등록자'),  // L292
    gb.textCenter('dcrCountStr', 50, '연관문서'),  // L293
    // [E8] actionCell (ImageCell "View").callbackOnCreate (L270) → Act80_Lookup_RelateAppr.open(제목, "journalId", journalId, …) — 제목 = 일자 + " 거래처" + " 적요", 닫으면 selectById로 그 행을 갱신
    iconCell<JournalFix>('view', 'viewAction', 40, '', row => {
      relateId.current = row.journalId;
      setRelateTarget({
        title: `${row.date}${row.corpName ? ' ' + row.corpName : ''}${row.note ? ' ' + row.note : ''}`,
        code: 'journalId', relateId: row.journalId,
      });
    }),  // L294
    gb.textCenter('fixYnName', 70, '전표승인'),  // L295
    gb.textCenter('fixPersonName', 100, '승인자'),  // L296
    gb.textCenter('fixDateStr', 150, '승인일시'),  // L297
  ], []);

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <div style={{ height: '100%', padding: '20px 20px 20px 20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
        {/* [E4] retrieveButton[조회].Select (L221) / [E3] searchText.KeyPress [Enter] (L177) → retrieve() */}
        <SearchPanel onSearch={retrieve} loading={loading} fieldsWidth={900}>
          <SearchPanel.Row>
            <SearchPanel.Field label="조회기간">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <DatePicker style={{ width: 120 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
                ~
                <DatePicker style={{ width: 120 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
              </span>
            </SearchPanel.Field>
            <SearchPanel.Field label="거래유형">
              <LookupInput value={tr.name} width={200} placeholder={ALL_LABEL} onOpen={() => setTrOpen(true)} onClear={() => onTrResult(null)} />
            </SearchPanel.Field>
            <SearchPanel.Field label="거래처">
              <LookupInput value={corp.name} width={200} placeholder={ALL_LABEL} onOpen={() => setCorpOpen(true)} onClear={() => onCorpResult(null)} />
            </SearchPanel.Field>
          </SearchPanel.Row>
          <SearchPanel.Row>
            <SearchPanel.Field label="검색">
              <SearchPanel.Input style={{ width: 250 }} placeholder="거래처/거래유형/적요" value={searchText} onChange={e => setSearchText(e.target.value)} />
            </SearchPanel.Field>
            <SearchPanel.Field label="발생구분">
              <SystemCodeComboBox kindCd="TrOccType" altCode={ALL_CODE} style={{ width: 100 }} value={trOccType}
                onChange={c => { setTrOccType(c ?? '%'); }} />
            </SearchPanel.Field>
            <Checkbox checked={unFixYn} onChange={e => setUnFixYn(e.target.checked)}>미승인 전표만 보기</Checkbox>
          </SearchPanel.Row>
          <SearchPanel.Actions>
            {/* [E5] confirmButton[승인].Select (L227) → updateConfirm("P") / [E6] cancelButton[승인취소].Select (L233) → updateConfirm("C") */}
            <Button type="save" onClick={() => updateConfirm('P')}>승인</Button>
            <Button type="cancel" onClick={() => updateConfirm('C')}>승인취소</Button>
          </SearchPanel.Actions>
          <SearchPanel.Actions>{null}</SearchPanel.Actions>
        </SearchPanel>
        <Splitter layout="vertical" style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
          <Splitter.Panel defaultSize="50%" min={120}>
            <div style={{ height: '100%', paddingBottom: 8, boxSizing: 'border-box' }}>
              {/* [E7] grid.RowClick (L240) → retrievePage() */}
              <MultiGrid<JournalFix>
                gridRef={gridRef}
                rowData={rows}
                columnDefs={columnDefs}
                getRowId={p => String(p.data.journalId)}
                sumRow={SUM_ROW}
                onRowClicked={e => { if (e.data) retrievePage(e.data); }}
              />
            </div>
          </Splitter.Panel>
          <Splitter.Panel defaultSize="50%" min={200}>
            <div style={{ height: '100%', paddingTop: 8, boxSizing: 'border-box' }}>
              <Act02_Grid_JournalFix journal={current} nonce={nonce} />
            </div>
          </Splitter.Panel>
        </Splitter>
      </div>
      <Sys15_Lookup_Corp open={corpOpen} empYn onResult={onCorpResult} onClose={() => setCorpOpen(false)} />
      <Ast05_Lookup_TrCode open={trOpen} mode="view" assetType="1" financeYn={null} onResult={onTrResult} onClose={() => setTrOpen(false)} />
      <Act80_Lookup_RelateAppr target={relateTarget}
        onClosed={() => { if (relateId.current != null) void refreshRow(relateId.current); }}
        onClose={() => setRelateTarget(null)} />
    </div>
  );
};
