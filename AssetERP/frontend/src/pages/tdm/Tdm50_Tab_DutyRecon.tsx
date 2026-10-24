/**
 * [1497] 책무 > 00. 대시보드 > 책무마감 검증 (N03)
 * AS-IS: myApp/client/vi/tdm/Tdm50_Tab_DutyRecon.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L52-73: 가운데(여백 20, 테두리) = 툴바(기준년월 QuickMoveField · [조회]) + 점검 결과 그리드(SingleGrid)
 * E15 Tdm50_Tab_DutyReconAdmin의 고객사용 짝 — 같은 API(f_recon_tdm 'DB_CHK' → sys99_print)를 쓰고 고객사 칸·회사명 열이 없다
 * UX보강(10): 툴바 = SearchBar(UX-01)
 */
import React, { useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmDutyRecon } from '@/types/tdm';
import { QuickMoveField, YearMonth } from '@/components/form/QuickMoveField';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';

type Row = TdmDutyRecon & { rowKey: string };

const gb = gbFor<Row>();

export const Tdm50_Tab_DutyRecon: React.FC = () => {
  const [ym, setYm] = useState<YearMonth>({ year: dayjs().year(), month: dayjs().month() + 1 });
  const [rows, setRows] = useState<Row[]>([]);

  // createData() L93-109: sys.Sys99_Print.insertReconTdm(windowClassName "DB_CHK", baseDate = 그 달 1일, companyId = 로그인 회사, groupId = 로그인 사용자)
  //   → retrieve() L111-123: sys.Sys99_Print.selectByWindowClassName
  const createData = async (v: YearMonth = ym) => {
    try {
      await tdmApi.createDutyReconData({ baseDate: dayjs(new Date(v.year, v.month - 1, 1)).format('YYYY-MM-DD') });
      const list = await tdmApi.searchDutyRecon();
      setRows(list.map(r => ({ ...r, rowKey: String(r.printId) })));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L52-73) → settings() L75-82 + QuickMoveField callbackOnCreate(L36-41) → createData(): 열자마자 이번 달로 조회한다
  useEffect(() => { void createData(); }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  // buildGrid() L84-91
  const columnDefs = useMemo(() => [
    gb.text('string01', 300, '점검항목'),  // L86
    gb.text('string02', 400, '점점결과'),  // L87
    gb.text('string03', 300, '참조'),  // L88
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] retrieveButton[조회].Select (L76) / QuickMoveField 이동·Enter(콜백 L42-47) → createData() */}
        <SearchBar onSearch={() => createData()}>
          <SearchBar.Field label="기준년월">
            <QuickMoveField {...ym} onChange={setYm} onCommit={v => void createData(v)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<Row> rowData={rows} columnDefs={columnDefs} getRowId={p => p.data.rowKey} />
        </div>
      </div>
    </div>
  );
};
