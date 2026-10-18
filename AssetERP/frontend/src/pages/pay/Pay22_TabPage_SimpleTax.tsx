/**
 * 근로소득 간이세액표 상세 (E22-2) — Pay23_TabPage_SimpleTaxTable 오른쪽 85%
 * AS-IS: myApp/client/vi/pay/Pay22_TabPage_SimpleTax.java (313줄, 새 원본 IDMS-IC) — 함수 이름은 원본 메서드 이름 그대로
 * 레이아웃 L73-181: 위(60%) "1. 천만원 이하" 툴바(금액 검색칸 · [조회] · 관리자 회사만 [엑셀업로드]) + 간이세액표 단일 선택 그리드,
 *   아래(40%, 분할) "2. 천만원 초과" 툴바(관리자 회사만 [등록][저장][삭제]) + 셀 편집 그리드(체크박스 없음 — 행을 눌러 고름)
 * 부모(Pay23_TabPage_SimpleTaxTable)가 적용일을 고르면 두 표를 읽는다(retrievePage → retrieveOther·retrieve)
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { InputNumber, message, Space, Splitter } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { PaySimpleTax, PaySimpleTaxOther } from '@/types/pay';
import { Button } from '@/components/button';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { CellEditGrid, SingleGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';
import { PayDetailProps } from './usePayDateList';

const gb = gbFor<PaySimpleTax>();
const otherGb = gbFor<PaySimpleTaxOther>();

/** 초과 표 그리드는 체크박스가 없다(setChecked 없음) — 행을 눌러 고른다. 렌더마다 새 객체면 선택이 풀리므로 상수 */
const SINGLE_ROW_SELECTION = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;

const DEDUCT_FIELDS = ['deductCnt1', 'deductCnt2', 'deductCnt3', 'deductCnt4', 'deductCnt5', 'deductCnt6', 'deductCnt7', 'deductCnt8', 'deductCnt9', 'deductCnt10', 'deductCnt11'] as const;

/** AS-IS buildGrid() L185-204: 머리글 묶음 "월급여액(천원)"(이상·미만) · "공제대상가족의 수"(1~11) */
const buildGrid = () => [
  gb.group('월급여액(천원)', [  // L188
    gb.long('fromAmt', 100, '이상'),  // L190
    gb.long('toAmt', 100, '미만'),  // L191
  ]),
  gb.group('공제대상가족의 수', DEDUCT_FIELDS.map((f, i) => gb.long(f, 100, String(i + 1)))),  // L189·L192-202
];

/** AS-IS buildOtherGrid() L206-220: 머리글 묶음 "월급여액(천원)"(초과·이하) + 적용기준율·누진세액·비고 */
const buildOtherGrid = () => [
  otherGb.group('월급여액(천원)', [  // L210
    otherGb.long('fromAmt', 100, '초과', { editor: 'number' }),  // L212
    otherGb.long('toAmt', 100, '이하', { editor: 'number' }),  // L213
  ]),
  otherGb.double('rate1', 140, '적용기준율1 (%)', { editor: 'number' }),  // L214
  otherGb.double('rate2', 140, '적용기준율2 (%)', { editor: 'number' }),  // L215
  otherGb.long('addTax', 140, '누진세액2 (원)', { editor: 'number' }),  // L216
  otherGb.text('note', 700, '비고', { editor: 'text' }),  // L217
];

