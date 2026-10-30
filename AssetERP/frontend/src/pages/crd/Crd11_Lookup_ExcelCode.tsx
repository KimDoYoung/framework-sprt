/**
 * 업로드 구분코드 맵핑 창 (U14) — Crd02_Tab_DataUpload의 [엑셀업로드 설정]에서 연다 (카드회사를 고르면 보이는 단추)
 * AS-IS: myApp/client/vi/crd/Crd11_Lookup_ExcelCode.java (338줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L66-108: 모달 700×600 "{카드사명} 매핑", 위 = 툴바 [조회][등록][저장][삭제](70%) + [커스텀 설정](30%, 오른쪽), 아래 = 셀 편집 그리드(행번호, 체크박스 다중:
 *   업로드 구분코드 200(콤보 CreditCardExcelCode) · 위치(세로줄) 100 · 비고 280), 아래 가운데 [닫기]
 * 이 회사의 맵핑이 없으면 기본 맵핑(회사 0)을 보여 주고 [등록][저장][삭제]를 막는다 → [커스텀 설정]으로 복사해야 고칠 수 있다. 삭제 단추 설명: 전체 제거 후 조회 시 기본세팅으로 돌아간다
 * 같은 맵핑을 관리자 화면에서 고치는 Crd11_Lookup_ExcelCodeAdmin(E24)과 그리드·API가 같다
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Space, Tooltip, message } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { crdApi } from '@/api/crd';
import { errorMessage } from '@/api/client';
import { sysApi } from '@/api/sys';
import { CrdExcelCode } from '@/types/crd';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<CrdExcelCode>();

interface Props {
  open: boolean;
  /** open(bankCode, CCompanyName) L66 */
  bankCode: string;
  bankName: string;
  onClose: () => void;
}

/** buildGrid() L151-173. [E7] cardExcelCodeComboBox[CreditCardExcelCode].Collapse (L157) → 고른 이름에 맞춰 코드(bankExcelCode)도 바꾼다 */
const buildGrid = (excelCodes: Code[]) => [
  gb.text('bankExcelName', 200, '업로드 구분코드', {
    editor: 'select',
    values: excelCodes.map(c => c.name),
    valueSetter: p => {
      p.data.bankExcelName = p.newValue;
      p.data.bankExcelCode = excelCodes.find(c => c.name === p.newValue)?.code ?? p.data.bankExcelCode;
      return true;
    },
  }),
  gb.longCenter('seq', 100, '위치(세로줄)', { editor: 'number' }),
  gb.textArea('text', 280, '비고', { editor: 'largeText' }),
];

export const Crd11_Lookup_ExcelCode: React.FC<Props> = ({ open, bankCode, bankName, onClose }) => {
  const [excelCodes, setExcelCodes] = useState<Code[]>([]);
  /** 이 회사의 맵핑이 있는가 — 없으면 기본 맵핑을 보여 주고 등록·저장·삭제를 막는다(excelCodeChk) */
  const [custom, setCustom] = useState(false);
  const columnDefs = useMemo(() => buildGrid(excelCodes), [excelCodes]);

  const crud = useGridCrud<CrdExcelCode>({
    idField: 'excelCodeId',
    // [E1] retrieveButton[조회].Select (L111) → excelCodeChk() L189-218: 이 회사 맵핑이 있으면 그것을(단추 켬), 없으면 retrieve(0L) 기본 맵핑을(단추 끔)
    search: useCallback(async () => {
      const own = await crdApi.searchExcelCodes(bankCode);
      setCustom(own.length > 0);
      return own.length > 0 ? own : crdApi.searchExcelCodes(bankCode, true);
    }, [bankCode]),
    // update() L303-333 → crd.Crd11_ExcelCode.update
    save: crdApi.saveExcelCodes,
    // deleteRow() L289-301 → crd.Crd11_ExcelCode.delete
    remove: crdApi.deleteExcelCodes,
    // [E4] deleteButton[삭제].Select (L130) → deleteChk() L269-287: "삭제"/"n건의 항목을 삭제하시겠습니까?"(체크한 행 수, 폭 300) → [E8] msgBox.DialogHide [YES] → deleteRow()
    deleteConfirm: n => `${n}건의 항목을 삭제하시겠습니까?`,
    // insertRow() L220-227: 회사 ID · 카드사 코드
    newRow: useCallback(() => ({ bankCode }), [bankCode]),
    firstEditField: 'bankExcelName',
    // update() L303-333: 수정한 행마다 구분코드·위치 필수, 그 다음 전체 행 코드 중복
    validate: (changed, all) => {
      for (const m of changed) {
        if (!m.bankExcelCode || !m.bankExcelName) return '구분코드는 필수선택항목입니다.';
        if (m.seq == null) return '위치(세로줄)은 필수입력사항입니다.';
      }
      const codes = all.map(m => m.bankExcelCode);
      if (codes.length !== new Set(codes).size) return '중복된 코드가 존재합니다';
      return undefined;
    },
    // deleteRow() L295-299: 다 지워 목록이 비면 excelCodeChk() — 기본 맵핑으로 돌아간다
    onChanged: () => {
      setTimeout(() => {
        if ((crud.gridRef.current?.api?.getDisplayedRowCount() ?? 0) === 0) void crud.retrieve();
      }, 0);
    },
  });

  useEffect(() => {
    sysApi.searchCodes('CreditCardExcelCode').then(setExcelCodes).catch(() => {});
  }, []);

  // open() L66-108: show(), excelCodeChk()
  useEffect(() => {
    if (open) void crud.retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, bankCode]);

  // [E5] customSetButton[커스텀 설정].Select (L136) → customChk() L229-246: 이 회사 맵핑이 이미 있으면 "이미 커스텀 설정이 되어있습니다."
  //   → copyData() L248-267: crd.Crd11_ExcelCode.copyData(화면에 보이는 기본 맵핑 전체) 뒤 excelCodeChk()
  const customChk = async () => {
    try {
      const own = await crdApi.searchExcelCodes(bankCode);
      if (own.length !== 0) {
        message.warning('이미 커스텀 설정이 되어있습니다.');
        return;
      }
      await crdApi.copyExcelCodes(bankCode, crud.rows);
      await crud.retrieve();
    } catch (err) {
      message.warning(errorMessage(err, '커스텀 설정 실패'));
    }
  };

  return (
    <LookupModal
      open={open}
      title={`${bankName} 매핑`}
      width={700}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E6] closeButton[닫기].Select (L143) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 480, display: 'flex', flexDirection: 'column', gap: 8, border: '1px solid #d9d9d9', padding: 8, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Space style={{ flex: 1 }}>
            <Button type="search" onClick={crud.retrieve}>조회</Button>
            {/* [E2] insertButton[등록].Select (L117) → insertRow() */}
            <Button type="register" disabled={!custom} onClick={crud.addRow}>등록</Button>
            {/* [E3] updateButton[저장].Select (L123) → update(). 저장(n)은 UX-03 */}
            <Button type="save" disabled={!custom} count={crud.changes} onClick={crud.saveRows}>저장</Button>
            <Tooltip title="전체 제거 후 조회 시 기본세팅으로 돌아갑니다.">
              <span><Button type="delete" disabled={!custom} onClick={crud.deleteChecked}>삭제</Button></span>
            </Tooltip>
          </Space>
          <Button type="assign" onClick={customChk}>커스텀 설정</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<CrdExcelCode> crud={crud} columnDefs={columnDefs} />
        </div>
      </div>
    </LookupModal>
  );
};
