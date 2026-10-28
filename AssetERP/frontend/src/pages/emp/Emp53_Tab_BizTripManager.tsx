/**
 * 출장관리 (S11) — 경영관리 > 02. 휴가/출장 관리 > 출장관리 #1381
 * AS-IS: myApp/client/vi/emp/Emp53_Tab_BizTripManager.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃(생성자 L65-81, SG): 툴바(조회기간 · 검색 230 · 완료건 제외 · [조회][저장]) + 체크 다중 셀 편집 그리드(2단 헤더 출장기간·출장품의·결과보고·결과보고서 면제).
 * 1단계(사용자 묶음 요청 2026-10-28): 상세보기 아이콘의 결재문서 보기(Apr01_Edit_ApprDoc.retrieveApproval)는 다음 단계 — 원본의 문서 유무·상태 검사까지만 한다.
 */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import { empBizTripApi } from '@/api/emp';
import { BizTrip } from '@/types/emp';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { CellEditGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { useGridCrud, editableCol } from '@/hooks/useGridCrud';

const gb = gbFor<BizTrip>();
const BLUE = { color: '#456EA6' };

export const Emp53_Tab_BizTripManager: React.FC = () => {
  // [E0] 화면 열림 (생성자 L65-81 → settings() L83-133, retrieve()): 조회기간 = 올해 1월 1일 ~ 오늘 + 1개월, "완료건 제외" 체크
  const [startDate, setStartDate] = useState(dayjs().startOf('year'));
  const [closeDate, setCloseDate] = useState(dayjs().add(1, 'month'));
  const [resultSkipYn, setResultSkipYn] = useState(true);
  const [searchText, setSearchText] = useState('');
  const cur = useRef({ startDate, closeDate, resultSkipYn, searchText });
  cur.current = { startDate, closeDate, resultSkipYn, searchText };

  // retrieve() L189-204: 서비스 emp.Emp53_BizTrip.selectByCompanyId(companyId, startDate, closeDate, resultSkipYn, "%검색어%")
  const crud = useGridCrud<BizTrip>({
    idField: 'bizTripId',
    search: useCallback(() => empBizTripApi.search(
      cur.current.startDate.format('YYYY-MM-DD'), cur.current.closeDate.format('YYYY-MM-DD'), cur.current.resultSkipYn, cur.current.searchText), []),
    // [E3] updateButton[저장].Select (L127) → update() L206-209: GridUpdate → emp.Emp53_BizTrip.update
    save: useCallback((rows: BizTrip[]) => empBizTripApi.save(rows), []),
    // 행 삭제 버튼이 없다(원본에 삭제 서비스 호출 없음)
    remove: useCallback(async () => 0, []),
    newRow: useCallback(() => ({}), []),
  });

  // [E1] searchText.KeyPress [Enter] (L113) / [E2] retrieveButton[조회].Select (L121) → retrieve()
  const retrieve = () => crud.retrieve();

  // apprView() L211-231: 서비스 apr.Apr01_Appr.selectById(apprId) → Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false, 닫으면 retrieve()) — 편집창은 다음 단계
  const apprView = () => message.info('전자결재 문서 보기는 아직 변환 전입니다(다음 단계).');

  // 출장품의 상세보기 (buildGrid L135-187 viewCell): 결재상태가 없으면 "해당 관련문서가 없습니다"
  const viewAppr = (row: BizTrip) => {
    if (row.apprStatusCode == null || row.apprStatusCode === '') { message.warning('해당 관련문서가 없습니다'); return; }
    apprView();
  };
  // 결과보고 상세보기 (resultViewCell): 결과보고 결재상태가 없으면 "해당 관련문서가 없습니다", 출장신청서가 완료(30)가 아니면 "출장신청서가 완료된 후에 문서작성이 가능합니다."
  const viewResultAppr = (row: BizTrip) => {
    if (row.resultApprStatusCode == null || row.resultApprStatusCode === '') { message.warning('해당 관련문서가 없습니다'); return; }
    if (row.apprStatusCode == null || row.apprStatusCode !== '30') { message.warning('출장신청서가 완료된 후에 문서작성이 가능합니다.'); return; }
    apprView();
  };

  // AS-IS buildGrid() L135-187 (setChecked MULTI, 헤더 묶음 4개)
  const columnDefs = useMemo(() => [
    gb.text('personInfo', 150, '출장자'),
    gb.group('출장기간', [
      gb.date('startDate', 100, '시작일'),
      gb.date('closeDate', 100, '종료일'),
    ]),
    gb.textCenter('bizTripName', 100, '구분'),
    gb.text('destination', 120, '출장지'),
    gb.text('purpose', 150, '출장목적'),
    gb.textCenter('num', 80, '출장인원'),
    gb.text('companion', 150, '동반인'),
    gb.group('출장품의', [
      gb.textCenter('apprStatusName', 80, '결재상태'),
      iconCell<BizTrip>('view', 'actionCell', 60, '상세보기', viewAppr),
    ]),
    gb.group('결과보고', [
      gb.textCenter('resultApprStatusName', 80, '결재상태'),
      iconCell<BizTrip>('view', 'actionCell2', 60, '상세보기', viewResultAppr),
    ]),
    { ...gb.group('결과보고서 면제', [
      editableCol(gb.boolean('resultSkipYn', 50, '여부', { editable: true, headerStyle: BLUE })),
      editableCol(gb.text('skipReason', 200, '사유', { editor: 'text', headerStyle: BLUE })),
    ]), headerStyle: BLUE },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar
          onSearch={() => void retrieve()}
          extra={<Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>}
        >
          <SearchBar.Field label="조회기간">
            <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
            <span>~</span>
            <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} onChange={d => d && setCloseDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 230 }} placeholder="출장자/출장지/출장목적" value={searchText} onChange={e => setSearchText(e.target.value)} />
            <Checkbox checked={resultSkipYn} onChange={e => setResultSkipYn(e.target.checked)}>완료건 제외</Checkbox>
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<BizTrip> crud={crud} columnDefs={columnDefs} />
        </div>
      </div>
    </div>
  );
};
