/**
 * 투자한도/StopLoss 설정 조회창 (W03) — Ast40_Tab_OwnerCapital 의 [투자한도/StopLoss 설정]
 * AS-IS: myApp/client/vi/ast/Ast41_Lookup_InvestLimit.java (296줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 1000×500: 위 툴바([조회][생성][삭제] / [행 추가][행 삭제]) + 왼쪽 기준 적용일 목록(200, SingleGrid) + 오른쪽 자산구분별 한도(CellEditGrid) + 푸터 [저장][닫기]
 * 하위: Ast41_Lookup_Insert(적용일 생성)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, message } from 'antd';
import { errorMessage } from '@/api/client';
import { astApi } from '@/api/ast';
import { sysApi } from '@/api/sys';
import { InvestLimit, InvestLimitDate } from '@/types/ast';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Ast41_Lookup_Insert } from './Ast41_Lookup_Insert';

const gbDate = gbFor<InvestLimitDate>();
const gb = gbFor<InvestLimit>();

interface Props {
  open: boolean;
  onClose: () => void;
}

// buildGrid() L164-168
const dateColumns = [
  gbDate.date('startDate', 150, '기준 적용일'),  // L166
];

// buildFormGrid() L170-190 — [E9] investAssetTypeComboBox[InvestAssetType].Collapse (L174) → 자산구분 코드·이름 동기화 (valueSetter)
const buildFormColumns = (assetTypes: Code[]) => [
  gb.text('investAssetName', 150, '자산구분', {                                  // L185
    editor: 'select',
    values: assetTypes.map(c => c.name),
    valueSetter: p => {
      p.data.investAssetName = p.newValue;
      p.data.investAssetType = assetTypes.find(c => c.name === p.newValue)?.code ?? p.data.investAssetType;
      return true;
    },
  }),
  gb.double('limitRate', 150, '투자한도비율(%)', { editor: 'number' }),         // L186
  gb.double('stopLossRate', 150, 'Stop Loss(%)', { editor: 'number' }),        // L187
  gb.text('note', 200, '비고', { editor: 'text' }),                            // L188
];

export const Ast41_Lookup_InvestLimit: React.FC<Props> = ({ open, onClose }) => {
  const [dates, setDates] = useState<InvestLimitDate[]>([]);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [assetTypes, setAssetTypes] = useState<Code[]>([]);
  const [insertOpen, setInsertOpen] = useState(false);
  const dateGridRef = useRef<{ api?: { getDisplayedRowAtIndex: (i: number) => { setSelected: (b: boolean) => void } | undefined } }>(null);
  const selectFirst = useRef(false);

  const formColumns = useMemo(() => buildFormColumns(assetTypes), [assetTypes]);

  // retrieveForm() L265-275: ast.Ast41_InvestLimit.selectByDate
  const search = useCallback(async () => (startDate ? astApi.searchInvestLimits(startDate) : []), [startDate]);
  const save = useCallback((changed: InvestLimit[]) => astApi.saveInvestLimits(changed), []);
  const remove = useCallback((ids: number[]) => astApi.deleteInvestLimits(ids), []);
  // insertRow() L277-285: 선택한 적용일을 새 행에 넣는다(회사는 서버)
  const newRow = useCallback((): Partial<InvestLimit> => ({ startDate: startDate ?? undefined }), [startDate]);

  const crud = useGridCrud<InvestLimit>({
    idField: 'investLimitId',
    search,
    save,
    remove,
    newRow,
    firstEditField: 'investAssetName',
    reloadAfterSave: true,   // update() L192-202: 저장 뒤 retrieveForm()
    deleteConfirm: false,    // deleteRow() L287-291: 확인 창 없이 GridDeleteData
    validate: (changed, all) => {
      void all;
      return changed.some(r => !r.investAssetType) ? '자산구분은 필수입력 항목입니다.' : undefined;
    },
  });
  const { retrieve: retrieveForm, clear } = crud;

  // retrieve() L252-263: ast.Ast41_InvestLimit.selectByCompanyId, 조회 뒤 첫 행 선택
  const retrieve = useCallback(async () => {
    try {
      selectFirst.current = true;
      setDates(await astApi.searchInvestLimitDates());
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (생성자 L71-162) → show(), 목록 조회
  useEffect(() => {
    if (!open) return;
    setStartDate(null);
    clear();
    sysApi.searchCodes('InvestAssetType').then(setAssetTypes).catch(() => {});
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E1] grid.SelectionChanged [선택>0] (L78) → retrieveForm()
  useEffect(() => { if (open && startDate) void retrieveForm(); else clear(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [startDate]);

  const onDateRowsUpdated = () => {
    if (!selectFirst.current) return;
    selectFirst.current = false;
    dateGridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true);
  };

  // [E4] deleteButton[삭제].Select (L100) → delete() L204-240
  const deleteDate = () => {
    if (!startDate) {
      message.warning('기준 적용일을 선택해주세요');
      return;
    }
    Modal.confirm({
      title: '삭제',
      content: '해당 적용일을 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 400,
      onOk: async () => {   // [E10] msgBox.DialogHide [YES] (L212) → deleteByDate, retrieve(), formGrid.clear
        try {
          await astApi.deleteInvestLimitDate(startDate);
          setStartDate(null);
          clear();
          await retrieve();
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  return (
    <LookupModal
      open={open}
      title="투자한도/StopLoss 설정"
      width={1000}
      maskClosable={false}
      style={{ top: 20 }}
      onCancel={onClose}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0, textAlign: 'center' },
      }}
      footer={[
        /* [E7] updateButton[저장].Select (L119) → update() */ <Button key="save" type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>,
        /* [E8] cancleButton[닫기].Select (L125) → hide() */ <Button key="close" type="close" onClick={onClose}>닫기</Button>,
      ]}
    >
      <div style={{ height: 400, display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 2px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {/* [E2] retrieveButton[조회].Select (L88) → retrieve() */}
            <Button type="search" onClick={retrieve}>조회</Button>
            {/* [E3] insertButton[생성].Select (L94) → insert() L242-250: Ast41_Lookup_Insert 열기, 닫힌 뒤 retrieve() */}
            <Button type="generate" onClick={() => setInsertOpen(true)}>생성</Button>
            <Button type="delete" onClick={deleteDate}>삭제</Button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {/* [E5] insertRowButton[행 추가].Select (L106) → insertRow() */}
            <Button type="addRow" onClick={crud.addRow} disabled={!startDate}>행 추가</Button>
            {/* [E6] deleteRowButton[행 삭제].Select (L112) → deleteRow() */}
            <Button type="removeRow" onClick={crud.deleteChecked}>행 삭제</Button>
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 8 }}>
          <div style={{ width: 200, flex: 'none' }}>
            <SingleGrid<InvestLimitDate>
              gridRef={dateGridRef as never}
              rowData={dates}
              columnDefs={dateColumns}
              getRowId={p => String(p.data.investLimitId)}
              onRowDataUpdated={onDateRowsUpdated}
              onSelect={row => { if (row) setStartDate(row.startDate); }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <CellEditGrid<InvestLimit> crud={crud} columnDefs={formColumns} />
          </div>
        </div>
      </div>
      <Ast41_Lookup_Insert open={insertOpen} onCreated={() => void retrieve()} onClose={() => setInsertOpen(false)} />
    </LookupModal>
  );
};
