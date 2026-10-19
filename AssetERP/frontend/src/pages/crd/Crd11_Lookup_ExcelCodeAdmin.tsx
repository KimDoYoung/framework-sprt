/**
 * 업로드 구분코드 맵핑 창 (E24) — Crd10_Tab_ExcelCompanyAdmin의 "맵핑" 아이콘에서 연다
 * AS-IS: myApp/client/vi/crd/Crd11_Lookup_ExcelCodeAdmin.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L60-92: 모달 700×600 "{카드사명} 매핑", 위 = 툴바 [조회][등록][저장][삭제], 아래 = 셀 편집 그리드(행번호, 체크박스 다중:
 *   업로드 구분코드 200(콤보 CreditCardExcelCode) · 위치(세로줄) 100 · 비고 280), 아래 가운데 [닫기]
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { crdApi } from '@/api/crd';
import { sysApi } from '@/api/sys';
import { CrdExcelCode, CrdExcelCompany } from '@/types/crd';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<CrdExcelCode>();

interface Props {
  /** open(selectModel) L60-92 — 값이 있으면 열린다 (고른 카드사 행) */
  excelCompany: CrdExcelCompany | null;
  onClose: () => void;
}

/** [E6] cardExcelCodeComboBox[CreditCardExcelCode].Collapse (L135) → 고른 이름에 맞춰 코드(bankExcelCode)도 바꾼다. buildGrid() L129-151 */
const buildGrid = (excelCodes: Code[]) => [
  gb.text('bankExcelName', 200, '업로드 구분코드', {  // L146
    editor: 'select',
    values: excelCodes.map(c => c.name),
    valueSetter: p => {
      p.data.bankExcelName = p.newValue;
      p.data.bankExcelCode = excelCodes.find(c => c.name === p.newValue)?.code ?? p.data.bankExcelCode;
      return true;
    },
  }),
  gb.longCenter('seq', 100, '위치(세로줄)', { editor: 'number' }),  // L147
  gb.textArea('text', 280, '비고', { editor: 'largeText' }),  // L148
];

export const Crd11_Lookup_ExcelCodeAdmin: React.FC<Props> = ({ excelCompany, onClose }) => {
  const open = excelCompany !== null;
  const [excelCodes, setExcelCodes] = useState<Code[]>([]);
  const columnDefs = useMemo(() => buildGrid(excelCodes), [excelCodes]);

  const crud = useGridCrud<CrdExcelCode>({
    idField: 'excelCodeId',
    // retrieve() L153-165: 회사(서버) · bankCode → crd.Crd11_ExcelCode.selectByCompanyId
    search: useCallback(() => (excelCompany?.bankCode ? crdApi.searchExcelCodes(excelCompany.bankCode) : Promise.resolve([])), [excelCompany]),
    // update() L202-232: GridUpdate → crd.Crd11_ExcelCode.update
    save: crdApi.saveExcelCodes,
    // deleteRow() L196-200: GridDeleteData → crd.Crd11_ExcelCode.delete
    remove: crdApi.deleteExcelCodes,
    // [E4] deleteButton[삭제].Select (L113) → deleteChk() L176-194: "삭제"/"n건의 항목을 삭제하시겠습니까?"(체크한 행 수) → [E7] msgBox.DialogHide [YES] (L179) → deleteRow()
    deleteConfirm: n => `${n}건의 항목을 삭제하시겠습니까?`,
    // insertRow() L167-174: 회사 ID · 카드사 코드는 열린 카드사 행의 값
    newRow: useCallback(() => ({ companyId: excelCompany?.companyId, bankCode: excelCompany?.bankCode }), [excelCompany]),
    firstEditField: 'bankExcelName',
    // update() L202-232: 수정한 행마다 구분코드·위치 필수, 그 다음 전체 행 코드 중복
    validate: (changed, all) => {
      for (const m of changed) {
        if (!m.bankExcelCode || !m.bankExcelName) return '구분코드는 필수선택항목입니다.';
        if (m.seq == null) return '위치(세로줄)은 필수입력사항입니다.';
      }
      const codes = all.map(m => m.bankExcelCode);
      if (codes.length !== new Set(codes).size) return '중복된 코드가 존재합니다';
      return undefined;
    },
  });

  useEffect(() => {
    sysApi.searchCodes('CreditCardExcelCode').then(setExcelCodes).catch(() => {});
  }, []);

  // open() L60-92: show(), retrieve()
  useEffect(() => {
    if (open) void crud.retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <LookupModal
      open={open}
      title={`${excelCompany?.bankName ?? ''} 매핑`}
      width={700}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E5] closeButton[닫기].Select (L120) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 480, display: 'flex', flexDirection: 'column', gap: 8, border: '1px solid #d9d9d9', padding: 8, boxSizing: 'border-box' }}>
        <Space>
          {/* [E1] retrieveButton[조회].Select (L95) → retrieve() */}
          <Button type="search" onClick={crud.retrieve}>조회</Button>
          {/* [E2] insertButton[등록].Select (L101) → insertRow() L167-174 */}
          <Button type="register" onClick={crud.addRow}>등록</Button>
          {/* [E3] updateButton[저장].Select (L107) → update(). 저장(n)은 UX-03 */}
          <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
          <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<CrdExcelCode> crud={crud} columnDefs={columnDefs} />
        </div>
      </div>
    </LookupModal>
  );
};
