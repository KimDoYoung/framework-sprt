/**
 * 납부방법 변경 탭 (S26) — Pay31_Tab_InsureApply 넷째 탭
 * AS-IS: myApp/client/vi/pay/Pay31_TabPage_InsureApply4.java (453줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L96-133: 세로 — 위 50(기준년도 · 신고구분(InsureCode002, 기본 "전체") · 사원명 · [조회][등록][저장][삭제] · [템플릿][엑셀업로드]) /
 *   가운데 CellEditGrid(체크 다중) / 아래 100(변경신청 기한정보 안내 글)
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 저장 = 저장(n)(UX-03), 날짜 편집 열 120(UX-08)
 */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Button as AntButton, Input, message } from 'antd';
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
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { useGridCrud } from '@/hooks/useGridCrud';
import { PayInsureApplyTabHandle, PayInsurePersonField, useInsureCodes } from './payInsureApplyTab';

const gb = gbFor<PayInsureApply>();

export const Pay31_TabPage_InsureApply4 = forwardRef<PayInsureApplyTabHandle>((_props, ref) => {
  // settings() L135-: 기준년도 = 작년, 신고구분 = 전체("%")
  const [yearText, setYearText] = useState(() => String(dayjs().year() - 1));
  const [insureCode, setInsureCode] = useState('%');
  const personIdRef = useRef<number | null>(null);
  const [cellLookup, setCellLookup] = useState<PayInsureApply | null>(null);
  const excelForm = useRef<FileUpdownFormHandle>(null);
  const latest = useRef({ yearText, insureCode });
  latest.current = { yearText, insureCode };
  // 그리드 안 콤보: 구분(InsureCode002, "전체" 없음) · 납부방법(DivPayCode)
  const insureCodes = useInsureCodes({ kindGroupCd: 'InsureCode002' });
  const payCodes = useInsureCodes({ kindCd: 'DivPayCode' });

  const crud = useGridCrud<PayInsureApply>({
    idField: 'insureApplyId',
    // retrieve() L339-357: 기준년도가 없으면 "기준년도를 입력해주세요", pay.Pay31_InsureApply.selectByCompanyId(startDate = 기준년도-01-01, closeDate = 기준년도-12-31, year = 기준년도+1, insureApplyGubun "5")
    search: useCallback(() => {
      const y = latest.current.yearText;
      return payApi.searchInsureApplies({
        gubun: '5', personId: personIdRef.current, insureCode: latest.current.insureCode,
        year: String(Number(y) + 1), startDate: `${y}-01-01`, closeDate: `${y}-12-31`,
      });
    }, []),
    // update() L360-391: 모든 행 검사(보험구분·신고일) → GridUpdate pay.Pay31_InsureApply.update
    validate: (_changed, all) => {
      for (const r of all) {
        if (r.insureName == null) return '보험구분은 필수선택 항목입니다';
        if (r.applyDate == null) return '신고일 필수작성 항목입니다';
      }
      return undefined;
    },
    save: useCallback((rows: PayInsureApply[]) => payApi.saveInsureApplies(rows), []),
    // [E14] messageBox.DialogHide [YES] (L407) → deleteRow() L404-419
    remove: useCallback((ids: number[]) => payApi.deleteInsureApplies(ids), []),
    // insertRow() L394-401: companyId + insureApplyCode "5"(납부방법 변경)인 새 행 (회사는 서버가 로그인 사용자로 넣는다)
    newRow: useCallback(() => ({ insureApplyCode: '5' }), []),
    firstEditField: 'personName',
    deleteConfirm: '선택한 정보를 삭제하시겠습니까?',
  });
  const { retrieve: retrieveRows } = crud;

  const retrieve = useCallback(async () => {
    if (latest.current.yearText.trim() === '') {
      message.warning('기준년도를 입력해주세요');
      return;
    }
    await retrieveRows();
  }, [retrieveRows]);

  useImperativeHandle(ref, () => ({ retrieve: () => void retrieve() }), [retrieve]);
  // [E0] 화면 열림: 탭이 선택되면 retrieve(null) → retrieve()
  useEffect(() => { void retrieve(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // [E11] lookupEmpTransInfo.TriggerClick (L252) → 인라인 L252-268: 고른 사원의 ID·사번·이름을 그 행에 넣는다
  const onCellPersonPicked = (row: TransInfo | null) => {
    const target = cellLookup;
    setCellLookup(null);
    if (!row || !target) return;
    crud.updateRow(target.insureApplyId, { personId: row.personId, personNo: row.empNo ?? '', personName: row.korNm ?? '' });
  };

  // [E8] tempDownloadButton[템플릿].Select (L220) → downloadForm.submit() (./excelTemplete/Template_4대보험 납부방법 변경.xlsx)
  const downloadTemplate = async () => {
    try {
      await payApi.downloadInsureApplyTemplate();
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    }
  };

  // [E15] fileUploadField.Change (L430) → uploadExcelForm.submit() · [E10] uploadExcelForm.SubmitComplete (L238) → retrieve()
  const onExcelFile = async (file?: File) => {
    if (!file) return;
    try {
      const count = await payApi.uploadInsureApplyExcel('pay-method', file);
      message.success(`4대보험 납부방법을 업로드하였습니다. (${count}건)`);
    } catch (err) {
      message.error(errorMessage(err, '업로드 실패'));
    }
    await retrieve();
  };

  // buildGrid() L263-309 — CellEditGrid(Pay31_InsureApplyModel), 체크 다중
  const columnDefs = useMemo(() => [
    gb.textCenter('personNo', 80, '사번'),
    gb.textCenter('personName', 100, '성명', {
      cellStyle: { color: '#1677ff' },
      cellRenderer: (p: { data?: PayInsureApply; value?: string }) => (
        <><AntButton type="text" size="small" icon={<SearchOutlined />} onClick={e => { e.stopPropagation(); if (p.data) setCellLookup(p.data); }} />{p.value}</>
      ),
    }),
    // [E12] insureComboBox.Collapse (L277) → 고른 보험의 코드·이름을 그 행에 넣는다
    gb.text('insureName', 150, '구분', {
      editor: 'select',
      values: insureCodes.map(c => c.name),
      valueSetter: p => {
        const d = p.data as unknown as Record<string, unknown>;
        d.insureName = p.newValue;
        d.insureCode = insureCodes.find(c => c.name === p.newValue)?.code ?? null;
        return true;
      },
    }),
    // [E13] payComboBox[DivPayCode].Collapse (L288) → 고른 납부방법의 코드·이름을 그 행에 넣는다
    gb.text('payName', 150, '납부방법', {
      editor: 'select',
      values: payCodes.map(c => c.name),
      valueSetter: p => {
        const d = p.data as unknown as Record<string, unknown>;
        d.payName = p.newValue;
        d.payCode = payCodes.find(c => c.name === p.newValue)?.code ?? null;
        return true;
      },
    }),
    gb.long('payDiv', 150, '분할납부지정회차', { editor: 'number' }),
    gb.date('applyDate', 120, '신고일자', { editor: 'date' }),
  ], [insureCodes, payCodes]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* [E4] retrieveButton[조회].Select (L196) → retrieve() */}
      <SearchBar
        onSearch={() => retrieve()}
        loading={crud.loading}
        extra={<>
          {/* [E5] insertButton[등록].Select (L202) → insertRow() */}
          <Button type="register" onClick={() => crud.addRow()}>등록</Button>
          {/* [E6] updateButton[저장].Select (L208) → update(). 저장(n)은 UX-03 */}
          <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
          {/* [E7] deleteButton[삭제].Select (L214) → deleteRow() */}
          <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
          <span style={{ width: 16 }} />
          <Button type="download" onClick={downloadTemplate}>템플릿</Button>
          {/* [E9] excelUploadButton[엑셀업로드].Select (L226) → excelUpload(): ExcelUpload?uploadType=payInsureApply4Upload */}
          <Button type="upload" onClick={() => excelForm.current?.click()}>엑셀업로드</Button>
          <FileUpdownForm ref={excelForm} accept=".xlsx,.xls" onChange={onExcelFile} />
        </>}
      >
        <SearchBar.Field label="기준년도">
          {/* [E1] yearText.KeyPress [Enter] (L148) → retrieve() */}
          <Input style={{ width: 60 }} placeholder="YYYY" value={yearText}
            onChange={e => { latest.current.yearText = e.target.value; setYearText(e.target.value); }}
            onPressEnter={() => void retrieve()} />
        </SearchBar.Field>
        <SearchBar.Field label="신고구분">
          <SystemCodeComboBox kindGroupCd="InsureCode002" altCode={['%', '전체']} style={{ width: 120 }} value={insureCode}
            onChange={code => { latest.current.insureCode = code ?? '%'; setInsureCode(code ?? '%'); }} />
        </SearchBar.Field>
        <SearchBar.Field label="사원명">
          {/* [E2] personName.TriggerClick (L158) → openLookupPerson(null) · [E3] personName.ValueChange (L164) */}
          <PayInsurePersonField onChange={(id, doRetrieve) => { personIdRef.current = id; if (doRetrieve) void retrieve(); }} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<PayInsureApply> crud={crud} columnDefs={columnDefs} />
      </div>
      <div style={{ flex: 'none', height: 100, display: 'flex', alignItems: 'center', paddingLeft: 10, lineHeight: 1.6 }}>
        <div>
          <div>변경신청 기한정보</div>
          <div>&nbsp;- 일시납/분할납부 신청 : 보수총액신고일 ~ 4/15</div>
          <div>&nbsp;- 1회차 납부 후 일시납/분할납부신청 : 4/16 ~ 5/10</div>
        </div>
      </div>
      <Emp00_Lookup_SelectSingle open={cellLookup != null} separateAddTitle transDate={dayjs().format('YYYY-MM-DD')} onResult={onCellPersonPicked} onClose={() => setCellLookup(null)} />
    </div>
  );
});
Pay31_TabPage_InsureApply4.displayName = 'Pay31_TabPage_InsureApply4';
