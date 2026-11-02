/**
 * [1064] 커뮤니티 > 02. 공지사항 > 사내공지등록 (Z02)
 * AS-IS: myApp/client/vi/bbs/Bbs02_Tab_NoticeManager.java (261줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L53-90: 위 = 툴바(공지구분 120 · 구분상세 200 · 검색 250 "상태/공지구분/제목/기타메모" · [조회][등록][그룹설정]), 가운데 = 공지 그리드(단일 선택, 행번호) + 페이징 툴바
 * 연결: Bbs02_Edit_Notice(등록·수정) · Bbs07_Lookup_Comment(댓글 보기) · Emp57_Lookup_Insert(그룹설정)
 * 스타일: SGP (견본 Chk02_Tab_DailyList — docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Select, message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { bbsNoticeApi } from '@/api/bbs';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { BbsNoticeMng } from '@/types/bbs';
import { Code } from '@/types/sys';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { PagingToolBar, SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Emp57_Lookup_Insert } from '../emp/Emp57_Lookup_Insert';
import { Bbs02_Edit_Notice, BbsNoticeEdit } from './Bbs02_Edit_Notice';
import { Bbs07_Lookup_Comment } from './Bbs07_Lookup_Comment';

const gb = gbFor<BbsNoticeMng>();
const LIMIT = 100;  // gridToolBar.setToolBar(100) — 쪽 크기는 원본 PagingToolBar 기본
const SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Param { noticeType: string; noticeDetail: string; searchText: string }

export const Bbs02_Tab_NoticeManager: React.FC = () => {
  const user = useLoginUser();
  const gridRef = useRef<AgGridReact<BbsNoticeMng>>(null);
  const [noticeType, setNoticeType] = useState('%');
  const [detailCodes, setDetailCodes] = useState<Code[]>([]);
  const [noticeDetail, setNoticeDetail] = useState('%');
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<BbsNoticeMng[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editTarget, setEditTarget] = useState<BbsNoticeEdit | null>(null);
  const [commentId, setCommentId] = useState<number | null>(null);
  const [groupOpen, setGroupOpen] = useState(false);
  const paramRef = useRef<Param | undefined>(undefined);
  const allDetailRef = useRef<Code[]>([]);

  // GridPagingLoader.getPaging(): 저장된 조건 + offset·limit → 목록·전체 건수
  const getPaging = async (p: number) => {
    if (!paramRef.current) return;
    setLoading(true);
    try {
      const res = await bbsNoticeApi.searchNoticeManage({ ...paramRef.current, offset: (p - 1) * LIMIT, limit: LIMIT });
      setRows(res.rows);
      setTotal(res.total);
      setPage(p);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // retrieve() L220-241: 조건을 만들어 1페이지부터 다시 읽는다 (companyId는 서버, searchText = '%' + 글자 + '%' — 서버가 감싼다)
  const retrieve = (over?: { noticeType?: string; noticeDetail?: string }) => {
    paramRef.current = { noticeType: over?.noticeType ?? noticeType, noticeDetail: over?.noticeDetail ?? noticeDetail, searchText };
    return getPaging(1);
  };

  // [E0] 화면 열림 (생성자 L53-90) → setting(), retrieve() — 구분상세 목록(sys.Sys09_Code.selectByCode3, 코드 "%")을 미리 읽고 [E3] 첫 조회
  const retrieveRef = useRef(retrieve);
  retrieveRef.current = retrieve;
  useEffect(() => {
    sysApi.searchCodes('NoticeDetailCode')
      .then(list => { allDetailRef.current = list; })
      .catch(err => message.error(errorMessage(err, '공지구분 조회 실패')))
      .finally(() => { void retrieveRef.current(); });
  }, []);

  // [E2] noticeTypeCombo[NoticeType001].Collapse (L106): 전체면 구분상세를 "전체"·꺼짐으로 두고 조회, 아니면 켜고 selectByCode3(구분+"%") 뒤 조회
  const onTypeChange = (code: string | undefined) => {
    const v = code && code !== '' ? code : '%';
    setNoticeType(v);
    setNoticeDetail('%');
    setDetailCodes(v === '%' ? [] : allDetailRef.current.filter(c => c.code.startsWith(v)));
    void retrieve({ noticeType: v, noticeDetail: '%' });
  };

  // [E7] insertButton[등록].Select (L170) → insertRow() L248-251: Bbs02_Edit_Notice.newNotice(grid) L400-441 — 새 ID, 회사·작성자 = 로그인, 공지구분 "01", 상태 "대기"
  const insertRow = async () => {
    try {
      const id = await bbsNoticeApi.getNoticeNextId();
      setEditTarget({
        isNew: true, noticeId: id, companyId: user.companyId, topYn: false, fromDate: null, toDate: null, openYn: '대기', noticeNo: null,
        noticeType: '01', noticeTypeName: '(회사)전체공지', noticeDetailCode: null, noticeDetailName: null, noticeDetailFullName: null,
        title: null, commentCnt: null, note: null, notice: null, userId: user.userId, userName: user.name, commentYn: false, topNoticeYn: false, topNoticeCloseDate: null,
      });
    } catch (err) {
      message.error(errorMessage(err, '새 공지 ID를 받지 못했습니다'));
    }
  };

  // Bbs02_Edit_Notice 콜백: 저장하면 그 행을 그리드에 넣는다 (AS-IS GridUpdate → grid.getStore().update). 새 행은 맨 아래(03 원칙 17)로 보여 준다
  const onSaved = (saved: BbsNoticeMng) => {
    const exists = rows.some(r => r.noticeId === saved.noticeId);
    setRows(prev => (exists ? prev.map(r => (r.noticeId === saved.noticeId ? saved : r)) : [...prev, saved]));
    if (!exists) setTimeout(() => {
      const api = gridRef.current?.api;
      const node = api?.getRowNode(String(saved.noticeId));
      if (api && node?.rowIndex != null) api.ensureIndexVisible(node.rowIndex);
    }, 0);
  };
  const onDeleted = (noticeId: number) => setRows(prev => prev.filter(r => r.noticeId !== noticeId));

  // buildGrid() L185-217 (단일 선택)
  const columnDefs = useMemo(() => [
    gb.pin('topYn', 35, ''),  // L203
    gb.date('fromDate', 100, '공지일'),  // L204
    gb.date('toDate', 100, '종료일'),  // L205
    gb.textCenter('openYn', 50, '상태'),  // L206
    gb.textCenter('noticeNo', 100, '공지번호'),  // L207
    gb.text('noticeDetailFullName', 200, '공지구분'),  // L208
    gb.text('title', 500, '제목'),  // L209
    gb.longCenter('commentCnt', 40, '댓글'),  // L210
    // L211 addCell(actionCell, 30, "", ImageCell("View")) → Bbs07_Lookup_Comment.open(noticeId)
    iconCell<BbsNoticeMng>('view', 'commentCell', 30, '', row => setCommentId(row.noticeId)),
    // L212 addCell(actionCell, 50, "수정", ImageCell("Edit")) → Bbs02_Edit_Notice.editNotice(grid)
    iconCell<BbsNoticeMng>('edit', 'actionCell', 50, '수정', row => setEditTarget(row)),
    gb.text('note', 300, '기타메모'),  // L213
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E6] retrieveButton[조회].Select (L164) → retrieve() */}
      <SearchBar
        onSearch={() => void retrieve()}
        loading={loading}
        extra={
          <>
            <Button type="register" onClick={() => void insertRow()}>등록</Button>
            {/* [E8] groupButton[그룹설정].Select (L176) → Emp57_Lookup_Insert.open() */}
            <Button type="group" onClick={() => setGroupOpen(true)}>그룹설정</Button>
          </>
        }
      >
        <SearchBar.Field label="공지구분">
          {/* [E1] callbackOnCreate (L98) / [E2] 위 onTypeChange */}
          <SystemCodeComboBox kindGroupCd="NoticeType001" altCode={['%', '전체']} style={{ width: 120 }} value={noticeType} onChange={onTypeChange} />
          {/* [E3] callbackOnCreate (L137) → 전체·꺼짐 / [E4] noticeDetailCombo.Collapse (L147) → retrieve() */}
          <Select
            style={{ width: 200 }}
            disabled={noticeType === '%'}
            value={noticeDetail}
            onChange={v => { setNoticeDetail(v); void retrieve({ noticeDetail: v }); }}
            options={[{ value: '%', label: '전체' }, ...detailCodes.map(c => ({ value: c.code, label: c.name }))]}
          />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          {/* [E5] searchText.KeyPress [Enter] (L156) → retrieve() */}
          <SearchBar.Input style={{ width: 250 }} placeholder="상태/공지구분/제목/기타메모" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<BbsNoticeMng>
          gridRef={gridRef}
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
      <Bbs02_Edit_Notice model={editTarget} onClose={() => setEditTarget(null)} onSaved={onSaved} onDeleted={onDeleted} />
      <Bbs07_Lookup_Comment noticeId={commentId} onClose={() => { setCommentId(null); void getPaging(page); }} />
      <Emp57_Lookup_Insert open={groupOpen} onClose={() => setGroupOpen(false)} />
    </div>
  );
};
