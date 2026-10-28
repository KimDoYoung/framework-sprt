/**
 * 급여공제 탭 (C01-3) — C01 사원정보 관리 하위.
 * AS-IS: myApp/client/vi/emp/Emp35_TabPage_DeductDate.java (좌 15% 날짜 목록) + Emp35_TabPage_DeductInsert.java (우 85% 편집 폼)
 * S28: 같은 본문을 급여공제정보 화면(Emp35_Page_DeductDate)도 쓰므로 `Emp35_Page_DeductDate.tsx`·`Emp35_TabPage_DeductInsert.tsx`로 뺐다.
 *      이 파일은 선택 사원의 personId를 넘기는 껍데기다.
 */
import React from 'react';
import { TransInfoTabProps } from './Emp00_Tab_TransInfo';
import { Emp35_Page_DeductDate } from './Emp35_Page_DeductDate';

export const Emp35_TabPage_DeductDate: React.FC<TransInfoTabProps> = ({ row }) => (
  <Emp35_Page_DeductDate personId={row?.personId} />
);
