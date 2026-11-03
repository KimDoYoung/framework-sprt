/**
 * [1263] KFS > 01. 시스템 개발 > 시스템 개발 (EE17)
 * AS-IS: myApp/client/vi/scm/Scm10_Tab_Dev.java (377줄) + Scm11_Grid_DevStep(87줄, 진행단계 목록) + Scm11_Edit_DevStep(508줄, 처리 폼)
 *   + Scm11_Lookup_ResultMessage·Scm13_Lookup_MultiUpload·Scm13_Grid_DevProgram·Scm11_Grid_ApprFile·Scm03_Lookup_ExpectProgram·Scm10_Lookup_Note·Scm01_Lookup_Detail
 *   (Scm11_Lookup_Result·Scm13_Edit_DevProgram·Scm01_Lookup_SrContent·Scm01_Grid_ApprFile 은 EE15·EE16 재사용)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L101-120: north(0.3, 분할 가능, 여백 20·20·0·20) = 툴바 한 줄(조회기간 · 시스템 · 상태 · □미완료건만 보기 · 검색 · [조회] · □내 개발건만 보기) + 개발 그리드
 *   / center(0.7, 여백 20) = 진행단계 목록(400) + 처리 폼(나머지), 둘 다 테두리
 * 열 때 조회하지 않는다(원본 settings()에 retrieve 호출이 없다). 조회가 끝나면 첫 행을 고른다
 * 스타일: SGEF (견본 Sys90_Tab_AfterService — 아래 폼 앞에 진행단계 목록 400이 더 붙는다)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, Input, message, Select, Splitter } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { scmApi } from '@/api/scm';
import { errorMessage } from '@/api/client';
import { Dev, DevStatus, DevStep, Sr } from '@/types/scm';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Scm01_Lookup_Detail } from './Scm01_Lookup_Detail';
import { Scm10_Lookup_Note } from './Scm10_Lookup_Note';
import { Scm11_Edit_DevStep } from './Scm11_Edit_DevStep';
import { Scm11_Grid_DevStep } from './Scm11_Grid_DevStep';
import { Scm11_Lookup_ResultMessage } from './Scm11_Lookup_ResultMessage';

const gb = gbFor<Dev>();
const FORMAT = 'YYYY-MM-DD';
const ALL = '%';
/** 콤보 "전체"(ComboBoxField(kind, "%", "전체")) */
const ALL_CODE: [string, string] = [ALL, '전체'];
/** setChecked 단일 → 한 행 선택. 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

export const Scm10_Tab_Dev: React.FC = () => {
  const user = useLoginUser();
  const gridRef = useRef<AgGridReact<Dev>>(null);
  const selectFirst = useRef<number | null | undefined>(undefined);
  const retrieveSeq = useRef(0);
  // settings() L135-203: 조회기간 = 올해 1/1 ~ 오늘, 시스템·상태 "전체", □미완료건만 보기 켬, □내 개발건만 보기 켬
  const [startDate, setStartDate] = useState(dayjs().startOf('year').format(FORMAT));
  const [closeDate, setCloseDate] = useState(dayjs().format(FORMAT));
  const [systemCode, setSystemCode] = useState<string>(ALL);
  const [devStatus, setDevStatus] = useState<string>(ALL);
  const [devStatuses, setDevStatuses] = useState<DevStatus[]>([]);
  const [searchText, setSearchText] = useState('');
  const [checkBox01, setCheckBox01] = useState(true);
  const [checkBoxMyDev, setCheckBoxMyDev] = useState(true);
  const [rows, setRows] = useState<Dev[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Dev | null>(null);
  // 가운데: 진행단계 목록이 고른 줄 → 처리 폼 (retrieveEditPage L262-317)
  const [stepReload, setStepReload] = useState(0);
  const [devStep, setDevStep] = useState<DevStep | null>(null);
  const [editEnabled, setEditEnabled] = useState(false);
  const [mine, setMine] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  // 그리드 아이콘 창
  const [noteDev, setNoteDev] = useState<Dev | null>(null);
  const [detailSr, setDetailSr] = useState<Sr | null>(null);

  // [E0] 화면 열림 (생성자 L78-133) → settings() — 상태 콤보(sys.Sys00_Common.selectDevStatus)를 채운다. 열 때 조회하지 않는다
  React.useEffect(() => {
    scmApi.searchDevStatuses().then(setDevStatuses).catch(err => message.error(errorMessage(err, '상태 조회 실패')));
  }, []);

  // [E2] systemComboBox.Collapse (L152) · [E3] devStatusComboBox.Collapse (L160) · [E4] searchText.KeyPress [Enter] (L175) · [E5] retrieveButton[조회].Select (L183)
  //   → retrieve() L319-358: scm.Scm10_Dev.selectByText(startDate, closeDate, "%검색어%", systemCode, devStatus, checkBox01, checkBoxMyDev, personId)
  async function retrieve(over?: { systemCode?: string; devStatus?: string }) {
    const my = ++retrieveSeq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await scmApi.searchDevsByText({
        startDate, closeDate, searchText,
        systemCode: over?.systemCode ?? systemCode, devStatus: over?.devStatus ?? devStatus, checkBox01, checkBoxMyDev,
      });
      if (my !== retrieveSeq.current) return;
      // 고른 줄이 있으면 그대로, 없으면 첫 행을 고른다(L339-343) · 이어서 retrieveEditPage()
      const keep = selected && list.some(d => d.devId === selected.devId) ? selected.devId : null;
      selectFirst.current = list.length > 0 ? keep : undefined;
      setRows(list);
      setStepReload(n => n + 1);
      if (list.length === 0) { setSelected(null); setDevStep(null); setEditEnabled(false); }  // devStepList.clear(), editBoard.init()
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === retrieveSeq.current) setLoading(false);
    }
  }

  // [E1] grid.SelectionChanged (L127) → retrieveEditPage() L262-317
  const onSelectionChanged = () => setSelected(gridRef.current?.api?.getSelectedRows()[0] ?? null);

  // 진행단계 목록이 줄을 고르면 (devStepList.retrieve(devModel, callback) 의 callback)
  const onStepSelect = (step: DevStep | null) => {
    if (step == null) {  // result == null: editBoard.setEnabled(false); editBoard.init();
      setDevStep(null); setEditEnabled(false);
      return;
    }
    setDevStep(step);
    // 개발상태가 05(이행불가 전)·10 이면 처리 폼을 연다, 로그인한 사람이 그 단계 담당자면 readOnly(true)(= 누를 수 있게)
    if (step.devStepCd === '05' || step.devStepCd === '10') {
      setEditEnabled(true);
      setMine(String(user.userId) === String(step.personId));
    } else {
      // 이미 끝난 단계: 결과가 있으면 "결과" 창을 띄우고 폼은 막은 채 내용만 보인다
      if (step.result != null) setResultMessage(step.result);
      setEditEnabled(false);
    }
  };

  // 처리 폼의 [저장]·상태 버튼이 끝난 뒤 callback → Scm10_Tab_Dev.retrieve()
  const onChanged = () => void retrieve();

  // buildGrid() L205-260 (체크 단일)
  const columnDefs = useMemo(() => [
    gb.date('regDate', 100, '등록일'),
    gb.textCenter('systemNm', 120, '시스템구분'),
    gb.text('requestor', 150, '요청자'),
    // actionCell03 (L225-246): scm.Scm01_Sr.getSrModel(devId) → Scm01_Lookup_Detail.open(srModel)
    iconCell<Dev>('view', 'detailCell', 70, '개발의뢰<br>상세보기', row => {
      scmApi.getSrByDev(row.devId).then(setDetailSr).catch(err => message.error(errorMessage(err, '조회 실패')));
    }),
    gb.text('arrangeNote', 650, '개발내용'),
    // actionCell01 (L206-212): Scm10_Lookup_Note.open(selectModel.getNote())
    iconCell<Dev>('view', 'noteCell', 50, '', row => setNoteDev(row)),
    gb.textCenter('personNm', 100, '개발자'),
    gb.date('startDate', 100, '시작일'),
    gb.date('dueDate', 100, '완료예정일'),
    gb.date('resultDate', 100, '완료일'),
    gb.textCenter('devStepResult', 100, '진행상태'),
    gb.textCenter('srNo', 100, 'SR번호'),
  ], []);

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel defaultSize="30%" min={200}>
          <div style={{ height: '100%', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <SearchBar onSearch={() => void retrieve()} loading={loading}>
                <SearchBar.Field label="조회기간">
                  <DatePicker value={dayjs(startDate)} format={FORMAT} allowClear={false} style={{ width: 120 }} onChange={d => d && setStartDate(d.format(FORMAT))} />
                  <span style={{ margin: '0 6px' }}>~</span>
                  <DatePicker value={dayjs(closeDate)} format={FORMAT} allowClear={false} style={{ width: 120 }} onChange={d => d && setCloseDate(d.format(FORMAT))} />
                </SearchBar.Field>
                <SearchBar.Field label="시스템">
                  <SystemCodeComboBox kindCd="SystemCode" altCode={ALL_CODE} style={{ width: 130 }} value={systemCode}
                    onChange={c => { const v = c ?? ALL; setSystemCode(v); void retrieve({ systemCode: v }); }} />
                </SearchBar.Field>
                <SearchBar.Field label="상태">
                  <Select style={{ width: 120 }} value={devStatus}
                    options={[{ value: ALL, label: '전체' }, ...devStatuses.map(s => ({ value: s.code, label: s.name }))]}
                    onChange={v => { setDevStatus(v); void retrieve({ devStatus: v }); }} />
                </SearchBar.Field>
                <Checkbox checked={checkBox01} onChange={e => setCheckBox01(e.target.checked)} style={{ fontSize: 12 }}>미완료건만 보기</Checkbox>
                <SearchBar.Field label="검색">
                  <Input
                    allowClear
                    style={{ width: 360 }}
                    placeholder="요청자/개발내용/개발자/진행상태/SR번호/결과상세/비고"
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    onPressEnter={() => void retrieve()}
                  />
                </SearchBar.Field>
                <Checkbox checked={checkBoxMyDev} onChange={e => setCheckBoxMyDev(e.target.checked)} style={{ fontSize: 12 }}>내 개발건만 보기</Checkbox>
              </SearchBar>
              <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
                <SingleGrid<Dev>
                  gridRef={gridRef}
                  rowData={rows}
                  columnDefs={columnDefs}
                  getRowId={p => String(p.data.devId)}
                  loading={loading}
                  rowSelection={SINGLE_CHECK}
                  onRowDataUpdated={e => {
                    const want = selectFirst.current;
                    if (want === undefined) return;
                    selectFirst.current = undefined;
                    const node = want != null ? e.api.getRowNode(String(want)) : e.api.getDisplayedRowAtIndex(0);
                    node?.setSelected(true);
                  }}
                  onSelectionChanged={onSelectionChanged}
                  // [E6] grid.CellDoubleClick [colIndex == 13] (L190) → SR번호 복사 (copyToClipboard)
                  onCellDoubleClicked={e => {
                    if (e.colDef.field === 'srNo' && e.data?.srNo) void navigator.clipboard?.writeText(e.data.srNo).catch(() => undefined);
                  }}
                />
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel min={360}>
          <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
            <div style={{ height: '100%', display: 'flex', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
              <div style={{ width: 400, flex: 'none', borderRight: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
                <Scm11_Grid_DevStep devId={selected?.devId ?? null} reloadKey={stepReload} onSelect={onStepSelect} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Scm11_Edit_DevStep devStep={devStep} enabled={editEnabled} mine={mine} onChanged={onChanged} />
              </div>
            </div>
          </div>
        </Splitter.Panel>
      </Splitter>
      <Scm10_Lookup_Note open={noteDev != null} note={noteDev?.note ?? ''} editable={false} onClose={() => setNoteDev(null)} />
      <Scm01_Lookup_Detail open={detailSr != null} sr={detailSr} onClose={() => setDetailSr(null)} />
      <Scm11_Lookup_ResultMessage open={resultMessage != null} message={resultMessage ?? ''} onClose={() => setResultMessage(null)} />
    </div>
  );
};
