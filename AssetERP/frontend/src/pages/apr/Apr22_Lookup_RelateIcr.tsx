/**
 * 연관내규 설정·상세보기 창 (V13) — 연관내규 목록 한 줄의 기준일(결재완료일/발생일)과 마감일을 정한다.
 * AS-IS: myApp/client/vi/apr/Apr22_Lookup_RelateIcr.java (419줄) — Apr20_Lookup_RelateIcs와 같은 화면(법규명 → 내규명, 서식파일 Icr01_Page_IcrFile)이라
 * 같은 부품을 `kind="icr"`로 쓴다. 마감일 계산은 apr.Apr22_RelateIcr.getCloseDate = apr20과 같은 f_get_std_date.
 */
import React from 'react';
import { AprRelateIcsRow } from '@/types/apr';
import { Apr20_Lookup_RelateIcs } from './Apr20_Lookup_RelateIcs';

interface Props {
  row: AprRelateIcsRow | null;
  onSet: (patch: { standCode: string | null; standDate: string | null; closeDate: string | null; standYn: string }) => void;
  onClose: () => void;
  /** view(viewModel) — 상세보기 */
  view?: boolean;
}

export const Apr22_Lookup_RelateIcr: React.FC<Props> = props => <Apr20_Lookup_RelateIcs {...props} kind="icr" />;
