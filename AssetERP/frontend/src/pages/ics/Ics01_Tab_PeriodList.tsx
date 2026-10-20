/**
 * [1255] 준법감시 > 00. 법규정보 > 월별 법규조회 (H04)
 * AS-IS: myApp/client/vi/ics/Ics01_Tab_PeriodList.java (349줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L71-119: center=세로(툴바 2줄 50+36 + 그리드) — 1줄 = 조회월(년 + 월 콤보) · 대분류 콤보 · 중분류 · 일임(자문)관련 법규만 조회,
 *   2줄 = 주기구분(구분 콤보 + 주기 콤보) · 일별제외 · 검색 250 · [조회]. 조회 기간(startDate·closeDate)은 감춰져 있고 년·월로 정한다.
 *   그리드(단일 선택, 아이콘 열 2, 맨 아래 합계 행 "계")
 * 연결: Ics01_Lookup_CheckList(중분류)·IcsComboBoxField(대분류)·Ics01_Lookup_ClassTreeDetail(상세보기)·Ics01_Lookup_IcsFile(서식파일 openPeriod)
 *   · Ics01_Lookup_IcsFileAdmin은 IcsFile 안의 [불러오기]가 여는데 openPeriod가 [불러오기]를 감추므로 이 화면에서 도달할 수 없다
 * 열 때 바로 조회하지 않는다(원본은 retrieve()를 주석 처리했다) — [조회]·검색어 Enter·월 콤보를 닫을 때 조회한다.
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 박스 안 여백 = 11 §5(padding 10·gap 8). 초기화(UX-02)는 검색 조건이 길어 줄바꿈 위험이라 넣지 않는다
 */
import React, { useMemo, useRef, useState } from 'react';
import { Checkbox, Input, message } from 'antd';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { IcsClassTreeItem, IcsLawPeriod } from '@/types/ics';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { IcsComboBoxField, ALL_LABEL } from '@/components/lookup/IcsComboBoxField';
import { Ics01_Lookup_CheckList } from '@/components/lookup/Ics01_Lookup_CheckList';
import { Ics01_Lookup_ClassTreeDetail } from '@/components/lookup/Ics01_Lookup_ClassTreeDetail';
import { Ics01_Lookup_IcsFile } from './Ics01_Lookup_IcsFile';

const gb = gbFor<IcsLawPeriod>();
const ALL_CODE: [string, string] = ['%', ALL_LABEL];  // ComboBoxField("CycleCode","%","전체")

const pad2 = (n: number) => String(n).padStart(2, '0');

/** setDate() L325-332: 조회월의 1일 ~ 말일 (yyyy-MM-dd). 년이 숫자가 아니면 null */
function monthRange(year: string, month: string): [string, string] | null {
  const y = Number(year.trim());
  const m = Number(month);
  if (!Number.isInteger(y) || y < 1 || y > 9999 || !Number.isInteger(m) || m < 1 || m > 12) return null;
  const last = new Date(y, m, 0).getDate();
  const ym = `${String(y).padStart(4, '0')}-${pad2(m)}`;
  return [`${ym}-01`, `${ym}-${pad2(last)}`];
}

