/**
 * 임금계산방법 탭 (E22) — Pay20_Tab_DeductAdmin 하위 2번째 탭
 * AS-IS: myApp/client/vi/pay/Pay04_TabPage_Formula.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L75-255:
 *  - 관리자 회사(0): 왼쪽 절반 = 툴바1([조회][생성][저장][삭제]) + 툴바2([행 추가][행 삭제]) + 적용일 그리드 25% | 산출식 그리드 75%,
 *    오른쪽 절반 = 툴바(고객사 · [조회] · [기초데이터생성]) + 적용일 그리드 25% | 산출식 그리드 75% + 안내 문구
 *  - 그 밖의 회사: 왼쪽만 — [조회]만 있고 적용일 그리드 12% | 산출식 그리드 88% (산출식 열 폭 200·500·500)
 * 오른쪽 산출식 그리드의 산출식·비고 열은 원본에서도 편집기가 달려 있지만 저장하는 곳이 없다(고객사 데이터는 [기초데이터생성]으로만 바뀐다)
 * 부모(Pay20_Tab_DeductAdmin)가 forwardRef 핸들로 retrieve()를 부른다(탭을 고를 때 retrieveTabpage)
 */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Input, message, Modal, Space, Splitter } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { AgGridReact } from 'ag-grid-react';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { PayFormula, PayFormulaDate } from '@/types/pay';
import { Button } from '@/components/button';
import { CellEditGrid, SingleGrid, gbFor } from '@/components/grid';
import { Sys01_Lookup_Company } from '@/components/lookup/Sys01_Lookup_Company';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Pay04_Lookup_Insert } from './Pay04_Lookup_Insert';
import { Pay20_Lookup_ItemList } from './Pay20_Lookup_ItemList';
import { PayTabPageHandle } from './Pay20_TabPage_Item';

const dateGb = gbFor<PayFormulaDate>();
const gb = gbFor<PayFormula>();

/** 산출식 그리드는 체크박스가 없다(setChecked 없음) — 행을 눌러 고른다. 렌더마다 새 객체면 선택이 풀리므로 상수 */
const SINGLE_ROW_SELECTION = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;

/** AS-IS buildGrid() / buildEastGrid() L257-261·L279-283 */
const dateColumns = () => [dateGb.date('startDate', 150, '기준 적용일')];  // L259·L281

/** AS-IS buildFormGrid() L263-277 (관리자 회사 120·300·120, 그 밖 200·500·500) / buildEastFormGrid() L285-292 (120·300·120) */
const formColumns = (wide: boolean) => [
  gb.text('itemName', wide ? 200 : 120, '구분'),  // L267·L271·L288
  gb.text('formulaForm', wide ? 500 : 300, '산출식 또는 산출방법 입력', { editor: 'text' }),  // L268·L272·L289
  gb.text('note', wide ? 500 : 120, '비고', { editor: 'text' }),  // L269·L273·L290
];

const NOTE = ['※ 고객사 선택 후 기초데이터 생성시 기존데이터는 삭제 후 생성됩니다.', '반드시 고객사 데이터를 확인 후 작업하세요'];

