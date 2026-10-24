/**
 * [1496] 책무 > 00. 대시보드 > 책무진행 상태 (N02)
 * AS-IS: myApp/client/vi/tdm/Tdm50_Tab_DutyProgress.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L63-84: 가운데(여백 20, 테두리) = 툴바(기준년월 QuickMoveField · [조회]) + 책무진행 상태 그리드(SingleGrid, 앞 3열 고정, 묶음 헤더 3개)
 * E14 Tdm50_Tab_DutyProgressAdmin의 고객사용 짝 — 같은 API(f_recon_tdm → sys99_print)를 쓰고 고객사 칸·회사 열·점검대상 여부 묶음이 없다
 * UX보강(10): 툴바 = SearchBar(UX-01)
 */
import React, { useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmDutyProgress } from '@/types/tdm';
import { QuickMoveField, YearMonth } from '@/components/form/QuickMoveField';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';

type Row = TdmDutyProgress & { rowKey: string };

const gb = gbFor<Row>();
const BLUE = '#456EA6';   // setHtmlGridStyle(…, "456EA6")

type Colored = { headerStyle: { color: string } };
const color = (c: string): Colored => ({ headerStyle: { color: c } });
const frozen = { pinned: 'left' as const };                        // addTextFrozen
/** addLongNull: 오른쪽, null·0은 빈칸 */
const longNull = (f: keyof Row, w: number, h: string, c?: string) =>
  gb.long(f, w, h, { valueFormatter: p => (p.value ? Number(p.value).toLocaleString('ko-KR') : ''), ...(c ? color(c) : {}) });

const MONTH_FIELDS = ['m00Cnt', 'm01Cnt', 'm02Cnt', 'm03Cnt', 'm04Cnt', 'm05Cnt', 'm06Cnt', 'm07Cnt', 'm08Cnt', 'm09Cnt', 'm10Cnt', 'm11Cnt'] as const;

export const Tdm50_Tab_DutyProgress: React.FC = () => {
  const [ym, setYm] = useState<YearMonth>({ year: dayjs().year(), month: dayjs().month() + 1 });
  const [rows, setRows] = useState<Row[]>([]);
  const [headerMonth, setHeaderMonth] = useState(ym.month);              // changeMonthHeader() L167-205 가 쓰는 기준월

  // retrieve() L227-239: sys.Sys99_Print.selectByWindowClassName (windowClassName "CHCK_STATUS", groupId = 로그인 사용자 — 서버가 정한다)
  const retrieve = async () => {
    try {
      const list = await tdmApi.searchDutyProgress();
      setRows(list.map(r => ({ ...r, rowKey: String(r.printId) })));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L63-84) → setDefault() L86-105: 진행 중인 점검년월로 기준년월 SET(없으면 이번 달) → retrieve() — createData가 아니라 조회만 한다
  useEffect(() => {
    let alive = true;
    void (async () => {
      try {
        const checkYm = await tdmApi.getDashboardRecentCheckYm();   // tdm.Tdm50_ChckJob.selectRcntChckJob, 'yyyy.MM'
        if (alive && checkYm) {
          const v = { year: Number(checkYm.substring(0, 4)), month: Number(checkYm.substring(5, 7)) };
          setYm(v);
          setHeaderMonth(v.month);                                   // QuickMoveField callbackOnCreate → changeMonthHeader()
        }
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
      if (alive) await retrieve();
    })();
    return () => { alive = false; };
  }, []);

  // [E1] retrieveButton[조회].Select (L108) / QuickMoveField 이동·Enter(콜백 L53-58) → createData() L207-225:
  //   changeMonthHeader() → sys.Sys99_Print.insertReconTdm(windowClassName "CHCK_STATUS", baseDate = 그 달 1일, companyId = 로그인 회사, groupId = 로그인 사용자) → retrieve()
  const createData = async (v: YearMonth = ym) => {
    setHeaderMonth(v.month);
    try {
      await tdmApi.createDutyProgressData({ baseDate: dayjs(new Date(v.year, v.month - 1, 1)).format('YYYY-MM-DD') });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return;
    }
    await retrieve();
  };

  // buildGrid() L116-165, changeMonthHeader() L167-205: 월별 헤더는 기준월부터 12개월 ((startMonth - 1 + i) % 12 + 1)월
  const columnDefs = useMemo(() => [
    gb.text('roleName', 130, '직책', frozen),  // L125 addTextFrozen
    gb.textCenter('exctName', 80, '임원', frozen),  // L126
    gb.text('orgName', 160, '점검부서', frozen),  // L127
    gb.text('name1454', 110, '1454<br>부서담당자'),  // L128
    gb.text('apprList1463', 110, '1463<br>승인선'),  // L129
    gb.group('메뉴얼 확정(1424)', [   // L118 HeaderGroupMap(0, 6, …, 1, 4)
      longNull('manlCnt', 70, '전체항목', BLUE),  // L130
      longNull('endCnt', 70, '작성완료', BLUE),  // L131
      longNull('lockCnt', 60, 'Lock', BLUE),  // L132
      longNull('approveCnt', 60, '결재', BLUE),  // L133
    ]),
    gb.group('점검주기별 항목수', [   // L119 HeaderGroupMap(0, 10, …, 1, 7)
      longNull('unusedCnt', 60, '미사용'),  // L134
      longNull('manlAnnually', 50, '년간'),  // L135
      longNull('manlSemiannually', 50, '반기'),  // L136
      longNull('manlQuarterly', 50, '분기'),  // L137
      longNull('manlMonthly', 50, '월'),  // L138
      longNull('manlAnytime', 50, '수시'),  // L139
      longNull('manlEtc', 60, '특정월'),  // L140
    ]),
    gb.group('월별점검항목수', MONTH_FIELDS.map((f, i) =>   // L122 HeaderGroupMap(0, 17, …, 1, 12), L143-154
      longNull(f, 50, `${((headerMonth - 1 + i) % 12) + 1}월`, BLUE))),
    longNull('itemCnt1455', 70, '1455<br>생성항목'),  // L155
    gb.text('checker1456', 100, '1456<br>점검자'),  // L156
    gb.text('apprList1456', 100, '1456<br>승인선'),  // L157
    gb.textStatus('apprStatus', 100, '1458<br>승인상태'),  // L158
    gb.text('exctApproveYn', 100, '1455<br>승인완료'),  // L159
    gb.text('chckLockYn', 100, '1455<br>잠금'),  // L160
    gb.text('chckCloseYn', 100, '1455<br>마감'),  // L161
    gb.text('chckApprStatus', 100, '1455<br>마감결재'),  // L162
  ], [headerMonth]);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar onSearch={() => createData()}>
          <SearchBar.Field label="기준년월">
            {/* QuickMoveField: ◀▶·월 콤보·연도 Enter가 곧바로 createData() (콜백 L53-58) */}
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
