/**
 * 이익제공 한도초과현황 > 회사별 연간 초과건 탭 (L07)
 * AS-IS: myApp/client/vi/biz/Biz01_TabPage_CompanyYear.java (73줄) — 줄 번호는 원본, 새 원본 IDMS-IC
 * [E0] 화면 열림 (생성자 L23-25) → 초기화. 조회(retrieve())는 상위가 활성 탭에 시켜 rows로 내려 준다
 */
import React, { useMemo } from 'react';
import { SingleGrid, gbFor } from '@/components/grid';
import { BizLimitCompanyYear } from '@/types/biz';

const gb = gbFor<BizLimitCompanyYear>();

interface Props {
  rows: BizLimitCompanyYear[];
  loading: boolean;
}

export const Biz01_TabPage_CompanyYear: React.FC<Props> = ({ rows, loading }) => {
  const columnDefs = useMemo(() => [
    gb.textCenter('provideRcvTypeName', 150, '제공/수령'),
    gb.textCenter('targetCompanyName', 250, '제공(수령) 회사명'),
    gb.long('averagePrice', 120, '경제적가치'),
  ], []);
  return <SingleGrid<BizLimitCompanyYear> rowData={rows} columnDefs={columnDefs} loading={loading} />;
};
