/**
 * 위반내역조회 (I10) — 준법감시 > 10. 임직원매매 > 위반내역조회 #1370 (Flt10_Tab_ViolateUser)
 * 준감인용 11. 임직원매매(준감인) > 위반내역조회 #1157 (Flt10_Tab_Violate, J05)과 같은 화면이다 — fixedUser로 갈린다.
 * AS-IS: myApp/client/vi/flt/Flt10_Tab_Violate.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L62-89: center = vlc = 툴바(기준일 · 사원명 · [조회][엑셀다운로드]) / 읽기 전용 그리드(단일 선택)
 * Flt10_Tab_ViolateUser(L5-8): 사원명 칸을 막고(setEnabled(false)) 열릴 때 retrieve() — 로그인 사용자 본인만. Flt10_Tab_Violate는 열릴 때 조회하지 않는다.
 * 원본 엑셀은 RD 리포트 서버(Flt10_Rd_Violate) → TOBE는 서버가 조회 결과를 xlsx로 만든다(E10·G03과 같은 방식)
 * UX보강(10): 툴바 = SearchBar(UX-01), 날짜 열 90(UX-08)
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { fltApi } from '@/api/flt';
import { errorMessage } from '@/api/client';
import { FltViolate } from '@/types/flt';
import { TransInfo } from '@/types/emp';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';

const gb = gbFor<FltViolate>();
const DATE_FORMAT = 'YYYY-MM-DD';
const ALL = '전체';

/** buildGrid() L142-155 */
const columnDefs = [
  gb.text('orgName', 200, '본부(부서)'),
  gb.textCenter('personName', 120, '사원명'),
  gb.text('checkName', 250, '위반내역'),
  gb.textCenter('checkStd', 120, '기준정보'),
  gb.textCenter('checkViolate', 120, '위반정보'),
  gb.date('trDate', 90, '위반거래일'),  // 원본 120 → UX-08
  gb.text('trItemName', 200, '위반종목명'),
  gb.textArea('rejectReason', 200, '사전승인의견'),
  gb.textArea('trNote', 200, '매매사유'),
];

interface Props {
  /** Flt10_Tab_ViolateUser: 로그인 사용자 본인으로 고정하고 열릴 때 조회한다 */
  fixedUser?: boolean;
}

export const Flt10_Tab_Violate: React.FC<Props> = ({ fixedUser = false }) => {
  const user = useLoginUser();
  // setInitData() L225-231: 기준일 = 오늘이 속한 달 1일의 전날(전월 말일)
  const [stdDate, setStdDate] = useState<Dayjs>(() => dayjs().startOf('month').subtract(1, 'day'));
  // settings() L91-140: empKorName = LoginUser.getUserName(), personId = LoginUser.getUserId()
  const [empName, setEmpName] = useState(user.name);
  const [personId, setPersonId] = useState<number | null>(user.userId);
  const [empOpen, setEmpOpen] = useState(false);
  const [rows, setRows] = useState<FltViolate[]>([]);
  const paramRef = useRef({ stdDate, personId, empName });
  paramRef.current = { stdDate, personId, empName };

  // retrieve() L157-170: 서비스 flt.Flt10_Tr.selectViolate(companyId, stdDate, personId)
  const retrieve = useCallback(async () => {
    const p = paramRef.current;
    try {
      setRows(await fltApi.searchViolate(p.stdDate.format(DATE_FORMAT), p.personId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (생성자 L62-89) → settings(). Flt10_Tab_ViolateUser(L5-8)만 retrieve()
  useEffect(() => { if (fixedUser) void retrieve(); }, [fixedUser, retrieve]);

  // [E1] empKorName.TriggerClick (L98) → Emp00_Lookup_SelectSingle.openAll(오늘, null, …): [전체]는 null → "전체", personId = null
  const onEmpResult = (emp: TransInfo | null) => {
    setEmpOpen(false);
    if (emp == null) {
      setEmpName(ALL);
      setPersonId(null);
    } else {
      setEmpName(emp.korNm ?? '');
      setPersonId(emp.personId);
    }
  };

  // [E2] empKorName.Change (L117) → 칸이 비면 personId = null. 칸이 읽기 전용(setEditable(false))이라 글자를 지울 수 없어 별도 처리 없음 —
  // 비우는 길은 조회창의 [전체]뿐이고 그건 위 E1이 같은 일(전체 · personId null)을 한다

  // [E4] downloadButton[엑셀다운로드].Select (L134) → createRdExcel() L172-223 (RD 대신 서버 xlsx)
  const createRdExcel = async () => {
    const p = paramRef.current;
    const fileName = `임직원매매 위반내역(${p.stdDate.format(DATE_FORMAT)})_${p.empName}.xlsx`;
    try {
      await fltApi.downloadViolateExcel(p.stdDate.format(DATE_FORMAT), p.personId, fileName);
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    }
  };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E3] retrieveButton[조회].Select (L128) → retrieve() */}
        <SearchBar
          onSearch={() => retrieve()}
          extra={<Button type="download" onClick={createRdExcel}>엑셀다운로드</Button>}
        >
          <SearchBar.Field label="기준일">
            <DatePicker style={{ width: 130 }} allowClear={false} value={stdDate} format={DATE_FORMAT} onChange={d => d && setStdDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="사원명">
            <LookupInput width={150} value={empName} placeholder={ALL} disabled={fixedUser} onOpen={() => setEmpOpen(true)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<FltViolate>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.trId)}
          />
        </div>
      </div>
      <Emp00_Lookup_SelectSingle open={empOpen} transDate={dayjs().format(DATE_FORMAT)} onResult={onEmpResult} onClose={() => setEmpOpen(false)} />
    </div>
  );
};
