/**
 * [1225] 관리회계 > 22. 재무제표 > 금감원보고용 재무제표 (X22)
 * AS-IS: myApp/client/vi/act/Act04_Tab_ReportFSS.java (133줄) + Act04_Rd_ReportFSS(RD 영역) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L39-95: north(높이 50, 여백 20/20/0/20) = 툴바(기준년월 70 "YYYY.MM" 기본 이번 달 · 구분 콤보 170(FssGACode, 처음 "재무상태표(GA023)") · [조회]), center(여백 0/22/20/20) = RD 영역. 열 때 한 번 조회한다
 * 스타일: SR (견본 Emp01_Tab_InoutState — docs/page-style.md) UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import { actApi } from '@/api/act';
import { errorMessage } from '@/api/client';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Act04_Rd_ReportFSS, ReportFssRdHandle } from './Act04_Rd_ReportFSS';

const WINDOW_CLASS_NAME = 'Act04_Tab_ReportFSS';

export const Act04_Tab_ReportFSS: React.FC = () => {
  // 기준년월 기본 = 오늘이 속한 달 (L40-46), 구분 = 재무상태표(GA023) (L56-59)
  const [yyyyMM, setYyyyMM] = useState(() => dayjs().format('YYYY.MM'));
  const [code, setCode] = useState('GA023');
  const [loading, setLoading] = useState(false);
  const rdRef = useRef<ReportFssRdHandle>(null);

  // getCloseDate() L122-128: 기준년월 말일 ("-"는 "."으로 바꿔 읽는다)
  const getCloseDate = () => {
    const d = dayjs(`${yyyyMM.replace(/-/g, '.')}.01`.replace(/\./g, '-'));
    return d.isValid() ? d.add(1, 'month').subtract(1, 'day') : null;
  };

  // retrieve() L97-120: sys.Sys99_Print.insertRdReportFSS(companyId, personId, windowClassName, stdDate, code) → 성공하면 RD 영역에 보고서(rdGroupId)
  const retrieve = async (codeValue = code) => {
    const close = getCloseDate();
    if (!close) { message.info('기준년월을 확인하세요.'); return; }
    setLoading(true);  // rdForm.mask("Loading")
    try {
      const stdDate = close.format('YYYY-MM-DD');
      const groupId = await actApi.insertGenLedgerFssRd({ windowClassName: WINDOW_CLASS_NAME, stdDate, code: codeValue });
      await rdRef.current?.retrieve({ stdDate, code: codeValue }, String(groupId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L39-95) → retrieve()
  // [E2] codeComboBox (ComboBoxField).callbackOnCreate (L56) → 콤보가 만들어지면 "재무상태표(GA023)"로 두고 retrieve() — 고르는 것만으로는 조회하지 않는다
  useEffect(() => { void retrieve(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20, background: '#fff', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* [E3] retrieveButton[조회].Select (L77) → retrieve() */}
      <SearchBar onSearch={() => retrieve()} loading={loading}>
        <SearchBar.Field label="기준년월">
          {/* [E1] yyyyMM.KeyPress [Enter] (L47) → retrieve() — SearchBar.Input이 Enter 조회 */}
          <SearchBar.Input style={{ width: 100 }} placeholder="YYYY.MM" value={yyyyMM} onChange={e => setYyyyMM(e.target.value)} />
        </SearchBar.Field>
        <SearchBar.Field label="구분">
          <SystemCodeComboBox kindCd="FssGACode" style={{ width: 170 }} value={code} onChange={c => setCode(c ?? 'GA023')} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Act04_Rd_ReportFSS ref={rdRef} />
      </div>
    </div>
  );
};
