/**
 * [1512] 기초자료 > 10. 책무 > 책무마감 검증 (E15)
 * AS-IS: myApp/client/vi/tdm/Tdm50_Tab_DutyReconAdmin.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L61-84: 가운데 = 툴바(기준년월 QuickMoveField · 고객사 200 · [조회]) + 점검 결과 그리드(SingleGrid)
 * 조회는 두 단계다: sys99_print.insertReconTdm(DB 함수 f_recon_tdm이 사용자 몫의 'DB_CHK' 행을 다시 만든다) → selectByWindowClassName
 * UX보강(10): 툴바 = SearchBar(UX-01)
 */
import React, { useMemo, useState } from 'react';
import { Input, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmDutyRecon } from '@/types/tdm';
import { Company } from '@/types/sys';
import { QuickMoveField, YearMonth } from '@/components/form/QuickMoveField';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Sys01_Lookup_SelectSingle } from '../sys/Sys01_Lookup_SelectSingle';

type Row = TdmDutyRecon & { rowKey: string };

const gb = gbFor<Row>();

export const Tdm50_Tab_DutyReconAdmin: React.FC = () => {
  // [E0] 화면 열림 (생성자 L61-84) → settings() L86-119: 기준년월 이번 달, 고객사 = 로그인 회사 — 열 때 조회는 하지 않는다
  const user = useLoginUser();
  const [ym, setYm] = useState<YearMonth>({ year: dayjs().year(), month: dayjs().month() + 1 });
  const [companyId, setCompanyId] = useState<number>(user.companyId);   // private Long companyId = LoginUser.getCompanyId()
  const [companyName, setCompanyName] = useState(user.companyName);
  const [rows, setRows] = useState<Row[]>([]);
  const [lookupCompany, setLookupCompany] = useState(false);

  // [E1] retrieveButton[조회].Select (L87) / QuickMoveField 이동·Enter → createData() L131-148:
  //   sys.Sys99_Print.insertReconTdm(windowClassName "DB_CHK", baseDate = 그 달 1일, companyId, groupId = 로그인 사용자) → retrieve() L150-162
  const createData = async (v: YearMonth = ym, company: number = companyId) => {
    try {
      await tdmApi.createDutyReconData({ companyId: company, baseDate: dayjs(new Date(v.year, v.month - 1, 1)).format('YYYY-MM-DD') });
      const list = await tdmApi.searchDutyRecon();
      setRows(list.map(r => ({ ...r, rowKey: String(r.printId) })));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E2] companyName.TriggerClick [result != null] (L101) → Sys01_Lookup_SelectSingle.open(): 고른 회사로 바꾸고 곧바로 createData()
  const onCompanyResult = (company: Company | null) => {
    setLookupCompany(false);
    if (company) {
      setCompanyId(company.companyId);
      setCompanyName(company.companyNm);
      void createData(ym, company.companyId);
    }
  };

  // buildGrid() L121-129
  const columnDefs = useMemo(() => [
    gb.text('companyName', 200, '회사명'),  // L123
    gb.text('string01', 300, '점검항목'),  // L124
    gb.text('string02', 400, '점점결과'),  // L125
    gb.text('string03', 300, '참조'),  // L126
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <SearchBar onSearch={() => createData()}>
        <SearchBar.Field label="기준년월">
          <QuickMoveField {...ym} onChange={setYm} onCommit={v => void createData(v)} />
        </SearchBar.Field>
        <SearchBar.Field label="고객사">
          <Input readOnly style={{ width: 200, cursor: 'pointer' }} value={companyName} suffix={<SearchOutlined />} onClick={() => setLookupCompany(true)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<Row> rowData={rows} columnDefs={columnDefs} getRowId={p => p.data.rowKey} />
      </div>
      <Sys01_Lookup_SelectSingle open={lookupCompany} onResult={onCompanyResult} />
    </div>
  );
};
