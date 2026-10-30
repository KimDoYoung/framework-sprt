/**
 * [1296] 고유자산 > 20. 고유자산 거래처리 > 공모주일정 (W04)
 * AS-IS: myApp/client/vi/sch/Sch10_Tab_Ipo2.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L77-135: 가운데 = 툴바 1줄(조회일자 [콤보 100 · 시작 ~ 종료] · 시장구분 [콤보 "전체"] · 검색 250 "종목명/주간사" · ☐ 관심종목만 보기 · [조회][출력/다운로드][DART 바로가기])
 *   + 툴바 2줄([관심종목 등록][관심종목 제거] · [공모주 달력] · 안내 2줄 4472C4 12px) + 공모주 일정 그리드(체크 다중, 2단 헤더 수요예측일정·청약일정)
 * 스타일: SG (견본 Tdm01_Tab_Hr — 툴바 2줄이라 SearchBar 아래에 버튼 줄을 한 줄 더 둔다)
 * 형제 Q04 `Sch10_Tab_Ipo`(#1223)와 같은 서버·창을 쓴다. 다른 점: 수요예측참여(E9)·청약운용지시(E10) 아이콘 열이 없고, 1~3열 고정이 없다
 * UX보강(10): 툴바 = SearchBar(UX-01), 읽기 전용 날짜 열 폭 90(UX-08, 원본 95·120)
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

const gb = gbFor<Sch10IpoUser>();
const FORMAT = 'YYYY-MM-DD';
const NO_HOMEPAGE = '해당 주간사에 대한 주소가 없습니다. 관리자에게 문의해주세요.';

export const Sch10_Tab_Ipo2: React.FC = () => {
  const gridRef = useRef<AgGridReact<Sch10IpoUser>>(null);
  // settings() L137-269: 조회일자 콤보 "수요예측일"(코드 1), 시작 올해 1/1, 종료 올해 12/31, 시장구분 "전체", 관심종목만 보기 꺼짐
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

  const cond = () => ({ dateType, startDate: startDate.format(FORMAT), closeDate: closeDate.format(FORMAT), searchText, marketCode, interestYn });

  // retrieve() L344-380: sch.Sch10_Ipo.selectBySearchText (ManagerYn=false). 조회가 끝나면 첫 행을 선택한다(grid.getSelectionModel().select(0, false))
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

  // [E0] 화면 열림 (생성자 L77-135) → settings(), retrieve()  ·  [E1] dateComboBox.callbackOnCreate (L138) → retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void retrieve(); }, []);

  // [E7] interestButton[관심종목 등록].Select (L256) → interest(true)  ·  [E8] interestDeleteButton[관심종목 제거].Select → interest(false)
  // interest() L394-418: 고른 행이 없으면 "대상을 먼저 선택해주세요" → sch.Sch11_IpoCompany.insertInterest → retrieve()
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

  // [E5] downLoadListButton[출력/다운로드].Select (L193) → sys.Sys99_Print.insertRdIpo(…) → RDViewer.viewer(Sch10_Rd_IpoList, rdGroupId)
  const printList = async () => {
    try {
      const groupId = await schApi.printIpos(cond());
      const res = await rdApi.buildUrl({ kind: 'viewer', mrd: 'Sch10_Rd_IpoList', options: '/rhtmlimportopt [2]', rv: { rdGroupId: groupId } });
      setRdUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    }
  };

  // siteCell.execute (buildGrid L271-): 주간사가 하나면 홈페이지로, 여럿이면 주간사List 창으로
  const openSite = async (row: Sch10IpoUser) => {
    const corpName = row.note ?? '';
    if (corpName.split(',').length > 1) {
      setCorpNames(corpName);  // lookupIpoCorpList() L420-433
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

  // buildGrid() L271-342. lookupShare() L382-392: Sch02_Lookup_Share → 저장 뒤 그 행의 일정공유 칸을 바꾼다
  const columnDefs = useMemo(() => [
    gb.textCenter('interestName', 60, '관심'),                                          // L304 addTextCenter
    gb.textCenter('marketName', 100, '시장구분'),                                        // L305
    gb.text('itemName', 250, '종목', { cellStyle: { fontWeight: 'bold' } }),             // L306 addTextBold
    // L299 addHeaderGroupMap(0, 5, "수요예측일정", 1, 2), L300 addHeaderGroupMap(0, 7, "청약일정", 1, 2)
    gb.group('수요예측일정', [
      gb.date('demandStartDate', 90, '시작일'),                                          // L307
      gb.date('demandCloseDate', 90, '종료일'),                                          // L308
    ]),
    gb.group('청약일정', [
      gb.date('subscriptionStartDate', 90, '시작일'),                                    // L309
      gb.date('subscriptionCloseDate', 90, '종료일'),                                    // L310
    ]),
    gb.date('payDate', 90, '납입(환불)일'),                                              // L311
    gb.date('listDate', 90, '상장(예정)일'),                                             // L312
    gb.textCenter('priceBracket', 120, '희망공모가'),                                     // L313
    gb.long('price', 80, '공모가', { cellStyle: { fontWeight: 'bold' } }),                // L314 addLongBold
    gb.textArea('note', 250, '주간사'),                                                   // L315
    iconCell<Sch10IpoUser>('view', 'siteAction', 60, '바로가기', row => void openSite(row)),  // siteCell
    gb.double('subscriptionRate', 80, 'ICAM<br>청약률(%)'),                               // L317 addDoubleHtml
    gb.text('shareInfo', 150, '일정공유', { headerClass: ['gb-hdr', 'sch10-share-hdr'] }),   // L318 addText(…, "0069B4")
    iconCell<Sch10IpoUser>('edit', 'shareAction', 30, '', row => setShareIpoId(row.ipoId)),  // shareCell → lookupShare()
  ], []);  // eslint-disable-line react-hooks/exhaustive-deps

  const noticeStyle: React.CSSProperties = { color: '#4472C4', fontSize: 12, lineHeight: '25px' };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E3] retrieveButton[조회].Select (L169) → retrieve(), [E2] searchText.KeyPress [Enter] (L161) → retrieve() */}
        <SearchBar
          onSearch={retrieve}
          loading={loading}
          extra={<>
            <Button type="download" onClick={printList}>출력/다운로드</Button>
            {/* [E6] homePageOpenButton[DART 바로가기].Select (L250) → Window.open("https://dart.fss.or.kr") */}
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
          {/* [E4] downLoadButton[공모주 달력].Select (L175) → RDViewer.openSch10(Sch10_Rd_Ipo) */}
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
      <RdViewer url={rdUrl} title="" onClose={() => setRdUrl(null)} />
    </div>
  );
};
