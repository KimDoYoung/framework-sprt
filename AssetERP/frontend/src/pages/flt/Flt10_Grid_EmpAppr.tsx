/**
 * 사원의 상신문서 (J06) — 정기보고현황(Flt10_Tab_EmpAppr)의 오른쪽 그리드
 * AS-IS: myApp/client/vi/flt/Flt10_Grid_EmpAppr.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 그리드(체크 단일 선택): 상신일 · 상신상태 · 상신제목 · 상세보기(아이콘) · 삭제(아이콘). 부모가 고른 사원(emp)과 기준일(stdDate)이 바뀌면 다시 읽는다.
 * 상세보기가 여는 전자결재 편집창(Apr01_Edit_ApprDoc, 다른 도메인)은 다음 단계 — 안내만 한다.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import type { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { fltApi } from '@/api/flt';
import { errorMessage } from '@/api/client';
import { FltEmpAppr, FltEmpApprDoc } from '@/types/flt';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';

const gb = gbFor<FltEmpApprDoc>();
const DATE_FORMAT = 'YYYY-MM-DD';

interface Props {
  /** 왼쪽 그리드에서 고른 사원 (없으면 비어 있다) */
  emp: FltEmpAppr | undefined;
  /** 부모 retrieve()가 정한 기준일 = 기준년월의 말일 */
  stdDate: Dayjs;
}

/** retrieve() L137-198: 점검주기 분기('1')면 기준월이 속한 분기의 1일 ~ 분기 말일, 아니면 기준월 1일 ~ 기준일 */
const period = (emp: FltEmpAppr, stdDate: Dayjs): [string, string] => {
  if (emp.checkCycle === '1') {
    const quarterStart = stdDate.startOf('month').month(Math.floor(stdDate.month() / 3) * 3);
    return [quarterStart.format(DATE_FORMAT), quarterStart.add(2, 'month').endOf('month').format(DATE_FORMAT)];
  }
  return [stdDate.startOf('month').format(DATE_FORMAT), stdDate.format(DATE_FORMAT)];
};

export const Flt10_Grid_EmpAppr: React.FC<Props> = ({ emp, stdDate }) => {
  const gridRef = useRef<AgGridReact<FltEmpApprDoc> | null>(null);
  const [rows, setRows] = useState<FltEmpApprDoc[]>([]);

  // init() L133-135: 비운다 → retrieve(): 서비스 flt.Flt10_Tr.selectByApprId(companyId, personId, startDate, closeDate) → 첫 행 선택
  const retrieve = useCallback(async () => {
    setRows([]);
    if (!emp) return;
    const [startDate, closeDate] = period(emp, stdDate);
    try {
      setRows(await fltApi.searchEmpApprDocs(emp.personId, startDate, closeDate));
      setTimeout(() => gridRef.current?.api.getDisplayedRowAtIndex(0)?.setSelected(true, true));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [emp, stdDate]);

  // [E0] 화면 열림 (생성자 L46-48) → 그리드를 붙인다. 부모가 사원을 고르면(emp 변경) retrieve()
  useEffect(() => { void retrieve(); }, [retrieve]);

  // deleteAppr() L112-131: 서비스 flt.Flt10_Tr.deleteAppr(apprId, userId) → "상신문서가 삭제되었습니다." → 다시 조회
  const deleteAppr = async (row: FltEmpApprDoc) => {
    try {
      await fltApi.deleteEmpAppr(row.apprId);
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
      return;
    }
    message.success('상신문서가 삭제되었습니다.');
    await retrieve();
  };

  // buildGrid() L50-110
  const columnDefs = useMemo(() => [
    gb.date('apprRegDate', 100, '상신일'),
    gb.text('apprStatusName', 100, '상신상태'),
    gb.text('apprTitle', 400, '상신제목'),
    // 상세보기: apr.Apr01_Appr.selectById → Apr01_Edit_ApprDoc.retrieveApproval (다음 단계)
    iconCell<FltEmpApprDoc>('view', 'detailCell', 55, '상세보기', () => message.info('전자결재 문서 창은 다음 단계에서 연결합니다.')),
    // 삭제: [E1] msgBox.DialogHide [YES] (L84) → deleteAppr()
    iconCell<FltEmpApprDoc>('delete', 'deleteCell', 55, '삭제', row => {
      Modal.confirm({
        title: '확인',
        content: '해당 상신문서를 삭제하시겠습니까?',
        okText: '예',
        cancelText: '아니오',
        onOk: () => deleteAppr(row),
      });
    }),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [retrieve]);

  return (
    <SingleGrid<FltEmpApprDoc>
      gridRef={gridRef}
      rowData={rows}
      columnDefs={columnDefs}
      getRowId={p => String(p.data.trId)}
      rowSelection={ROW_SELECTION}
    />
  );
};

/** setChecked(SelectionMode.SINGLE) — 체크 단일 선택 (11 §4: 상수로 빼서 넘긴다) */
const ROW_SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;
