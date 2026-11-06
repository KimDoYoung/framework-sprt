/**
 * [1202] 관리회계 > 20. 결산 > 펀드보수 결산처리 (X13)
 * AS-IS: myApp/client/vi/ast/Ast30_Tab_OfficeMngFeeClose.java (488줄) + Ast30_Lookup_FeeClose.java (323줄) + Ast06_Grid_Journal.java (143줄)
 *   + Sys15_Lookup_Corp — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L78-97: BorderLayout 위 = 툴바 50(여백 20,20,0,20: 결산일자 70 · 운용사 200 "전체" · 검색 200 "운용사/통화" · [조회][결산처리][결산취소] · [출력/다운로드] · [보수원장정리])
 *   + 가운데 그리드(행번호·체크 다중·9열 + [변경] 아이콘, 맨 아래 합계 행 getSumGrid("계",2,9,9)), 아래 300(여백 0,20,20,20) = Ast06_Grid_Journal
 * 스타일: GG (견본 Est02_Tab_PfResultReport — docs/page-style.md). 툴바는 한 줄이라 SearchBar, 원본 툴바의 [결산처리]부터는 extra
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 읽기 전용 날짜 열 폭 90(UX-08, 원본 100). 결산년월 입력 폭 100(12 원칙 7, 원본 70)
 * 분개 그리드의 [변경] = Act02_Lookup_ModiJournal(W05), 운용사 조회창 = Sys15_Lookup_Corp(재사용)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Modal, Splitter } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { astApi } from '@/api/ast';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { AstFundFeeClose } from '@/types/ast';
import { Corp } from '@/types/sys';
import { useLoginUser } from '@/hooks/useLoginUser';
import { MultiGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { RdViewer } from '@/components/lookup/RdViewer';
import { Sys15_Lookup_Corp } from '@/components/lookup/Sys15_Lookup_Corp';
import { Ast06_Grid_Journal, Ast06_Grid_JournalHandle } from './Ast06_Grid_Journal';
import { Ast30_Lookup_FeeClose, FeeCloseSaved } from './Ast30_Lookup_FeeClose';

const gb = gbFor<AstFundFeeClose>();
const FORMAT = 'YYYY-MM-DD';
const ALL_LABEL = '전체';

export const Ast30_Tab_OfficeMngFeeClose: React.FC = () => {
  const user = useLoginUser();
  const gridRef = useRef<AgGridReact<AstFundFeeClose>>(null);
  const journalRef = useRef<Ast06_Grid_JournalHandle>(null);
  // [E0] 화면 열림 (생성자 L78-97) → setting() L99-252: 결산일자 = 지난달(이번 달 1일의 전날), 운용사 "전체" → retrieve()
  const [yyyyMM, setYyyyMM] = useState(() => dayjs().startOf('month').subtract(1, 'day').format('YYYY.MM'));
  const [corpId, setCorpId] = useState<number | null>(null);
  const [corpName, setCorpName] = useState(ALL_LABEL);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<AstFundFeeClose[]>([]);
  const [loading, setLoading] = useState(false);
  const [corpOpen, setCorpOpen] = useState(false);
  const [feeRow, setFeeRow] = useState<AstFundFeeClose | null>(null);
  const [rdUrl, setRdUrl] = useState<string | null>(null);

  /** getCloseDate() L468-474: 결산일자(년월)의 말일 (형식이 틀리면 null) */
  const getCloseDate = (): Dayjs | null => {
    const m = dayjs(yyyyMM.replace(/-/g, '.') + '.01', 'YYYY.MM.DD', true);
    return m.isValid() ? m.endOf('month') : null;
  };
  const checkDate = (): Dayjs | null => {
    const d = getCloseDate();
    if (!d) message.warning('결산일자를 확인하세요. (YYYY.MM)');
    return d;
  };

  // retrievePage() L315-330: ast.Ast06_Tr.selectById(trId) → 분개 그리드 retrieve(journalId). 결산 전 행은 거래가 없어 비운다
  const retrievePage = async (row: AstFundFeeClose | undefined) => {
    if (!row || row.trId == null) { journalRef.current?.clear(); return; }
    try {
      const tr = await astApi.getTr(row.trId);
      await journalRef.current?.retrieve(tr.journalId);
    } catch (err) {
      message.error(errorMessage(err, '분개 조회 실패'));
    }
  };

  // retrieve() L287-313: ast.Ast30_BookFundFee.selectEvalFundFee(companyId, holdDate, corpIdStr, searchText) → 첫 행 선택 → retrievePage()
  // [E1] yyyyMM.KeyPress [Enter] (L108) / [E3] searchText.KeyPress [Enter] (L142) / [E4] retrieveButton[조회].Select (L171) → retrieve()
  const retrieve = async (searchOverride?: string) => {
    const close = checkDate();
    if (!close) return;
    setLoading(true);
    journalRef.current?.clear();
    try {
      const list = await astApi.searchFundFeeCloses({ holdDate: close.format(FORMAT), corpId, searchText: searchOverride ?? searchText });
      setRows(list);
      const first = list[0];
      if (first) {
        setTimeout(() => gridRef.current?.api?.getRowNode(String(first.keyId))?.setSelected(true), 0);
        await retrievePage(first);
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // 화면을 열 때 한 번 조회 (setting() 끝의 retrieve())
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E2] corpName.TriggerClick [result != null] (L120) → Sys15_Lookup_Corp.open(): 고르면 이름·ID, 취소(전체)면 "전체"·null
  const onCorpResult = (corp: Corp | null) => {
    setCorpOpen(false);
    setCorpName(corp ? corp.corpName ?? '' : ALL_LABEL);
    setCorpId(corp ? corp.corpId : null);
  };

  const checked = () => gridRef.current?.api.getSelectedRows() ?? [];

  // [E5] updateButton[결산처리].Select (L177) / [E6] deleteButton[결산취소].Select (L183) → preCheck("P"|"C") L332-408:
  //   선택 없음 "처리대상을 선택해주세요." → 결산일 미래일 "결산일이 미래일입니다." → 확인(300) "N건의 결산을 처리|취소하시겠습니까?" → [E10]·[E11] YES → 회계마감 검사(서버) → update() L410-436
  const preCheck = (procType: 'P' | 'C') => {
    const sel = checked();
    if (sel.length === 0) { message.warning('처리대상을 선택해주세요.'); return; }
    if (dayjs(sel[0].holdDate).isAfter(dayjs(), 'day')) { message.warning('결산일이 미래일입니다.'); return; }
    const title = procType === 'P' ? '결산처리' : '결산취소';
    Modal.confirm({
      title, width: 300, okText: '예', cancelText: '아니오',
      content: procType === 'P' ? `${sel.length}건의 결산을 처리하시겠습니까?` : `${sel.length}건의 결산을 취소하시겠습니까?`,
      onOk: async () => {
        try {
          if (procType === 'P') await astApi.processFundFeeCloses(sel);
          else await astApi.cancelFundFeeCloses(sel);
          message.success(procType === 'P' ? '결산처리가 완료되었습니다.' : '결산취소가 완료되었습니다.');
          await retrieve();
        } catch (err) {
          message.error(errorMessage(err, title + ' 실패'));
        }
      },
    });
  };

  // [E7] reprocFundFeeButton[보수원장정리].Select (L189) → reprocFundFee() L438-458: ast.Ast30_BookFundFee.reprocFundFee(closeDate) → "보수원장 정리가 완료 되었습니다"
  const reprocFundFee = async () => {
    const close = checkDate();
    if (!close) return;
    setLoading(true);
    try {
      await astApi.reprocFundFee(close.format(FORMAT));
      message.info('보수원장 정리가 완료 되었습니다');
    } catch (err) {
      message.error(errorMessage(err, '보수원장 정리 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E8] downloadButton[출력/다운로드].Select [corpId.getValue() != null] (L195) → sys.Sys99_Print.insertRdOfficeMngFeeClose → RDViewer(mrd Ast30_Rd_OfficeMngFeeClose, rv rdGroupId·companyId·personId·Date "yyyy년 MM월")
  const download = async () => {
    const close = checkDate();
    if (!close) return;
    setLoading(true);
    try {
      const groupId = await astApi.rdFundFeeClose({ holdDate: close.format(FORMAT), corpId, searchText });
      const res = await rdApi.buildUrl({
        kind: 'viewer', mrd: 'Ast30_Rd_OfficeMngFeeClose', options: '/rhtmlimportopt [2]',
        rv: { rdGroupId: String(groupId), companyId: String(user.companyId), personId: String(user.userId), Date: close.format('YYYY년 MM월') },
      });
      setRdUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    } finally {
      setLoading(false);
    }
  };

  // 환율 및 펀드보수 변경 창에서 저장한 뒤 메인 행을 합계로 바꾼다 — updateAfter() L290-313의 grid.getStore().update(feeModel)
  const onFeeSaved = (keyId: number, sum: FeeCloseSaved) => {
    setRows(prev => prev.map(r => (r.keyId === keyId ? { ...r, fee: sum.fee, forFee: sum.forFee, fxRate: sum.fxRate } : r)));
  };

  // buildGrid() L254-285 (analysis grid): [변경] actionCell L256-267 → Ast30_Lookup_FeeClose.open(selectModel)
  const columnDefs = useMemo(() => [
    gb.textCenter('closeYnName', 80, '결산여부'),                 // L273
    gb.date('holdDate', 90, '결산일자'),                          // L274 (UX-08 폭 90, 원본 100)
    gb.text('trName', 220, '거래유형'),                           // L275
    gb.textCenter('corpCode', 100, '운용사코드'),                 // L276
    gb.text('corpName', 300, '운용사'),                           // L277
    gb.textCenter('curCode', 50, '통화'),                         // L278
    gb.double('forFee', 150, '누적보수(통화기준)'),               // L279
    gb.long('fee', 150, '누적보수(KRW)'),                         // L280
    gb.double('fxRate', 100, '적용환율'),                         // L281
    {                                                              // L282 actionCell
      ...iconCell<AstFundFeeClose>('edit', 'changeAction', 50, '변경', row => setFeeRow(row)),
      cellRendererSelector: (p: { node: { rowPinned?: string | null } }) => (p.node.rowPinned ? { component: () => null } : undefined),
    },
  ], []);

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel min={120}>
          <div style={{ height: '100%', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <SearchBar
                onSearch={() => void retrieve()}
                loading={loading}
                extra={<>
                  <Button type="save" onClick={() => preCheck('P')}>결산처리</Button>
                  <Button type="cancel" onClick={() => preCheck('C')}>결산취소</Button>
                  <Button type="download" onClick={download}>출력/다운로드</Button>
                  <Button type="reset" onClick={reprocFundFee}>보수원장정리</Button>
                </>}
              >
                <SearchBar.Field label="결산일자">
                  <Input style={{ width: 100 }} placeholder="YYYY.MM" value={yyyyMM} onChange={e => setYyyyMM(e.target.value)} onPressEnter={() => void retrieve()} />
                </SearchBar.Field>
                <SearchBar.Field label="운용사">
                  <LookupInput value={corpName} width={200} placeholder={ALL_LABEL} onOpen={() => setCorpOpen(true)} onClear={() => onCorpResult(null)} />
                </SearchBar.Field>
                <SearchBar.Field label="검색">
                  <SearchBar.Input style={{ width: 200 }} placeholder="운용사/통화" value={searchText} onChange={e => setSearchText(e.target.value)} />
                </SearchBar.Field>
              </SearchBar>
              <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
                {/* [E9] grid.RowClick (L244) → retrievePage(): 고른 행의 분개를 다시 읽는다 */}
                <MultiGrid<AstFundFeeClose> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.keyId)}
                  sumRow={{ labelField: 'closeYnName', label: '계', sum: ['fee'] }}
                  onRowClicked={e => { if (e.data) void retrievePage(e.data); }} />
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
      <Ast30_Lookup_FeeClose feeRow={feeRow} onClose={() => setFeeRow(null)} onSaved={onFeeSaved} />
      <RdViewer url={rdUrl} title="펀드보수 결산처리" onClose={() => setRdUrl(null)} />
    </div>
  );
};
