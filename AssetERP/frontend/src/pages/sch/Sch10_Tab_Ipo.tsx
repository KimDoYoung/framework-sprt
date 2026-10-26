/**
 * [1223] 펀드관리 > 04. 공모주청약 > 공모주 일정조회 (Q04)
 * AS-IS: myApp/client/vi/sch/Sch10_Tab_Ipo.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L80-138: 가운데(여백 20, 테두리) = 툴바 1줄(조회일자 [콤보 100 · 시작 100 ~ 종료 100] · 시장구분 [콤보 70 "전체"] · 검색 250 "종목명/주간사" · ☐ 관심종목만 보기 · [조회][출력/다운로드][DART 바로가기])
 *   + 툴바 2줄([관심종목 등록][관심종목 제거] · [공모주 달력] · 안내 2줄 4472C4 12px) + 공모주 일정 그리드(체크 다중, 1~3열 고정, 2단 헤더 수요예측일정·청약일정)
 * UX보강(10): 툴바 = SearchBar(UX-01), 읽기 전용 날짜 열 폭 90(UX-08, 원본 95·120)
 * 수요예측참여(E9) 아이콘은 Q05의 `Fnd30_Edit_DemandOpr`(insertWith)를 연다. [다음 단계] 청약운용지시(E10) 아이콘의 `Fnd30_Edit_Opr`는 Q06(`Fnd30_Tab_Opr`)에서 만든다 — 지금은 안내만
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { schApi } from '@/api/sch';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { Sch10IpoUser, Sch12IpoCorp } from '@/types/sch';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { MultiGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { RdViewer } from '@/components/lookup/RdViewer';
import { AgGridReact } from 'ag-grid-react';
import { Sch02_Lookup_Share } from './Sch02_Lookup_Share';
import { Sch12_Lookup_IpoCorpList } from './Sch12_Lookup_IpoCorpList';
import { RdViewer_Sch10 } from './RdViewer_Sch10';
import { DemandOprTarget, Fnd30_Edit_DemandOpr } from '../fnd/Fnd30_Edit_DemandOpr';

const gb = gbFor<Sch10IpoUser>();
const FORMAT = 'YYYY-MM-DD';
const NO_HOMEPAGE = '해당 주간사에 대한 주소가 없습니다. 관리자에게 문의해주세요.';

export const Sch10_Tab_Ipo: React.FC = () => {
  const gridRef = useRef<AgGridReact<Sch10IpoUser>>(null);
  // settings() L140-274: 조회일자 콤보 "수요예측일"(코드 1), 시작 올해 1/1, 종료 올해 12/31, 시장구분 "전체", 관심종목만 보기 꺼짐
  const [dateType, setDateType] = useState('1');
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().startOf('year'));
  const [closeDate, setCloseDate] = useState<Dayjs>(dayjs().endOf('year'));
  const [marketCode, setMarketCode] = useState('%');
  const [searchText, setSearchText] = useState('');
  const [interestYn, setInterestYn] = useState(false);
  const [rows, setRows] = useState<Sch10IpoUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [rdUrl, setRdUrl] = useState<string | null>(null);
  const [shareIpoId, setShareIpoId] = useState<number | null>(null);
  const [corpNames, setCorpNames] = useState<string | null>(null);
  const [demandTarget, setDemandTarget] = useState<DemandOprTarget | null>(null);

  const cond = () => ({ dateType, startDate: startDate.format(FORMAT), closeDate: closeDate.format(FORMAT), searchText, marketCode, interestYn });

  // retrieve() L403-439: sch.Sch10_Ipo.selectBySearchText. 조회가 끝나면 첫 행을 선택한다(grid.getSelectionModel().select(0, false))
  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      const list = await schApi.searchIposUser({ dateType, startDate: startDate.format(FORMAT), closeDate: closeDate.format(FORMAT), searchText, marketCode, interestYn });
      setRows(list);
      setTimeout(() => gridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true), 0);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [dateType, startDate, closeDate, searchText, marketCode, interestYn]);

  // [E0] 화면 열림 (생성자 L80-138) → settings(), retrieve()  ·  [E1] dateComboBox.callbackOnCreate (L141) → retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void retrieve(); }, []);

  // [E7] interestButton[관심종목 등록].Select (L262) → interest(true)  ·  [E8] interestDeleteButton[관심종목 제거].Select (L268) → interest(false)
  // interest() L453-477: 고른 행이 없으면 "대상을 먼저 선택해주세요" → sch.Sch11_IpoCompany.insertInterest → retrieve()
  const interest = async (yn: boolean) => {
    const selected = gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.length === 0) {
      message.warning('대상을 먼저 선택해주세요');
      return;
    }
    try {
      await schApi.updateIpoInterests(selected.map(r => r.ipoId), yn);
    } catch (err) {
      message.error(errorMessage(err, '처리 실패'));
      return;
    }
    await retrieve();
  };

  // [E5] downLoadListButton[출력/다운로드].Select (L199) → sys.Sys99_Print.insertRdIpo(…) → RDViewer.viewer(Sch10_Rd_IpoList, rdGroupId)
  const printList = async () => {
    try {
      const groupId = await schApi.printIpos(cond());
      const res = await rdApi.buildUrl({ kind: 'viewer', mrd: 'Sch10_Rd_IpoList', options: '/rhtmlimportopt [2]', rv: { rdGroupId: groupId } });
      setRdUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    }
  };

  // siteCell.execute (buildGrid L277-): 주간사가 하나면 홈페이지로, 여럿이면 주간사List 창으로
  const openSite = async (row: Sch10IpoUser) => {
    const corpName = row.note ?? '';
    if (corpName.split(',').length > 1) {
      setCorpNames(corpName);  // lookupIpoCorpList() L479-492
      return;
    }
    try {
      const list = await schApi.searchIpoCorpsByName(corpName);
      const homepage = list[0]?.homepage;
      if (!homepage) {
        message.warning(NO_HOMEPAGE);
        return;
      }
      window.open(homepage, '_blank');
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  const openCorp = (row: Sch12IpoCorp) => {
    if (!row.homepage) {
      message.warning(NO_HOMEPAGE);
      return;
    }
    window.open(row.homepage, '_blank');
  };

  // lookupShare() L441-451: Sch02_Lookup_Share → 저장 뒤 그 행의 일정공유 칸을 바꾼다
  const columnDefs = useMemo(() => [
    gb.textCenter('interestName', 60, '관심', { pinned: 'left' }),                     // L283 addTextFrozen center
    gb.textCenter('marketName', 100, '시장구분', { pinned: 'left' }),                   // L284 addTextFrozen center
    gb.text('itemName', 250, '종목', { pinned: 'left' }),                               // L285 addTextFrozen left
    // L279 addHeaderGroupMap(0, 5, "수요예측일정", 1, 2), L280 addHeaderGroupMap(0, 7, "청약일정", 1, 2)
    gb.group('수요예측일정', [
      gb.date('demandStartDate', 90, '시작일'),                                         // L293
      gb.date('demandCloseDate', 90, '종료일'),                                         // L294
    ]),
    gb.group('청약일정', [
      gb.date('subscriptionStartDate', 90, '시작일'),                                   // L295
      gb.date('subscriptionCloseDate', 90, '종료일'),                                   // L296
    ]),
    gb.date('payDate', 90, '납입(환불)일'),                                             // L297
    // [E9] insertDemandCell (L284-310) → Fnd30_Edit_DemandOpr.insert(oprModel, callback → retrieve()): 신청일 오늘·납입일·종목명·주간사(note)·수요예측기간(yy.MM.dd ~ yy.MM.dd)·시장구분·공모가밴드·확정공모가액 변동수용 true
    iconCell<Sch10IpoUser>('edit', 'demandAction', 60, '수요예측<br>참여', row => setDemandTarget({
      mode: 'insertWith',
      preset: {
        demandDate: dayjs().format(FORMAT),
        payDate: row.payDate ?? null,
        itemName: row.itemName ?? null,
        leadManager: row.note ?? null,
        demandPeriod: `${row.demandStartDate ? dayjs(row.demandStartDate).format('YY.MM.DD') : ''} ~ ${row.demandCloseDate ? dayjs(row.demandCloseDate).format('YY.MM.DD') : ''}`,
        market: row.marketName ?? null,
        priceBracket: row.priceBracket ?? null,
        priceAcceptYn: true,
      },
    })),
    // [E10] insertCell → Fnd30_Edit_Opr.insert(oprModel{oprCode "01" …}) — Q06에서
    iconCell<Sch10IpoUser>('edit', 'opAction', 60, '청약<br>운용지시', () => {
      message.info('청약 운용지시 등록창(Fnd30_Edit_Opr)은 공모주청약 운용지시(Q06) 변환에서 연결합니다.');
    }),
    gb.date('listDate', 90, '상장(예정)일'),                                            // L300
    gb.textCenter('priceBracket', 120, '희망공모가'),                                    // L301
    gb.long('price', 80, '공모가', { cellStyle: { fontWeight: 'bold' } }),               // L302 addLongBold
    gb.textArea('note', 250, '주간사'),                                                  // L303
    iconCell<Sch10IpoUser>('view', 'siteAction', 60, '바로가기', row => void openSite(row)),  // siteCell
    gb.double('subscriptionRate', 80, 'ICAM<br>청약률(%)'),                              // L305 addDoubleHtml
    gb.text('shareInfo', 150, '일정공유', { headerClass: ['gb-hdr', 'sch10-share-hdr'] }),  // L306 addText(…, "0069B4")
    iconCell<Sch10IpoUser>('edit', 'shareAction', 30, '', row => setShareIpoId(row.ipoId)),  // shareCell → lookupShare()
  ], []);  // eslint-disable-line react-hooks/exhaustive-deps

  const noticeStyle: React.CSSProperties = { color: '#4472C4', fontSize: 12, lineHeight: '25px' };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
      <style>{'.sch10-share-hdr .ag-header-cell-text{color:#0069B4}'}</style>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8, padding: 10, background: '#fff' }}>
        {/* [E3] retrieveButton[조회].Select (L173) → retrieve(), [E2] searchText.KeyPress [Enter] (L164) → retrieve() */}
        <SearchBar
          onSearch={retrieve}
          loading={loading}
          extra={<>
            <Button type="download" onClick={printList}>출력/다운로드</Button>
            {/* [E6] homePageOpenButton[DART 바로가기].Select (L256) → Window.open("https://dart.fss.or.kr") */}
            <Button type="goto" onClick={() => window.open('https://dart.fss.or.kr', '_blank')}>DART 바로가기</Button>
          </>}
        >
          <SearchBar.Field label="조회일자">
            <SystemCodeComboBox kindCd="IpoScheduleDateType" style={{ width: 100 }} value={dateType} onChange={code => setDateType(code ?? '1')} />
            <DatePicker style={{ width: 120 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
            <span> ~ </span>
            <DatePicker style={{ width: 120 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="시장구분">
            <SystemCodeComboBox kindCd="MarketCode" altCode={['%', '전체']} style={{ width: 90 }} value={marketCode} onChange={code => setMarketCode(code ?? '%')} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 250 }} placeholder="종목명/주간사" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
          <Checkbox checked={interestYn} onChange={e => setInterestYn(e.target.checked)}>관심종목만 보기</Checkbox>
        </SearchBar>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <Button type="save" onClick={() => interest(true)}>관심종목 등록</Button>
          <Button type="delete" onClick={() => interest(false)}>관심종목 제거</Button>
          {/* [E4] downLoadButton[공모주 달력].Select (L179) → RDViewer.openSch10(Sch10_Rd_Ipo) */}
          <Button type="download" onClick={() => setCalendarOpen(true)}>공모주 달력</Button>
          <div style={{ width: 600 }}>
            <div style={noticeStyle}>※ 일정변동 여부 등을 증권신고서를 통해 반드시 확인하세요.</div>
            <div style={noticeStyle}>※ ICAM청약률(%) : 한국펀드서비스 고객사 기준</div>
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<Sch10IpoUser>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.ipoId)}
            selectionColumnDef={{ pinned: 'left' }}
          />
        </div>
      </div>
      <Sch02_Lookup_Share
        ipoId={shareIpoId}
        onSaved={info => setRows(prev => prev.map(r => (r.ipoId === shareIpoId ? { ...r, shareInfo: info } : r)))}
        onClose={() => setShareIpoId(null)}
      />
      <Sch12_Lookup_IpoCorpList corpName={corpNames} onResult={row => openCorp(row)} onClose={() => setCorpNames(null)} />
      <RdViewer_Sch10 open={calendarOpen} onClose={() => setCalendarOpen(false)} />
      <Fnd30_Edit_DemandOpr target={demandTarget} onSaved={() => void retrieve()} onClose={() => setDemandTarget(null)} />
      <RdViewer url={rdUrl} title="" onClose={() => setRdUrl(null)} />
    </div>
  );
};
