/**
 * 중요표시 문서 조회창 — 통합 문서검색(Dcr00_Tab_DocList, #1006)·문서 목록(Apr01_Grid_DocList)의 북마크(별) 아이콘이 연다.
 * AS-IS: myApp/client/vi/apr/Apr50_Lookup_ApprList.java (178줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L46-82: 1200×600 모달 "중요표시 문서"(닫기 X 없음), 툴바(검색 · 입력 300 "상신제목/등록자/부서/문서분류" · [검색]) + 그리드(결재상태 80 · 등록(상신)일 100 · 문서구분 70 · 문서명 440 · 상신자 100 · 시행일 100 · 문서분류 170 · 상세보기 80) + 페이징 툴바(50) + [닫기]
 * 12-화면우선원칙: 열 폭 합계 1140 + 행번호·여백이 1120을 넘어 AS-IS 1200보다 크게(1300) 잡고 넘치는 만큼만 스크롤한다 (03 원칙 21)
 */
import React, { useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { aprBookmarkListApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprBookmarkList } from '@/types/apr';
import { Button } from '@/components/button';
import { PagingToolBar, SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Apr01_Edit_ApprDoc } from './Apr01_Edit_ApprDoc';

const gb = gbFor<AprBookmarkList>();
const LIMIT = 50;  // gridToolBar.setToolBar(50)

interface Props {
  open: boolean;
  /** 닫기: hide()만 */
  onClose: () => void;
}

export const Apr50_Lookup_ApprList: React.FC<Props> = ({ open, onClose }) => {
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<AprBookmarkList[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [viewApprId, setViewApprId] = useState<number | null>(null);

  // GridPagingLoader.getPaging(): 검색어 + offset·limit → 목록·전체 건수 (apr.Apr50_Bookmark.selectByPersonIdPaging)
  const getPaging = async (p: number, text: string = searchText) => {
    setLoading(true);
    try {
      const res = await aprBookmarkListApi.search(text, (p - 1) * LIMIT, LIMIT);
      setRows(res.rows);
      setTotal(res.total);
      setPage(p);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // retrieve() L151-169: 1페이지부터 다시 읽는다 — [E2] searchText.KeyPress [Enter] (L87) · [E3] retrieveButton[검색].Select (L95)
  const retrieve = () => getPaging(1);

  // 화면 열림 (open L46-82) → settings(), show(), retrieve()
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    setRows([]);
    setTotal(0);
    setPage(1);
    void getPaging(1, '');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // buildGrid() L109-149
  const columnDefs = useMemo(() => [
    gb.textStatus('statusName', 80, '결재상태'),  // L139
    gb.date('regDate', 100, '등록(상신)일'),  // L140
    gb.textCenter('inOutTypeName', 70, '문서구분'),  // L141
    gb.textHtml('title', 440, '문서명'),  // L142
    gb.textCenter('regEmpName', 100, '상신자'),  // L143
    gb.date('effectDate', 100, '시행일'),  // L144
    gb.text('classTreeName', 170, '문서분류'),  // L145
    // [E5] editDocCell (ImageCell "View") (L110-137) → ApprCallbackResult(열람권한 확인) → Apr01_Edit_ApprDoc.retrieveApproval(model, false, callback → retrieve())
    iconCell<AprBookmarkList>('view', 'actionCell', 80, '상세보기', row => setViewApprId(row.apprId)),  // L146
  ], []);

  return (
    <>
      <LookupModal
        open={open}
        title="중요표시 문서"
        width={1300}
        style={{ top: 20 }}
        maskClosable={false}
        onCancel={onClose}
        destroyOnHidden
        styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
        footer={
          <div style={{ textAlign: 'center' }}>
            {/* [E4] closeButton[닫기].Select (L101) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <SearchBar onSearch={retrieve} searchText="검색" loading={loading}>
            <SearchBar.Field label="검색">
              <SearchBar.Input autoFocus style={{ width: 300 }} placeholder="상신제목/등록자/부서/문서분류"
                value={searchText} onChange={e => setSearchText(e.target.value)} />
            </SearchBar.Field>
          </SearchBar>
          <div style={{ height: 'min(440px, calc(100vh - 330px))' }}>
            <SingleGrid<AprBookmarkList>
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.bookmarkId)}
              loading={loading}
              rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
            />
          </div>
          {/* [E1] gridToolBar (GridPagingLoader).callbackOnCreate (L67) → retrieve() */}
          <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={p => void getPaging(p)} />
        </div>
      </LookupModal>
      <Apr01_Edit_ApprDoc apprId={viewApprId} onClosed={() => void getPaging(page)} onClose={() => setViewApprId(null)} />
    </>
  );
};
