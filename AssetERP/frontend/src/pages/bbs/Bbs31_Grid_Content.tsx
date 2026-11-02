/**
 * 게시물 목록 (Z13) — Bbs30_Tab_ClassTree 오른쪽 (선택한 세부항목의 게시물)
 * AS-IS: myApp/client/vi/bbs/Bbs31_Grid_Content.java (205줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L49-68: 위 = 툴바(검색 입력 300 "게시물 제목/작성자" · [검색] · [게시물 작성]), 아래 = 게시물 그리드(체크 단일, 행번호) + 페이징 툴바(100)
 * 연결: Bbs31_Lookup_Content(상세보기) · Bbs31_Edit_Content(게시물 작성)
 * UX보강(10): 툴바 = SearchBar(UX-01·04)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import { bbsBoardApi } from '@/api/bbs';
import { errorMessage } from '@/api/client';
import { BbsClassTree, BbsContent } from '@/types/bbs';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Button } from '@/components/button';
import { PagingToolBar, SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Bbs31_Edit_Content, BbsContentEdit } from './Bbs31_Edit_Content';
import { Bbs31_Lookup_Content } from './Bbs31_Lookup_Content';

const gb = gbFor<BbsContent>();
const LIMIT = 100;  // gridToolBar.setToolBar(100)
const SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Props {
  /** 선택한 세부항목 — AS-IS retrieve(classTreeModel). null이면 비어 있다 */
  classTree: BbsClassTree | null;
}

export const Bbs31_Grid_Content: React.FC<Props> = ({ classTree }) => {
  const user = useLoginUser();
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<BbsContent[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openYn, setOpenYn] = useState(true);
  const [detail, setDetail] = useState<BbsContent | null>(null);
  const [editTarget, setEditTarget] = useState<BbsContentEdit | null>(null);
  const paramRef = useRef<{ classTreeId: number; searchText: string } | undefined>(undefined);
  const classTreeId = classTree?.classTreeId;
  const publicYn = classTree?.publicYn;

  // GridPagingLoader.getPaging(): 저장된 조건 + offset·limit → 목록·전체 건수
  const getPaging = useCallback(async (p: number) => {
    if (!paramRef.current) return;
    setLoading(true);
    try {
      const res = await bbsBoardApi.searchContents({ ...paramRef.current, offset: (p - 1) * LIMIT, limit: LIMIT });
      setRows(res.rows);
      setTotal(res.total);
      setPage(p);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  // retrieve() L162-180: 조건(세부항목·검색어 — 서버가 '%…%'로 감싼다)을 만들어 1페이지부터 다시 읽는다
  const retrieve = useCallback((text: string) => {
    if (classTreeId == null) return Promise.resolve();
    paramRef.current = { classTreeId, searchText: text };
    return getPaging(1);
  }, [classTreeId, getPaging]);

  // [E0] 화면 열림 (생성자 L49-68) → settings() — 세부항목이 정해지면 아래 retrieve(classTreeModel)
  // retrieve(classTreeModel) L134-160: 목록을 비우고, 전체공개면 바로 열람 가능, 아니면 서비스 bbs.Bbs33_Role.checkRole(orgId, personId, classTreeId)로 권한을 본다
  useEffect(() => {
    setRows([]);
    setTotal(0);
    setPage(1);
    if (classTreeId == null) { paramRef.current = undefined; return; }
    let alive = true;
    const run = async () => {
      let open = true;
      if (!publicYn) {
        try {
          open = await bbsBoardApi.hasRole(classTreeId);
        } catch (err) {
          message.error(errorMessage(err, '권한 조회 실패'));
          open = false;
        }
      }
      if (!alive) return;
      setOpenYn(open);
      await retrieve(searchText);
    };
    void run();
    return () => { alive = false; };
  // 세부항목이 바뀔 때만 (검색어는 [검색]·Enter로)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classTreeId, publicYn]);

  // detailCell (ImageCell "Detail") L96-122: 열람 가능이면 열고, 아니면 내 글만 연다
  const openDetail = (row: BbsContent) => {
    if (openYn || row.personId === user.userId) {
      setDetail(row);
    } else {
      message.warning('해당 게시물의 열람권한이 없습니다');
    }
  };

  // [E2] insertButton[게시물 작성].Select (L81) → insert() L182-200
  const insert = async () => {
    if (classTreeId == null) return message.warning('게시물 세부분류를 선택해주세요');
    if (!openYn) return message.warning('해당 게시물 항목에 작성권한이 없습니다');
    try {
      const contentId = await bbsBoardApi.getContentNextId();  // Bbs31_Edit_Content.insert L68-91: DBUtil.setSeq
      setEditTarget({ isNew: true, contentId, classTreeId, title: '', content: '', hideYn: false });
    } catch (err) {
      message.error(errorMessage(err, '새 게시물 ID를 받지 못했습니다'));
    }
  };

  // buildGrid() L95-132 (체크 단일 선택)
  const columnDefs = useMemo(() => [
    gb.textCenter('regDateStr', 200, '등록일시'),  // L126
    gb.textHtml('titleRole', 500, '제목'),  // L127
    gb.textCenter('personName', 100, '작성자'),  // L128
    iconCell<BbsContent>('view', 'actionCell', 60, '상세보기', openDetail),  // L129 [E4]·[E5] detailCell
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [openYn, user.userId]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* [E3] retrieveButton[검색].Select (L87) → retrieve() / [E1] searhText.KeyPress [Enter] (L73) */}
      <SearchBar
        onSearch={() => void retrieve(searchText)}
        loading={loading}
        extra={<Button type="register" onClick={() => void insert()}>게시물 작성</Button>}
      >
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 300 }} placeholder="게시물 제목/작성자" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<BbsContent>
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.contentId)}
          loading={loading}
          rowSelection={SELECTION}
        />
      </div>
      <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={getPaging} />
      {/* [E5] 상세 창이 닫히면(수정·삭제 포함) callback → retrieve() */}
      <Bbs31_Lookup_Content row={detail} onClose={() => { setDetail(null); void retrieve(searchText); }} />
      <Bbs31_Edit_Content model={editTarget} onClose={() => setEditTarget(null)} onDone={() => void retrieve(searchText)} />
    </div>
  );
};
