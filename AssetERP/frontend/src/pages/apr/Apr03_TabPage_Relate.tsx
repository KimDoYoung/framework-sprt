/**
 * 문서작성 > 01. 문서작성 > 업무별 문서작성 > 연관펀드·연관일임 패널 (F02)
 * AS-IS: myApp/client/vi/apr/Apr03_TabPage_Relate.java (85줄) — 줄 번호는 원본, 새 원본 IDMS-IC
 * 레이아웃 L22-30: vlc = 연관펀드 그리드(1×0.5) / 연관일임 그리드(1×0.5), 헤더 없음. 두 그리드 모두 행번호 숨김, 단일 선택
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import { aprApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprRelateAdv, AprRelateFund } from '@/types/apr';
import { SingleGrid, gbFor } from '@/components/grid';

const gbFund = gbFor<AprRelateFund>();
const gbAdv = gbFor<AprRelateAdv>();

interface Props {
  /** 위 문서 목록에서 고른 문서 (없으면 둘 다 비운다) */
  apprId: number | null;
}

export const Apr03_TabPage_Relate: React.FC<Props> = ({ apprId }) => {
  const [funds, setFunds] = useState<AprRelateFund[]>([]);
  const [advs, setAdvs] = useState<AprRelateAdv[]>([]);
  const seq = useRef(0);

  // [E0] 화면 열림 (생성자 L22-30): 두 그리드를 세로 1:1로 놓는다
  // retrieve() L52-58 → retrieve01() L60-71 (apr.Apr03_RelateFund.selectByApprId), retrieve02() L73-84 (apr.Apr12_RelateAdv.selectByApprId)
  useEffect(() => {
    const my = ++seq.current;
    if (apprId == null) {
      setFunds([]);
      setAdvs([]);
      return;
    }
    Promise.all([aprApi.searchRelateFunds(apprId), aprApi.searchRelateAdvs(apprId)])
      .then(([f, a]) => {
        if (my !== seq.current) return;
        setFunds(f);
        setAdvs(a);
      })
      .catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [apprId]);

  const fundCols = useMemo(() => [gbFund.text('fundName', 290, '연관펀드')], []);  // buildGrid01() L37
  const advCols = useMemo(() => [gbAdv.text('manageName', 290, '연관일임')], []);  // buildGrid02() L47

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<AprRelateFund> rowNumber={false} rowData={funds} columnDefs={fundCols} getRowId={p => String(p.data.fundId)} />
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<AprRelateAdv> rowNumber={false} rowData={advs} columnDefs={advCols} getRowId={p => String(p.data.advId)} />
      </div>
    </div>
  );
};
