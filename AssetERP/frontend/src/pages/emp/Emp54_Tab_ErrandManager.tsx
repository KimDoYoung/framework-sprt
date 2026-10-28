/**
 * 외출관리 (S12) — 경영관리 > 02. 휴가/출장 관리 > 외출관리 #1465
 * AS-IS: myApp/client/vi/emp/Emp54_Tab_ErrandManager.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃(생성자 L53-79, SG): 툴바(조회기간 · 검색 250 · [조회]) + 체크 다중 보기 그리드(MultiGrid).
 * 1단계(사용자 묶음 요청 2026-10-28): 이익수령 제외신청 아이콘의 결재문서 보기(Apr01_Edit_ApprDoc.retrieveApproval)는 다음 단계 — 문서 유무 검사까지만 한다.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import { empErrandApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { Errand } from '@/types/emp';
import { SearchBar } from '@/components/search';
import { MultiGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';

const gb = gbFor<Errand>();

export const Emp54_Tab_ErrandManager: React.FC = () => {
  // [E0] 화면 열림 (생성자 L53-79 → settings() L81-108, retrieve()): 조회기간 = 오늘 ~ 6개월 뒤 1일
  const [startDate, setStartDate] = useState(dayjs());
  const [closeDate, setCloseDate] = useState(dayjs().add(6, 'month').startOf('month'));
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<Errand[]>([]);
  const cur = useRef({ startDate, closeDate, searchText });
  cur.current = { startDate, closeDate, searchText };

  // retrieve() L177-191: 서비스 emp.Emp54_Errand.selectByManager(companyId, startDate, closeDate, "%검색어%")
  const retrieve = useCallback(async () => {
    try {
      setRows(await empErrandApi.search(
        cur.current.startDate.format('YYYY-MM-DD'), cur.current.closeDate.format('YYYY-MM-DD'), cur.current.searchText));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  useEffect(() => { void retrieve(); }, [retrieve]);

  // [E3] actionCell01 (ImageCell).callbackOnCreate (L134) → 상신 ID 없으면 "상신문서가 존재하지 않습니다",
  //   있으면 apr.Apr01_Appr.selectById → Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false, 닫으면 retrieve()) — 편집창은 다음 단계
  const viewAppr = useCallback((row: Errand) => {
    if (row.apprId == null) { message.warning('상신문서가 존재하지 않습니다'); return; }
    message.info('전자결재 문서 보기는 아직 변환 전입니다(다음 단계).');
  }, []);

  // AS-IS buildGrid() L110-175 (setChecked MULTI)
  const columnDefs = useMemo(() => [
    gb.date('date', 100, '일자'),
    gb.textCenter('weekday', 70, '요일'),
    gb.text('personInfo', 200, '외출자'),
    gb.text('errandName', 100, '구분'),
    gb.textCenter('departTime', 120, '외출시각'),
    gb.textCenter('returnTime', 120, '복귀시각'),
    gb.text('reason', 400, '사유'),
    gb.text('venue', 150, '장소'),
    gb.text('host', 150, '주최자'),
    gb.text('note', 150, '비고'),
    iconCell<Errand>('view', 'actionCell', 70, '이익수령<br>제외신청', viewAppr),
    gb.textCenter('aprStatusName', 80, '결재상태'),
  ], [viewAppr]);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] searchText.KeyPress [Enter] (L93) / [E2] retrieveButton[조회].Select (L102) → retrieve() */}
        <SearchBar onSearch={() => void retrieve()}>
          <SearchBar.Field label="조회기간">
            <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
            <span>~</span>
            <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} onChange={d => d && setCloseDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 250 }} placeholder="외출자/구분/사유/주최자" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<Errand> rowData={rows} columnDefs={columnDefs} />
        </div>
      </div>
    </div>
  );
};
