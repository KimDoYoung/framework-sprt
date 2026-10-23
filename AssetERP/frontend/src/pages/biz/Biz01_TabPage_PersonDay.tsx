/**
 * 이익제공 한도초과현황 > 인별 1회 초과건 탭 (L07)
 * AS-IS: myApp/client/vi/biz/Biz01_TabPage_PersonDay.java (78줄) — 줄 번호는 원본, 새 원본 IDMS-IC
 * [E0] 화면 열림 (생성자 L23-25) → 초기화. 조회(retrieve() L50-)는 상위 Biz01_Tab_LimitCheckList가 활성 탭에 시켜 rows로 내려 준다. 그리드 buildGrid() 체크박스 없는 단일 선택
 */
import React, { useMemo } from 'react';
import { SingleGrid, gbFor } from '@/components/grid';
import { BizLimitPersonDay } from '@/types/biz';

const gb = gbFor<BizLimitPersonDay>();

interface Props {
  rows: BizLimitPersonDay[];
  loading: boolean;
}

export const Biz01_TabPage_PersonDay: React.FC<Props> = ({ rows, loading }) => {
  const columnDefs = useMemo(() => [
    gb.textCenter('provideRcvTypeName', 150, '제공/수령'),
    gb.textCenter('regEmpName', 150, '제공(수령)자'),
    gb.date('provideDate', 100, '일자'),
    gb.textCenter('providePurName', 150, '목적'),
    gb.textCenter('provideContentName', 150, '내용'),
    gb.textCenter('targetEmpName', 300, '거래상대방'),
    gb.long('averagePrice', 120, '인당 경제적가치'),
    gb.text('note', 300, '비고'),
  ], []);
  return <SingleGrid<BizLimitPersonDay> rowData={rows} columnDefs={columnDefs} loading={loading} />;
};