// [E0] 화면 열림 (생성자 L73-181) → 초기화
export const Pay22_TabPage_SimpleTax: React.FC<PayDetailProps> = ({ date, tick }) => {
  const user = useLoginUser();
  const isAdminCompany = user.companyId === 0;  // 툴바: LoginUser.getCompanyId() == 0일 때만 엑셀업로드·등록·저장·삭제
  const gridRef = useRef<AgGridReact<PaySimpleTax>>(null);
  const excelForm = useRef<FileUpdownFormHandle>(null);
  const [rows, setRows] = useState<PaySimpleTax[]>([]);
  const [searchLong, setSearchLong] = useState<number | null>(null);
  const lastSearch = useRef<number | null>(null);
  const columnDefs = useMemo(buildGrid, []);
  const otherColumnDefs = useMemo(buildOtherGrid, []);

  const crud = useGridCrud<PaySimpleTaxOther>({
    idField: 'simpleTaxTableOtherId',
    // retrieveOther() L238-251: 고른 적용일 → pay.Pay23_SimpleTaxTableOther.selectByDate
    search: useCallback(() => (date ? payApi.searchSimpleTaxOthers(date.startDate) : Promise.resolve([])), [date]),
    save: payApi.saveSimpleTaxOthers,
    remove: payApi.deleteSimpleTaxOthers,
    // insertRow() L258-263: 고른 적용일을 넣은 빈 행
    newRow: useCallback(() => ({ startDate: date?.startDate }), [date]),
    firstEditField: 'fromAmt',
    deleteConfirm: '선택한 정보를 삭제하시겠습니까?',  // deleteRow() L265-280
  });

  // retrieve(selectModel) L222-236: 고른 적용일·금액(searchLong) → pay.Pay22_SimpleTaxTable.selectByDate, 있으면 첫 행 선택
  const retrieve = useCallback(async () => {
    if (!date) {
      setRows([]);
      return;
    }
    try {
      lastSearch.current = searchLong;
      setRows(await payApi.searchSimpleTaxes(date.startDate, searchLong));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [date, searchLong]);

  // retrievePage() (부모 L184-190): 적용일을 고르거나 조회할 때마다(tick) 두 표를 읽는다
  useEffect(() => {
    retrieve();
    if (date) crud.retrieve();
    else crud.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date?.startDate, tick]);

  useEffect(() => {
    const t = setTimeout(() => gridRef.current?.api.getDisplayedRowAtIndex(0)?.setSelected(true, true), 50);
    return () => clearTimeout(t);
  }, [rows]);

  // [E3] searchLong.ValueChange (L142) → retrieve(): 값을 확정(포커스를 옮김)했을 때 바뀐 값으로 다시 읽는다
  const onSearchCommit = () => { if (lastSearch.current !== searchLong) retrieve(); };

  // [E2] excelUploadButton[엑셀업로드].Select (L98) → excelUploadCheck() L282-292: 해당 적용일의 간이세액표를 먼저 비우고(deleteByDate) 파일 선택창을 연다
  const excelUploadCheck = async () => {
    if (!date) {
      message.warning('기준 적용일을 선택해주세요');
      return;
    }
    try {
      await payApi.deleteSimpleTaxTable(date.startDate);
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
      return;
    }
    excelForm.current?.click();  // excelUpload() L294-: 선택창
  };

  // [E9] fileUploadField.Change (L303) → uploadExcelForm.submit() (ExcelUpload?uploadType=simpleTaxTableUpload&startDate=…), [E1] uploadExcelForm.SubmitComplete (L91) → retrieve()
  const onExcelFile = async (file: File | undefined) => {
    if (!file || !date) return;
    try {
      await payApi.uploadSimpleTaxExcel(date.startDate, file);
    } catch (err) {
      message.error(errorMessage(err, '업로드 실패'));
    }
    void retrieve();
  };

  return (
    <Splitter layout="vertical" style={{ height: '100%', background: '#fff' }}>
      <Splitter.Panel defaultSize="60%" min={150}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 8, boxSizing: 'border-box' }}>
          <Space wrap style={{ flex: 'none' }}>
            <b style={{ fontSize: 14 }}>1. 천만원 이하</b>
            <InputNumber<number>
              style={{ width: 150 }}
              value={searchLong}
              controls={false}
              formatter={v => (v == null ? '' : String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ','))}
              parser={v => Number((v ?? '').replace(/,/g, ''))}
              onChange={v => setSearchLong(v)}
              onBlur={onSearchCommit}
              onPressEnter={onSearchCommit}
            />
            {/* [E4] retrieveButton[조회].Select (L149) → retrieve(simpleTaxTableOtherModel) */}
            <Button type="search" onClick={retrieve}>조회</Button>
            {isAdminCompany && <Button type="upload" onClick={excelUploadCheck}>엑셀업로드</Button>}
          </Space>
          <div style={{ flex: 1, minHeight: 0 }}>
            <SingleGrid<PaySimpleTax>
              gridRef={gridRef}
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.simpleTaxTableId)}
            />
          </div>
          <FileUpdownForm ref={excelForm} accept=".xlsx,.xls" onChange={onExcelFile} />
        </div>
      </Splitter.Panel>
      <Splitter.Panel min={150}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 8, boxSizing: 'border-box' }}>
          <Space wrap style={{ flex: 'none' }}>
            <b style={{ fontSize: 14 }}>2. 천만원 초과</b>
            {isAdminCompany && <>
              {/* [E5] insertButton[등록].Select (L156) → insertRow() L258-263 */}
              <Button type="register" onClick={() => (date ? crud.addRow() : message.warning('기준 적용일을 선택해주세요'))}>등록</Button>
              {/* [E6] updateButton[저장].Select (L162) → update() L253-256. 저장(n)은 UX-03 */}
              <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
              {/* [E7] deleteButton[삭제].Select (L168) → deleteRow() L265-280 → [E8] messageBox.DialogHide [YES] (L268) → pay.Pay23_SimpleTaxTableOther.delete */}
              <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
            </>}
          </Space>
          <div style={{ flex: 1, minHeight: 0 }}>
            <CellEditGrid<PaySimpleTaxOther> crud={crud} columnDefs={otherColumnDefs} rowSelection={SINGLE_ROW_SELECTION} />
          </div>
        </div>
      </Splitter.Panel>
    </Splitter>
  );
};
