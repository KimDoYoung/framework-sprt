/**
 * 법인카드 사용내역 조회 (L04) — 준법감시 > 40. 이익제공(수령)현황 > 법인카드 사용내역 조회 #1138
 * AS-IS: myApp/client/vi/biz/Biz01_Tab_CardContents.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L78-145: north = 툴바(기준년월 · 관리자 · 제공목적 · [조회][출력/다운로드][엑셀다운로드]) 80% + 총 승인금액 라벨 20%,
 *   center = 사용내역 그리드(단일 선택) + 페이징 툴바(500건), east 420 = 위 `Biz01_Edit_Card`(280) + 아래 `Biz02_Grid_PersonList` (L02와 같은 부품)
 * 편집 칸의 콤보 3개와 인원 칸의 [등록][삭제]는 늘 잠겨 있다(setting() L149-150 `setButtonVisible(false)`) — 조회 전용 화면이다.
 * RD: [출력/다운로드]는 `RdViewer`, [엑셀다운로드]는 `rdDownload`(docs/RD-대책.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04, 버튼이 많아 UX-02 초기화는 뺀다), 그리드 날짜 폭(UX-08)
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
import { RdViewer } from '@/components/lookup/RdViewer';
import { rdDownload } from '@/utils/rdDownload';
import { Biz01_Edit_Card } from './Biz01_Edit_Card';
import { Biz02_Grid_PersonList } from './Biz02_Grid_PersonList';

const gb = gbFor<BizCardContents>();

/** setToolBar(500) L113 */
const LIMIT = 500;
/** 콤보 빈칸 "전체"의 코드 (CommonComboBoxField(…, "%", "전체")) */
const ALL = '%';
const BLUE = '#456EA6';

/** getCardDate() L436-441: 'yyyy.MM'(또는 'yyyy-MM')으로 읽어 'yyyy.MM'으로 돌려준다. 읽을 수 없으면 null */
function parseYm(text: string): string | null {
  const m = /^(\d{4})[.-](\d{1,2})$/.exec(text.trim());
  if (!m || Number(m[2]) < 1 || Number(m[2]) > 12) return null;
  return `${m[1]}.${m[2].padStart(2, '0')}`;
}

