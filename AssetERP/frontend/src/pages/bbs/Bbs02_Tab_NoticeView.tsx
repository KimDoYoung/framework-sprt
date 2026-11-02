/**
 * [1065] 커뮤니티 > 02. 공지사항 > 공지사항 (Z03)
 * AS-IS: myApp/client/vi/bbs/Bbs02_Tab_NoticeView.java (320줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L64-104: center=박스(여백 20) — 툴바(공지구분 120 · 구분상세 200 · 공지기간 100~100 · 검색 250 · [조회]) + 공지 그리드(단일 선택, 버튼바 50) + 페이징 툴바(100)
 * 연결: Bbs02_Popup_NoticeAdmin(상세보기 아이콘, H01에서 만든 것을 재사용 — 댓글·첨부파일 창은 그 안에서 열림)
 * 스타일: SG (견본 — docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 박스 안 여백 = 11 §5(padding 10·gap 8). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, Select, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { bbsNoticeApi } from '@/api/bbs';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { BbsNoticePerson } from '@/types/bbs';
import { Code } from '@/types/sys';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { PagingToolBar, SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Bbs02_Popup_NoticeAdmin } from './Bbs02_Popup_NoticeAdmin';

const gb = gbFor<BbsNoticePerson>();
const LIMIT = 100;  // gridToolBar.setToolBar(100)
const DATE = 'YYYY-MM-DD';
const SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Param { noticeType: string; noticeDetailCode: string; searchText: string; startDate?: string; closeDate?: string }

export const Bbs02_Tab_NoticeView: React.FC = () => {
  const [noticeType, setNoticeType] = useState('%');
  const [detailCodes, setDetailCodes] = useState<Code[]>([]);
  const [noticeDetailCode, setNoticeDetailCode] = useState('%');
  // settings() L116-198: 기간 기본값 = 오늘 -3개월 ~ 오늘
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().subtract(3, 'month'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<BbsNoticePerson[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [viewing, setViewing] = useState<BbsNoticePerson | null>(null);
  const retrievingRef = useRef(false);   // retrieving: 조회 중이면 다시 안 읽는다 (L245-248)
  /** gridToolBar.addParam(…) — 페이지를 넘길 때는 마지막 조회 조건을 쓴다(GridPagingLoader) */
  const paramRef = useRef<Param | undefined>(undefined);
  const allDetailRef = useRef<Code[]>([]);

  // GridPagingLoader.getPaging(): 저장된 조건 + offset·limit → 목록·전체 건수
  const getPaging = async (p: number) => {
    if (!paramRef.current) return;
    setLoading(true);
    try {
      const res = await bbsNoticeApi.searchMyNotices({ ...paramRef.current, offset: (p - 1) * LIMIT, limit: LIMIT });
      setRows(res.rows);
      setTotal(res.total);
      setPage(p);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // retrieve() L244-280: 구분이 전체('%')일 때만 기간(startDate·closeDate)을 건다. 1페이지부터 다시 읽는다
  const retrieve = async (over?: { noticeType?: string; noticeDetailCode?: string }) => {
    if (retrievingRef.current) return;
    retrievingRef.current = true;
    const type = over?.noticeType ?? noticeType;
    paramRef.current = {
      noticeType: type || '%',
      noticeDetailCode: over?.noticeDetailCode ?? noticeDetailCode,
      searchText,
      ...(type === '%' ? { startDate: startDate.format(DATE), closeDate: closeDate.format(DATE) } : {}),
    };
    try {
      await getPaging(1);
    } finally {
      retrievingRef.current = false;
    }
  };

  // [E0] 화면 열림 (생성자 L64-104) → settings(), setDefaultParams() / 구분상세 목록(sys.Sys09_Code.selectByCode3, 코드 "%")을 미리 읽고 첫 조회
  const retrieveRef = useRef(retrieve);
  retrieveRef.current = retrieve;
  useEffect(() => {
    sysApi.searchCodes('NoticeDetailCode')
      .then(list => { allDetailRef.current = list; })
      .catch(err => message.error(errorMessage(err, '공지구분 조회 실패')))
      .finally(() => { void retrieveRef.current(); });
  }, []);

  // [E2] noticeTypeCombo[NoticeType].Collapse (L120) → 구분상세를 "전체"로 되돌리고, 전체면 구분상세를 끄고 조회 /
  //      아니면 구분상세를 켜고 selectByCode3(code = 구분+"%")로 다시 읽은 뒤 조회
  const onTypeChange = (code: string | undefined) => {
    const v = code && code !== '' ? code : '%';
    setNoticeType(v);
    setNoticeDetailCode('%');
    setDetailCodes(v === '%' ? [] : allDetailRef.current.filter(c => c.code.startsWith(v)));
    void retrieve({ noticeType: v, noticeDetailCode: '%' });
  };

  // buildGrid() L200-217 (단일 선택)
  const columnDefs = useMemo(() => [
    gb.pin('topYn', 35, ''),  // L209
    gb.date('fromDate', 100, '공지일'),  // L210
    gb.textCenter('noticeNo', 100, '공지번호'),  // L211
    gb.textHtml('noticeDetailFullName', 200, '공지구분'),  // L212
    gb.textHtml('title', 600, '제목'),  // L213
    // L214 addCell(ImageCell("보기")) → viewNotice() L219-242: commentYn이면 openWithComment, 아니면 open (머리글 = title2)
    iconCell<BbsNoticePerson>('view', 'actionCell', 70, '상세보기', setViewing),
  ], []);

  const dateEnabled = noticeType === '%';

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E6] retrieveButton[조회].Select (L192) → retrieve() */}
        <SearchBar onSearch={() => void retrieve()} searchText="조회" loading={loading}>
          <SearchBar.Field label="공지구분">
            {/* [E1] callbackOnCreate (L50) / [E2] 위 onTypeChange */}
            <SystemCodeComboBox kindCd="NoticeType" altCode={['%', '전체']} style={{ width: 120 }} value={noticeType} onChange={onTypeChange} />
            {/* [E3] callbackOnCreate (L156) → 전체·꺼짐 / [E4] noticeDetailCombo.Collapse (L166) → retrieve() */}
            <Select
              style={{ width: 200 }}
              disabled={noticeType === '%'}
              value={noticeDetailCode}
              onChange={v => { setNoticeDetailCode(v); void retrieve({ noticeDetailCode: v }); }}
              options={[{ value: '%', label: '전체' }, ...detailCodes.map(c => ({ value: c.code, label: c.name }))]}
            />
          </SearchBar.Field>
          <SearchBar.Field label="공지기간">
            <DatePicker style={{ width: 130 }} allowClear={false} disabled={!dateEnabled} value={startDate} onChange={d => d && setStartDate(d)} />
            <span>~</span>
            <DatePicker style={{ width: 130 }} allowClear={false} disabled={!dateEnabled} value={closeDate} onChange={d => d && setCloseDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            {/* [E5] searchText.KeyPress [Enter] (L184) → retrieve() */}
            <SearchBar.Input style={{ width: 250 }} placeholder="공지번호/공지구분/제목" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<BbsNoticePerson>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.noticeId)}
            loading={loading}
            rowSelection={SELECTION}
            // 조회가 끝나면 첫 행을 고른다: grid.getSelectionModel().select(0, false)
            onRowDataUpdated={e => e.api.getDisplayedRowAtIndex(0)?.setSelected(true)}
          />
        </div>
        <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={getPaging} />
      </div>
      <Bbs02_Popup_NoticeAdmin notice={viewing} onClose={() => setViewing(null)} />
    </div>
  );
};
