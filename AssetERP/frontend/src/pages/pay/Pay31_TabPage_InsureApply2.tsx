/**
 * 보수변동/착오정정 신고 탭 (S26) — Pay31_Tab_InsureApply 둘째 탭
 * AS-IS: myApp/client/vi/pay/Pay31_TabPage_InsureApply2.java (418줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L88-121: 세로 — 위 50(신고일 시작 ~ 종료 · 사원명 · [조회][등록][저장][삭제][엑셀업로드]) / 가운데 CellEditGrid(체크 다중) / 아래 100(보험별 적용 안내 글)
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 저장 = 저장(n)(UX-03), 날짜 편집 열 120(UX-08)
 */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Button as AntButton, DatePicker, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { PayInsureApply } from '@/types/pay';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { CellEditGrid, gbFor } from '@/components/grid';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { useGridCrud } from '@/hooks/useGridCrud';
import { InsureApplyNote, PayInsureApplyTabHandle, PayInsurePersonField, useInsureCodes } from './payInsureApplyTab';
import { Pay31_Lookup_Insert2 } from './Pay31_Lookup_Insert2';

const gb = gbFor<PayInsureApply>();
const FORMAT = 'YYYY-MM-DD';

export const Pay31_TabPage_InsureApply2 = forwardRef<PayInsureApplyTabHandle>((_props, ref) => {
  // settings() L134-: startDate = 올해 1월 1일, closeDate = 오늘
  const [startDate, setStartDate] = useState(() => dayjs().startOf('year'));
  const [closeDate, setCloseDate] = useState(() => dayjs());
  const personIdRef = useRef<number | null>(null);
  const [cellLookup, setCellLookup] = useState<PayInsureApply | null>(null);
  const [insertOpen, setInsertOpen] = useState(false);
  const excelForm = useRef<FileUpdownFormHandle>(null);
  const insureCodes = useInsureCodes({ kindCd: 'InsureCode' });

  const crud = useGridCrud<PayInsureApply>({
    idField: 'insureApplyId',
    // retrieve() L300-309: pay.Pay31_InsureApply.selectByCompanyId(…, insureApplyGubun "multi" = 보수변동·착오정정)
    search: useCallback(() => payApi.searchInsureApplies({
      gubun: 'multi', personId: personIdRef.current, insureCode: '%', startDate: startDate.format(FORMAT), closeDate: closeDate.format(FORMAT),
    }), [startDate, closeDate]),
    // update() L312-: 바뀐 행의 변경적용월 '-' → '.', 모든 행 검사(보험구분·신고구분·신고일·취득일) → GridUpdate pay.Pay31_InsureApply.update
    validate: (_changed, all) => {
      for (const r of all) {
        if (r.insureName == null) return '보험구분은 필수선택 항목입니다';
        if (r.insureApplyName == null) return '신고구분은 필수선택 항목입니다';
        if (r.applyDate == null) return '신고일 필수작성 항목입니다';
      }
      return undefined;
    },
    save: useCallback((rows: PayInsureApply[]) => payApi.saveInsureApplies(rows.map(r => ({ ...r, applyMonth: r.applyMonth?.replace(/-/g, '.') }))), []),
    // [E11] messageBox.DialogHide [YES] (L371) → deleteRow() L363-380
    remove: useCallback((ids: number[]) => payApi.deleteInsureApplies(ids), []),
    newRow: useCallback(() => ({}), []),
    deleteConfirm: '선택한 정보를 삭제하시겠습니까?',
  });
  const { retrieve } = crud;

  useImperativeHandle(ref, () => ({ retrieve: () => void retrieve() }), [retrieve]);
  // [E0] 화면 열림: 탭이 선택되면 retrieve(null) → retrieve()
  useEffect(() => { void retrieve(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // [E9] lookupEmpTransInfo.TriggerClick (L217) → 인라인 L217-233: 고른 사원의 ID·사번·이름을 그 행에 넣는다
  const onCellPersonPicked = (row: TransInfo | null) => {
    const target = cellLookup;
    setCellLookup(null);
    if (!row || !target) return;
    crud.updateRow(target.insureApplyId, { personId: row.personId, personNo: row.empNo ?? '', personName: row.korNm ?? '' });
  };

  // [E12] fileUploadField.Change (L395) → uploadExcelForm.submit() · [E1] uploadExcelForm.SubmitComplete (L127) → retrieve()
  const onExcelFile = async (file?: File) => {
    if (!file) return;
    try {
      const count = await payApi.uploadInsureApplyExcel('edi', file);
      message.success(`EDI정보를 업로드하였습니다. (${count}건)`);
    } catch (err) {
      message.error(errorMessage(err, '업로드 실패'));
    }
    await retrieve();
  };

  // buildGrid() L212-270 — CellEditGrid(Pay31_InsureApplyModel), 체크 다중
  const columnDefs = useMemo(() => [
    gb.textCenter('personNo', 80, '사번'),
    gb.textCenter('personName', 100, '성명', {
      cellStyle: { color: '#1677ff' },
      cellRenderer: (p: { data?: PayInsureApply; value?: string }) => (
        <><AntButton type="text" size="small" icon={<SearchOutlined />} onClick={e => { e.stopPropagation(); if (p.data) setCellLookup(p.data); }} />{p.value}</>
      ),
    }),
    gb.date('applyDate', 120, '신고일자', { editor: 'date' }),
    gb.text('insureApplyName', 150, '신고구분'),
    // [E10] insureComboBox[InsureCode].Collapse (L235) → 고른 보험의 코드·이름을 그 행에 넣는다
    gb.text('insureName', 150, '신청대상', {
      editor: 'select',
      values: insureCodes.map(c => c.name),
      valueSetter: p => {
        const d = p.data as unknown as Record<string, unknown>;
        d.insureName = p.newValue;
        d.insureCode = insureCodes.find(c => c.name === p.newValue)?.code ?? null;
        return true;
      },
    }),
    gb.date('initDate', 120, '취득일자', { editor: 'date' }),
    gb.textCenter('applyMonth', 100, '변경적용월', { editor: 'text' }),
    gb.long('applyMonthPay', 200, '보수월액', { editor: 'number' }),
    gb.text('note', 300, '비고', { editor: 'text' }),
  ], [insureCodes]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* [E4] retrieveButton[조회].Select (L179) → retrieve() */}
      <SearchBar
        onSearch={() => retrieve()}
        loading={crud.loading}
        extra={<>
          {/* [E5] insertButton[등록].Select (L185) → insertRow(): Pay31_Lookup_Insert2.open(callback = retrieve()) */}
          <Button type="register" onClick={() => setInsertOpen(true)}>등록</Button>
          {/* [E6] updateButton[저장].Select (L191) → update(). 저장(n)은 UX-03 */}
          <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
          {/* [E7] deleteButton[삭제].Select (L197) → deleteRow() */}
          <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
          {/* [E8] excelUploadButton[엑셀업로드].Select (L203) → excelUpload(): ExcelUpload?uploadType=ediUpload */}
          <Button type="upload" onClick={() => excelForm.current?.click()}>엑셀업로드</Button>
          <FileUpdownForm ref={excelForm} accept=".xlsx,.xls" onChange={onExcelFile} />
        </>}
      >
        <SearchBar.Field label="신고일">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <DatePicker style={{ width: 120 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => { if (d) setStartDate(d); }} />
            <span>~</span>
            <DatePicker style={{ width: 120 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => { if (d) setCloseDate(d); }} />
          </span>
        </SearchBar.Field>
        <SearchBar.Field label="사원명">
          {/* [E2] personName.TriggerClick (L141) → openLookupPerson(null) · [E3] personName.ValueChange (L147) */}
          <PayInsurePersonField onChange={(id, doRetrieve) => { personIdRef.current = id; if (doRetrieve) void retrieve(); }} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<PayInsureApply> crud={crud} columnDefs={columnDefs} />
      </div>
      <InsureApplyNote />
      <Emp00_Lookup_SelectSingle open={cellLookup != null} separateAddTitle transDate={dayjs().format(FORMAT)} onResult={onCellPersonPicked} onClose={() => setCellLookup(null)} />
      <Pay31_Lookup_Insert2 open={insertOpen} onCreated={() => void retrieve()} onClose={() => setInsertOpen(false)} />
    </div>
  );
});
Pay31_TabPage_InsureApply2.displayName = 'Pay31_TabPage_InsureApply2';
