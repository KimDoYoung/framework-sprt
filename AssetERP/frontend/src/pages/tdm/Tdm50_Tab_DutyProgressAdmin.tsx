/**
 * [1511] 기초자료 > 10. 책무 > 책무진행 상태 (E14)
 * AS-IS: myApp/client/vi/tdm/Tdm50_Tab_DutyProgressAdmin.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L71-94: 가운데 = 툴바(기준년월 QuickMoveField · 고객사 200 · [조회]) + 책무진행 상태 그리드(SingleGrid, 앞 4열 고정, 묶음 헤더 4개)
 * 조회는 두 단계다: sys99_print.insertReconTdm(DB 함수 f_recon_tdm이 사용자 몫의 점검상태 행을 다시 만든다) → selectByWindowClassName
 * UX보강(10): 툴바 = SearchBar(UX-01)
 */
import React, { useMemo, useState } from 'react';
import { Input, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmDutyProgress } from '@/types/tdm';
import { Company } from '@/types/sys';
import { QuickMoveField, YearMonth } from '@/components/form/QuickMoveField';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Sys01_Lookup_SelectSingle } from '../sys/Sys01_Lookup_SelectSingle';

type Row = TdmDutyProgress & { rowKey: string };

const gb = gbFor<Row>();
const BLUE = '#456EA6';   // setHtmlGridStyle(…, "456EA6")
const RED = '#DD5E5E';    // setHtmlGridStyle(…, "DD5E5E")

type Colored = { headerStyle: { color: string } };
const color = (c: string): Colored => ({ headerStyle: { color: c } });
const frozen = { pinned: 'left' as const };                        // addTextFrozen
/** addLongNull: 오른쪽, null·0은 빈칸 */
const longNull = (f: keyof Row, w: number, h: string, c?: string) =>
  gb.long(f, w, h, { valueFormatter: p => (p.value ? Number(p.value).toLocaleString('ko-KR') : ''), ...(c ? color(c) : {}) });

const MONTH_FIELDS = ['m00Cnt', 'm01Cnt', 'm02Cnt', 'm03Cnt', 'm04Cnt', 'm05Cnt', 'm06Cnt', 'm07Cnt', 'm08Cnt', 'm09Cnt', 'm10Cnt', 'm11Cnt'] as const;

export const Tdm50_Tab_DutyProgressAdmin: React.FC = () => {
  // [E0] 화면 열림 (생성자 L71-94) → settings() L96-129: 기준년월 이번 달, 고객사 = 로그인 회사 — 열 때 조회는 하지 않는다
  const user = useLoginUser();
  const [ym, setYm] = useState<YearMonth>({ year: dayjs().year(), month: dayjs().month() + 1 });
  const [companyId, setCompanyId] = useState<number>(user.companyId);   // private Long companyId = LoginUser.getCompanyId()
  const [companyName, setCompanyName] = useState(user.companyName);
  const [rows, setRows] = useState<Row[]>([]);
  const [lookupCompany, setLookupCompany] = useState(false);
  const [headerMonth, setHeaderMonth] = useState(ym.month);              // changeMonthHeader() L182-206 가 쓰는 기준월(조회할 때 바뀐다)

  // [E1] retrieveButton[조회].Select (L97) / QuickMoveField 이동·Enter(callbackComboCollapse) → createData() L208-227:
  //   changeMonthHeader() → sys.Sys99_Print.insertReconTdm(windowClassName "CHCK_STATUS", baseDate = 그 달 1일, companyId, groupId = 로그인 사용자) → retrieve() L229-241
  const createData = async (v: YearMonth = ym, company: number = companyId) => {
    setHeaderMonth(v.month);
    try {
      await tdmApi.createDutyProgressData({ companyId: company, baseDate: dayjs(new Date(v.year, v.month - 1, 1)).format('YYYY-MM-DD') });
      const list = await tdmApi.searchDutyProgress();
      setRows(list.map(r => ({ ...r, rowKey: String(r.printId) })));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E2] companyName.TriggerClick [result != null] (L111) → Sys01_Lookup_SelectSingle.open(): 고른 회사로 바꾸고 곧바로 createData()
  const onCompanyResult = (company: Company | null) => {
    setLookupCompany(false);
    if (company) {
      setCompanyId(company.companyId);
      setCompanyName(company.companyNm);
      void createData(ym, company.companyId);
    }
  };

  // buildGrid() L131-180, changeMonthHeader() L182-206: 월별 헤더는 기준월부터 12개월 ((startMonth - 1 + i) % 12 + 1)월
  const columnDefs = useMemo(() => [
    gb.text('companyName', 130, '회사', frozen),  // L135 addTextFrozen
    gb.text('roleName', 130, '직책', frozen),  // L136
    gb.textCenter('exctName', 80, '임원', frozen),  // L137
    gb.text('orgName', 160, '지원부서', frozen),  // L138
    gb.text('name1454', 110, '1454<br>부서담당자'),  // L139
    gb.text('apprList1463', 110, '1463<br>승인선'),  // L140
    gb.group('메뉴얼 확정(1424)', [   // L133 HeaderGroupMap(0, 7, …, 1, 4)
      longNull('manlCnt', 70, '전체항목', BLUE),  // L141
      longNull('endCnt', 70, '작성완료', BLUE),  // L142
      longNull('lockCnt', 60, 'Lock', BLUE),  // L143
      longNull('approveCnt', 60, '결재', BLUE),  // L144
    ]),
    gb.group('점검주기별 항목수', [   // L134 HeaderGroupMap(0, 11, …, 1, 7)
      longNull('unusedCnt', 60, '미사용'),  // L145
      longNull('manlAnnually', 50, '년간'),  // L146
      longNull('manlSemiannually', 50, '반기'),  // L147
      longNull('manlQuarterly', 50, '분기'),  // L148
      longNull('manlMonthly', 50, '월'),  // L149
      longNull('manlAnytime', 50, '수시'),  // L150
      longNull('manlEtc', 60, '특정월'),  // L151
    ]),
    gb.group('점검대상 여부', [   // L135 HeaderGroupMap(0, 18, …, 1, 2)
      gb.textCenter('thisMonthYn', 50, '금월', color(RED)),  // L152
      gb.textCenter('nextMonthYn', 50, '익월', color(RED)),  // L153
    ]),
    gb.group('월별점검항목수', MONTH_FIELDS.map((f, i) =>   // L136 HeaderGroupMap(0, 20, …, 1, 12), L154-165
      longNull(f, 50, `${((headerMonth - 1 + i) % 12) + 1}월`, BLUE))),
    longNull('itemCnt1455', 70, '1455<br>생성항목'),  // L166
    gb.text('checker1456', 100, '1456<br>점검자'),  // L167
    gb.text('apprList1456', 100, '1456<br>승인선'),  // L168
    gb.textStatus('apprStatus', 100, '1458<br>승인상태'),  // L169
    gb.text('exctApproveYn', 100, '1455<br>승인완료'),  // L170
    gb.text('chckLockYn', 100, '1455<br>잠금'),  // L171
    gb.text('chckCloseYn', 100, '1455<br>마감'),  // L172
    gb.text('chckApprStatus', 100, '1455<br>마감결재'),  // L173
  ], [headerMonth]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <SearchBar onSearch={() => createData()}>
        <SearchBar.Field label="기준년월">
          {/* QuickMoveField: ◀▶·월 콤보·연도 Enter가 곧바로 createData() (callbackComboCollapse) */}
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
