/**
 * [1340] 준법감시 > 01. 법규관리 > 법규보고 점검(관리자) (H12)
 * AS-IS: myApp/client/vi/sch/Sch04_Tab_IcsListManager.java (463줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * H06 `Sch04_Tab_IcsList`의 관리자용 짝. 같은 SQL(sch04_list.selectByIcs)을 managerYn=true로 부른다.
 * 레이아웃 L97-137: center=세로(툴바 50 + 툴바 40 + 그리드) — 마감월(년 + 월 콤보; 시작일·마감일은 감춰져 있고 년·월로 정한다) · 담당부서(조회창, 200, "전체") ·
 *   발생구분 · 주기구분 · [조회] [출력/다운로드] / 검색 393 · [완료건 제외] · [일임(자문)관련 법규만 조회].
 *   그리드는 단일 선택이고 setChecked가 주석 처리돼 체크박스가 없으며(L309), 편집하는 열이 없다(처리구분·처리일 편집기 주석 처리, L313-314). [저장] 없음.
 *   아이콘 열 3(처리결과 확인처리 · 법규 보기 · 원인문서 보기)
 * 연결: Sch04_Lookup_IcsMsg(확인자, actionType "2") · Ics01_Lookup_ClassTreeDetail · Icr01_Lookup_ClassTreeDetail · Org00_Lookup_SelectMulti(담당부서, [전체]·한 조직)
 *   · Apr01_Edit_ApprDoc(원인문서 보기)는 다른 도메인이라 1단계에서는 원본의 사전 검사 메시지까지만 하고 안내를 띄운다.
 * 출력/다운로드는 RD 리포트(Sch04_Rd_IcsList) 대신 조회 결과를 그리드 열 순서로 xlsx에 쓴다(H06과 같은 방식).
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 박스 안 여백 = 11 §5(padding 10·gap 8). 초기화(UX-02)는 조건이 길어 줄바꿈 위험이라 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, Input, message } from 'antd';
import dayjs from 'dayjs';
import { schApi } from '@/api/sch';
import { errorMessage } from '@/api/client';
import { Sch04List, Sch04ListManagerSearch } from '@/types/sch';
import { OrgInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Org00_Lookup_SelectMulti } from '@/components/lookup/Org00_Lookup_SelectMulti';
import { Ics01_Lookup_ClassTreeDetail } from '@/components/lookup/Ics01_Lookup_ClassTreeDetail';
import { Icr01_Lookup_ClassTreeDetail } from '@/components/lookup/Icr01_Lookup_ClassTreeDetail';
import { Sch04_Lookup_IcsMsg } from '@/components/lookup/Sch04_Lookup_IcsMsg';

const gb = gbFor<Sch04List>();
const ALL_CODE: [string, string] = ['%', '전체'];  // CommonComboBoxField(…, "%", "전체", "전체")·ComboBoxField("IcsCycleClass", "%", "전체")

const pad2 = (n: number) => String(n).padStart(2, '0');

/** setDate() L443-450: 조회월의 1일 ~ 말일 (yyyy-MM-dd). 년이 숫자가 아니면 null */
function monthRange(year: string, month: string): [string, string] | null {
  const y = Number(year.trim());
  const m = Number(month);
  if (!Number.isInteger(y) || y < 1 || y > 9999 || !Number.isInteger(m) || m < 1 || m > 12) return null;
  const last = new Date(y, m, 0).getDate();
  const ym = `${String(y).padStart(4, '0')}-${pad2(m)}`;
  return [`${ym}-01`, `${ym}-${pad2(last)}`];
}

