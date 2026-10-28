/**
 * [1106] 펀드관리 > 01. 상품기획 > 상품기획문서 등록 (P04) — 아래 펀드별 일정목록 탭
 * AS-IS: myApp/client/vi/fnd/Fnd20_TabPage_PlanEmp.java (235줄)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L53-66: 위 툴바(SearchBarBuilder — 제목 "펀드별 일정목록"만, 버튼 없음) + 그리드(체크박스 단일)
 * 1단계: [결재요청] 아이콘이 여는 전자결재 편집창 Apr01_Edit_ApprDoc(서버 fnd.Fnd20_Plan.insertAppr 포함)은 다음 단계
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Typography } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { fndApi } from '@/api/fnd';
import { errorMessage } from '@/api/client';
import { Plan } from '@/types/fnd';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { useLoginUser } from '@/hooks/useLoginUser';

const gb = gbFor<Plan>();
/** setChecked(SINGLE) — 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Props {
  /** retrieve(fundId) L136-142 — 위 그리드에서 고른 펀드. nonce가 바뀌면(행을 누를 때마다) 같은 펀드여도 다시 조회한다 */
  target: { fundId: number | null; nonce: number };
}

export const Fnd20_TabPage_PlanEmp: React.FC<Props> = ({ target }) => {
  const user = useLoginUser();
  const gridRef = useRef<AgGridReact<Plan>>(null);
  const [rows, setRows] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const seq = useRef(0);

  // [E0] 화면 열림 (생성자 L53-66) → 제목 "펀드별 일정목록"(120) 툴바 + 그리드. 열 때 조회하지 않고, 위 그리드에서 펀드를 고르면 읽는다
  // retrieve(fundId) L136-142: 서비스 fnd.Fnd20_Plan.selectByFundIdEmp(fundId, orgId) — SQL이 selectByFundId와 같아 GET fnd/plans를 쓴다
  const retrieve = useCallback(async () => {
    const my = ++seq.current;
    if (target.fundId == null) { setRows([]); return; }
    setLoading(true);
    try {
      const list = await fndApi.searchPlans(target.fundId);
      if (my === seq.current) setRows(list);
    } catch (err) {
      if (my === seq.current) { setRows([]); message.error(errorMessage(err, '조회 실패')); }
    } finally {
      if (my === seq.current) setLoading(false);
    }
  }, [target.fundId]);
  useEffect(() => { void retrieve(); }, [target, retrieve]);

  // buildGrid() L68-120
  const columnDefs = useMemo(() => [
    gb.text('classTreeFullName', 300, '문서분류'),  // L73
    gb.text('approvalTypeName', 100, '최종결재'),  // L74
    gb.text('orgName', 150, '부서'),  // L75
    gb.text('personName', 80, '담당자'),  // L76
    gb.date('startDate', 90, '시작일'),  // L77
    gb.date('dueDate', 90, '완료예정일'),  // L78
    gb.text('closeYn', 100, '진행상태'),  // L79
    // aprButton(ImageCell "Edit") L81-103: 담당자 미지정이면 "담당자 미지정 문서입니다", 담당자가 내가 아닌데 완료가 아니면 "완료된 문서만 조회됩니다",
    //   그 밖에는 aprLookup(planId) L122-134 → fnd.Fnd20_Plan.insertAppr → Apr01_Edit_ApprDoc.retrieveApproval(model, false, callback → retrieve(fundId))
    // [생략] insertAppr는 결재 문서를 만들므로 편집창과 함께 다음 단계 — 검사까지만 한다
    iconCell<Plan>('edit', 'actionCell', 60, '결재요청', row => {
      if (row.personId == null) {
        message.warning('담당자 미지정 문서입니다');
        return;
      }
      if (row.personId !== user.userId && row.closeYn !== '완료') {
        message.warning('완료된 문서만 조회됩니다');
        return;
      }
      message.info('전자결재 문서 창은 다음 단계에서 연결됩니다');
    }),
    // [E1 생략] gridBuilder.BeforeStartEdit (L107) — 업무내용 편집기는 있으나 툴바에 [저장]이 없어(addUpdateButton 주석 처리) 저장할 수 없다. 읽기 전용으로 둔다
    gb.text('note', 400, '업무내용'),  // L105
  ], [user.userId]);

  // [E2 생략] msgBox.DialogHide [YES] (L193) → fnd.Fnd20_Plan.delete — deleteRow() 호출처가 없다(addDeleteButton 주석 처리)
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ height: 32, display: 'flex', alignItems: 'center', width: 120 }}>
        <Typography.Text strong>펀드별 일정목록</Typography.Text>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<Plan>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.planId)}
          loading={loading}
          rowSelection={SINGLE_CHECK}
        />
      </div>
    </div>
  );
};
