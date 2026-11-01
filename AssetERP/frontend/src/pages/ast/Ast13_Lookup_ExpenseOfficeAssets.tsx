/**
 * 비품대장 등록 (W16) — Ast13_Tab_OfficeAssets의 [비품등록]
 * AS-IS: myApp/client/vi/ast/Ast13_Lookup_ExpenseOfficeAssets.java (493줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L86-92 / open L94-132: 모달 1100×500 "비품대장 등록", 위 줄(발생일 100 · 적요 350 · 금액 100 — 모두 읽기 전용 · [지출결의서 선택]) + 둘째 줄([조회][등록][삭제][저장]) + 셀 편집 그리드(체크 다중·합계 "계") + [닫기]
 * 그리드 6열(잠금 아이콘 40 · 거래유형 180 콤보 · 종목 300 조회창 · 적요 250 · 취득금액 100 · 취득ID 150). 읽어 온 줄은 잠금 — 적요만 고칠 수 있다
 * 폭: 열 합계 1020 + 60 + 130 = 1210 (03 원칙 21, 12 원칙으로 스크롤을 피하려 AS-IS 1100보다 크게)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Input, InputNumber, message, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Button as AntButton } from 'antd';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstCodeName, AstExpenseTr, AstOfficeTrRow, AstTrCodeTreeNode } from '@/types/ast';
import { PayExpenseOffice } from '@/types/pay';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Pay50_Lookup_ExpenseOfficeAssets } from '../pay/Pay50_Lookup_ExpenseOfficeAssets';
import { Ast01_Lookup_Info } from './Ast01_Lookup_Info';

/** 그리드 한 줄 — 읽어 온 줄(잠김) + 새 줄이 저장 때 서버로 보낼 값(지출결의서에서 온 날짜·세금·거래처·지출결의서ID) */
interface OfficeTr extends AstExpenseTr {
  date?: string | null;
  tax?: number | null;
  corpId?: number | null;
  expenseId?: number | null;
}

const gb = gbFor<OfficeTr>();
/** AS-IS 거래유형 콤보의 className */
const WINDOW_CLASS = 'Ast13_Tab_OfficeAssets';

interface Props {
  open: boolean;
  /** open(callback): 저장·삭제가 성공하면 callback.execute() — 본 화면이 retrieve() */
  onChanged: () => void;
  onClose: () => void;
}

