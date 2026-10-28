/**
 * [1035] 경영관리 > 02. 휴가/출장 관리 > 연월차휴가 현황 (S07)
 * AS-IS: myApp/client/vi/emp/Emp20_Tab_YearList.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃(생성자 L69-150, SG): 테두리 박스 = 툴바(기준연도 · 월차 계산기준일 라디오 3 + 특정일 · 재직구분 · [조회][출력/다운로드]) + 연월차 그리드(2단 헤더, 앞 2열 고정)
 * [출력/다운로드]는 서비스 sys.Sys99_Print.insertRdYearList → RDViewer.viewer(mrd Emp20_Rd_YearList) — `rdApi` + `RdViewer`.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, Input, Radio, Select, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { empLeaveApi, empYearLeaveApi } from '@/api/emp';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { YearLeave } from '@/types/emp';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { SingleGrid, gbFor } from '@/components/grid';
import { RdViewer } from '@/components/lookup/RdViewer';

const gb = gbFor<YearLeave>();

const DATE_FORMAT = 'YYYY-MM-DD';
/** 재직구분 콤보 (retireTypeCombo L187-189) → retireType 코드 (retrieve L359-368) */
const RETIRE_TYPES: Record<string, string> = { 전체: '000', 재직: '100', 퇴직: '900' };

/** 묶음 헤더·열 제목 색 (setHtmlGridStyle / addXxx 마지막 인자) */
const MONTH_COLOR = '107C41';
const TOTAL_COLOR = '404040';
const USE_COLOR = '0069B4';
const REMAIN_COLOR = 'CE4242';
const head = (color: string) => ({ headerStyle: { color: `#${color}` } });
const bold = { cellStyle: { fontWeight: 'bold' } };