export const Biz01_Tab_CardContents: React.FC = () => {
  const gridRef = useRef<AgGridReact<BizCardContents>>(null);
  // setting() L152-157: 기준년월 = 지난달 yyyy.MM, 관리자·제공목적 빈칸 = "전체"
  const sp = useSearchParams(() => ({
    dataYm: dayjs().subtract(1, 'month').format('YYYY.MM'),
    managerId: ALL,
    providePurCode: ALL,
  }));
  const { dataYm, managerId, providePurCode } = sp.values;

  const [rows, setRows] = useState<BizCardContents[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [amount, setAmount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [afterLoad, setAfterLoad] = useState(0);
  const [managers, setManagers] = useState<BizCodeOption[]>([]);
  const [current, setCurrent] = useState<BizCardContents | null>(null);
  const [personRefresh, setPersonRefresh] = useState(0);
  const [rdUrl, setRdUrl] = useState<string | null>(null);
  // num: 마지막으로 고른 행 번호 (retrieve 뒤 선택 규칙에 쓴다)
  const num = useRef(0);
  const managerYm = useRef('');

  // getCardDate(): 읽을 수 없는 기준년월은 원본에서 예외로 아무 일도 없다 — 여기서는 안내한다
  const cardDate = (): string | null => {
    const ym = parseYm(sp.current.current.dataYm);
    if (!ym) message.warning('기준년월을 yyyy.MM 형식으로 입력하세요');
    return ym;
  };

  // setting() L159-177 · [E2] dataYMText.ValueChange (L168): 서비스 sys.Sys00_Common.selectBizCardManager(companyId, stdYYYYMM) → 관리자 콤보를 다시 읽고 "전체"로
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

  // retrieve() L299-346 · totalAmtCheck() L348-379: 서비스 biz.Biz01_Promo.selectCardContentsPaging(companyId, dataYm, managerId, providePurCode, searchText = '%…%')
  //   → 읽은 뒤 선택 규칙(첫 행이 있고 num == 0이면 첫 행 선택, 아니면 num 행에 포커스만)과 서비스 biz.Biz01_Promo.selectByAmt(총 승인금액)
  const load = useCallback(async (toPage: number) => {
    const v = sp.current.current;
    const ym = parseYm(v.dataYm);
    if (!ym) {
      message.warning('기준년월을 yyyy.MM 형식으로 입력하세요');
      return;
    }
    const cond = { dataYm: ym, managerId: v.managerId, providePurCode: v.providePurCode, searchText: '' };
    setBusy(true);
    try {
      const res = await bizPromoApi.searchCardContents({ ...cond, offset: (toPage - 1) * LIMIT, limit: LIMIT });
      gridRef.current?.api?.deselectAll();
      setRows(res.rows);
      setTotal(res.total);
      setPage(toPage);
      setAfterLoad(n => n + 1);
      setAmount(await bizPromoApi.getCardContentsAmount(cond));
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
      api.setFocusedCell(i, 'htmlCardName');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [afterLoad]);

  // [E0] 화면 열림 (생성자 L78-145) → setting(), retrieve()
  useEffect(() => {
    void loadManagers(sp.current.current.dataYm);
    void retrieve();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E3] grid.RowClick (L192) → retrieveTabpage() L282-297: 고른 내역을 편집 칸·인원 칸에 넘긴다 (저장·인원 변경 뒤 retrieve())
  const onSelect = (row: BizCardContents | undefined) => {
    if (!row) return;
    num.current = Math.max(0, rows.findIndex(r => r.promoId === row.promoId));
    setCurrent(row);
  };

  // [E6] rdButton[출력/다운로드].Select (L212) → 서비스 sys.Sys99_Print.insertRdCardContents(companyId, personId, "Biz01_Tab_CardContents", dataYm, managerId, providePurCode, searchText)
  //   → 성공이면 RDViewer.viewer(dns admin · CommonViewer.html · mrd Biz01_Rd_CardContents · options "/rhtmlimportopt [2]" · rv rdGroupId·companyId·personId·dataYm)
  const rdPrint = async () => {
    const ym = cardDate();
    if (!ym) return;
    const v = sp.current.current;
    setBusy(true);
    try {
      const groupId = await bizPromoApi.rdPrintCardContents({ dataYm: ym, managerId: v.managerId, providePurCode: v.providePurCode, searchText: '' });
      const res = await rdApi.buildUrl({
        kind: 'viewer',
        mrd: 'Biz01_Rd_CardContents',
        options: '/rhtmlimportopt [2]',
        rv: { rdGroupId: groupId, dataYm: ym },
      });
      setRdUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    } finally {
      setBusy(false);
    }
  };

  // [E7] downloadButton[엑셀다운로드].Select (L253) → createRdExcel() L381-434: 서비스 sys.Sys99_Print.insertRdCardContentsDownload(windowClassName, companyId, personId, dataYm, managerId, providePurCode, searchText)
  //   → 성공이면 RDUtil.download(page CommonInvokerDownload.jsp · mrd Biz01_Rd_CardContentsDownload · options "/rexportopt [6] /rxlsopt [100]" · 파일 "법인카드 사용내역조회(yyyy.MM).xlsx" · rv companyId·personId·rdGroupId·dataYm)
  const createRdExcel = async () => {
    const ym = cardDate();
    if (!ym) return;
    const v = sp.current.current;
    setBusy(true);
    try {
      const groupId = await bizPromoApi.rdDownloadCardContents({ dataYm: ym, managerId: v.managerId, providePurCode: v.providePurCode, searchText: '' });
      const res = await rdApi.buildUrl({
        kind: 'download',
        mrd: 'Biz01_Rd_CardContentsDownload',
        options: '/rexportopt [6] /rxlsopt [100]',
        exportType: 'xlsx',
        fileName: `법인카드 사용내역조회(${ym}).xlsx`,
        rv: { rdGroupId: groupId, dataYm: ym },
      });
      await rdDownload(res);
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    } finally {
      setBusy(false);
    }
  };

  // buildGrid() L262-280
  const columnDefs = useMemo(() => [
    gb.textCenter('closeName', 70, '마감구분'),  // L264
    gb.text('htmlCardName', 110, '카드명'),  // L265
    gb.textCenter('regEmpName', 70, '관리자'),  // L266
    gb.date('approvalDt', 90, '카드승인일'),  // L267 (원본 100 — UX-08 읽기 전용 날짜는 90)
    gb.text('franchiseName', 200, '가맹점명'),  // L268
    gb.text('sectorName', 150, '업종'),  // L269
    gb.long('approvalAmount', 100, '승인금액'),  // L270
    gb.textCenter('providePurName', 100, '제공목적'),  // L271
    gb.textCenter('provideContentName', 100, '제공내역'),  // L272
    gb.long('totalPeple', 70, '인원'),  // L273
    gb.long('averagePrice', 100, '인당 경제적가치'),  // L274
    gb.text('note', 300, '비고'),  // L275
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
        <div style={{ flex: 4, minWidth: 0 }}>
          {/* [E5] retrieveButton[조회].Select (L206) → retrieve() · [E1] dataYMText.KeyPress [Enter] (L160) → retrieve()
              [E4 생략] searchTextField.KeyPress [Enter] (L198) — 입력칸이 툴바에 붙어 있지 않아 화면에 없다(원본 그대로, searchText는 늘 빈 값) */}
          <SearchBar
            onSearch={retrieve}
            extra={(
              <>
                <Button type="download" onClick={rdPrint}>출력/다운로드</Button>
                <Button type="download" onClick={createRdExcel}>엑셀다운로드</Button>
              </>
            )}
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
          </SearchBar>
        </div>
        {/* totalAmtCheck() L348-379: label01 — 총 승인금액 (오른쪽 정렬, 14px 굵게, 금액은 #456EA6) */}
        <div style={{ flex: 1, textAlign: 'right', fontSize: 14, fontWeight: 'bold', whiteSpace: 'nowrap' }}>
          총 승인금액 : <span style={{ color: BLUE }}>{amount.toLocaleString()}</span> 원
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Splitter style={{ height: '100%' }}>
          <Splitter.Panel min={600}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', border: '1px solid #d9d9d9' }}>
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
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', border: '1px solid #d9d9d9' }}>
              <div style={{ height: 280, flex: 'none' }}>
                {/* setButtonVisible(false) L149-150: 콤보 3개 잠금 · 인원 칸 [등록][삭제] 숨김 → closed */}
                <Biz01_Edit_Card promo={current} closed onSaved={() => void retrieve()} onEmpAdded={() => setPersonRefresh(n => n + 1)} />
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <Biz02_Grid_PersonList promo={current} closed refreshKey={personRefresh} onChanged={() => void retrieve()} />
              </div>
            </div>
          </Splitter.Panel>
        </Splitter>
      </div>
      <RdViewer url={rdUrl} title="법인카드 사용내역 조회" onClose={() => setRdUrl(null)} />
    </div>
  );
};
