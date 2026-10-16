/**
 * [1140] 관리자 > 02. 시스템관리 > 로그인내역 조회 (A20)
 * AS-IS: myApp/client/vi/sys/Sys26_Tab_LoginHistory.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L47-78: 툴바(조회기간 시작일 ~ 종료일 · 접속구분 · 회사명 · 조회 · 삭제) + 그리드(행번호, 체크박스 다중)
 * UX보강(10): 툴바 = SearchBar(UX-01·02 — 초기화는 줄바꿈이 없을 때만)
 * 삭제: 원본 GridDeleteData는 확인창 없이 체크 행을 지운다 — 공통 규칙(05 §8)대로 "n건 삭제되었습니다."·선택 없음 경고를 더했다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Select } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import dayjs, { Dayjs } from 'dayjs';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Code, LoginHistory } from '@/types/sys';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { MultiGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';

const gb = gbFor<LoginHistory>();
const ALL = '%';  // loginModeComboBox·companyComboBox: "전체" 또는 "%"

/** AS-IS buildGrid() L117-131 */
const columnDefs = [
  gb.textCenter('openDateString', 200, '접속일시'),  // L120
  gb.text('companyNm', 200, '회사명'),  // L121
  gb.text('personNm', 150, '성명'),  // L122
  gb.text('statusNm', 150, '상태구분'),  // L123
  gb.textCenter('loginModeNm', 80, '접속경로'),  // L124
  gb.text('ipAddress', 150, 'IP 주소'),  // L125
  gb.text('os', 150, 'OS'),  // L126
  gb.text('browser', 200, 'Browser'),  // L127
];

export const Sys26_Tab_LoginHistory: React.FC = () => {
  const gridRef = useRef<AgGridReact<LoginHistory>>(null);
  const [companies, setCompanies] = useState<Code[]>([]);
  // settings() L80-115: 조회기간 = 오늘 ~ 오늘, 접속구분·회사명 = 전체
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs());
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [loginMode, setLoginMode] = useState(ALL);
  const [companyCd, setCompanyCd] = useState(ALL);
  const [rows, setRows] = useState<LoginHistory[]>([]);

  useEffect(() => {
    sysApi.searchCompanyNames().then(setCompanies).catch(err => message.error(errorMessage(err, '조회 실패')));
  }, []);

  // retrieve() L133-167: 서비스 sys.Sys26_Login.selectByLoginDate → 첫 행 선택
  const retrieve = useCallback(async () => {
    try {
      setRows(await sysApi.searchLoginHistories({
        startDate: startDate.format('YYYY-MM-DD'), closeDate: closeDate.format('YYYY-MM-DD'), companyId: companyCd, loginMode,
      }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [startDate, closeDate, companyCd, loginMode]);

  // [E0] 화면 열림 (생성자 L47-78) → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  // [E2] deleteButton[삭제].Select (L107) → GridDeleteData.delete(체크된 행, sys.Sys26_Login.delete)
  const deleteChecked = async () => {
    const checked = gridRef.current?.api.getSelectedRows() ?? [];
    if (checked.length === 0) {
      message.warning('삭제할 행을 선택하세요.');
      return;
    }
    try {
      const ids = checked.map(r => r.loginId);
      const count = await sysApi.deleteLoginHistories(ids);
      setRows(prev => prev.filter(r => !ids.includes(r.loginId)));
      message.success(`${count}건 삭제되었습니다.`);
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  const companyOptions = useMemo(() => [{ value: ALL, label: '전체' }, ...companies.map(c => ({ value: c.code, label: c.name }))], [companies]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 20, gap: 8, background: '#fff', boxSizing: 'border-box' }}>
      {/* [E1] retrieveButton[조회].Select (L101) → retrieve() */}
      <SearchBar onSearch={retrieve} onReset={() => { setStartDate(dayjs()); setCloseDate(dayjs()); setLoginMode(ALL); setCompanyCd(ALL); }}
        extra={<Button type="delete" onClick={deleteChecked}>삭제</Button>}>
        <SearchBar.Field label="조회기간">
          <DatePicker style={{ width: 140 }} allowClear={false} value={startDate} onChange={setStartDate} format="YYYY-MM-DD" />
          ~
          <DatePicker style={{ width: 140 }} allowClear={false} value={closeDate} onChange={setCloseDate} format="YYYY-MM-DD" />
        </SearchBar.Field>
        <SearchBar.Field label="접속구분">
          <SystemCodeComboBox kindCd="LoginModeCode" altCode={[ALL, '전체']} style={{ width: 100 }} value={loginMode} onChange={c => setLoginMode(c ?? ALL)} />
        </SearchBar.Field>
        <SearchBar.Field label="회사명">
          <Select style={{ width: 200 }} value={companyCd} options={companyOptions} onChange={setCompanyCd} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiGrid<LoginHistory>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.loginId)}
          // 콜백 L158-163: 첫 행이 있으면 select(0)
          onRowDataUpdated={e => e.api.getDisplayedRowAtIndex(0)?.setSelected(true, true)}
        />
      </div>
    </div>
  );
};
