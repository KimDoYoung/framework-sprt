/**
 * [1352] 기초자료 > 30. 자산&경영 > 법인카드 업로드 기초자료(관리자) (E24)
 * AS-IS: myApp/client/vi/crd/Crd10_Tab_ExcelCompanyAdmin.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L52-102: 툴바(조회 · 등록 · 저장 · 삭제) + 체크박스 다중 셀 편집 그리드(카드사명 150 콤보 · 맵핑 80 아이콘 · 비고 500). 여백 20, 최대 폭 1000
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 저장 = 저장(n)(UX-03). 원본에 검색 조건·초기화 버튼이 없어 onReset(UX-02)은 넣지 않는다
 * 로그인 회사의 카드사만 조회한다(retrieve() L139).
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { crdApi } from '@/api/crd';
import { sysApi } from '@/api/sys';
import { CrdExcelCompany } from '@/types/crd';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Crd11_Lookup_ExcelCodeAdmin } from './Crd11_Lookup_ExcelCodeAdmin';

const gb = gbFor<CrdExcelCompany>();

/**
 * AS-IS buildGrid() L104-135: setChecked(MULTI).
 * [E5] creditCardCompanyComboBox[CreditCardCompany].Collapse (L109) → 고른 이름에 맞춰 코드(bankCode)도 바꾼다
 */
const buildGrid = (banks: Code[], openLookup: (row: CrdExcelCompany) => void) => [
  gb.text('bankName', 150, '카드사명', {  // L130
    editor: 'select',
    values: banks.map(c => c.name),
    valueSetter: p => {
      p.data.bankName = p.newValue;
      p.data.bankCode = banks.find(c => c.name === p.newValue)?.code ?? p.data.bankCode;
      return true;
    },
  }),
  iconCell<CrdExcelCompany>('edit', 'actionCell', 80, '맵핑', openLookup),  // L131 ImageCell("Edit") → Crd11_Lookup_ExcelCodeAdmin.open(선택한 행)
  gb.text('note', 500, '비고', { editor: 'text' }),  // L132
];

export const Crd10_Tab_ExcelCompanyAdmin: React.FC = () => {
  const user = useLoginUser();
  const [banks, setBanks] = useState<Code[]>([]);
  const [lookupRow, setLookupRow] = useState<CrdExcelCompany | null>(null);
  const columnDefs = useMemo(() => buildGrid(banks, setLookupRow), [banks]);

  const crud = useGridCrud<CrdExcelCompany>({
    idField: 'excelCompanyId',
    // retrieve() L137-148: 회사(로그인 회사, 서버) → crd.Crd10_ExcelCompany.selectByCompanyId
    search: crdApi.searchExcelCompanies,
    // update() L150-177: GridUpdate → crd.Crd10_ExcelCompany.update
    save: crdApi.saveExcelCompanies,
    // deleteRow() L206-210: GridDeleteData → crd.Crd10_ExcelCompany.delete
    remove: crdApi.deleteExcelCompanies,
    // [E4] deleteButton[삭제].Select (L82) → deleteChk() L186-204: "삭제"/"n건의 항목을 삭제하시겠습니까?"(체크한 행 수) → [E6] msgBox.DialogHide [YES] (L189) → deleteRow()
    deleteConfirm: n => `${n}건의 항목을 삭제하시겠습니까?`,
    // insertRow() L179-184: 회사 ID = 로그인 회사
    newRow: useCallback(() => ({ companyId: user.companyId }), [user.companyId]),
    firstEditField: 'bankName',
    // update() L150-177: 수정한 행마다 카드사 필수, 그 다음 전체 행 카드사 중복
    validate: (changed, all) => {
      if (changed.some(m => !m.bankCode || !m.bankName)) return '카드사는 필수선택항목입니다.';
      const codes = all.map(m => m.bankCode);
      if (codes.length !== new Set(codes).size) return '중복된 카드사가 존재합니다';
      return undefined;
    },
  });

  useEffect(() => {
    sysApi.searchCodes('CreditCardCompany').then(setBanks).catch(() => {});
  }, []);

  // [E0] 화면 열림 (생성자 L52-102): 열 때 조회
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { crud.retrieve(); }, []);

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20, display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 1000 }}>
      {/* [E1] retrieveButton[조회].Select (L61) → retrieve() */}
      <SearchBar onSearch={crud.retrieve} loading={crud.loading} extra={<>
        {/* [E2] insertButton[등록].Select (L68) → insertRow() L179-184 */}
        <Button type="register" onClick={crud.addRow}>등록</Button>
        {/* [E3] updateButton[저장].Select (L75) → update() L150-177. 저장(n)은 UX-03 */}
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
        <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
      </>} />
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<CrdExcelCompany> crud={crud} columnDefs={columnDefs} />
      </div>
      <Crd11_Lookup_ExcelCodeAdmin excelCompany={lookupRow} onClose={() => setLookupRow(null)} />
    </div>
  );
};
