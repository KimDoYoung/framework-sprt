/**
 * [1466] 책무 > 90. 책무관리현황 > 조치대상조회(변화관리) (N25)
 * AS-IS: myApp/client/vi/tdm/Tdm00_Tab_ChangeList.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L34-55: 위 툴바(기준일 · [조회]) + 변화 목록 그리드(SingleGrid: 변화구분 250 · 내용 750)
 * UX보강(10): 툴바 = SearchBar(UX-01)
 */
import React, { useEffect, useMemo, useState } from 'react';
import { DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmChangeListItem } from '@/types/tdm';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';

type Row = TdmChangeListItem & { rowKey: number };

const gb = gbFor<Row>();

export const Tdm00_Tab_ChangeList: React.FC = () => {
  const [stdDate, setStdDate] = useState<Dayjs>(dayjs());   // settings() L57-67: 기준일 = LoginUser.getToday()
  const [rows, setRows] = useState<Row[]>([]);

  // retrieve() L78-91: tdm.Tdm02_HrRecord.selectChangeList(companyId, stdDate)
  const retrieve = async (d: Dayjs = stdDate) => {
    try {
      const list = await tdmApi.searchChangeList(d.format('YYYY-MM-DD'));
      setRows(list.map((r, i) => ({ ...r, rowKey: i })));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L34-55) → settings(), retrieve()
  useEffect(() => { void retrieve(); }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  // buildGrid() L69-76
  const columnDefs = useMemo(() => [
    gb.text('changeData', 250, '변화구분'),  // L72
    gb.text('note', 750, '내용'),  // L73
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] retrieveButton[조회].Select (L61) → retrieve() */}
        <SearchBar onSearch={() => retrieve()}>
          <SearchBar.Field label="기준일">
            <DatePicker style={{ width: 120 }} format="YYYY.MM.DD" allowClear={false} value={stdDate} onChange={d => d && setStdDate(d)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<Row> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.rowKey)} />
        </div>
      </div>
    </div>
  );
};
