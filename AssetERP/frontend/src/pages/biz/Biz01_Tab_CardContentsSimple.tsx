/**
 * (s)법인카드사용내역 (L11) — 준법감시 > 40. 이익제공(수령)현황 > (s)법인카드사용내역 #1321
 * AS-IS: myApp/client/vi/biz/Biz01_Tab_CardContentsSimple.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L65-118: center = 툴바(기준년월 · 관리자 · 제공목적 · 검색 · [조회][엑셀다운로드]) + 사용내역 그리드(단일 선택) + 페이징 툴바(500건), east 420 = `Biz01_Edit_CardSimple`(L09) 전체
 * L04 `Biz01_Tab_CardContents`의 간이판: 총 승인금액·[출력/다운로드]·인원 칸이 없고 검색칸이 있으며, 그리드가 카드명 대신 거래상대방·인원(직접 입력값)을 갖는다.
 * 편집 칸은 늘 콤보 3개가 잠겨 있다(setting() L122 `editCard.setButtonVisible(false)`) — 거래상대방·인원·비고만 고친다.
 * RD: [엑셀다운로드]는 `rdDownload`(docs/RD-대책.md)
 * 스타일: SGHF (docs/page-style.md) — 툴바가 전체 폭 north라 견본처럼 왼쪽 패널 안에 두지 않는다
 * UX보강(10): 툴바 = SearchBar(UX-01·04, 버튼이 적어 UX-02 초기화는 뺀다 — L04와 같이 조회 조건이 많다), 그리드 날짜 폭(UX-08)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Select, Spin, Splitter } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { bizPromoApi } from '@/api/biz';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { BizCardContents, BizCodeOption } from '@/types/biz';
import { Button } from '@/components/button';
import { SearchBar, useSearchParams } from '@/components/search';
import { PagingToolBar, SingleGrid, gbFor } from '@/components/grid';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { rdDownload } from '@/utils/rdDownload';
import { Biz01_Edit_CardSimple } from './Biz01_Edit_CardSimple';

const gb = gbFor<BizCardContents>();

/** gridToolBar 한 쪽 건수 (L04와 같은 500) */
const LIMIT = 500;
/** 콤보 빈칸 "전체"의 코드 (CommonComboBoxField(…, "%", "전체")) */
const ALL = '%';

/** getCardDate() L329-334: 'yyyy.MM'(또는 'yyyy-MM')으로 읽어 'yyyy.MM'으로 돌려준다. 읽을 수 없으면 null */
function parseYm(text: string): string | null {
  const m = /^(\d{4})[.-](\d{1,2})$/.exec(text.trim());
  if (!m || Number(m[2]) < 1 || Number(m[2]) > 12) return null;
  return `${m[1]}.${m[2].padStart(2, '0')}`;
}

