/**
 * [1337] 준법감시 > 00. 법규정보 > 법규보고 점검 (H06)
 * AS-IS: myApp/client/vi/sch/Sch04_Tab_IcsList.java (476줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L97-131: center=세로(툴바 50 + 그리드) — 마감월(년 + 월 콤보; 시작일·마감일은 감춰져 있고 년·월로 정한다) · 발생구분 · 주기구분 · 검색 250 ·
 *   [완료건 제외] · [일임(자문)관련 법규만 조회] · [조회] [저장] [출력/다운로드]. 그리드는 단일 선택(setChecked가 주석 처리돼 체크박스 없음)이고
 *   처리구분(콤보)·처리일(날짜) 두 열만 셀 편집한다. 아이콘 열 3(처리결과 편집·법규 보기·원인문서 보기)
 * 연결: Sch04_Lookup_IcsMsg(처리결과, actionType "1") · Ics01_Lookup_ClassTreeDetail · Icr01_Lookup_ClassTreeDetail
 *   · Apr01_Edit_ApprDoc(원인문서 보기)는 다른 도메인이라 1단계에서는 원본의 사전 검사 메시지까지만 하고 안내를 띄운다.
 * 출력/다운로드는 RD 리포트(Sch04_Rd_IcsList) 대신 조회 결과를 그리드 열 순서로 xlsx에 쓴다(Apr01 목록 화면과 같은 방식).
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 저장(n)(UX-03). 박스 안 여백 = 11 §5(padding 10·gap 8). 초기화(UX-02)는 조건이 길어 줄바꿈 위험이라 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, Input, message } from 'antd';
import { schApi } from '@/api/sch';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Sch04List, Sch04ListSearch } from '@/types/sch';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Ics01_Lookup_ClassTreeDetail } from '@/components/lookup/Ics01_Lookup_ClassTreeDetail';
import { Icr01_Lookup_ClassTreeDetail } from '@/components/lookup/Icr01_Lookup_ClassTreeDetail';
import { Sch04_Lookup_IcsMsg } from '@/components/lookup/Sch04_Lookup_IcsMsg';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<Sch04List>();
const ALL_CODE: [string, string] = ['%', '전체'];  // CommonComboBoxField(…, "%", "전체", "전체")·ComboBoxField("IcsCycleClass", "%", "전체")
const CONFIRMED_MSG = '관리자 확인이 완료되어 변경할 수 없습니다';
const EDIT_COLS = ['statusName', 'manageDate'];

const pad2 = (n: number) => String(n).padStart(2, '0');

/** setDate() L459-466: 조회월의 1일 ~ 말일 (yyyy-MM-dd). 년이 숫자가 아니면 null */
function monthRange(year: string, month: string): [string, string] | null {
  const y = Number(year.trim());
  const m = Number(month);
  if (!Number.isInteger(y) || y < 1 || y > 9999 || !Number.isInteger(m) || m < 1 || m > 12) return null;
  const last = new Date(y, m, 0).getDate();
  const ym = `${String(y).padStart(4, '0')}-${pad2(m)}`;
  return [`${ym}-01`, `${ym}-${pad2(last)}`];
}