export const Ast13_Lookup_ExpenseOfficeAssets: React.FC<Props> = ({ open, onChanged, onClose }) => {
  const [expense, setExpense] = useState<PayExpenseOffice | null>(null);
  const [trCodes, setTrCodes] = useState<AstCodeName[]>([]);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [infoRow, setInfoRow] = useState<OfficeTr | null>(null);

  // retrieve() L261-279: ast.Ast06_Tr.selectByExpenseId(companyId, expenseId) — 지출결의서를 안 골랐으면 "지출결의서를 선택하세요"
  const search = useCallback(async (): Promise<OfficeTr[]> => (expense ? astApi.searchTrsByExpense(expense.expenseId) : []), [expense]);
  const save = useCallback(async (changed: OfficeTr[]) => changed, []);
  const remove = useCallback(async () => 0, []);
  // insertRow() L281-303: 지출결의서 값으로 채운 새 줄 — 적요 = 지출내역, 취득금액 = 지출결의서 금액, 세금·거래처·지출결의서ID
  const newRow = useCallback((): Partial<OfficeTr> => ({
    lockYn: false,
    date: expense?.occDate ?? null,
    note: expense?.desc ?? null,
    contAmt: expense?.amt ?? null,
    tax: expense?.tax ?? null,
    corpId: expense?.corpId ?? null,
    expenseId: expense?.expenseId ?? null,
  }), [expense]);

  const crud = useGridCrud<OfficeTr>({
    idField: 'trId',
    search,
    save,
    remove,
    newRow,
    firstEditField: 'trName',
  });
  const { retrieve: retrieveRows, clear, removeRows, getChanged, gridRef } = crud;

  // [E0] 화면 열림 (생성자 L86-92, open L94-132, setting L134-181, buildGrid L183-259) — 거래유형 콤보(selectWindowUseTrCode)
  useEffect(() => {
    if (!open) return;
    setExpense(null);
    clear();
    astApi.searchWindowTrCodes(WINDOW_CLASS).then(setTrCodes).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // lookupExpense() L462-485: 고른 지출결의서를 위 줄에 넣고 retrieve()
  useEffect(() => { if (open && expense) void retrieveRows(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [expense]);

  const retrieve = () => {
    if (!expense) {
      message.warning('지출결의서를 선택하세요');
      return;
    }
    void retrieveRows();
  };

  const insertRow = () => {
    if (!expense) {
      message.warning('지출결의서가 먼저 선택되어야 합니다.');
      return;
    }
    crud.addRow();
  };

  // preUpdate() L305-340 → checkClose(occDate) → update() L342-360
  const update = async () => {
    gridRef.current?.api?.stopEditing();
    const changed = getChanged();
    if (changed.length === 0) {
      message.warning('변경된 내역이 없습니다');
      return;
    }
    for (const r of changed) {
      if (!r.trCode) { message.warning('거래유형을 선택하세요'); return; }
      if (r.astClassTreeId == null) { message.warning('종목을 선택하세요'); return; }
      if (r.contAmt == null) { message.warning('취득금액을 입력하세요'); return; }
    }
    try {
      await astApi.checkDepnClose(expense?.occDate ?? '');   // [E5] Act04_GenLedger.checkClose(companyId, stdDate = 발생일)
      const payload: AstOfficeTrRow[] = changed.map(r => ({
        trId: r.trId, lockYn: r.lockYn, trCode: r.trCode, astClassTreeId: r.astClassTreeId, note: r.note, contAmt: r.contAmt,
        date: r.date ?? null, tax: r.tax ?? null, corpId: r.corpId ?? null, expenseId: r.expenseId ?? null,
      }));
      await astApi.saveOfficeAssetTrs(payload);        // ast.Ast06_Tr.updateDepn2
      message.success('비품 등록이 완료되었습니다.');
      onChanged();
      void retrieveRows();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // preDelete() L362-401 → checkDepn(감가상각) → checkClose(발생일) → delete(): 확인 "선택한 비품원장을 삭제하시겠습니까?"
  const preDelete = () => {
    const checked = (gridRef.current?.api?.getSelectedRows() ?? []) as OfficeTr[];
    if (checked.length === 0) {
      message.warning('삭제할 내역을 선택하세요');
      return;
    }
    Modal.confirm({
      title: '확인',
      content: '선택한 비품원장을 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 350,
      onOk: async () => {   // [E10] msgBox.DialogHide [YES] (L375)
        const savedIds = checked.map(r => r.trId).filter(id => id > 0);
        try {
          if (savedIds.length > 0) {
            await astApi.checkTrDepn(savedIds);               // ast.Ast06_Tr.checkDepnMulti
            await astApi.checkDepnClose(expense?.occDate ?? '');   // act.Act04_GenLedger.checkClose
            await astApi.deleteTrs(savedIds);                 // ast.Ast06_Tr.delete
          }
          removeRows(checked.map(r => r.trId));
          message.success('삭제가 완료되었습니다');
          if (savedIds.length > 0) {
            onChanged();
            void retrieveRows();
          }
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // [E8] astFullName.TriggerClick [data.getTrCode() == null] (L203) → "거래유형을 선택하세요" / 있으면 Ast01_Lookup_Info.gridInsert("1", trCode, "1", …)
  const openInfo = (row: OfficeTr) => {
    if (!row.trCode) {
      message.warning('거래유형을 선택하세요');
      return;
    }
    setInfoRow(row);
  };
  const onInfoResult = (node: AstTrCodeTreeNode | null) => {
    if (node && infoRow) crud.updateRow(infoRow.trId, { astClassTreeId: node.classTreeId, classTreeFullName: node.classTreeFullName });
    setInfoRow(null);
  };

  // [E9] gridBuilder.BeforeStartEdit [model != null] (L243) → 잠겨 있으면 적요만 고칠 수 있다: "수정할 수 없습니다. 삭제 후 다시 등록하세요"
  const notLocked = (p: { data?: OfficeTr }) => !p.data?.lockYn;
  const columnDefs = useMemo(() => [
    gb.booleanIcon('lockYn', 40, ''),                                          // L236
    gb.text('trName', 180, '거래유형', {                                        // L237 거래유형 콤보 [E7] trNameComboBox.Collapse (L191) → trCode 동기화
      editor: 'select',
      values: trCodes.map(c => c.name),
      editable: notLocked,
      valueSetter: p => {
        p.data.trName = p.newValue;
        p.data.trCode = trCodes.find(c => c.name === p.newValue)?.code ?? p.data.trCode;
        return true;
      },
    }),
    gb.text('classTreeFullName', 300, '종목', {                                 // L238 종목 조회창 트리거
      cellStyle: { color: '#1677ff' },
      cellRenderer: (p: { data?: OfficeTr; value?: string }) => (
        <>
          <AntButton type="text" size="small" icon={<SearchOutlined />}
            onClick={e => { e.stopPropagation(); if (p.data) { if (p.data.lockYn) message.warning('수정할 수 없습니다. 삭제 후 다시 등록하세요'); else openInfo(p.data); } }} />
          {p.value}
        </>
      ),
    }),
    gb.text('note', 250, '적요', { editor: 'text' }),                           // L239 (잠겨도 고칠 수 있다)
    gb.long('contAmt', 100, '취득금액', { editor: 'number', editable: notLocked }),   // L240
    gb.longCenter('trId', 150, '취득ID', {                                      // L241 (새 줄의 임시 음수 ID는 감춘다)
      valueFormatter: p => (p.value != null && Number(p.value) > 0 ? String(p.value) : ''),
    }),
  ], [trCodes]);   // eslint-disable-line react-hooks/exhaustive-deps

  // BeforeStartEdit 메시지: 잠긴 줄의 적요 말고 다른 칸을 더블클릭하면 안내
  const onCellDoubleClicked = (e: { data?: OfficeTr; colDef: { field?: string } }) => {
    const f = e.colDef.field;
    if (e.data?.lockYn && (f === 'trName' || f === 'contAmt')) message.warning('수정할 수 없습니다. 삭제 후 다시 등록하세요');
  };

  const fmt = (n: number | null | undefined) => (n == null ? '' : String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','));

  return (
    <LookupModal
      open={open}
      title="비품대장 등록"
      width={1210}
      maskClosable={false}
      style={{ top: 20 }}
      onCancel={onClose}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0, textAlign: 'center' },
      }}
      footer={[
        /* [E6] closeButton[닫기].Select (L175) → hide() */ <Button key="close" type="close" onClick={onClose}>닫기</Button>,
      ]}
    >
      <div style={{ height: 420, display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 2px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 'bold' }}>발생일</span>
          <Input disabled style={{ width: 110 }} value={expense?.occDate ?? ''} />
          <span style={{ fontWeight: 'bold', marginLeft: 8 }}>적요</span>
          <Input disabled style={{ width: 350 }} value={expense?.desc ?? ''} />
          <span style={{ fontWeight: 'bold', marginLeft: 8 }}>금액</span>
          <InputNumber disabled controls={false} style={{ width: 110 }} value={expense?.amt ?? null} formatter={v => fmt(v as number)} />
          {/* [E1] expenseButton[지출결의서 선택].Select (L145) → lookupExpense() */}
          <Button type="search" onClick={() => setExpenseOpen(true)}>지출결의서 선택</Button>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {/* [E2] retrieveButton[조회].Select (L151) → retrieve() */}
          <Button type="search" onClick={retrieve}>조회</Button>
          {/* [E3] insertRowButton[등록].Select (L157) → insertRow() */}
          <Button type="register" onClick={insertRow}>등록</Button>
          {/* [E4] deleteRowButton[삭제].Select (L163) → preDelete() */}
          <Button type="delete" onClick={preDelete}>삭제</Button>
          {/* [E5] updateButton[저장].Select (L169) → preUpdate() */}
          <Button type="save" count={crud.changes} onClick={update}>저장</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<OfficeTr> crud={crud} columnDefs={columnDefs} onCellDoubleClicked={onCellDoubleClicked as never}
            sumRow={{ labelField: 'trName', label: '계', sum: ['contAmt'] }} />
        </div>
      </div>
      <Pay50_Lookup_ExpenseOfficeAssets open={expenseOpen} onResult={r => setExpense(r)} onClose={() => setExpenseOpen(false)} />
      <Ast01_Lookup_Info open={infoRow !== null} assetType="1" trCode={infoRow?.trCode ?? null} abroType="1" onResult={onInfoResult} onClose={() => setInfoRow(null)} />
    </LookupModal>
  );
};
