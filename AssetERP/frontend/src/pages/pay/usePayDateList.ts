/**
 * 적용일 목록 탭 공통 로직 (E22-2) — 간이세액표(Pay23_TabPage_SimpleTaxTable)·공제표(Pay24_TabPage_DeductTable)·인적공제금액(Pay25_TabPage_PersonDeduct)이
 * 같은 구조라 조회·첫 행 선택·삭제를 여기 둔다(화면 JSX·이벤트는 각 클래스 파일). PayDetailProps는 상세 탭이 받는 값.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { errorMessage } from '@/api/client';
import { PayStartDate } from '@/types/pay';
import { useLoginUser } from '@/hooks/useLoginUser';

/** 상세 탭이 받는 값: 고른 적용일, 조회마다 올라가는 tick(같은 적용일이어도 다시 읽는다) */
export interface PayDetailProps {
  date?: PayStartDate;
  tick: number;
}

export function usePayDateList(searchDates: () => Promise<PayStartDate[]>, deleteDate: (startDate: string) => Promise<number>) {
  const user = useLoginUser();
  const isAdminCompany = user.companyId === 0;  // LoginUser.getCompanyId() == 0일 때만 등록·삭제
  const gridRef = useRef<AgGridReact<PayStartDate>>(null);
  const [dates, setDates] = useState<PayStartDate[]>([]);
  const [selected, setSelected] = useState<PayStartDate>();
  const [tick, setTick] = useState(0);

  // retrieve(): 적용일 전체(최신순)를 읽는다. 읽은 뒤 첫 행을 선택하고 상세가 다시 읽는다(tick)
  const retrieve = useCallback(async () => {
    try {
      setDates(await searchDates());
      setTick(t => t + 1);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [searchDates]);

  // [E0] 열 때 조회
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  // 목록이 그려진 다음에 선택해야 해서 목록이 바뀐 뒤에 첫 행을 선택한다. 목록이 비면 선택이 없다
  useEffect(() => {
    if (dates.length === 0) setSelected(undefined);
    const t = setTimeout(() => gridRef.current?.api.getDisplayedRowAtIndex(0)?.setSelected(true, true), 50);
    return () => clearTimeout(t);
  }, [dates]);

  // deleteRow(): 적용일을 안 골랐으면 알리고, 확인 "해당 적용일을 삭제하시겠습니까?" → 예면 deleteByDate → retrieve()
  const deleteRow = () => {
    if (!selected) {
      message.warning('기준 적용일을 선택해주세요');
      return;
    }
    const startDate = selected.startDate;
    Modal.confirm({
      title: '삭제',
      content: '해당 적용일을 삭제하시겠습니까?',
      width: 400,
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          await deleteDate(startDate);
          await retrieve();
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  return { isAdminCompany, gridRef, dates, selected, setSelected, tick, retrieve, deleteRow };
}