export const Sch04_Tab_IcsList: React.FC = () => {
  const today = useMemo(() => new Date(), []);
  const [year, setYear] = useState(String(today.getFullYear()));
  const [month, setMonth] = useState(pad2(today.getMonth() + 1));
  const [scheduleCode, setScheduleCode] = useState('%');
  const [cycleCode, setCycleCode] = useState('%');
  const [searchText, setSearchText] = useState('');
  const [exceptYn, setExceptYn] = useState(false);
  const [advisYn, setAdvisYn] = useState(false);
  const [statusCodes, setStatusCodes] = useState<Code[]>([]);
  const [msgRow, setMsgRow] = useState<Sch04List | null>(null);
  const [lawRow, setLawRow] = useState<Sch04List | null>(null);

  // 콤보를 닫는 순간(Collapse)에는 방금 고른 값이 아직 state에 반영되지 않았을 수 있어 ref로 최신 값을 읽는다
  const latest = useRef({ year, month, scheduleCode, cycleCode, searchText, exceptYn, advisYn });
  latest.current = { year, month, scheduleCode, cycleCode, searchText, exceptYn, advisYn };

  const condition = (): Sch04ListSearch | null => {
    const c = latest.current;
    const range = monthRange(c.year, c.month);  // setDate()
    if (!range) return null;
    return { startDate: range[0], closeDate: range[1], doneExceptYn: c.exceptYn, scheduleCode: c.scheduleCode, cycleCode: c.cycleCode, searchText: c.searchText, advisYn: c.advisYn };
  };

  // retrieve() L331-353: sch.Sch04_List.selectByIcs
  const search = useCallback(async (): Promise<Sch04List[]> => {
    const cond = condition();
    return cond ? schApi.searchIcsList(cond) : [];
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // update() L355-389: sch.Sch04_List.upsert(personId) 뒤 retrieve()
  const save = useCallback(async (changed: Sch04List[]) => {
    await schApi.upsertIcsList(changed);
    return changed;
  }, []);

  const crud = useGridCrud<Sch04List>({
    idField: 'listId',
    search,
    save,
    remove: async () => undefined,  // 삭제 기능 없음
    newRow: () => ({}),
    reloadAfterSave: true,
    // L368-372: 처리구분이 미처리("0")가 아닌데 처리일이 없으면 "처리일을 입력하세요"
    validate: changed => (changed.some(r => r.statusCode !== '0' && !r.manageDate) ? '처리일을 입력하세요' : undefined),
  });
  const { retrieve } = crud;

  // [E0] 화면 열림 (생성자 L93-132) → setting() L134-262: 년 = 올해, 월 = 이번 달, 발생구분 "전체" — 발생구분 콤보가 읽히면 곧바로 retrieve()
  useEffect(() => {
    void retrieve();
    // buildGrid() L267-275: statusComboBox = ComboBoxField("ScheduleStatusCode")
    sysApi.searchCodes('ScheduleStatusCode').then(setStatusCodes).catch(() => setStatusCodes([]));
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E5] searchText.KeyPress [Enter] (L192)·[E6] searchButton[조회].Select (L201) → retrieve() L331-353
  const doRetrieve = () => retrieve();

  // [E7] updateButton[저장].Select (L208) → update() L355-389 — crud.saveRows (변경 0건이면 저장(0) 비활성: UX-03)

  // [E8] rdButton[출력/다운로드].Select (L215) → sys.Sys99_Print.insertRdIcsList + RD 리포트 Sch04_Rd_IcsList: 조회 조건 그대로 xlsx 받기
  const download = async () => {
    const cond = condition();
    if (!cond) return;
    try {
      await schApi.downloadIcsListExcel(cond, `법규보고 점검(${cond.startDate} ~ ${cond.closeDate}).xlsx`);
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    }
  };

  // viewLaw() L391-402: 발생구분 2·3 → Ics01_Lookup_ClassTreeDetail.open(icsClassTreeId), 6·7 → Icr01_Lookup_ClassTreeDetail.open(icsClassTreeId)
  const viewLaw = (row: Sch04List) => setLawRow(row);

  // viewAppr() L404-432: 원인문서가 없으면 "원인문서가 존재하지 않습니다", 있으면 ApprCallbackResult → Apr01_Edit_ApprDoc.retrieveApproval(model, false, …)
  // [생략] 전자결재 편집창(Apr01_Edit_ApprDoc)은 다른 도메인이라 다음 단계에서 연결한다 — 열람권한 검사("해당문서의 열람권한이 없습니다")도 그때
  const viewAppr = (row: Sch04List) => {
    if (row.issApprId == null) {
      message.warning('원인문서가 존재하지 않습니다');
      return;
    }
    message.info('전자결재 문서 보기 창은 다음 단계에서 연결됩니다');
  };

  // editResult() L434-457: 미처리 건이면 "처리구분을 저장한 후 결과를 입력하세요", 고친 행이 있으면 "저장되지 않은 데이터가 존재합니다. 저장 후 클릭하세요",
  //   아니면 Sch04_Lookup_IcsMsg.open("1", row, callback → grid.getStore().update(row))
  const editResult = (row: Sch04List) => {
    if (row.noneDataYn) {
      message.warning('처리구분을 저장한 후 결과를 입력하세요');
      return;
    }
    if (crud.hasChanges()) {
      message.warning('저장되지 않은 데이터가 존재합니다. 저장 후 클릭하세요');
      return;
    }
    setMsgRow(row);
  };

  // buildGrid() L264-329 (단일 선택, 처리구분·처리일만 셀 편집)
  // [E10] gridBuilder.BeforeStartEdit (L317) → 확인(confirmYn)된 행이면 편집을 막고 "관리자 확인이 완료되어 변경할 수 없습니다"
  const notEditable = (p: { data?: Sch04List }) => !p.data?.confirmYn;
  const columnDefs = useMemo(() => [
    gb.date('closeDate', 90, '마감일'),  // L300
    gb.text('mngOrgName', 120, '담당부서'),  // L301
    gb.textCenter('personName', 90, '처리자'),  // L302
    gb.textCenter('statusName', 100, '처리구분', {  // L303 편집: ScheduleStatusCode 콤보. [E9] statusComboBox.Collapse (L268) → statusCode·statusName 둘 다 바꾼다
      editor: 'select',
      values: [...new Set(statusCodes.map(c => c.name))],
      editable: notEditable,
      valueSetter: p => {
        p.data.statusName = p.newValue;
        p.data.statusCode = statusCodes.find(c => c.name === p.newValue)?.code ?? p.data.statusCode;
        return true;
      },
    }),
    gb.date('manageDate', 90, '처리일', { editor: 'date', editable: notEditable }),  // L304 편집: MyDateField
    // L305 actionCell(Edit) → editResult()
    iconCell<Sch04List>('edit', 'actionCellResult', 70, '처리결과', editResult),
    gb.booleanYn2('confirmYn', 70, '확인여부'),  // L306
    gb.textArea('title', 350, '법규명'),  // L307
    iconCell<Sch04List>('view', 'actionCellLaw', 30, '', viewLaw),  // L308 → viewLaw()
    gb.textArea('relatedLaw', 200, '관련조문'),  // L309
    gb.textArea('apprTitle', 250, '원인문서'),  // L310
    iconCell<Sch04List>('view', 'actionCellAppr', 30, '', viewAppr),  // L311 → viewAppr()
    gb.date('issDate', 90, '발생일'),  // L312
    gb.textCenter('scheduleName', 100, '발생구분'),  // L313
    gb.textCenter('cycleName', 100, '주기구분'),  // L314
    gb.booleanYn2('advisYn', 60, '일임<br>(자문)'),  // L315
  ], [statusCodes]);  // eslint-disable-line react-hooks/exhaustive-deps

  // BeforeStartEdit: 확인된 행의 편집 칸을 더블클릭하면 안내를 띄운다 (editable이 막으므로 편집은 시작되지 않는다)
  const blockConfirmed = (e: { data?: Sch04List; colDef: { field?: string } }) => {
    if (e.data?.confirmYn && EDIT_COLS.includes(e.colDef.field ?? '')) message.warning(CONFIRMED_MSG);
  };

  const lawIcs = lawRow && ['2', '3'].includes(lawRow.scheduleCode ?? '') ? lawRow.icsClassTreeId ?? null : null;
  const lawIcr = lawRow && ['6', '7'].includes(lawRow.scheduleCode ?? '') ? lawRow.icsClassTreeId ?? null : null;

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar
          onSearch={() => doRetrieve()}
          searchText="조회"
          loading={crud.loading}
          extra={(
            <>
              {/* [E7] updateButton[저장] */}
              <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
              {/* [E8] rdButton[출력/다운로드] */}
              <Button type="download" onClick={download}>출력/다운로드</Button>
            </>
          )}
        >
          <SearchBar.Field label="마감월">
            {/* [E1] year.ValueChange (L139) → setDate() — 조회할 때 년·월로 기간을 만든다 */}
            <Input style={{ width: 62 }} maxLength={4} value={year} onChange={e => setYear(e.target.value)} />
            {/* [E2] monthComboBox[MonthsCode].Collapse (L148) → setDate(), retrieve() */}
            <SystemCodeComboBox
              kindCd="MonthsCode" allowClear={false} style={{ width: 70 }}
              value={month} onChange={v => { if (v) { latest.current.month = v; setMonth(v); } }}
              onOpenChange={open => { if (!open) void retrieve(); }}
            />
          </SearchBar.Field>
          <SearchBar.Field label="발생구분">
            {/* [E3] issTypeComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L168) → retrieve() */}
            <SystemCodeComboBox
              kindGroupCd="ScheduleCode0001" altCode={ALL_CODE} style={{ width: 120 }}
              value={scheduleCode} onChange={v => { latest.current.scheduleCode = v ?? '%'; setScheduleCode(v ?? '%'); }}
              onOpenChange={open => { if (!open) void retrieve(); }}
            />
          </SearchBar.Field>
          <SearchBar.Field label="주기구분">
            {/* [E4] cycleComboBox[IcsCycleClass].Collapse (L177) → retrieve() */}
            <SystemCodeComboBox
              kindCd="IcsCycleClass" altCode={ALL_CODE} style={{ width: 100 }}
              value={cycleCode} onChange={v => { latest.current.cycleCode = v ?? '%'; setCycleCode(v ?? '%'); }}
              onOpenChange={open => { if (!open) void retrieve(); }}
            />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 250 }} placeholder="담당부서/처리자/법규명/관련조문/원인문서" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
          <Checkbox checked={exceptYn} onChange={e => setExceptYn(e.target.checked)}>완료건 제외</Checkbox>
          <Checkbox checked={advisYn} onChange={e => setAdvisYn(e.target.checked)}>일임(자문)관련 법규만 조회</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<Sch04List>
            crud={crud}
            columnDefs={columnDefs}
            rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
            onCellDoubleClicked={blockConfirmed}
          />
        </div>
      </div>
      <Sch04_Lookup_IcsMsg
        row={msgRow}
        actionType="1"
        onResult={r => { if (msgRow) crud.replaceRow(msgRow.listId, r); }}
        onClose={() => setMsgRow(null)}
      />
      <Ics01_Lookup_ClassTreeDetail classTreeId={lawIcs} onClose={() => setLawRow(null)} />
      <Icr01_Lookup_ClassTreeDetail classTreeId={lawIcr} onClose={() => setLawRow(null)} />
    </div>
  );
};
