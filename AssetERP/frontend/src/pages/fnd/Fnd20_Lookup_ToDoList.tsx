/**
 * 상품기획 창 (EE78) — AS-IS는 MyPage 오늘의 할일(Monitoring_Page_DayList)에서 업무구분 050(상품기획) 행을 더블클릭하면 연다
 * AS-IS: myApp/client/vi/fnd/Fnd20_Lookup_ToDoList.java (226줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L74-103: 1500×350 모달 "상품기획", 툴바 50 = [기준일 | 전체보기 ☐ | 조회] + 단일 선택 그리드 + [닫기]. ([저장]은 원본도 툴바에 안 붙임)
 * open(planId, date) L50: 기준일 = 할일 행의 날짜, 열자마자 retrieve() — [전체보기] 해제: fnd.Fnd20_Plan.selectById(그 일정 한 건) / 체크: selectByPersonId(내 일정 중 기준일이 기간에 드는 것)
 * 그리드 buildGrid() L105-137: 상품기획명 300 · 문서분류 300 · 최종결재 100 · 시작일 100 · 완료예정일 100 · 진행상태 100 · 결재요청 60(아이콘) · 업무내용 350 (모두 읽기 전용)
 * 결재요청 아이콘 → aprLookup() L139: fnd.Fnd20_Plan.insertAppr(상신 문서가 없으면 만들어 줌) → 전자결재 문서창 열기, 닫히면 retrieve()
 * [E2] updateButton[저장] (L75)은 원본도 툴바에 안 붙인 도달 불가 버튼, [E4] gridBuilder.BeforeStartEdit (L140)은 편집기가 있는 열이 없어 일어나지 않는다 — 만들지 않는다
 * TOBE에서는 MyPage Day List(`components/mypage/DayListBox`, EE106)가 연다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message, Space } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { errorMessage } from '@/api/client';
import { fndApi } from '@/api/fnd';
import { PlanTodo } from '@/types/fnd';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SearchBar } from '@/components/search';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';

const gb = gbFor<PlanTodo>();
const FMT = 'YYYY-MM-DD';

interface Props {
  /** open(planId, date) — 할일 행의 기획일정 ID. 값이 있으면 열린다 */
  planId: number | null;
  /** 할일 행의 날짜 'yyyy-MM-dd' (기준일의 처음 값) */
  date: string;
  onClose: () => void;
}

export const Fnd20_Lookup_ToDoList: React.FC<Props> = ({ planId, date, onClose }) => {
  const gridRef = useRef<AgGridReact<PlanTodo>>(null);
  const [baseDate, setBaseDate] = useState(date);
  const [all, setAll] = useState(false);
  const [rows, setRows] = useState<PlanTodo[]>([]);
  const [loading, setLoading] = useState(false);
  const [apprId, setApprId] = useState<number | null>(null);

  // retrieve() L167-183: [전체보기]면 selectByPersonId(personId, startDate), 아니면 selectById(planId, startDate)
  const retrieve = useCallback(async (d: string, allView: boolean) => {
    if (planId == null) return;
    setLoading(true);
    try {
      setRows(await fndApi.searchPlanTodos(planId, d, allView));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [planId]);

  // [E0] 화면 열림 → open(planId, date) L50-54: 기준일 설정, Setting(), retrieve()
  useEffect(() => {
    if (planId == null) return;
    setBaseDate(date);
    setAll(false);
    setRows([]);
    void retrieve(date, false);
  }, [planId, date, retrieve]);

  // aprLookup() L139-153 / getServiceResult() L196-208: fnd.Fnd20_Plan.insertAppr → 문서창, 닫히면 retrieve()
  const aprLookup = async (row: PlanTodo) => {
    try {
      setApprId(await fndApi.requestPlanAppr(row.planId));
    } catch (err) {
      message.error(errorMessage(err, '결재요청 실패'));
    }
  };

  const columnDefs = useMemo(() => [
    gb.text('fundName', 300, '상품기획명'),                // L116
    gb.text('classTreeFullName', 300, '문서분류'),          // L117
    gb.textCenter('approvalTypeName', 100, '최종결재'),     // L118
    gb.date('startDate', 100, '시작일'),                   // L119
    gb.date('dueDate', 100, '완료예정일'),                 // L120
    gb.textCenter('closeYn', 100, '진행상태'),             // L121
    iconCell<PlanTodo>('edit', 'actionCell', 60, '결재요청', row => void aprLookup(row)),  // L122
    gb.text('note', 350, '업무내용'),                      // L123
  ], []);

  return (
    <>
      <LookupModal
        open={planId != null}
        title="상품기획"
        width={1500}
        maskClosable={false}
        onCancel={onClose}
        destroyOnHidden
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              {/* [E3] closeButton[닫기].Select (L81) → hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ height: 250, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* [E1] retrieveButton[조회].Select (L69) → retrieve() */}
          <SearchBar onSearch={() => retrieve(baseDate, all)}>
            <SearchBar.Field label="기준일">
              <DatePicker style={{ width: 130 }} allowClear={false} format={FMT} value={dayjs(baseDate)}
                onChange={d => d && setBaseDate(d.format(FMT))} />
            </SearchBar.Field>
            <Checkbox checked={all} onChange={e => setAll(e.target.checked)}>전체보기</Checkbox>
          </SearchBar>
          <div style={{ flex: 1, minHeight: 0 }}>
            <SingleGrid<PlanTodo>
              gridRef={gridRef}
              rowData={rows}
              loading={loading}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.planId)}
              rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
            />
          </div>
        </div>
      </LookupModal>
      {/* retrieveApproval(aprModel, false, callback) — 닫히면 retrieve() */}
      <Apr01_Edit_ApprDoc apprId={apprId} onClosed={() => void retrieve(baseDate, all)} onClose={() => setApprId(null)} />
    </>
  );
};
