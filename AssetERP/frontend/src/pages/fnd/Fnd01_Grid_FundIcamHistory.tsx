/**
 * 펀드 변경이력 그리드 (P08) — Fnd01_Tab_FundIcamHistory 오른쪽
 * AS-IS: myApp/client/vi/fnd/Fnd01_Grid_FundIcamHistory.java (115줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃: 그리드(체크박스 단일 선택) + 페이징 툴바(100). 조회 결과의 첫 행을 고른다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import { fndApi } from '@/api/fnd';
import { errorMessage } from '@/api/client';
import { FundInfo } from '@/types/fnd';
import { PagingToolBar, SingleGrid, gbFor } from '@/components/grid';

const gb = gbFor<FundInfo>();
const LIMIT = 100;  // gridToolBar.setToolBar(100)
/** setChecked(SINGLE) → 체크박스 단일 선택. 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Props {
  /** retrieve(companyId, fundCode)의 fundCode — null이면 setClear() */
  fundCode: string | null;
}

export const Fnd01_Grid_FundIcamHistory: React.FC<Props> = ({ fundCode }) => {
  const [rows, setRows] = useState<FundInfo[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const seq = useRef(0);

  // [E1] gridToolBar (GridPagingLoader).callbackOnCreate (L34) → retrieve() · getPaging(): fnd.Fnd02_FundInfo.selectByPaging + 전체 건수
  const getPaging = async (code: string, p: number) => {
    const my = ++seq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const res = await fndApi.searchFundInfos({ fundCode: code, offset: (p - 1) * LIMIT, limit: LIMIT });
      if (my !== seq.current) return;
      setRows(res.rows);  // 조회가 끝나면 첫 행을 고른다(onRowDataUpdated)
      setTotal(res.total);
      setPage(p);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === seq.current) setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L28-49) → retrieve() L94-113: 펀드를 고르면 1페이지부터 / setClear() L90-92: 선택이 없으면 비운다
  useEffect(() => {
    if (fundCode) {
      void getPaging(fundCode, 1);
    } else {
      seq.current++;
      setRows([]);
      setTotal(0);
      setPage(1);
      setLoading(false);
    }
  }, [fundCode]);

  // buildGrid() L51-88 (체크박스 단일 선택)
  const columnDefs = useMemo(() => [
    gb.date('workDate', 100, '기준일자'),  // L56
    gb.text('fundName', 300, '펀드명'),  // L57
    gb.text('fundFullName', 350, '펀드명(Full)'),  // L58
    gb.textCenter('kofiaFundCode', 120, '협회펀드코드'),  // L59
    gb.textCenter('ksdFundCode', 120, '예탁원펀드코드'),  // L60
    gb.textCenter('ksdItemCode', 120, '예탁원종목코드'),  // L61
    gb.text('kofiaTrustName', 100, '신탁구분'),  // L62
    gb.text('kofiaFundTypeName', 100, '펀드유형'),  // L63
    gb.text('kofiaPublicName', 100, '공모사모코드'),  // L64
    gb.text('kofiaParentName', 100, '모자구분'),  // L65
    gb.text('kofiaClassTypeName', 100, '클래스구분'),  // L66
    gb.text('kofiaFundUnitName', 100, '단위구분'),  // L67
    gb.text('kofiaCharClassName', 130, '특성분류'),  // L68
    gb.text('orgCodeName', 100, '운용부서명'),  // L69
    gb.text('operator1', 100, '주운운용역'),  // L70
    gb.text('operator2', 100, '부운운용역'),  // L71
    gb.text('cur', 50, '기준통화'),  // L72
    gb.long('seoljAek', 120, '설정액'),  // L73
    gb.long('sunjasanAek', 120, '순자산'),  // L74
    gb.double('stdPrice', 100, '기준가'),  // L75
    gb.date('nextCloseDate', 100, '다음결산일'),  // L76
    gb.date('nextFeeDate', 100, '다음보수인출일'),  // L77
    gb.date('endExpectDate', 100, '만기예정일'),  // L78
    gb.text('consignmentName', 150, '수탁사'),  // L79
    gb.text('trustBankName', 100, '수탁은행'),  // L80
    gb.text('officeWorkName', 150, '사무수탁사'),  // L81
    gb.double('managementRate', 100, '운용보수율(bp)'),  // L82
    gb.double('salesRate', 100, '판매보수율(bp)'),  // L83
    gb.double('consignmentRate', 100, '수탁보수율(bp)'),  // L84
    gb.double('officeWorkRate', 110, '사무수탁보수율(bp)'),  // L85
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<FundInfo>
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.fundInfoId)}
          loading={loading}
          rowSelection={SINGLE_CHECK}
          onRowDataUpdated={e => e.api.getDisplayedRowAtIndex(0)?.setSelected(true)}
        />
      </div>
      <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={p => fundCode && void getPaging(fundCode, p)} />
    </div>
  );
};
