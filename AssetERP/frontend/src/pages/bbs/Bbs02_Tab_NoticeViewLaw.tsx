/**
 * [1258] 준법감시 > 00. 법규정보 > 법규공지 (H01)
 * AS-IS: myApp/client/vi/bbs/Bbs02_Tab_NoticeViewLaw.java (181줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L47-78: center=테두리 박스(여백 20) — 툴바(공지구분 120 · 검색 250 · [조회]) + 공지 그리드(단일 선택, 버튼바 50) + 페이징 툴바(100)
 * 연결: Bbs02_Popup_NoticeAdmin(상세보기 아이콘) + Bbs07_TapPage_Comment·Bbs07_Lookup_FileList(댓글)·Bbs02_Lookup_File(첨부파일)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 박스 안 여백 = 11 §5(padding 10·gap 8). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Select, message } from 'antd';
import { bbsNoticeApi } from '@/api/bbs';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { BbsNotice } from '@/types/bbs';
import { Code } from '@/types/sys';
import { PagingToolBar, SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Bbs02_Popup_NoticeAdmin } from './Bbs02_Popup_NoticeAdmin';

const gb = gbFor<BbsNotice>();
const LIMIT = 100;  // gridToolBar.setToolBar(100)
const SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

export const Bbs02_Tab_NoticeViewLaw: React.FC = () => {
  const [codes, setCodes] = useState<Code[]>([]);
  const [noticeDetailCode, setNoticeDetailCode] = useState('%');
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<BbsNotice[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [viewing, setViewing] = useState<BbsNotice | null>(null);
  /** gridToolBar.addParam(…) — 페이지를 넘길 때는 마지막 조회 조건을 쓴다(GridPagingLoader) */
  const paramRef = useRef<{ noticeType: string; noticeDetailCode: string; searchText: string } | undefined>(undefined);

  // GridPagingLoader.getPaging(): 저장된 조건 + offset·limit → 목록·전체 건수
  const getPaging = async (p: number) => {
    if (!paramRef.current) return;
    setLoading(true);
    try {
      const res = await bbsNoticeApi.searchNotices({ ...paramRef.current, offset: (p - 1) * LIMIT, limit: LIMIT });
      setRows(res.rows);
      setTotal(res.total);
      setPage(p);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E1] searchText.KeyPress [Enter] (L97)·[E2] retrieveButton[조회].Select (L106) → retrieve() L154-176: 조건(noticeType "10")을 만들어 1페이지부터 다시 읽는다
  const retrieve = () => {
    paramRef.current = { noticeType: '10', noticeDetailCode, searchText };
    return getPaging(1);
  };

  // [E0] 화면 열림 (생성자 L47-78) → settings() L80-112: 공지구분 = sys.Sys00_Common.selectByKindCode(NoticeDetailCode, code "10%") 목록에 "전체"를 얹고 "전체"로 둔 뒤 retrieve()
  const retrieveRef = useRef(retrieve);
  retrieveRef.current = retrieve;
  useEffect(() => {
    sysApi.searchCodes('NoticeDetailCode')
      .then(list => setCodes(list.filter(c => c.code.startsWith('10'))))
      .catch(err => message.error(errorMessage(err, '공지구분 조회 실패')))
      .finally(() => { void retrieveRef.current(); });
  }, []);

  // buildGrid() L114-132 (단일 선택)
  const columnDefs = useMemo(() => [
    gb.date('fromDate', 100, '공지일'),  // L120
    gb.text('noticeTypeName', 120, '공지구분'),  // L121
    gb.textCenter('noticeNo', 100, '공지번호'),  // L122
    gb.text('noticeDetailName', 120, '구분상세'),  // L123
    gb.textHtml('title', 800, '제목'),  // L124
    gb.textCenter('publicYnName', 70, '공개여부'),  // L125
    // L116-119 editCell("보기") → viewNotice() L134-152: commentYn이면 openWithComment, 아니면 open
    iconCell<BbsNotice>('view', 'actionCell', 70, '상세보기', setViewing),  // L126
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar onSearch={() => void retrieve()} searchText="조회" loading={loading}>
          <SearchBar.Field label="공지구분">
            <Select
              style={{ width: 120 }}
              value={noticeDetailCode}
              onChange={setNoticeDetailCode}
              options={[{ value: '%', label: '전체' }, ...codes.map(c => ({ value: c.code, label: c.name }))]}
            />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 250 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<BbsNotice>
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
