/**
 * [1475] 펀드관리 > 20. 운용현황 > 펀드별 기준가 현황 (R05)
 * AS-IS: myApp/client/vi/icam/Icam06_Tab_FundPrice.java (183줄)
 * 생성자 L45-66: SearchBar(기준일자 · [조회] · [엑셀다운로드]) + SingleGrid(11개 컬럼)
 * 스타일: SG (SearchGrid — docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04)
 */
import React, { useEffect, useMemo, useState } from 'react';
import { DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { errorMessage } from '@/api/client';
import { icamApi } from '@/api/icam';
import { rdApi } from '@/api/rd';
import { FundPrice } from '@/types/icam';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { rdDownload } from '@/utils/rdDownload';

const gb = gbFor<FundPrice>();

export const Icam06_Tab_FundPrice: React.FC = () => {
  // settings() L71: startDate.setValue(preDay)
  const [stdDate, setStdDate] = useState<Dayjs>(dayjs().subtract(1, 'day'));
  const [rows, setRows] = useState<FundPrice[]>([]);
  const [loading, setLoading] = useState(false);

  // [E1] retrieveButton[조회].Select (L74) → retrieve() L106-119: icam.Icam06_FundBook.selectIcamFundPrice
  const retrieve = async () => {
    if (!stdDate) {
      message.warning('기준일자를 선택하세요.');
      return;
    }
    setLoading(true);
    try {
      const data = await icamApi.searchFundPrices(stdDate.format('YYYY-MM-DD'));
      setRows(data);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L45-66) → settings(), retrieve()
  useEffect(() => {
    void retrieve();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // [E2] downLoadButton[엑셀다운로드].Select (L80) → downLoad() L121-170: sys.Sys99_Print.insertRdFundPrice → RDUtil.download
  const downLoad = async () => {
    if (!stdDate) {
      message.warning('기준일자를 선택하세요.');
      return;
    }
    const stdDateStr = stdDate.format('YYYY-MM-DD');
    setLoading(true);
    try {
      const groupId = await icamApi.rdDownloadFundPrice(stdDateStr);
      const res = await rdApi.buildUrl({
        kind: 'download',
        mrd: 'Icam06_Rd_FundPrice',
        options: '/rxlsopt [100]',
        exportType: 'xlsx',
        fileName: `펀드별 기준가 현황(${stdDateStr}).xlsx`,
        rv: {
          rdGroupId: groupId,
          startDate: stdDateStr,
        },
      });
      await rdDownload(res);
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    } finally {
      setLoading(false);
    }
  };

  // buildGrid() L88-104
  const columnDefs = useMemo(() => [
    gb.textCenter('fundCode', 100, '펀드코드'),
    gb.text('fundName', 400, '펀드명'),
    gb.textCenter('cur', 60, '통화'),
    gb.double('forPrincipal', 150, '원본액'),
    gb.doubleColor('principalDiff', 120, '원본액<br>전일대비'),
    gb.double('forNav', 150, '순자산액'),
    gb.doubleColor('navDiff', 120, '순자산액<br>전일대비'),
    gb.double('forStdPrice', 100, '기준가'),
    gb.doubleColor('stdPriceDiff', 100, '기준가<br>전일대비'),
    gb.double('forTaxPrice', 100, '과표기준가'),
    gb.doubleColor('taxPriceDiff', 100, '과표기준가<br>전일대비'),
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] retrieveButton[조회].Select (L74) → retrieve() */}
        <SearchBar
          onSearch={retrieve}
          loading={loading}
          extra={
            // [E2] downLoadButton[엑셀다운로드].Select (L80) → downLoad()
            <Button type="download" onClick={downLoad}>엑셀다운로드</Button>
          }
        >
          <SearchBar.Field label="기준일자">
            <DatePicker
              value={stdDate}
              onChange={d => d && setStdDate(d)}
              allowClear={false}
              format="YYYY-MM-DD"
            />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<FundPrice>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.fundBookId)}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};