export const Sch04_Tab_IcsListManager: React.FC = () => {
  const today = useMemo(() => new Date(), []);
  const [year, setYear] = useState(String(today.getFullYear()));
  const [month, setMonth] = useState(pad2(today.getMonth() + 1));
  const [org, setOrg] = useState<{ orgId: number; orgName: string } | null>(null);  // orgId·orgLookup (L85-86) — 없으면 "전체"
  const [orgOpen, setOrgOpen] = useState(false);
  const [scheduleCode, setScheduleCode] = useState('%');
  const [cycleCode, setCycleCode] = useState('%');
  const [searchText, setSearchText] = useState('');
  const [exceptYn, setExceptYn] = useState(false);
  const [advisYn, setAdvisYn] = useState(false);
  const [rows, setRows] = useState<Sch04List[]>([]);
  const [loading, setLoading] = useState(false);
  const [msgRow, setMsgRow] = useState<Sch04List | null>(null);
  const [lawRow, setLawRow] = useState<Sch04List | null>(null);

  // 콤보를 닫는 순간(Collapse)에는 방금 고른 값이 아직 state에 반영되지 않았을 수 있어 ref로 최신 값을 읽는다
  const latest = useRef({ year, month, org, scheduleCode, cycleCode, searchText, exceptYn, advisYn });
  latest.current = { year, month, org, scheduleCode, cycleCode, searchText, exceptYn, advisYn };

  const condition = (): Sch04ListManagerSearch | null => {
    const c = latest.current;
    const range = monthRange(c.year, c.month);  // setDate()
    if (!range) return null;
    return {
      orgId: c.org?.orgId ?? null, startDate: range[0], closeDate: range[1], doneExceptYn: c.exceptYn,
      scheduleCode: c.scheduleCode, cycleCode: c.cycleCode, searchText: c.searchText, advisYn: c.advisYn,
    };
  };

  // retrieve() L330-352: sch.Sch04_List.selectByIcs (managerYn=true)
  const retrieve = useCallback(async () => {
    const cond = condition();
    if (!cond) return;
    setLoading(true);
    try {
      setRows(await schApi.searchIcsListManager(cond));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E0] 화면 열림 (생성자 L93-138) → setting() L140-272: 년 = 올해, 월 = 이번 달, 발생구분·주기구분 "전체", 담당부서 "전체" — 열자마자 조회하지 않는다
  //   (issTypeComboBox 콜백의 retrieve()가 주석 처리돼 있다 L170)
  useEffect(() => { /* 조회 없음 */ }, []);

  // [E6] searchText.KeyPress [Enter] (L203)·[E7] searchButton[조회].Select (L218) → retrieve() L330-352
  const doRetrieve = () => retrieve();

  // [E5] orgLookup.TriggerClick (L194) → lookupOrg() L424-441: Org00_Lookup_SelectMulti.open(시작일, true) — 고른 조직(parentFullName) / [전체]면 지움
  const selectOrg = (orgs: OrgInfo[]) => {
    const o = orgs[0];
    setOrg(o ? { orgId: o.orgCodeId, orgName: o.parentFullNm ?? o.korNm ?? '' } : null);
    setOrgOpen(false);
  };

  // [E8] rdButton[출력/다운로드].Select (L225) → sys.Sys99_Print.insertRdIcsList(managerYn=true) + RD 리포트 Sch04_Rd_IcsList: 조회 조건 그대로 xlsx 받기
  const download = async () => {
    const cond = condition();
    if (!cond) return;
    try {
      await schApi.downloadIcsListManagerExcel(cond, `법규보고 점검(관리자)(${cond.startDate} ~ ${cond.closeDate}).xlsx`);
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    }
  };

  // viewLaw() L354-365: 발생구분 2·3 → Ics01_Lookup_ClassTreeDetail.open(icsClassTreeId), 6·7 → Icr01_Lookup_ClassTreeDetail.open(icsClassTreeId)
  const viewLaw = (row: Sch04List) => setLawRow(row);

  // viewAppr() L367-395: 원인문서가 없으면 "원인문서가 존재하지 않습니다", 있으면 ApprCallbackResult → Apr01_Edit_ApprDoc.retrieveApproval(model, false, …)
  // [생략] 전자결재 편집창(Apr01_Edit_ApprDoc)은 다른 도메인이라 다음 단계에서 연결한다 — 열람권한 검사("해당문서의 열람권한이 없습니다")도 그때
  const viewAppr = (row: Sch04List) => {
    if (row.issApprId == null) {
      message.warning('원인문서가 존재하지 않습니다');
      return;
    }
    message.info('전자결재 문서 보기 창은 다음 단계에서 연결됩니다');
  };

  // editResult() L397-422: 처리구분이 1·2·5가 아니면 "미처리내역 입니다." — 아니면 Sch04_Lookup_IcsMsg.open("2", row, callback → 확인자·확인일·확인여부만 행에 반영)
  const editResult = (row: Sch04List) => {
    if (!['1', '2', '5'].includes(row.statusCode ?? '')) {
      message.warning('미처리내역 입니다.');
      return;
    }
    setMsgRow(row);
  };

  const onMsgResult = (r: Sch04List) => {
    if (!msgRow) return;
    setRows(prev => prev.map(x => (x.listId === msgRow.listId
      ? { ...x, confirmerId: r.confirmerId, confirmerName: r.confirmerName, confirmDate: r.confirmDate, confirmYn: r.confirmYn }
      : x)));
  };

  // [E9 생략] statusComboBox[ScheduleStatusCode].Collapse (L278) — 처리구분 열의 편집기가 주석 처리돼(L313) 연결되지 않는다(색인도 도달 불가)
  // buildGrid() L274-328 (단일 선택, 편집 열 없음)
  const columnDefs = useMemo(() => [
    gb.date('closeDate', 90, '마감일'),  // L310
    gb.text('mngOrgName', 120, '담당부서'),  // L311
    gb.textCenter('personName', 90, '처리자'),  // L312
    gb.textCenter('statusName', 100, '처리구분'),  // L313 (편집기 주석 처리)
    gb.date('manageDate', 90, '처리일'),  // L314 (편집기 주석 처리)
    // L315 actionCell(Edit) → editResult()
    iconCell<Sch04List>('edit', 'actionCellResult', 70, '처리결과<br>확인처리', editResult),
    gb.booleanYn2('confirmYn', 70, '확인여부'),  // L316
    gb.textArea('title', 350, '법규명'),  // L317
    iconCell<Sch04List>('view', 'actionCellLaw', 30, '', viewLaw),  // L318 → viewLaw()
    gb.textArea('relatedLaw', 200, '관련조문'),  // L319
    gb.textArea('apprTitle', 250, '원인문서'),  // L320
    iconCell<Sch04List>('view', 'actionCellAppr', 30, '', viewAppr),  // L321 → viewAppr()
    gb.date('issDate', 90, '발생일'),  // L322
    gb.textCenter('scheduleName', 100, '발생구분'),  // L323
    gb.textCenter('cycleName', 100, '주기구분'),  // L324
    gb.booleanYn2('advisYn', 60, '일임<br>(자문)'),  // L325
  ], []);  // eslint-disable-line react-hooks/exhaustive-deps

  const lawIcs = lawRow && ['2', '3'].includes(lawRow.scheduleCode ?? '') ? lawRow.icsClassTreeId ?? null : null;
  const lawIcr = lawRow && ['6', '7'].includes(lawRow.scheduleCode ?? '') ? lawRow.icsClassTreeId ?? null : null;

  const range = monthRange(year, month);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar
          onSearch={() => doRetrieve()}
          searchText="조회"
          loading={loading}
          extra={(
            /* [E8] rdButton[출력/다운로드] */
            <Button type="download" onClick={download}>출력/다운로드</Button>
          )}
        >
          <SearchBar.Field label="마감월">
            {/* [E1] year.ValueChange (L145) → setDate() — 조회할 때 년·월로 기간을 만든다 */}
            <Input style={{ width: 62 }} maxLength={4} value={year} onChange={e => setYear(e.target.value)} />
            {/* [E2] monthComboBox[MonthsCode].Collapse (L154) → setDate(), retrieve() */}
            <SystemCodeComboBox
              kindCd="MonthsCode" allowClear={false} style={{ width: 70 }}
              value={month} onChange={v => { if (v) { latest.current.month = v; setMonth(v); } }}
              onOpenChange={open => { if (!open) void retrieve(); }}
            />
          </SearchBar.Field>
          <SearchBar.Field label="담당부서">
            <LookupInput value={org?.orgName ?? ''} empty={['전체']} placeholder="전체" width={200} onOpen={() => setOrgOpen(true)} onClear={() => setOrg(null)} />
          </SearchBar.Field>
          <SearchBar.Field label="발생구분">
            {/* [E3] issTypeComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L174) → retrieve() */}
            <SystemCodeComboBox
              kindGroupCd="ScheduleCode0001" altCode={ALL_CODE} style={{ width: 120 }}
              value={scheduleCode} onChange={v => { latest.current.scheduleCode = v ?? '%'; setScheduleCode(v ?? '%'); }}
              onOpenChange={open => { if (!open) void retrieve(); }}
            />
          </SearchBar.Field>
          <SearchBar.Field label="주기구분">
            {/* [E4] cycleComboBox[IcsCycleClass].Collapse (L183) → retrieve() */}
            <SystemCodeComboBox
              kindCd="IcsCycleClass" altCode={ALL_CODE} style={{ width: 100 }}
              value={cycleCode} onChange={v => { latest.current.cycleCode = v ?? '%'; setCycleCode(v ?? '%'); }}
              onOpenChange={open => { if (!open) void retrieve(); }}
            />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 393 }} placeholder="담당부서/처리자/법규명/관련조문/원인문서" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
          <Checkbox checked={exceptYn} onChange={e => setExceptYn(e.target.checked)}>완료건 제외</Checkbox>
          <Checkbox checked={advisYn} onChange={e => setAdvisYn(e.target.checked)}>일임(자문)관련 법규만 조회</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<Sch04List>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.listId)}
            loading={loading}
          />
        </div>
      </div>
      <Org00_Lookup_SelectMulti
        baseDate={orgOpen ? (range?.[0] ?? dayjs().format('YYYY-MM-DD')) : undefined}
        allButton
        onSelect={selectOrg}
        onAll={() => selectOrg([])}
        onClose={() => setOrgOpen(false)}
      />
      <Sch04_Lookup_IcsMsg
        row={msgRow}
        actionType="2"
        onResult={onMsgResult}
        onClose={() => setMsgRow(null)}
      />
      <Ics01_Lookup_ClassTreeDetail classTreeId={lawIcs} onClose={() => setLawRow(null)} />
      <Icr01_Lookup_ClassTreeDetail classTreeId={lawIcr} onClose={() => setLawRow(null)} />
    </div>
  );
};
