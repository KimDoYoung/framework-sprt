/**
 * 펀드운용현황(펀드합계) (R07) — 펀드관리 > 20. 운용현황 > 펀드운용현황(펀드합계) #1323
 * AS-IS: myApp/client/vi/icam/Icam06_Tab_FundOperateStatus.java (274줄)
 * 페이지 스타일: GG (Grid+Grid 상하 분할)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Select, Splitter } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { ColDef, RowClickedEvent } from 'ag-grid-community';
import type { AgGridReact } from 'ag-grid-react';
import { icamApi } from '@/api/icam';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { FundOperateStatus } from '@/types/icam';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { SingleGrid, gbFor } from '@/components/grid';
import { RdViewer } from '@/components/lookup/RdViewer';
import {
  Icam06_Grid_FundOperateStatus,
  Icam06GridFundOperateStatusHandle,
} from './Icam06_Grid_FundOperateStatus';

const gb = gbFor<FundOperateStatus>();

export const Icam06_Tab_FundOperateStatus: React.FC = () => {
  // [E0] 화면 열림 → settings()
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().subtract(1, 'month'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [fundType, setFundType] = useState<string>('1');
  const [searchText, setSearchText] = useState<string>('');

  const [rows, setRows] = useState<FundOperateStatus[]>([]);
  const [loading, setLoading] = useState(false);

  // RD 미리보기
  const [rdUrl, setRdUrl] = useState<string | null>(null);

  const gridRef = useRef<AgGridReact<FundOperateStatus>>(null);
  const fundGridRef = useRef<Icam06GridFundOperateStatusHandle>(null);

  // 마스터 컬럼
  const columnDefs: ColDef<FundOperateStatus>[] = useMemo(
    () => [
      gb.date('stdDate', 90, '일자'),
      gb.long('principal', 200, '원본액'),
      gb.long('nav', 200, '순자산'),
      gb.long('totalAsset', 200, '총자산'),
      gb.long('navAvg', 200, '순자산평잔 (3개월 이동평균)'),
      gb.long('totalAssetAvg', 200, '총자산평잔 (3개월 이동평균)'),
    ],
    []
  );

  // [E5] grid.RowClick (L163) → fundRetrieve()
  const handleRowClick = useCallback(
    (e: RowClickedEvent<FundOperateStatus>) => {
      if (!e.data) return;
      fundGridRef.current?.retrieve(e.data.stdDate, fundType, searchText);
    },
    [fundType, searchText]
  );

  // [E1] fundTypeComboBox[FundType].Collapse (L120) → retrieve()
  const handleFundTypeChange = (value: string) => {
    setFundType(value);
  };

  // fundType 상태 변경 시 retrieve 호출 (E1 연동)
  useEffect(() => {
    retrieve();
  }, [fundType]); // eslint-disable-line react-hooks/exhaustive-deps

  // [E3] retrieveButton[조회].Select (L150) → retrieve()
  const retrieve = useCallback(async () => {
    if (!startDate || !closeDate) {
      message.warning('조회기간을 입력하세요.');
      return;
    }
    setLoading(true);
    fundGridRef.current?.clear();

    try {
      const data = await icamApi.searchFundOperateStatus({
        startDate: startDate.format('YYYY-MM-DD'),
        closeDate: closeDate.format('YYYY-MM-DD'),
        fundType,
        searchText,
      });
      setRows(data);

      if (data.length > 0) {
        const first = data[0];
        setTimeout(() => {
          gridRef.current?.api?.forEachNode((node) => {
            if (node.rowIndex === 0) {
              node.setSelected(true);
            }
          });
          fundGridRef.current?.retrieve(first.stdDate, fundType, searchText);
        }, 50);
      }
    } catch (e) {
      message.error(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [startDate, closeDate, fundType, searchText]);

  // [E4] rdButton[출력/다운로드].Select (L156) → createPrint()
  const createPrint = async () => {
    if (!startDate || !closeDate) {
      message.warning('조회기간을 입력하세요.');
      return;
    }
    try {
      const sDateStr = startDate.format('YYYY-MM-DD');
      const cDateStr = closeDate.format('YYYY-MM-DD');
      const fundTypeName = fundType === '1' ? '운용펀드' : '판매펀드';

      const groupId = await icamApi.rdPrintFundOperateStatus({
        startDate: sDateStr,
        closeDate: cDateStr,
        fundType,
        searchText,
      });

      const res = await rdApi.buildUrl({
        kind: 'viewer',
        mrd: 'Icam06_Rd_FundOperateStatus',
        options: '/rpdflinebreak [1]',
        rv: {
          rdGroupId: groupId,
          startDate: sDateStr,
          closeDate: cDateStr,
          fundType: fundTypeName,
        },
      });
      setRdUrl(res.url);
    } catch (e) {
      message.error(errorMessage(e));
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        padding: 8,
      }}
    >
      <SearchBar
        onSearch={retrieve}
        extra={
          <Button type="download" onClick={createPrint}>
            출력/다운로드
          </Button>
        }
      >
        <SearchBar.Field label="조회기간">
          <DatePicker
            value={startDate}
            onChange={(d) => d && setStartDate(d)}
            allowClear={false}
            style={{ width: 120 }}
          />
          <span style={{ margin: '0 4px' }}>~</span>
          <DatePicker
            value={closeDate}
            onChange={(d) => d && setCloseDate(d)}
            allowClear={false}
            style={{ width: 120 }}
          />
        </SearchBar.Field>

        <SearchBar.Field label="펀드구분">
          <Select
            value={fundType}
            onChange={handleFundTypeChange}
            style={{ width: 110 }}
            options={[
              { value: '1', label: '운용펀드' },
              { value: '2', label: '판매펀드' },
            ]}
          />
        </SearchBar.Field>

        <SearchBar.Field label="검색어">
          {/* [E2] searchText.KeyPress [Enter] */}
          <SearchBar.Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="펀드코드/펀드명"
            style={{ width: 180 }}
          />
        </SearchBar.Field>
      </SearchBar>

      <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
        <Splitter layout="vertical" style={{ height: '100%' }}>
          <Splitter.Panel defaultSize="50%" min="20%">
            <div style={{ width: '100%', height: '100%', boxSizing: 'border-box' }}>
              <SingleGrid<FundOperateStatus>
                gridRef={gridRef}
                columnDefs={columnDefs}
                rowData={rows}
                loading={loading}
                onRowClicked={handleRowClick}
                getRowId={(p) => String(p.data.fundBookId)}
              />
            </div>
          </Splitter.Panel>
          <Splitter.Panel defaultSize="50%" min="20%">
            <Icam06_Grid_FundOperateStatus ref={fundGridRef} />
          </Splitter.Panel>
        </Splitter>
      </div>

      <RdViewer url={rdUrl} title="펀드운용현황" onClose={() => setRdUrl(null)} />
    </div>
  );
};

export default Icam06_Tab_FundOperateStatus;
