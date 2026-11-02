/**
 * [1174] 관리회계 > 20. 결산 > 외화예금 환평가처리 (X12)
 * AS-IS: myApp/client/vi/ast/Ast06_Tab_FxEvalDeposit.java (544줄) + Ast24_Lookup_FxRate.java (239줄) + Ast06_Grid_Journal.java (143줄)
 *   + Sys15_Lookup_Corp·Ast01_Lookup_CorpAccount — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L79-98: BorderLayout 위 = 툴바 50(여백 20,20,0,20: 평가년월 70 · 보관처 200 "전체" · 보관계좌 250 "전체" · [조회][평가처리][평가취소][출력/다운로드][예금잔고정리][환율입력])
 *   + 가운데 그리드(행번호·체크 다중·9열), 아래 300(여백 0,20,20,20) = Ast06_Grid_Journal
 * 스타일: GG (견본 Est02_Tab_PfResultReport — docs/page-style.md). 툴바는 한 줄이라 SearchBar, 원본 툴바의 [평가처리]부터는 extra
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 읽기 전용 날짜 열 폭 90(UX-08, 원본 100). 년월 입력 폭 100(12 원칙 7, 원본 70)
 * 분개 그리드의 [변경] = Act02_Lookup_ModiJournal(2단계 ⓐ)
 */
import React, { useMemo, useRef, useState } from 'react';
import { Input, message, Modal, Splitter } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { astApi } from '@/api/ast';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { AstFxEval } from '@/types/ast';
import { Corp } from '@/types/sys';
import { useLoginUser } from '@/hooks/useLoginUser';
import { MultiGrid, gbFor } from '@/components/grid';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { RdViewer } from '@/components/lookup/RdViewer';
import { Sys15_Lookup_Corp } from '@/components/lookup/Sys15_Lookup_Corp';
import { Ast01_Lookup_CorpAccount } from './Ast01_Lookup_CorpAccount';
import { Ast24_Lookup_FxRate } from './Ast24_Lookup_FxRate';
import { Ast06_Grid_Journal, Ast06_Grid_JournalHandle } from './Ast06_Grid_Journal';

const gb = gbFor<AstFxEval>();
const FORMAT = 'YYYY-MM-DD';
const ALL_LABEL = '전체';