export const Ics01_Tab_PeriodList: React.FC = () => {
  const today = useMemo(() => new Date(), []);
  const [year, setYear] = useState(String(today.getFullYear()));
  const [month, setMonth] = useState(pad2(today.getMonth() + 1));
  const [level1Name, setLevel1Name] = useState(ALL_LABEL);
  const [level1Id, setLevel1Id] = useState<number | null>(null);
  const [level2Name, setLevel2Name] = useState(ALL_LABEL);
  const [advisYn, setAdvisYn] = useState(false);
  const [lawPublicType, setLawPublicType] = useState('%');
  const [cycleCode, setCycleCode] = useState('%');
  const [exceptDailyYn, setExceptDailyYn] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<IcsLawPeriod[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkListOpen, setCheckListOpen] = useState(false);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [fileId, setFileId] = useState<number | null>(null);

  // 월 콤보를 닫는 순간(Collapse)에는 방금 고른 값이 아직 state에 반영되지 않았을 수 있어 ref로 최신 값을 읽는다
  const latest = useRef({ year, month, level1Name, level2Name, advisYn, lawPublicType, cycleCode, exceptDailyYn, searchText });
  latest.current = { year, month, level1Name, level2Name, advisYn, lawPublicType, cycleCode, exceptDailyYn, searchText };

  // [E2] monthComboBox[MonthsCode].Collapse (L148) → setDate(), retrieve()
  // [E5] searchText.KeyPress [Enter] (L187)·[E6] searchButton[조회].Select (L202) → retrieve() L263-314
  // 조건을 만들어(전체는 '%' — 서버가 비어 온 값을 '%'로) 읽는다. 대분류 "전체"·중분류 "전체"·콤보 "전체"는 보내지 않는다
  const retrieve = async () => {
    const c = latest.current;
    const range = monthRange(c.year, c.month);  // setDate()
    if (!range) return;
    setLoading(true);
    try {
      setRows(await icsApi.searchLawPeriod({
        startDate: range[0], closeDate: range[1], searchText: c.searchText,
        level1Name: c.level1Name === ALL_LABEL ? undefined : c.level1Name,
        level2Name: c.level2Name === ALL_LABEL ? undefined : c.level2Name,
        cycleCode: c.cycleCode === '%' ? undefined : c.cycleCode,
        lawPublicType: c.lawPublicType === '%' ? undefined : c.lawPublicType,
        exceptDailyYn: c.exceptDailyYn, advisYn: c.advisYn,
      }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E3] level1Name[전체].ValueChange (L159) → 인라인 L159-165: 중분류를 "전체"로 되돌린다
  const changeLevel1 = (name: string, id: number | null) => {
    setLevel1Name(name);
    setLevel1Id(id);
    setLevel2Name(ALL_LABEL);
  };

  // [E4] level2Name[전체].TriggerClick (L171) → lookupIcsCode() L246-261: Ics01_Lookup_CheckList.open(대분류 id) 결과가 null이면 "전체", 아니면 그 분류 이름
  const selectLevel2 = (item: IcsClassTreeItem | null) => setLevel2Name(item?.classTreeName ?? ALL_LABEL);

  // buildGrid() L210-244 (getAggregationGrid("계", 1, 2): 대분류 열에 "계", 중분류 열에 행 개수)
  const columnDefs = useMemo(() => [
    gb.date('closeDate', 120, '처리기한'),  // L231
    gb.text('level1Name', 150, '대분류'),  // L232
    gb.text('level2Name', 200, '중분류'),  // L233
    gb.textHtml('classTreeNameAddAppr', 500, '법규명'),  // L234 addTextAreaHtml
    // L235 actionCell(Detail) → Ics01_Lookup_ClassTreeDetail.open(realClassTreeId)
    iconCell<IcsLawPeriod>('view', 'actionCellDetail', 80, '상세보기', row => setDetailId(row.realClassTreeId)),
    gb.textArea('submitTo', 200, '제출처'),  // L236
    gb.text('cycleName', 100, '주기'),  // L237
    gb.textArea('relatedLaw', 200, '관련조문'),  // L238
    gb.textCenter('fileCount', 80, '서식파일'),  // L239
    // L240 actionCell(View) → fileAddList() L316-323: Ics01_Lookup_IcsFile.openPeriod(realClassTreeId)
    iconCell<IcsLawPeriod>('view', 'actionCellFile', 40, ' ', row => setFileId(row.realClassTreeId)),
    gb.booleanYn2('advisYn', 60, '일임<br>(자문)'),  // L241 addBooleanYn2
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar onSearch={() => retrieve()} searchText="조회" loading={loading}>
          <SearchBar.Field label="조회월">
            {/* [E0] 화면 열림 (생성자 L71-119) → settings() L121-208: 년 = 올해, 월 콤보 = 이번 달, 읽기 전용 콤보. 년을 고치면 setDate() — 조회할 때 년·월로 기간을 만든다 [E1] year.ValueChange (L139) */}
            <Input style={{ width: 62 }} maxLength={4} value={year} onChange={e => setYear(e.target.value)} />
            <SystemCodeComboBox
              kindCd="MonthsCode" allowClear={false} style={{ width: 70 }}
              value={month} onChange={v => { if (v) { latest.current.month = v; setMonth(v); } }}
              onOpenChange={open => { if (!open) void retrieve(); }}
            />
          </SearchBar.Field>
          <SearchBar.Field label="대분류">
            <IcsComboBoxField value={level1Name} onChange={changeLevel1} width={150} />
          </SearchBar.Field>
          <SearchBar.Field label="중분류">
            {/* level2Name: setEditable(false)·값 "전체"·폭 250 */}
            <LookupInput value={level2Name} width={250} onOpen={() => setCheckListOpen(true)} onClear={() => setLevel2Name(ALL_LABEL)} />
          </SearchBar.Field>
          {/* advisCheckBox "일임(자문)관련 법규만 조회" (기본 해제) */}
          <Checkbox checked={advisYn} onChange={e => setAdvisYn(e.target.checked)}>일임(자문)관련 법규만 조회</Checkbox>
          <SearchBar.Field label="주기구분">
            <SystemCodeComboBox kindCd="LawPublicType" altCode={ALL_CODE} style={{ width: 110 }} value={lawPublicType} onChange={v => setLawPublicType(v ?? '%')} />
            <SystemCodeComboBox kindCd="CycleCode" altCode={ALL_CODE} style={{ width: 90 }} value={cycleCode} onChange={v => setCycleCode(v ?? '%')} />
          </SearchBar.Field>
          {/* exceptDailyCheckBox "일별제외" (기본 선택) */}
          <Checkbox checked={exceptDailyYn} onChange={e => setExceptDailyYn(e.target.checked)}>일별제외</Checkbox>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 250 }} placeholder="대분류/중분류/업무명/제출처/관련조문" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<IcsLawPeriod>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.rowNo)}
            loading={loading}
            sumRow={{ labelField: 'level1Name', label: '계', count: ['level2Name'] }}
          />
        </div>
      </div>
      <Ics01_Lookup_CheckList open={checkListOpen} parentTreeId={level1Id} onResult={selectLevel2} onClose={() => setCheckListOpen(false)} />
      <Ics01_Lookup_ClassTreeDetail classTreeId={detailId} onClose={() => setDetailId(null)} />
      {/* callback은 비어 있다(L316-323) — 서식파일 창이 목록만 보여 주므로 다시 읽을 것이 없다 */}
      <Ics01_Lookup_IcsFile law={fileId == null ? null : { classTreeId: fileId }} period onClosed={() => undefined} onClose={() => setFileId(null)} />
    </div>
  );
};
