/**
 * [1002] 문서작성 > 01. 문서작성 > 업무별 문서작성 (F02, 1단계)
 * AS-IS: myApp/client/vi/dcr/Dcr01_Tab_DcrUser.java (53줄) — Dcr01_Tab_DcrManager를 상속해 트리 조회만 바꾼다
 * 1단계(F01과 같은 사유): 전자결재 편집창 Apr01_Edit_ApprDoc·북마크 조회창 Apr50_Lookup_ApprList·메일 창 Dcr10_Lookup_MailSender는 다음 단계
 */
import React, { useEffect, useState } from 'react';
import { dcrApi } from '@/api/dcr';
import { Dcr01_Tab_DcrManager } from './Dcr01_Tab_DcrManager';

export const Dcr01_Tab_DcrUser: React.FC = () => {
  // [E0] 생성자 L26-33: managerYn = false, S1 사용 고객사는 문서작성 금지 → [신규문서 작성](docList.addInsertButton)을 안 단다
  const [showInsert, setShowInsert] = useState(false);
  useEffect(() => {
    dcrApi.getProductCode().then(code => setShowInsert(code !== 'S1')).catch(() => setShowInsert(true));
  }, []);

  // [E1] docList[등록].Insert (L30) → insertRow(): addInsertButton()이 단 [신규문서 작성] 버튼의 클릭 — Apr01_Grid_DocList의 [E3]에서 처리한다
  // retrieve() L36-51: dcr.Dcr01_ClassTree.selectByOrgIdRoleWrite (회사·조직·사원은 서버가 세션에서)
  return <Dcr01_Tab_DcrManager loadTree={dcrApi.searchWriteTree} showInsert={showInsert} padded />;
};
