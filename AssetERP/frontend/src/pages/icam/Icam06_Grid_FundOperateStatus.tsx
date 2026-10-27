/**
 * 펀드운용현황 상세 그리드 (R07) — 펀드관리 > 20. 운용현황 > 펀드운용현황(펀드합계) #1323
 * AS-IS: myApp/client/vi/icam/Icam06_Grid_FundOperateStatus.java (64줄)
 */
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import type { ColDef } from 'ag-grid-community';
import { icamApi } from '@/api/icam';
import { FundOperateStatusDetail } from '@/types/icam';
import { SingleGrid, gbFor } from '@/components/grid';

export interface Icam06GridFundOperateStatusHandle {
  retrieve: (stdDate: string, fundType?: string, searchText?: string) => Promise<void>;
  clear: () => void;
}

const gb = gbFor<FundOperateStatusDetail>();

interface Props {
  style?: React.CSSProperties;
}

export const Icam06_Grid_FundOperateStatus = forwardRef<Icam06GridFundOperateStatusHandle, Props>(
  ({ style }, ref) => {
    const [rows, setRows] = useState<FundOperateStatusDetail[]>([]);
    const [loading, setLoading] = useState(false);

    // [E0] 화면 열림 (생성자 L21-27) → 초기화
    const columnDefs: ColDef<FundOperateStatusDetail>[] = [
      gb.date('stdDate', 90, '계산일자'),
      gb.textCenter('fundCode', 100, '펀드코드'),
      gb.text('fundName', 350, '펀드명'),
      gb.long('principal', 150, '원본액'),
      gb.long('nav', 150, '순자산액'),
      gb.long('totalAsset', 150, '총자산액'),
      gb.long('setQty', 150, '설정좌수'),
      gb.double('stdPrice', 150, '기준가'),
      gb.textCenter('cur', 100, '펀드통화'),
    ];

    const retrieve = async (stdDate: string, fundType?: string, searchText?: string) => {
      if (!stdDate) {
        setRows([]);
        return;
      }
      setLoading(true);
      try {
        const data = await icamApi.searchFundOperateStatusDetails({
          stdDate,
          fundType,
          searchText,
        });
        setRows(data);
      } finally {
        setLoading(false);
      }
    };

    const clear = () => {
      setRows([]);
    };

    useImperativeHandle(ref, () => ({
      retrieve,
      clear,
    }));

    return (
      <div style={{ width: '100%', height: '100%', boxSizing: 'border-box', ...style }}>
        <SingleGrid<FundOperateStatusDetail>
          columnDefs={columnDefs}
          rowData={rows}
          loading={loading}
          getRowId={(p) => String(p.data.fundBookId)}
        />
      </div>
    );
  }
);

Icam06_Grid_FundOperateStatus.displayName = 'Icam06_Grid_FundOperateStatus';
