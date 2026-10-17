/**
 * 펀드별 이력 그리드 (D07) — Icam03_Tab_Fund 오른쪽(center)
 * AS-IS: myApp/client/vi/icam/Icam03_Grid_Fund.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L33-63: center = 그리드(행번호, 체크박스 단일, 33열) + 페이징 툴바(100). 버튼 줄은 비어 있다(조회 버튼은 만들기만 하고 넣지 않음).
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { icamApi } from '@/api/icam';
import { errorMessage } from '@/api/client';
import { IcamFund } from '@/types/icam';
import { PagingToolBar, SingleGrid, gbFor } from '@/components/grid';

const LIMIT = 100;   // gridToolBar.setToolBar(100)
const gb = gbFor<IcamFund>();

/** AS-IS buildGrid() L65-104 */
const columnDefs = [
  gb.date('stdDate', 100, '일자'),  // L69
  gb.textCenter('fundCd', 70, '펀드코드'),  // L70
  gb.text('fundNm', 350, '펀드명'),  // L71
  gb.textCenter('kofiaFundCd', 120, '협회펀드코드'),  // L72
  gb.textCenter('ksdFundCd', 120, '예탁원펀드코드'),  // L73
  gb.textCenter('ksdItemCd', 120, '예탁원종목코드'),  // L74
  gb.text('trustNm', 100, '신탁구분'),  // L75
  gb.text('fundTypeNm', 100, '펀드유형'),  // L76
  gb.text('publicNm', 100, '공모/사모'),  // L77
  gb.text('parentNm', 100, '모자구분'),  // L78
  gb.text('classTypeNm', 100, '클래스구분'),  // L79
  gb.text('fundUnitNm', 100, '단위구분'),  // L80
  gb.text('charClassNm', 120, '특성분류'),  // L81
  gb.booleanYn2('diffDivYn', 100, '손익차등형'),  // L82
  gb.date('setDate', 100, '설정일자'),  // L83
  gb.date('endDate', 100, '해지일자'),  // L84
  gb.date('endExpectDate', 100, '만기예정일자'),  // L85
  gb.textCenter('operator1', 100, '주운용역'),  // L86
  gb.textCenter('operator2', 100, '부운용역'),  // L87
  gb.text('consignmentNm', 120, '수탁사'),  // L88
  gb.text('trustBankNm', 100, '수탁은행'),  // L89
  gb.text('officeWorkNm', 120, '사무수탁사'),  // L90
  gb.text('cur', 50, '기준통화'),  // L91
  gb.date('closeDate', 100, '다음결산일'),  // L92
  gb.date('feeDate', 100, '다음보수인출일'),  // L93
  gb.double('managementRate', 100, '운용보수율(bp)'),  // L94
  gb.double('salesRate', 100, '판매보수율(bp)'),  // L95
  gb.double('consignmentRate', 100, '수탁보수율(bp)'),  // L96
  gb.double('officeWorkRate', 110, '사무수탁보수율(bp)'),  // L97
  gb.long('setAmt', 100, '설정액'),  // L98
  gb.long('nav', 100, '순자산액'),  // L99
  gb.text('workDateString', 150, '작업일시'),  // L100
  gb.text('worker', 100, '작업자'),  // L101
];

interface Props {
  /** 위쪽에서 고른 펀드. 없으면 비운다 (AS-IS setClear()) */
  companyId: number | null;
  fundCode: string | null;
}

export const Icam03_Grid_Fund: React.FC<Props> = ({ companyId, fundCode }) => {
  const gridRef = useRef<AgGridReact<IcamFund>>(null);
  const [rows, setRows] = useState<IcamFund[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  /** 조회 뒤 그리드가 행을 채우면 첫 행을 선택한다 (L135-137) */
  const selectFirst = useRef(false);

  // GridPagingLoader.getPaging(): 저장된 조건(companyId·fundCode) + offset·limit → 목록·전체 건수
  const getPaging = useCallback(async (p: number) => {
    if (companyId == null || fundCode == null) return;
    setLoading(true);  // grid.mask("Loading")
    try {
      const res = await icamApi.searchFundHistory({ companyId, fundCode, offset: (p - 1) * LIMIT, limit: LIMIT });
      selectFirst.current = true;
      setRows(res.rows);
      setTotal(res.total);
      setPage(p);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);  // grid.unmask()
    }
  }, [companyId, fundCode]);

  // [E0] 화면 열림 (생성자 L33-63) → retrieve(companyId, fundCode) L110-141: 1페이지부터. 펀드가 없으면 setClear() L106-108
  // [E1] retrieveButton[조회].Select (L34) → retrieve() — 원본은 버튼을 화면에 넣지 않아(L42 주석) 쓰이지 않는다: [E1 생략] 버튼 없음
  useEffect(() => {
    if (companyId == null || fundCode == null) {
      setRows([]);
      setTotal(0);
      setPage(1);
      return;
    }
    void getPaging(1);
  }, [companyId, fundCode, getPaging]);

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20, display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<IcamFund>
          gridRef={gridRef}
          rowData={rows}
          loading={loading}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.fundId)}
          rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
          onRowDataUpdated={e => {
            if (selectFirst.current) {
              selectFirst.current = false;
              e.api.getDisplayedRowAtIndex(0)?.setSelected(true, true);
            }
          }}
        />
      </div>
      <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={getPaging} />
    </div>
  );
};
