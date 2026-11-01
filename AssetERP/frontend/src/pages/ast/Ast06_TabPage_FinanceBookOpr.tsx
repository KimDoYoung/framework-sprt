/**
 * 종목별 매수·매도 내역 (W15) — Ast09_Tab_FinanceBookOpr 아래 250 영역 (읽기 전용 그리드 둘)
 * AS-IS: myApp/client/vi/ast/Ast06_TabPage_FinanceBookOpr.java (216줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L45-76: 가로 40% "• 매수내역"(파랑 456EA6 14) + 그리드 / 60% "• 매도내역"(빨강 E84C3D 14) + 그리드. 기간 라디오(주석 처리)는 만들지 않는다
 * retrieve(param) L135-190: ast.Ast06_Tr.selectByAstClassTreeId(companyId, stdDate, astClassTreeId, keepAccountId, trType 1/2) 두 번
 */
import { useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstFinanceOprTr } from '@/types/ast';
import { SingleGrid, gbFor } from '@/components/grid';

const gb = gbFor<AstFinanceOprTr>();

export interface FinanceOprTabParam {
  astClassTreeId: number;
  keepAccountId: number;
  stdDate: string;
}

interface Props {
  /** retrieve(param) — null이면 init()으로 비운다 */
  param: FinanceOprTabParam | null;
  /** 같은 행을 다시 눌러도 다시 읽도록 부모가 올린다 */
  nonce: number;
}

export const Ast06_TabPage_FinanceBookOpr: React.FC<Props> = ({ param, nonce }) => {
  const [buys, setBuys] = useState<AstFinanceOprTr[]>([]);
  const [sells, setSells] = useState<AstFinanceOprTr[]>([]);
  const [loading, setLoading] = useState(false);

  // [E0] 화면 열림 (생성자 L45-76) → settings() — 부모가 고른 행(param)으로 retrieve(param) L135-143, 없으면 init() L130-133
  useEffect(() => {
    if (!param) { setBuys([]); setSells([]); return; }   // init() L130-133
    let alive = true;
    setLoading(true);
    void (async () => {
      try {
        const [b, s] = await Promise.all([
          astApi.searchFinanceOprTrs(param.stdDate, param.astClassTreeId, param.keepAccountId, '1'),
          astApi.searchFinanceOprTrs(param.stdDate, param.astClassTreeId, param.keepAccountId, '2'),
        ]);
        if (alive) { setBuys(b); setSells(s); }
      } catch (err) {
        if (alive) message.error(errorMessage(err, '조회 실패'));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [param, nonce]);

  // buildGrid1() L103-112 — getTotalGrid("계", 1, 2, 5, "3", "3"): 합계 수량·매수금액·결제금액, 단가는 평균
  const buyCols = useMemo(() => [
    gb.date('date', 90, '매수일'),            // L105
    gb.double('qty', 100, '수량'),            // L106
    gb.double('price', 80, '단가'),           // L107
    gb.long('trAmt', 100, '매수금액'),        // L108
    gb.long('amt', 100, '결제금액'),          // L109
    gb.text('note', 150, '거래구분'),         // L110
  ], []);

  // buildGrid2() L114-127 — getTotalGrid("계", 1, 2, 9, "3,8", "3,8"): 단가·수익률은 평균, 나머지 합계
  const sellCols = useMemo(() => [
    gb.date('date', 90, '매도일'),            // L116
    gb.double('qty', 100, '수량'),            // L117
    gb.double('price', 80, '단가'),           // L118
    gb.long('trAmt', 100, '매도금액'),        // L119
    gb.long('feeSum', 90, '매매비용'),        // L120
    gb.long('amt', 100, '결제금액'),          // L121
    gb.long('purBookAmt', 100, '취득금액'),   // L122
    gb.double('purPlRate', 90, '수익률(%)'),  // L123
    gb.long('pl', 100, '순손익<br>(결제-취득)'), // L124
    gb.text('note', 150, '거래구분'),         // L125
  ], []);

  const title = (text: string, color: string) => <div style={{ height: 30, flex: 'none', color, fontWeight: 'bold', fontSize: 14, display: 'flex', alignItems: 'center' }}>{text}</div>;

  return (
    <div style={{ height: '100%', display: 'flex', boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ flex: '0 0 40%', minWidth: 0, display: 'flex', flexDirection: 'column', paddingRight: 5, boxSizing: 'border-box' }}>
        {title('• 매수내역', '#456EA6')}
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<AstFinanceOprTr> rowData={buys} columnDefs={buyCols} getRowId={p => String(p.data.trId)} loading={loading}
            sumRow={{ labelField: 'date', label: '계', sum: ['qty', 'trAmt', 'amt'], avg: ['price'] }} />
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', paddingLeft: 5, boxSizing: 'border-box' }}>
        {title('• 매도내역', '#E84C3D')}
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<AstFinanceOprTr> rowData={sells} columnDefs={sellCols} getRowId={p => String(p.data.trId)} loading={loading}
            sumRow={{ labelField: 'date', label: '계', sum: ['qty', 'trAmt', 'feeSum', 'amt', 'purBookAmt', 'pl'], avg: ['price', 'purPlRate'] }} />
        </div>
      </div>
    </div>
  );
};