// [E0] 화면 열림 (생성자 L75-255) → retrieve()
export const Pay04_TabPage_Formula = forwardRef<PayTabPageHandle>((_props, ref) => {
  const user = useLoginUser();
  const isAdminCompany = user.companyId === 0;  // L196 LoginUser.getCompanyId() == 0
  const dateGridRef = useRef<AgGridReact<PayFormulaDate>>(null);
  const eastDateGridRef = useRef<AgGridReact<PayFormulaDate>>(null);
  const [dates, setDates] = useState<PayFormulaDate[]>([]);
  const [selectedDate, setSelectedDate] = useState<PayFormulaDate>();
  const [formTick, setFormTick] = useState(0);
  const [eastDates, setEastDates] = useState<PayFormulaDate[]>([]);
  const [eastSelectedDate, setEastSelectedDate] = useState<PayFormulaDate>();
  const [eastTick, setEastTick] = useState(0);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [lookupCompany, setLookupCompany] = useState(false);
  const [lookupInsert, setLookupInsert] = useState(false);
  const [lookupItem, setLookupItem] = useState(false);

  const dateColumnDefs = useMemo(dateColumns, []);
  const formColumnDefs = useMemo(() => formColumns(!isAdminCompany), [isAdminCompany]);
  const eastFormColumnDefs = useMemo(() => formColumns(false), []);

  const crud = useGridCrud<PayFormula>({
    idField: 'formulaId',
    // retrieveForm() L334-344: companyId(로그인 회사 — 서버) · 고른 적용일 → pay.Pay04_Formula.selectByDate
    search: useCallback(() => (selectedDate ? payApi.searchFormulas(selectedDate.startDate) : Promise.resolve([])), [selectedDate]),
    save: payApi.saveFormulas,
    remove: payApi.deleteFormulas,
    newRow: useCallback(() => ({}), []),
    firstEditField: 'formulaForm',
    deleteConfirm: false,  // deleteRow() L446-450: 확인창 없음
    reloadAfterSave: true,  // update() L368-378: 저장 뒤 retrieveForm(고른 적용일)
  });

  // retrieveEastForm() L346-356: companyId(고른 고객사) · 고른 적용일 → pay.Pay04_Formula.selectByDate
  const eastCrud = useGridCrud<PayFormula>({
    idField: 'formulaId',
    search: useCallback(() => (eastSelectedDate && companyId != null ? payApi.searchFormulas(eastSelectedDate.startDate, companyId) : Promise.resolve([])), [eastSelectedDate, companyId]),
    save: useCallback(async () => [], []),  // 저장하는 곳이 없다(원본도 같다)
    remove: useCallback(async () => 0, []),
    newRow: useCallback(() => ({}), []),
  });

  // retrieve() L300-315: companyId(로그인 회사 — 서버) → pay.Pay04_Formula.selectByCompanyId, 있으면 첫 행 선택
  const retrieve = useCallback(async () => {
    try {
      setDates(await payApi.searchFormulaDates());
      setFormTick(t => t + 1);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  useImperativeHandle(ref, () => ({ retrieve }));

  // eastRetrieve() L317-332: 고객사를 안 골랐으면 알리고 끝, 고른 고객사의 적용일을 읽고 첫 행 선택
  const eastRetrieve = useCallback(async (target: number | null) => {
    if (target == null) {
      message.warning('고객사를 선택해주세요');
      return;
    }
    try {
      setEastDates(await payApi.searchFormulaDates(target));
      setEastTick(t => t + 1);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 열 때 조회
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  // retrieve() L304-315 · eastRetrieve() L317-332: 읽은 뒤 목록이 있으면 첫 행을 선택한다 (목록이 그려진 다음에 선택해야 해서 목록이 바뀐 뒤에 한다)
  useEffect(() => {
    const t = setTimeout(() => dateGridRef.current?.api.getDisplayedRowAtIndex(0)?.setSelected(true, true), 50);
    return () => clearTimeout(t);
  }, [dates]);
  useEffect(() => {
    const t = setTimeout(() => eastDateGridRef.current?.api.getDisplayedRowAtIndex(0)?.setSelected(true, true), 50);
    return () => clearTimeout(t);
  }, [eastDates]);

  // [E1] grid.SelectionChanged [선택>0] (L78) → retrieveForm(고른 적용일). 조회마다(formTick) 같은 적용일이어도 다시 읽는다
  useEffect(() => {
    if (selectedDate) crud.retrieve();
    else crud.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate?.startDate, formTick]);

  // [E2] eastGrid.SelectionChanged [선택>0] (L88) → retrieveEastForm(고른 적용일)
  useEffect(() => {
    if (eastSelectedDate && companyId != null) eastCrud.retrieve();
    else eastCrud.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eastSelectedDate?.startDate, eastTick]);

  // [E3] companyField.TriggerClick [result != null] (L100) → Sys01_Lookup_Company.open(): 고른 고객사로 eastRetrieve(), 선택안함이면 칸·오른쪽 그리드를 비우고 eastRetrieve()(알림)
  const onCompany = (c: { companyId: number; companyNm: string } | null) => {
    setLookupCompany(false);
    if (c) {
      setCompanyId(c.companyId);
      setCompanyName(c.companyNm);
      eastRetrieve(c.companyId);
    } else {
      setCompanyId(null);
      setCompanyName('');
      setEastDates([]);
      setEastSelectedDate(undefined);
      eastRetrieve(null);
    }
  };

  // [E6] updateButton[저장].Select (L133) → update() L368-378: 산출식 그리드의 변경 행 저장(GridUpdate) → 고른 적용일 retrieveForm()
  const update = () => crud.saveRows();

  // [E5] insertButton[생성].Select (L128) → insert() L358-366: Pay04_Lookup_Insert.open() → 끝나면 retrieve()
  const insert = () => setLookupInsert(true);

  // [E7] deleteButton[삭제].Select (L138) → delete() L380-416: 적용일을 안 골랐으면 알리고, 확인 → [E12] msgBox.DialogHide [YES] (L388) → pay.Pay04_Formula.deleteByDate → retrieve(), 산출식 그리드 비움
  const deleteDate = () => {
    if (!selectedDate) {
      message.warning('기준 적용일을 선택해주세요');
      return;
    }
    const startDate = selectedDate.startDate;
    Modal.confirm({
      title: '삭제',
      content: '해당 적용일을 삭제하시겠습니까?',
      width: 400,
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          await payApi.deleteFormulaDate(startDate);
          crud.clear();
          await retrieve();
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // insertRow() L418-444: Pay20_Lookup_ItemList에서 고른 급여항목마다 (항목코드·적용일·회사)를 넣은 행을 더하고 항목명을 변경으로 표시
  const insertRow = () => {
    if (!selectedDate) {
      message.warning('기준 적용일을 선택해주세요');
      return;
    }
    setLookupItem(true);
  };

  // [E11] basicDataCreateButton[기초데이터생성].Select (L158) → basicDataCreate() L452-473
  const basicDataCreate = async () => {
    if (companyId == null) {
      message.warning('고객사는 필수 선택 사항입니다');
      return;
    }
    if (!selectedDate?.startDate) {
      message.warning('기준 적용일은 필수 선택 사항입니다');
      return;
    }
    try {
      await payApi.basicDataCreate(companyId, selectedDate.startDate);
      await eastRetrieve(companyId);
    } catch (err) {
      message.error(errorMessage(err, '기초데이터 생성 실패'));
    }
  };

  const leftWidth = isAdminCompany ? '25%' : '12%';

  const leftPanel = (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, boxSizing: 'border-box' }}>
      <div style={{ flex: 'none', display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <Space wrap>
          {/* [E4] retrieveButton[조회].Select (L123) → retrieve() */}
          <Button type="search" onClick={retrieve}>조회</Button>
          {isAdminCompany && <>
            <Button type="generate" onClick={insert}>생성</Button>
            <Button type="save" count={crud.changes} onClick={update}>저장</Button>
            <Button type="delete" onClick={deleteDate}>삭제</Button>
          </>}
        </Space>
        {isAdminCompany && <Space wrap>
          {/* [E8] insertRowButton[행 추가].Select (L143) → insertRow() L418-444 */}
          <Button type="addRow" onClick={insertRow}>행 추가</Button>
          {/* [E9] deleteRowButton[행 삭제].Select (L148) → deleteRow() L446-450 */}
          <Button type="removeRow" onClick={crud.deleteChecked}>행 삭제</Button>
        </Space>}
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <div style={{ flex: `0 0 ${leftWidth}`, minWidth: 0 }}>
          <SingleGrid<PayFormulaDate>
            gridRef={dateGridRef}
            rowData={dates}
            columnDefs={dateColumnDefs}
            getRowId={p => String(p.data.formulaId)}
            onSelect={setSelectedDate}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <CellEditGrid<PayFormula> crud={crud} columnDefs={formColumnDefs} rowSelection={SINGLE_ROW_SELECTION} />
        </div>
      </div>
    </div>
  );

  // 관리자 회사가 아니면 왼쪽만 — [조회]뿐이라 생성·행 추가 창과 고객사 조회창은 필요 없다
  if (!isAdminCompany) return leftPanel;

  return (
    <>
      <Splitter style={{ height: '100%', background: '#fff' }}>
        <Splitter.Panel defaultSize="50%" min={400}>
          <div style={{ height: '100%', paddingRight: 8, boxSizing: 'border-box' }}>{leftPanel}</div>
        </Splitter.Panel>
        <Splitter.Panel min={400}>
          <div style={{ height: '100%', paddingLeft: 8, display: 'flex', flexDirection: 'column', gap: 8, boxSizing: 'border-box' }}>
            <Space wrap style={{ flex: 'none' }}>
              <span>고객사</span>
              {/* [E3] companyField.TriggerClick [result != null] (L100) */}
              <Input readOnly style={{ width: 150 }} value={companyName} suffix={<SearchOutlined />} onClick={() => setLookupCompany(true)} />
              {/* [E10] eastRetrieveButton[조회].Select (L153) → eastRetrieve() */}
              <Button type="search" onClick={() => eastRetrieve(companyId)}>조회</Button>
              <Button type="generate" onClick={basicDataCreate}>기초데이터생성</Button>
            </Space>
            <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
              <div style={{ flex: '0 0 25%', minWidth: 0 }}>
                <SingleGrid<PayFormulaDate>
                  gridRef={eastDateGridRef}
                  rowData={eastDates}
                  columnDefs={dateColumnDefs}
                  getRowId={p => String(p.data.formulaId)}
                  onSelect={setEastSelectedDate}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <CellEditGrid<PayFormula> crud={eastCrud} columnDefs={eastFormColumnDefs} rowSelection={SINGLE_ROW_SELECTION} />
              </div>
            </div>
            <div style={{ flex: 'none', color: '#555', fontSize: 12, lineHeight: '18px' }}>
              {NOTE.map(t => <div key={t}>{t}</div>)}
            </div>
          </div>
        </Splitter.Panel>
      </Splitter>
      <Sys01_Lookup_Company open={lookupCompany} onResult={onCompany} onClose={() => setLookupCompany(false)} />
      <Pay04_Lookup_Insert open={lookupInsert} onCreated={retrieve} onClose={() => setLookupInsert(false)} />
      <Pay20_Lookup_ItemList open={lookupItem}
        onResult={items => {
          setLookupItem(false);
          if (!selectedDate) return;
          crud.addRows(items.map(it => ({ itemCd: it.itemCd, itemName: it.itemName, startDate: selectedDate.startDate, companyId: user.companyId })), true);
        }}
        onClose={() => setLookupItem(false)} />
    </>
  );
});