export const Biz01_Tab_CardContentsSimple: React.FC = () => {
  const gridRef = useRef<AgGridReact<BizCardContents>>(null);
  // setting() L120-194: 기준년월 = 지난달 yyyy.MM, 관리자·제공목적 빈칸 = "전체", 검색칸 빈칸 "가맹점명/업종/거래상대방/비고"
  const sp = useSearchParams(() => ({
    dataYm: dayjs().subtract(1, 'month').format('YYYY.MM'),
    managerId: ALL,
    providePurCode: ALL,
    searchText: '',
  }));
  const { dataYm, managerId, providePurCode, searchText } = sp.values;

  const [rows, setRows] = useState<BizCardContents[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [busy, setBusy] = useState(false);
  const [afterLoad, setAfterLoad] = useState(0);
  const [managers, setManagers] = useState<BizCodeOption[]>([]);
  const [current, setCurrent] = useState<BizCardContents | null>(null);
  // num: 마지막으로 고른 행 번호 (retrieve 뒤 선택 규칙에 쓴다)
  const num = useRef(0);
  const managerYm = useRef('');

  // setting() L134-152 · [E2] dataYMText.ValueChange (L144): 서비스 sys.Sys00_Common.selectBizCardManager(companyId, stdYYYYMM) → 관리자 콤보를 다시 읽고 "전체"로
  const loadManagers = useCallback(async (ym: string) => {
    try {
      setManagers(await bizPromoApi.searchCardManagers(ym));
      managerYm.current = ym;
    } catch (err) {
      message.error(errorMessage(err, '관리자 조회 실패'));
    }
  }, []);

  const onYmChange = () => {
    const ym = parseYm(sp.current.current.dataYm);
    if (!ym || ym === managerYm.current) return;
    sp.set('managerId', ALL);
    void loadManagers(ym);
  };

  // retrieve() L227-272: 서비스 biz.Biz01_Promo.selectCardContentsPaging(companyId, dataYm, managerId, providePurCode, searchText = '%…%')
  //   → 읽은 뒤 선택 규칙(첫 행이 있고 num == 0이면 첫 행 선택, 아니면 num 행에 포커스만)
  const load = useCallback(async (toPage: number) => {
    const v = sp.current.current;
    const ym = parseYm(v.dataYm);
    if (!ym) {
      message.warning('기준년월을 yyyy.MM 형식으로 입력하세요');
      return;
    }
    setBusy(true);
    try {
      const res = await bizPromoApi.searchCardContents({
        dataYm: ym, managerId: v.managerId, providePurCode: v.providePurCode, searchText: v.searchText,
        offset: (toPage - 1) * LIMIT, limit: LIMIT,
      });
      gridRef.current?.api?.deselectAll();
      setRows(res.rows);
      setTotal(res.total);
      setPage(toPage);
      setAfterLoad(n => n + 1);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setBusy(false);
    }
  }, [sp]);

  // retrieve(): 다른 쪽에 있으면 1쪽으로 가서 읽는다(toolBar.setActivePage(1))
  const retrieve = useCallback(() => load(1), [load]);

  // 목록이 바뀐 뒤(afterLoad) 선택 규칙 적용
  useEffect(() => {
    if (afterLoad === 0) return;
    const api = gridRef.current?.api;
    if (!api || rows.length === 0) return;
    if (num.current === 0) {
      api.getRowNode(String(rows[0].promoId))?.setSelected(true);
    } else {
      const i = Math.min(num.current, rows.length - 1);
      api.ensureIndexVisible(i);
      api.setFocusedCell(i, 'closeName');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [afterLoad]);

  // [E0] 화면 열림 (생성자 L65-118) → setting(), retrieve()
  useEffect(() => {
    void loadManagers(sp.current.current.dataYm);
    void retrieve();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E3] grid.RowClick (L168) → retrieveTabpage() L216-225: 고른 내역을 편집 칸에 넘긴다 (저장 뒤 retrieve())
  const onSelect = (row: BizCardContents | undefined) => {
    if (!row) return;
    num.current = Math.max(0, rows.findIndex(r => r.promoId === row.promoId));
    setCurrent(row);
  };

  // [E6] downloadButton[엑셀다운로드].Select (L188) → createRdExcel() L274-327: 서비스 sys.Sys99_Print.insertRdCardContentsSimple(companyId, personId, "Biz01_Tab_CardContentsSimple", dataYm, managerId, providePurCode, searchText)
  //   → 성공이면 RDUtil.download(page CommonInvokerDownload.jsp · mrd Biz01_Rd_CardContentsSimple · options "/rexportopt [6] /rxlsopt [100]" · 파일 "법인카드사용내역(yyyy.MM).xlsx" · rv companyId·personId·rdGroupId·cardDate)
  //   실패 메시지는 서버 메시지 그대로. 끝날 때까지 그리드를 가린다(grid.mask)
  const createRdExcel = async () => {
    const v = sp.current.current;
    const ym = parseYm(v.dataYm);
    if (!ym) {
      message.warning('기준년월을 yyyy.MM 형식으로 입력하세요');
      return;
    }
    setBusy(true);
    try {
      const groupId = await bizPromoApi.rdDownloadCardContentsSimple({ dataYm: ym, managerId: v.managerId, providePurCode: v.providePurCode, searchText: v.searchText });
      const res = await rdApi.buildUrl({
        kind: 'download',
        mrd: 'Biz01_Rd_CardContentsSimple',
        options: '/rexportopt [6] /rxlsopt [100]',
        exportType: 'xlsx',
        fileName: `법인카드사용내역(${ym}).xlsx`,
        rv: { rdGroupId: groupId, cardDate: ym },
      });
      await rdDownload(res);
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    } finally {
      setBusy(false);
    }
  };

  // buildGrid() L196-214
  const columnDefs = useMemo(() => [
    gb.textCenter('closeName', 70, '마감구분'),  // L198
    gb.textCenter('regEmpName', 70, '관리자'),  // L199
    gb.date('approvalDt', 90, '카드승인일'),  // L200 (원본 100 — UX-08 읽기 전용 날짜는 90)
    gb.text('franchiseName', 200, '가맹점명'),  // L201
    gb.text('sectorName', 150, '업종'),  // L202
    gb.long('approvalAmount', 100, '승인금액'),  // L203
    gb.textCenter('providePurName', 100, '제공목적'),  // L204
    gb.textCenter('provideContentName', 100, '제공내역'),  // L205
    gb.text('provideCompany', 150, '거래상대방'),  // L206
    gb.longCenter('pepleCount', 70, '인원'),  // L207
    gb.long('averagePrice2', 110, '인당 경제적가치'),  // L208
    gb.text('note', 300, '비고'),  // L209
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* [E4] retrieveButton[조회].Select (L174) → retrieve() · [E1] dataYMText.KeyPress [Enter] (L136) → retrieve() · [E5] searchTextField.KeyPress [Enter] (L180) → retrieve() */}
      <SearchBar
        onSearch={retrieve}
        extra={<Button type="download" onClick={createRdExcel}>엑셀다운로드</Button>}
      >
        <SearchBar.Field label="기준년월">
          <SearchBar.Input style={{ width: 80 }} placeholder="YYYY.MM" value={dataYm}
            onChange={e => sp.set('dataYm', e.target.value)} onBlur={onYmChange} />
        </SearchBar.Field>
        <SearchBar.Field label="관리자">
          <Select<string>
            style={{ width: 120 }}
            value={managerId}
            options={[{ value: ALL, label: '전체' }, ...managers.map(m => ({ value: m.code, label: m.name }))]}
            onChange={code => sp.set('managerId', code)}
          />
        </SearchBar.Field>
        <SearchBar.Field label="제공목적">
          <SystemCodeComboBox
            kindGroupCd="ProvidePurCode002"
            altCode={[ALL, '전체']}
            style={{ width: 150 }}
            value={providePurCode}
            onChange={code => sp.set('providePurCode', code ?? ALL)}
          />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 250 }} placeholder="가맹점명/업종/거래상대방/비고" value={searchText}
            onChange={e => sp.set('searchText', e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Splitter style={{ height: '100%' }}>
          <Splitter.Panel min={600}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
              <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
                <SingleGrid<BizCardContents>
                  gridRef={gridRef}
                  rowData={rows}
                  columnDefs={columnDefs}
                  getRowId={p => String(p.data.promoId)}
                  onSelect={onSelect}
                />
                {busy && (
                  <div style={{ position: 'absolute', inset: 0, zIndex: 10, background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spin tip="Loading" />
                  </div>
                )}
              </div>
              <PagingToolBar page={page} limit={LIMIT} total={total} loading={busy} onChange={p => void load(p)} />
            </div>
          </Splitter.Panel>
          <Splitter.Panel defaultSize={420} min={300}>
            {/* setButtonVisible(false) L122: 콤보 3개 늘 잠금 → closed */}
            <Biz01_Edit_CardSimple promo={current} closed onSaved={() => void retrieve()} />
          </Splitter.Panel>
        </Splitter>
      </div>
    </div>
  );
};
