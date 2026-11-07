/**
 * [1355] 커뮤니티 > 04. 업무보고 > 주간업무보고 확인 (Z12)
 * AS-IS: myApp/client/vi/rpt/Rpt04_Tab_WeekConfirm.java (373줄) + Rpt04_Lookup_WeekConfirm (316줄, 확인 창) + Org00_Lookup_SelectSingle(공용) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L71-103: center(여백 20, 테두리) = 툴바 50(보고주간 연 45 + 월 콤보 60 + 주차 콤보 220 · 부서 180 · "미확인건만 조회" · [조회]) + 주간업무 확인 그리드(행번호, 단일 선택)
 * 스타일: SG (견본 — docs/page-style/SG/Tdm01_Tab_Hr.tsx)
 * RD: [주간업무보기]는 `sys99_print`를 채워 Rpt04_Lookup_WeekConfirm 안에 mrd Rpt04_Rd_WeekConfirm을 띄운다(docs/RD-대책.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 넣지 않는다
 * 12 화면우선원칙과 SG 견본이 다른 곳(안쪽 padding 10)은 03 원칙 22에 따라 견본을 따른다
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Checkbox, Input, message, Select } from 'antd';
import dayjs from 'dayjs';
import { rptWeekApi, rptWeekConfirmApi } from '@/api/rpt';
import { orgApi } from '@/api/emp';
import { aprApi } from '@/api/apr';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { RptWeekCode, RptWeekConfirm } from '@/types/rpt';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Org00_Lookup_SelectSingle } from '@/components/lookup/Org00_Lookup_SelectSingle';
import { SearchBar } from '@/components/search';
import { Rpt04_Lookup_WeekConfirm } from './Rpt04_Lookup_WeekConfirm';

const gb = gbFor<RptWeekConfirm>();
const DATE = 'YYYY-MM-DD';

export const Rpt04_Tab_WeekConfirm: React.FC = () => {
  const [rows, setRows] = useState<RptWeekConfirm[]>([]);
  const [target, setTarget] = useState<RptWeekConfirm | null>(null);
  const [rdUrl, setRdUrl] = useState<string | null>(null);
  const [orgOpen, setOrgOpen] = useState(false);

  // settings() L105-166: 미확인건만 조회 = 해제 · 보고주간 연 = 올해 · 월 = 이번 달 · 부서 = 로그인 사원 조직
  const [confirmCheck, setConfirmCheck] = useState(false);
  const [year, setYear] = useState(() => dayjs().format('YYYY'));
  const [month, setMonth] = useState<string>(() => dayjs().format('MM'));
  const [weeks, setWeeks] = useState<RptWeekCode[]>([]);
  const [weekCode, setWeekCode] = useState<string | undefined>(undefined);
  const [weekText, setWeekText] = useState<string | undefined>(undefined);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [closeDate, setCloseDate] = useState<string | null>(null);
  // 로그인 사원의 조직(AS-IS LoginUser.getOrgCodeId()) — 화면이 열릴 때 서버에서 읽는다. user.deptId 는 아직 설정값("D101" 같은 글자)이라 숫자로 못 쓴다
  const [orgCodeId, setOrgCodeId] = useState<number | null>(null);
  const [orgName, setOrgName] = useState('');

  // retrieve() L189-217: 서비스 rpt.Rpt03_Week.selectByCompanyId(companyId는 서버, startDate, orgCodeId, confirmYn = 미확인건만)
  const retrieveWeek = useCallback(async (s: string | null, org: number | null, unconfirmed: boolean) => {
    if (!s) return;
    try {
      setRows(await rptWeekConfirmApi.search(s, org, unconfirmed));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);
  const retrieve = () => retrieveWeek(startDate, orgCodeId, confirmCheck);

  const loadWeeks = useCallback(async (y: string, m: string) => {
    try {
      setWeeks(await rptWeekApi.getWeekList(y, m));
    } catch (err) {
      message.error(errorMessage(err, '주차 조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (생성자 L71-103) → settings(), getWeekDays(오늘) L308-334: 이번 주 월~금과 주차 글자를 채우고 retrieve()
  useEffect(() => {
    void (async () => {
      await loadWeeks(year, month);
      // 회사관리자 등 조직이 없으면(0) 부서 없이 전체를 조회한다
      let myOrg: number | null = null;
      try {
        const id = await aprApi.getMyOrgCodeId();
        myOrg = id > 0 ? id : null;
      } catch { /* 부서 없이 전체 */ }
      setOrgCodeId(myOrg);
      // settings() L149-153: 부서 칸 = 로그인 사원 조직의 이름
      try {
        const orgs = await orgApi.searchOrgInfos('', dayjs().format(DATE));
        const mine = orgs.find(o => o.orgCodeId === myOrg);
        if (mine) setOrgName(mine.korNm ?? '');
      } catch { /* 이름만 비워 둔다 */ }
      try {
        const days = await rptWeekApi.getWeekDays(dayjs().format(DATE));
        setStartDate(days.startDate);
        setCloseDate(days.closeDate);
        setWeekCode(`${days.startDate}|${days.closeDate}`);
        setWeekText(`${days.weekNumber}주차 (${days.startDate} ~ ${days.closeDate})`);
        await retrieveWeek(days.startDate, myOrg, false);
      } catch {
        message.warning('날짜를 가져올 수 없습니다.');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E1] monthComboBox[MonthsCode].Collapse (L123) → 주차 콤보를 비우고 연·월로 다시 읽는다(조회는 하지 않는다)
  const onMonthChange = (code: string) => {
    setMonth(code);
    setWeekCode(undefined);
    setWeekText(undefined);
    void loadWeeks(year, code);
  };
  // [E2] weekComboBox[sys.Sys00_Common.selectWeekListByMonth].Collapse (L137) → startDate·closeDate = "시작일|종료일", retrieve()
  const onWeekChange = (code: string) => {
    const [s, c] = code.split('|');
    setWeekCode(code);
    setStartDate(s);
    setCloseDate(c);
    void retrieveWeek(s, orgCodeId, confirmCheck);
  };

  // [E3] orgField.TriggerClick (L153) → lookupOrg() L219-241: 월이 '%'(전체)면 기준일 오늘, 아니면 그 달 1일 → Org00_Lookup_SelectSingle.open(기준일, 전체 버튼)
  const orgBaseDate = month === '%' ? dayjs().format(DATE) : `${year}-${month}-01`;

  // fixCheck(action) L336-365: 선택 행 사원의 제출여부(rpt.Rpt03_Week.selectByStartDate) — 제출이 아니면 안내 뒤 다시 조회
  const fixCheck = async (row: RptWeekConfirm, action: () => Promise<void>) => {
    if (!startDate || !closeDate) return;
    try {
      if (await rptWeekConfirmApi.isFixed(row.personId, startDate, closeDate)) {
        await action();
      } else {
        message.warning('제출 취소된 보고입니다. 다시 확인해주세요.');
        void retrieve();
      }
    } catch (err) {
      message.error(errorMessage(err, '상태 확인 실패'));
    }
  };

  // lookUpRd() L243-306: 서비스 rpt.Rpt03_Week.getLastWeek + sys.Sys99_Print.insertRdWeekConfirm(windowClassName "Rpt04_Tab_WeekConfirm")
  //   → Rpt04_Lookup_WeekConfirm.open(RD 그룹, 선택 행, callback → retrieve())
  //   → RD(dns admin · CommonViewer.html · mrd Rpt04_Rd_WeekConfirm · options "/rhtmlimportopt [2]" · rv rdGroupId·orgName·personName·startDate·closeDate·lastStartDate·lastCloseDate)
  const lookUpRd = async (row: RptWeekConfirm) => {
    if (!startDate || !closeDate) return;
    try {
      const print = await rptWeekConfirmApi.rdPrint(row.personId, startDate);
      const md = (d: string) => dayjs(d).format('MM/DD');
      const res = await rdApi.buildUrl({
        kind: 'viewer',
        mrd: 'Rpt04_Rd_WeekConfirm',
        options: '/rhtmlimportopt [2]',
        rv: {
          rdGroupId: print.groupId,
          orgName: row.orgName ?? '',
          personName: row.personName ?? '',
          startDate: md(startDate),
          closeDate: md(closeDate),
          lastStartDate: print.lastStartDate ? md(print.lastStartDate) : '0/0',
          lastCloseDate: print.lastCloseDate ? md(print.lastCloseDate) : '0/0',
        },
      });
      setRdUrl(res.url);
      setTarget(row);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // buildGrid() L168-187 (단일 선택, 행번호 있음)
  const columnDefs = useMemo(() => [
    gb.text('orgName', 180, '부서'),  // L179
    gb.textCenter('personName', 100, '작성자'),  // L180
    // L181 addCell(ImageCell "view") → fixCheck(), lookUpRd()
    iconCell<RptWeekConfirm>('view', 'actionCell', 80, '주간업무보기', row => void fixCheck(row, () => lookUpRd(row))),
    gb.textCenter('confirmer', 100, '확인자'),  // L182
    gb.text('confirmDateStr', 200, '확인일시'),  // L183
    gb.textArea('confirmNote', 700, '확인자 메모'),  // L184 addTextArea
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [startDate, closeDate, orgCodeId, confirmCheck]);

  const closeLookup = () => {
    setTarget(null);
    setRdUrl(null);
    void retrieve();
  };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
     <div style={{ height: '100%', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* [E4] retrieveButton[조회].Select (L160) → retrieve() */}
      <SearchBar onSearch={() => retrieve()}>
        <SearchBar.Field label="보고주간">
          <Input style={{ width: 60 }} maxLength={4} value={year} onChange={e => setYear(e.target.value)} />
          <SystemCodeComboBox kindCd="MonthsCode" allowClear={false} style={{ width: 80 }} value={month} onChange={c => { if (c) onMonthChange(c); }} />
          <Select
            style={{ width: 220 }}
            value={weekCode}
            placeholder={weekText}
            options={[...(weekCode && !weeks.some(w => w.code === weekCode) ? [{ value: weekCode, label: weekText }] : []), ...weeks.map(w => ({ value: w.code, label: w.name }))]}
            onChange={onWeekChange}
          />
        </SearchBar.Field>
        <SearchBar.Field label="부서">
          <LookupInput width={180} value={orgName} onOpen={() => setOrgOpen(true)} />
        </SearchBar.Field>
        <Checkbox checked={confirmCheck} onChange={e => setConfirmCheck(e.target.checked)}>미확인건만 조회</Checkbox>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<RptWeekConfirm> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.personId)} />
      </div>
     </div>
      <Rpt04_Lookup_WeekConfirm model={target} url={rdUrl} onClose={closeLookup} onChanged={() => void retrieve()} />
      {orgOpen && (
        <Org00_Lookup_SelectSingle
          baseDate={orgBaseDate}
          fixDate={false}
          allButton
          onAll={() => { setOrgCodeId(null); setOrgName('전체'); }}
          onClose={() => setOrgOpen(false)}
          onSelect={org => { setOrgCodeId(org.orgCodeId); setOrgName(org.korNm ?? ''); }}
        />
      )}
    </div>
  );
};