export const Ast06_Tab_FxEvalDeposit: React.FC = () => {
  const user = useLoginUser();
  const gridRef = useRef<AgGridReact<AstFxEval>>(null);
  const journalRef = useRef<Ast06_Grid_JournalHandle>(null);
  // [E0] 화면 열림 (생성자 L79-98) → setting() L100-169: 평가년월 = 지난달(이번 달 1일의 전날), 보관처·보관계좌 = 전체. 열 때 조회하지 않는다(생성자 L79-98)
  const [yyyyMM, setYyyyMM] = useState(() => dayjs().startOf('month').subtract(1, 'day').format('YYYY.MM'));
  const [corpId, setCorpId] = useState<number | null>(null);
  const [corpName, setCorpName] = useState(ALL_LABEL);
  const [accountId, setAccountId] = useState<number | null>(null);
  const [accountName, setAccountName] = useState(ALL_LABEL);
  const [rows, setRows] = useState<AstFxEval[]>([]);
  const [loading, setLoading] = useState(false);
  const [corpOpen, setCorpOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [fxRateDate, setFxRateDate] = useState<Dayjs | null>(null);
  const [rdUrl, setRdUrl] = useState<string | null>(null);

  /** getStartDate() L518-522: 평가년월의 1일 (형식이 틀리면 null) */
  const getStartDate = (): Dayjs | null => {
    const m = dayjs(yyyyMM.replace(/-/g, '.') + '.01', 'YYYY.MM.DD', true);
    return m.isValid() ? m : null;
  };
  /** getCloseDate() L524-530: 평가년월의 말일 */
  const getCloseDate = (): Dayjs | null => getStartDate()?.endOf('month') ?? null;
  const checkDate = (): Dayjs | null => {
    const d = getCloseDate();
    if (!d) message.warning('평가년월을 확인하세요. (YYYY.MM)');
    return d;
  };

  // retrieve() L327-347: ast.Ast06_Tr.selectFxEvalList(companyId, assetType "1", closeDate, corpId, accountId) → 첫 행 선택 → retrievePage()
  // [E1] yyyyMM.KeyPress [Enter] (L109) / [E4] retrieveButton[조회].Select (L184) → retrieve()
  const retrieve = async () => {
    const close = checkDate();
    if (!close) return;
    setLoading(true);
    try {
      const list = await astApi.searchFxEvals({ closeDate: close.format(FORMAT), corpId, accountId });
      setRows(list);
      const first = list[0];
      if (first) {
        setTimeout(() => gridRef.current?.api?.getRowNode(String(first.trId))?.setSelected(true), 0);
        await journalRef.current?.retrieve(first.journalId);  // retrievePage()
      } else {
        journalRef.current?.clear();
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E2] corpName.TriggerClick [result != null] (L121) → Sys15_Lookup_Corp.open(): 고르면 이름·ID, 취소(전체)면 "전체"·null
  const onCorpResult = (corp: Corp | null) => {
    setCorpOpen(false);
    setCorpName(corp ? corp.corpName ?? '' : ALL_LABEL);
    setCorpId(corp ? corp.corpId : null);
  };

  // [E3] corpAccountName.TriggerClick [result != null] (L144) → Ast01_Lookup_CorpAccount.open(getCloseDate(), …)
  const onAccountResult = (acc: { classTreeId: number; corpAccountName: string | null } | null) => {
    setAccountOpen(false);
    setAccountName(acc ? acc.corpAccountName ?? '' : ALL_LABEL);
    setAccountId(acc ? acc.classTreeId : null);
  };

  const checked = () => gridRef.current?.api.getSelectedRows() ?? [];

  /** HtmlMessageBox "확인" + 예/아니오 */
  const confirm = (content: React.ReactNode, width: number, onOk: () => Promise<void> | void) => {
    Modal.confirm({ title: '확인', content, width, okText: '예', cancelText: '아니오', onOk });
  };

  // [E5] updateButton[평가처리].Select [YES] (L190) → 선택 없으면 "선택된 내역이 없습니다." → 확인(440) "N건의 평가처리를 진행하시겠습니까?" → [E6] YES (L200) → update() L354-409
  const updateRow = () => {
    const sel = checked();
    if (sel.length === 0) { message.warning('선택된 내역이 없습니다.'); return; }
    confirm(`${sel.length}건의 평가처리를 진행하시겠습니까?`, 440, async () => {
      // update() L354-409: 평가일이 미래일이면 "평가일이 미래일입니다.", 평가완료·평가환율 없음 검사, 회계마감 검사는 서버가 한 트랜잭션으로 한다
      if (dayjs(sel[0].date).isAfter(dayjs(), 'day')) { message.warning('평가일이 미래일입니다.'); return; }
      if (sel.some(r => r.evalYnName === '평가')) { message.warning('선택한 내역중 평가완료된 내역이 존재합니다.'); return; }
      if (sel.some(r => !r.fxRate)) { message.warning('평가환율을 입력해주세요.'); return; }
      try {
        await astApi.processFxEvals(sel);
        message.success('처리가 완료되었습니다.');
        await retrieve();
      } catch (err) {
        message.error(errorMessage(err, '처리 실패'));
      }
    });
  };

  // [E7] deleteButton[평가취소].Select [YES] (L217) → 선택 없으면 "선택된 내역이 없습니다." → 확인(440) "N건의 평가를 취소하시겠습니까?" → [E8] YES (L227) → delete() L411-451
  const deleteRow = () => {
    const sel = checked();
    if (sel.length === 0) { message.warning('선택된 내역이 없습니다.'); return; }
    confirm(`${sel.length}건의 평가를 취소하시겠습니까?`, 440, async () => {
      if (sel.some(r => r.evalYnName !== '평가')) { message.warning('선택한 내역중 미평가 내역이 존재합니다.'); return; }
      try {
        await astApi.cancelFxEvals(sel);
        message.success('취소가 완료되었습니다.');
        await retrieve();
      } catch (err) {
        message.error(errorMessage(err, '취소 실패'));
      }
    });
  };

  // [E9] downloadButton[출력/다운로드].Select [result.getStatus() == 1] (L244) → sys.Sys99_Print.insertRdFxEvalDeposit → RDViewer(mrd Ast06_Rd_FxEvalDeposit, rv rdGroupId·companyId·personId·Date "yyyy년 MM월")
  const download = async () => {
    const close = checkDate();
    if (!close) return;
    setLoading(true);
    try {
      const groupId = await astApi.rdFxEval({ closeDate: close.format(FORMAT), corpId, accountId });
      const res = await rdApi.buildUrl({
        kind: 'viewer', mrd: 'Ast06_Rd_FxEvalDeposit', options: '/rhtmlimportopt [2]',
        rv: { rdGroupId: String(groupId), companyId: String(user.companyId), personId: String(user.userId), Date: close.format('YYYY년 MM월') },
      });
      setRdUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E10] depositButton[예금잔고정리].Select (L285) → depositUpdate() L470-511: 확인(400) "잔고정리를 시작하시겠습니까? (정리기간 : 시작일 ~ 오늘)" → [E13] YES (L476) → ast.Ast09_Book.createDepositBook(stdDate = getStartDate()) → "예금잔고정리가 정상적으로 처리되었습니다." → retrieve()
  const depositUpdate = () => {
    const start = getStartDate();
    if (!start) { message.warning('평가년월을 확인하세요. (YYYY.MM)'); return; }
    confirm(<>잔고정리를 시작하시겠습니까?<br />(정리기간 : {start.format(FORMAT)} ~ {dayjs().format(FORMAT)})</>, 400, async () => {
      setLoading(true);
      try {
        await astApi.cleanDepositBook(start.format(FORMAT));
        message.success('예금잔고정리가 정상적으로 처리되었습니다.');
        await retrieve();
      } catch (err) {
        message.error(errorMessage(err, '예금잔고정리 실패'));
      } finally {
        setLoading(false);
      }
    });
  };

  // [E11] fxRateButton[환율입력].Select (L292) → lookupFxRate() L513-516: Ast24_Lookup_FxRate.open(getCloseDate())
  const lookupFxRate = () => {
    const close = checkDate();
    if (close) setFxRateDate(close);
  };

  // buildGrid() L309-325 (analysis grid)
  const columnDefs = useMemo(() => [
    gb.textCenter('evalYnName', 90, '평가여부'),   // L312
    gb.date('date', 90, '평가일자'),               // L313
    gb.text('corpAccountName', 250, '계좌'),       // L314
    gb.textCenter('curCode', 60, '통화'),          // L315
    gb.double('forAmt', 120, '외화 잔고'),         // L316
    gb.long('depositBookAmt', 150, '원화 잔고'),   // L317
    gb.double('fxRate', 100, '평가환율'),          // L318
    gb.text('note', 300, '적요'),                  // L319
    gb.textCenter('personName', 80, '처리자'),     // L320
  ], []);

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel min={120}>
          <div style={{ height: '100%', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <SearchBar
                onSearch={retrieve}
                loading={loading}
                extra={<>
                  <Button type="save" onClick={updateRow}>평가처리</Button>
                  <Button type="cancel" onClick={deleteRow}>평가취소</Button>
                  <Button type="download" onClick={download}>출력/다운로드</Button>
                  <Button type="view" onClick={depositUpdate}>예금잔고정리</Button>
                  <Button type="register" onClick={lookupFxRate}>환율입력</Button>
                </>}
              >
                <SearchBar.Field label="평가년월">
                  <Input style={{ width: 100 }} placeholder="YYYY.MM" value={yyyyMM} onChange={e => setYyyyMM(e.target.value)} onPressEnter={() => void retrieve()} />
                </SearchBar.Field>
                <SearchBar.Field label="보관처">
                  <LookupInput value={corpName} width={200} placeholder={ALL_LABEL} onOpen={() => setCorpOpen(true)} onClear={() => onCorpResult(null)} />
                </SearchBar.Field>
                <SearchBar.Field label="보관계좌">
                  <LookupInput value={accountName} width={250} placeholder={ALL_LABEL} onOpen={() => setAccountOpen(true)} onClear={() => onAccountResult(null)} />
                </SearchBar.Field>
              </SearchBar>
              <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
                {/* [E12] grid.RowClick (L299) → retrievePage(): 고른 행의 분개를 다시 읽는다 */}
                <MultiGrid<AstFxEval> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.trId)}
                  onRowClicked={e => { if (e.data) void journalRef.current?.retrieve(e.data.journalId); }} />
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize={300} min={200}>
          <div style={{ height: '100%', padding: '0 20px 20px 20px', boxSizing: 'border-box' }}>
            <Ast06_Grid_Journal ref={journalRef} />
          </div>
        </Splitter.Panel>
      </Splitter>
      <Sys15_Lookup_Corp open={corpOpen} onResult={onCorpResult} onClose={() => setCorpOpen(false)} />
      <Ast01_Lookup_CorpAccount open={accountOpen} stdDate={getCloseDate() ?? dayjs()} onResult={onAccountResult} onClose={() => setAccountOpen(false)} />
      <Ast24_Lookup_FxRate stdDate={fxRateDate} onClose={() => setFxRateDate(null)} />
      <RdViewer url={rdUrl} title="외화예금 환평가처리" onClose={() => setRdUrl(null)} />
    </div>
  );
};
