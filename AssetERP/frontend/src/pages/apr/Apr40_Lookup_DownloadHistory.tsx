/**
 * 다운로드 기록 조회창 (F09) — 문서 다운로드(Dcr00_Tab_ApprList)의 [기록보기]가 연다.
 * AS-IS: myApp/client/vi/apr/Apr40_Lookup_DownloadHistory.java (180줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 open() L56-91: 1000×500 모달 "다운로드 기록", 툴바(기간 · 검색 300 · [조회]) + 그리드(체크박스 단일) + 페이징 툴바(50) + [닫기]
 * 1단계(F01~F08과 같은 사유): 보기 아이콘이 여는 전자결재 편집창 Apr01_Edit_ApprDoc은 다른 도메인(apr)이라 다음 단계에서 연결한다 — 지금은 안내만 띄운다.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, Space, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { aprApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprDownloadHistory } from '@/types/apr';
import { Button } from '@/components/button';
import { PagingToolBar, SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<AprDownloadHistory>();
const LIMIT = 50;  // gridToolBar.setToolBar(50)
const DATE_FORMAT = 'YYYY-MM-DD';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Apr40_Lookup_DownloadHistory: React.FC<Props> = ({ open, onClose }) => {
  // settings() L93-125: 기간 = 오늘 -1개월 ~ 오늘, 검색칸 빈칸 "문서명/사원명"
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().subtract(1, 'month'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<AprDownloadHistory[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  /** gridToolBar.addParam(…) — 페이지를 넘길 때는 마지막 조회 조건을 쓴다(GridPagingLoader) */
  const paramRef = useRef<{ startDate: string; closeDate: string; searchText: string } | undefined>(undefined);

  // GridPagingLoader.getPaging(): 저장된 조건 + offset·limit → 목록·전체 건수
  const getPaging = async (p: number) => {
    if (!paramRef.current) return;
    setLoading(true);
    try {
      const res = await aprApi.searchDownloadHistories({ ...paramRef.current, offset: (p - 1) * LIMIT, limit: LIMIT });
      setRows(res.rows);
      setTotal(res.total);
      setPage(p);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E1] searchText.KeyPress [Enter] (L105)·[E2] retrieveButton[조회].Select (L113) → retrieve() L152-171: 조건을 만들어 1페이지부터 다시 읽는다
  const retrieve = () => {
    paramRef.current = { startDate: startDate.format(DATE_FORMAT), closeDate: closeDate.format(DATE_FORMAT), searchText };
    return getPaging(1);
  };

  // open() L56-91: 열리면 바로 조회
  const retrieveRef = useRef(retrieve);
  retrieveRef.current = retrieve;
  useEffect(() => {
    if (open) void retrieveRef.current();
  }, [open]);

  // buildGrid() L127-150 (체크박스 단일 선택)
  const columnDefs = useMemo(() => [
    gb.textCenter('regDateString', 200, '다운일시'),  // L142
    // L130-141 actionCell(View) → Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false, callback)
    // [L130 생략] 편집창은 다음 단계
    iconCell<AprDownloadHistory>('view', 'actionCell', 30, ' ', () => message.info('전자결재 문서 보기 창은 다음 단계에서 연결됩니다')),
    gb.text('title', 550, '문서명'),  // L144
    gb.textCenter('personName', 100, '사원명'),  // L145
  ], []);

  return (
    <LookupModal
      open={open}
      title="다운로드 기록"
      width={1000}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E3] closeButton[닫기].Select (L119) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <SearchBar onSearch={retrieve} searchText="조회" loading={loading}>
        <SearchBar.Field label="기간">
          <DatePicker style={{ width: 140 }} allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
          <span>~</span>
          <DatePicker style={{ width: 140 }} allowClear={false} value={closeDate} onChange={d => d && setCloseDate(d)} />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 300 }} placeholder="문서명/사원명" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ height: 340, marginTop: 8 }}>
        <SingleGrid<AprDownloadHistory>
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.downloadHistoryId)}
          loading={loading}
          rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
          // 조회가 끝나면 첫 행을 고른다: grid.getSelectionModel().select(0, false)
          onRowDataUpdated={e => e.api.getDisplayedRowAtIndex(0)?.setSelected(true)}
        />
      </div>
      <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={getPaging} />
    </LookupModal>
  );
};