export const Emp20_Tab_YearList: React.FC = () => {
  const [rows, setRows] = useState<YearLeave[]>([]);
  const [loading, setLoading] = useState(false);
  const [rd, setRd] = useState<{ url: string; title: string } | null>(null);
  const [year, setYear] = useState(dayjs().format('YYYY'));
  const [leaveMonthCode, setLeaveMonthCode] = useState<string | null>(null);
  const [radioType, setRadioType] = useState('1');
  const [stdDate, setStdDate] = useState<Dayjs>(dayjs());
  const [retire, setRetire] = useState('재직');
  // radioCheck() L306-356: 기준연도를 바꾼 뒤에야 라디오가 막힌다(처음에는 모두 열려 있다)
  const [nowDisabled, setNowDisabled] = useState(false);
  const [dateDisabled, setDateDisabled] = useState(false);
  // 콤보 Collapse·라디오 변경처럼 상태 반영 전에 조회해야 하는 값
  const cur = useRef({ year, radioType, stdDate, retire, leaveMonthCode });
  cur.current = { year, radioType, stdDate, retire, leaveMonthCode };

  // retrieve() L358-392: 서비스 emp.Emp01_Person.selectByYearList(companyId, stdYear, monthStdDateType, stdDate, retireType)
  const retrieve = async (over: Partial<typeof cur.current> = {}) => {
    const v = { ...cur.current, ...over };
    // 특정일 체크시 연도는 기준연도와 동일해야 함. 결산월이 12월인 고객사만 체크
    if (v.radioType === '3' && v.leaveMonthCode === '12' && v.year !== v.stdDate.format('YYYY')) {
      message.info('특정일자의 연도가 기준연도와 다릅니다.');
      return;
    }
    setLoading(true);
    try {
      setRows(await empYearLeaveApi.search({ stdYear: v.year, monthStdDateType: v.radioType, stdDate: v.stdDate.format(DATE_FORMAT), retireType: RETIRE_TYPES[v.retire] }));
    } catch (err) {
      setRows([]);
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L69-150) → buttonBarSetting() L152-259: 기준연도(결산월 '03'이면 3월까지는 전년) → retrieve()
  useEffect(() => {
    void (async () => {
      let y = dayjs().format('YYYY');
      let code: string | null = null;
      try {
        const o = await empLeaveApi.getOption();
        code = o.leaveMonthCode;
        const now = dayjs();
        if (code === '03') y = String(now.month() + 1 <= 3 ? now.year() - 1 : now.year());
      } catch { /* 설정을 못 읽으면 올해로 조회 */ }
      setYear(y);
      setLeaveMonthCode(code);
      void retrieve({ year: y, leaveMonthCode: code });
    })();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E3] leaveYText.ValueChange (L178) → radioCheck() L306-356
  const radioCheck = () => {
    const curYear = dayjs().format('YYYY');
    if (curYear > year) {
      // 기준연도가 과거 : 기준연도말로만 조회가능
      if (radioType === '1' || radioType === '3') setRadioType('2');
      setNowDisabled(true);
      setDateDisabled(true);
    } else if (curYear < year) {
      // 기준연도가 미래 : 기준연도말, 특정일로 조회가능
      if (radioType === '1') setRadioType('2');
      setNowDisabled(true);
      setDateDisabled(false);
    } else {
      // 기준연도가 당해연도 : 모두 가능
      setNowDisabled(false);
      setDateDisabled(false);
    }
  };

  // [E1] toggleMonthStdDateType.ValueChange (L94-117) → radioType 바꾸고 특정일 활성화 → retrieve()
  const onRadio = (type: string) => {
    setRadioType(type);
    void retrieve({ radioType: type });
  };

  // [E6] downLoadButton[출력/다운로드].Select (L205) → 서비스 sys.Sys99_Print.insertRdYearList(companyId, personId, "Emp20_Tab_YearList", stdYear, monthStdDateType, stdDate, retireType)
  //   → 성공이면 RDViewer.viewer(mrd Emp20_Rd_YearList · options "/rpdflinebreak [1]" · rv rdGroupId·companyId·personId·Date(기준연도)·monthStdDateType)
  const downLoad = async () => {
    setLoading(true);
    try {
      const groupId = await empYearLeaveApi.rdPrint({ stdYear: year, monthStdDateType: radioType, stdDate: stdDate.format(DATE_FORMAT), retireType: RETIRE_TYPES[retire] });
      const res = await rdApi.buildUrl({
        kind: 'viewer',
        mrd: 'Emp20_Rd_YearList',
        options: '/rpdflinebreak [1]',
        rv: { rdGroupId: groupId, Date: year, monthStdDateType: radioType },
      });
      setRd({ url: res.url, title: '연월차휴가 현황' });
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    } finally {
      setLoading(false);
    }
  };

  const columnDefs = useMemo(() => [
    { ...gb.textCenter('empNo', 70, '사번'), pinned: 'left' as const },
    { ...gb.textCenter('korName', 90, '성명'), pinned: 'left' as const },
    gb.date('hireDateLeaveCalc', 90, '입사일자'),
    gb.group('연차', [
      gb.textRight('yearPeriod', 90, '근무기간'),
      gb.double('yearPer', 70, '근무년수'),
      gb.double('yearLeaveDays', 70, '휴가일수'),
    ]),
    { ...gb.group('월차', [
      { ...gb.textCenter('monthPeriod', 80, '근무기간'), ...head(MONTH_COLOR) },
      { ...gb.double('monthLeaveDays', 70, '휴가일수'), ...head(MONTH_COLOR) },
      { ...gb.double('pyRemainMonthDays', 70, '전년도<br>미사용'), ...head(MONTH_COLOR) },
    ]), ...head(MONTH_COLOR) },
    { ...gb.double('totalDays', 70, '발생휴가'), ...bold, ...head(TOTAL_COLOR) },
    { ...gb.group('사용휴가', [
      { ...gb.double('useYearDays', 70, '연차'), ...head(USE_COLOR) },
      { ...gb.double('useMonthDays', 70, '월차'), ...head(USE_COLOR) },
      { ...gb.double('useDays', 70, '계', bold), ...head(USE_COLOR) },
    ]), ...head(USE_COLOR) },
    { ...gb.group('잔여휴가', [
      { ...gb.double('remainYearDays', 70, '연차'), ...head(REMAIN_COLOR) },
      { ...gb.double('remainMonthDays', 70, '월차'), ...head(REMAIN_COLOR) },
      { ...gb.double('remainDays', 70, '계', bold), ...head(REMAIN_COLOR) },
    ]), ...head(REMAIN_COLOR) },
    gb.group('포상휴가', [
      gb.long('rewardTotalDays', 70, '발생'),
      gb.long('rewardUseDays', 70, '사용'),
      gb.long('rewardRemainDays', 70, '잔여'),
    ]),
    gb.double('spcDays', 70, '특별휴가'),
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E5] retrieveButton[조회].Select (L199) → retrieve() */}
        <SearchBar
          onSearch={() => void retrieve()}
          loading={loading}
          extra={<Button type="download" onClick={downLoad}>출력/다운로드</Button>}
        >
          <SearchBar.Field label="기준연도">
            {/* [E2] leaveYText.KeyPress [Enter] (L170) → retrieve() */}
            <Input
              style={{ width: 60 }}
              maxLength={4}
              placeholder="YYYY"
              value={year}
              onChange={e => setYear(e.target.value)}
              onPressEnter={() => void retrieve()}
              onBlur={radioCheck}
            />
          </SearchBar.Field>
          <SearchBar.Field label="월차 계산기준일">
            <Radio.Group value={radioType} onChange={e => onRadio(e.target.value)}>
              <Radio value="1" disabled={nowDisabled}>현재</Radio>
              <Radio value="2">기준연도말</Radio>
              <Radio value="3" disabled={dateDisabled}>특정일</Radio>
            </Radio.Group>
            <DatePicker style={{ width: 120 }} allowClear={false} disabled={radioType !== '3'} value={stdDate} onChange={d => d && setStdDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="재직구분">
            {/* [E4] retireTypeCombo[재직].Collapse (L192) → retrieve() */}
            <Select
              style={{ width: 100 }}
              value={retire}
              options={Object.keys(RETIRE_TYPES).map(k => ({ value: k, label: k }))}
              onChange={v => { cur.current = { ...cur.current, retire: v }; setRetire(v); }}
              onOpenChange={open => { if (!open) void retrieve(); }}
            />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<YearLeave> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.personId)} />
        </div>
      </div>
      <RdViewer url={rd?.url ?? null} title={rd?.title ?? ''} onClose={() => setRd(null)} />
    </div>
  );
};
