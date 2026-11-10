/**
 * 문서작성 > 02. 문서검색 > (X)종목별 문서검색 > 오른쪽 문서 목록 (F07, 1단계)
 * AS-IS: myApp/client/vi/apr/Apr01_Grid_ItemDocList.java (167줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L40-95: vlc 테두리 = 툴바(50: ◉연관종목만 ◉연관종목운용펀드포함 · 검색 [200] · [조회]) / 문서 그리드(체크박스 단일, 행번호 표시)
 * 상세보기 아이콘 → 전자결재 문서 창 Apr01_Edit_ApprDoc (2026-11-10 연결, 전엔 안내만).
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message, Radio } from 'antd';
import { aprApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprItemDoc } from '@/types/apr';
import { AstItemTreeNode } from '@/types/ast';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { Apr01_Edit_ApprDoc } from './Apr01_Edit_ApprDoc';

const gb = gbFor<AprItemDocRow>();

/** 연관 첨부파일 조인으로 같은 문서가 여러 행일 수 있어 apprId가 유일하지 않다 — 순번을 붙인 key를 그리드 행 id로 쓴다 */
type AprItemDocRow = AprItemDoc & { rowKey: string };

interface Props {
  /** 왼쪽 트리에서 고른 노드 (없으면 조회하지 않는다) */
  node: AstItemTreeNode | null;
}

export const Apr01_Grid_ItemDocList: React.FC<Props> = ({ node }) => {
  // [E0] 화면 열림 (생성자 L40-95): 검색구분 기본 "연관종목만"(searchType 1)
  const [searchType, setSearchType] = useState('1');
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<AprItemDocRow[]>([]);
  const [loading, setLoading] = useState(false);
  const seq = useRef(0);
  /** 문서 창 (Apr01_Edit_ApprDoc.retrieveApproval) */
  const [viewApprId, setViewApprId] = useState<number | null>(null);

  // public retrieve() L116-130: apr.Apr01_Appr.selectByItemDocList (검색어는 SQL이 %…%로)
  const retrieve = async (target: AstItemTreeNode | null = node, type: string = searchType) => {
    const my = ++seq.current;
    if (target == null) {
      setRows([]);
      return;
    }
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await aprApi.searchItemDocList({ astClassTreeId: target.classTreeId, searchType: type, searchText });
      if (my !== seq.current) return;
      setRows(list.map((r, i) => ({ ...r, rowKey: `${r.apprId}-${i}` })));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === seq.current) setLoading(false);
    }
  };

  // 트리에서 노드를 고르면(Apr01_Tab_ItemDocument.retrieveTabpage L182-198) setAstClassTreeId + retrieve()
  useEffect(() => {
    if (node != null) void retrieve(node);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node]);

  // [E1] toggleSearchType.ValueChange (L57) → searchType 바꾸고 retrieve()
  const changeSearchType = (type: string) => {
    setSearchType(type);
    void retrieve(node, type);
  };

  // buildGrid() L66-94
  const columnDefs = useMemo(() => [
    gb.date('regDate', 100, '상신일'),  // L84
    gb.date('effectDate', 100, '시행일'),  // L85
    gb.text('classTreeNameAllPath', 500, '문서분류'),  // L86
    gb.text('title', 500, '상신제목'),  // L87
    gb.text('note', 150, '비고'),  // L88
    // [E3] detailCell (ImageCell).callbackOnCreate (L117) → 인라인 L117-121
    // L89 actionCell(Detail): Apr01_Edit_ApprDoc.retrieveApproval(model, isAdmin=false, callback: 없음)
    iconCell<AprItemDocRow>('view', 'actionCell', 60, '상세보기', row => setViewApprId(row.apprId)),
    gb.text('fileName', 500, '첨부파일'),  // L90
  ], []);

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9' }}>
      {/* [E2] retrieveButton[조회].Select (L71) → retrieve() */}
      <SearchBar onSearch={() => void retrieve()} searchText="조회" loading={loading}>
        <Radio.Group value={searchType} onChange={e => changeSearchType(e.target.value)}>
          <Radio value="1">연관종목만</Radio>
          <Radio value="2">연관종목운용펀드포함</Radio>
        </Radio.Group>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 200 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
        <SingleGrid<AprItemDocRow>
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => p.data.rowKey}
          loading={loading}
          rowSelection={ROW_SELECTION}
        />
      </div>
      <Apr01_Edit_ApprDoc apprId={viewApprId} onClose={() => setViewApprId(null)} />
    </div>
  );
};

const ROW_SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;
