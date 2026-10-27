/**
 * [1268/1494] 펀드관리 > 20. 운용현황 > 펀드별 발생보수현황 / 관리회계 > 30. 펀드운용보수관리 > 월별 펀드보수현황 (R06)
 * AS-IS: myApp/client/vi/icam/Icam10_Tab_CurrentFeeByFund.java (241줄)
 * 생성자 L51-74: SearchBar(기준년도 · [조회] · [엑셀다운로드]) + SingleGrid(27개 컬럼 + 2단 헤더 그룹 + sumRow)
 * 스타일: SG (SearchGrid — docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04)
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Input, message } from 'antd';
import dayjs from 'dayjs';
import type { ColDef, ColGroupDef } from 'ag-grid-community';
import { errorMessage } from '@/api/client';
import { icamApi } from '@/api/icam';
import { rdApi } from '@/api/rd';
import { CurrentFeeByFund } from '@/types/icam';
import { Button } from '@/components/button';
import { SingleGrid, SumRow, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { rdDownload } from '@/utils/rdDownload';

const gb = gbFor<CurrentFeeByFund>();

const sumFields: (keyof CurrentFeeByFund)[] = [
  'beforefee1', 'afterfee1',
  'beforefee2', 'afterfee2',
  'beforefee3', 'afterfee3',
  'beforefee4', 'afterfee4',
  'beforefee5', 'afterfee5',
  'beforefee6', 'afterfee6',
  'beforefee7', 'afterfee7',
  'beforefee8', 'afterfee8',
  'beforefee9', 'afterfee9',
  'beforefee10', 'afterfee10',
  'beforefee11', 'afterfee11',
  'beforefee12', 'afterfee12',
  'totalBeforefee', 'totalAfterfee',
];

export const Icam10_Tab_CurrentFeeByFund: React.FC = () => {
  // settings() L78: startDay = YYYY
  const [yearText, setYearText] = useState<string>(dayjs().format('YYYY'));
  const [rows, setRows] = useState<CurrentFeeByFund[]>([]);
  const [loading, setLoading] = useState(false);

  // [E0] 화면 열림 (생성자 L51-74) → settings()
  useEffect(() => {
    setYearText(dayjs().format('YYYY'));
  }, []);

  // [E1] yearText.KeyPress [Enter] (L81) / [E2] retrieveButton[조회].Select (L89) → retrieve() L167-182
  const retrieve = async () => {
    if (!yearText || !yearText.trim()) {
      message.warning('기준년도를 입력하세요.');
      return;
    }
    setLoading(true);
    try {
      const yr = yearText.trim();
      const preYear = String(parseInt(yr, 10) - 1);
      const data = await icamApi.searchCurrentFeeByFunds(yr, preYear);
      setRows(data);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E3] downloadButton[엑셀다운로드].Select (L95) → createRdExcel() L184-236
  const handleDownload = async () => {
    if (!yearText || !yearText.trim()) {
      message.warning('기준년도를 입력하세요.');
      return;
    }
    const yr = yearText.trim();
    const preYear = String(parseInt(yr, 10) - 1);
    setLoading(true);
    try {
      const groupId = await icamApi.rdDownloadCurrentFeeByFund(yr, preYear);
      if (!groupId) {
        message.error('다운로드 그룹 생성 실패');
        return;
      }
      const res = await rdApi.buildUrl({
        kind: 'download',
        mrd: 'Icam10_Rd_CurrentFeeByFund',
        options: '/rxlsopt [100]',
        exportType: 'xlsx',
        fileName: `펀드별 운용보수현황(${yr}년).xlsx`,
        rv: {
          groupId,
          yearText: yr,
        },
      });
      await rdDownload(res);
    } catch (err) {
      message.error(errorMessage(err, '엑셀다운로드 실패'));
    } finally {
      setLoading(false);
    }
  };

  // buildGrid() L103-165
  const columnDefs = useMemo<(ColDef<CurrentFeeByFund> | ColGroupDef<CurrentFeeByFund>)[]>(() => [
    gb.text('fundName', 400, '펀드명', { pinned: 'left' }),
    gb.group('1월', [gb.double('beforefee1', 100, '전기'), gb.double('afterfee1', 100, '당기')]),
    gb.group('2월', [gb.double('beforefee2', 100, '전기'), gb.double('afterfee2', 100, '당기')]),
    gb.group('3월', [gb.double('beforefee3', 100, '전기'), gb.double('afterfee3', 100, '당기')]),
    gb.group('4월', [gb.double('beforefee4', 100, '전기'), gb.double('afterfee4', 100, '당기')]),
    gb.group('5월', [gb.double('beforefee5', 100, '전기'), gb.double('afterfee5', 100, '당기')]),
    gb.group('6월', [gb.double('beforefee6', 100, '전기'), gb.double('afterfee6', 100, '당기')]),
    gb.group('7월', [gb.double('beforefee7', 100, '전기'), gb.double('afterfee7', 100, '당기')]),
    gb.group('8월', [gb.double('beforefee8', 100, '전기'), gb.double('afterfee8', 100, '당기')]),
    gb.group('9월', [gb.double('beforefee9', 100, '전기'), gb.double('afterfee9', 100, '당기')]),
    gb.group('10월', [gb.double('beforefee10', 100, '전기'), gb.double('afterfee10', 100, '당기')]),
    gb.group('11월', [gb.double('beforefee11', 100, '전기'), gb.double('afterfee11', 100, '당기')]),
    gb.group('12월', [gb.double('beforefee12', 100, '전기'), gb.double('afterfee12', 100, '당기')]),
    gb.group('합계', [gb.double('totalBeforefee', 100, '전기'), gb.double('totalAfterfee', 100, '당기')]),
  ], []);

  // getSumGrid("합 계", 1, 2, 27) L164
  const sumRow = useMemo<SumRow>(() => ({
    labelField: 'fundName',
    label: '합 계',
    sum: sumFields as string[],
  }), []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar
          onSearch={retrieve}
          loading={loading}
          extra={
            <Button type="download" onClick={handleDownload}>
              엑셀다운로드
            </Button>
          }
        >
          <SearchBar.Field label="기준년도">
            <Input
              style={{ width: 80 }}
              placeholder="YYYY"
              maxLength={4}
              value={yearText}
              onChange={e => setYearText(e.target.value)}
              onPressEnter={retrieve}
            />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<CurrentFeeByFund>
            loading={loading}
            rowData={rows}
            columnDefs={columnDefs}
            sumRow={sumRow}
            getRowId={p => String(p.data.feeId)}
          />
        </div>
      </div>
    </div>
  );
};
