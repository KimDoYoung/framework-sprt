/**
 * 불공제세액 관리 조회창 (W11) — Ast06_Tab_EvalDepn 의 자산명 더블클릭(미처리 줄)
 * AS-IS: myApp/client/vi/ast/Ast16_Lookup_NonDeductTax.java (191줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(purTrId, header, callback) L53-59: 700×400, 위 툴바 50([조회][등록][삭제]) + 그리드(체크 다중, 편집: 적용일자 120 · 불공제세액(추가분) 120 · 비고 350) + 푸터 [저장][닫기]
 * 모달: 11a 조회창 규격(LookupModal) — 열 폭 합계 590 + 60 + 130 = 780 (03 원칙 21, AS-IS 700보다 작게 하지 않는다)
 * UX보강(10): [저장(n)] UX-03, 툴바 [조회] 중복 클릭 방지 UX-01
 * 스타일: MG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useCallback, useEffect, useMemo } from 'react';
import { astApi } from '@/api/ast';
import { AstNonDeductTax } from '@/types/ast';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<AstNonDeductTax>();

export interface NonDeductTaxTarget {
  purTrId: number;
  /** "[ 자산명 ] (취득일 yyyy-MM-dd)" */
  title: string;
}

interface Props {
  target: NonDeductTaxTarget | null;
  /** [저장] 성공 뒤(callback.execute()) — 창은 닫힌다 */
  onSaved: () => void;
  onClose: () => void;
}

export const Ast16_Lookup_NonDeductTax: React.FC<Props> = ({ target, onSaved, onClose }) => {
  const open = target !== null;
  const purTrIdRef = React.useRef<number | null>(target?.purTrId ?? null);
  if (target) purTrIdRef.current = target.purTrId;
  const onSavedRef = React.useRef(onSaved);
  onSavedRef.current = onSaved;
  const onCloseRef = React.useRef(onClose);
  onCloseRef.current = onClose;

  // retrieve() L129-141: ast.Ast16_NonDeductTax.selectByPurTrId(purTrId)
  const search = useCallback(() => astApi.searchNonDeductTaxes(purTrIdRef.current as number), []);
  // update() L143-154: ast.Ast16_NonDeductTax.update → callback.execute() → hide()
  const save = useCallback(async (changed: AstNonDeductTax[]) => {
    const ids = await astApi.saveNonDeductTaxes(changed);
    onSavedRef.current();
    onCloseRef.current();
    return changed.map((r, i) => ({ ...r, nonDeductTaxId: ids[i] ?? r.nonDeductTaxId }));
  }, []);
  // [E6] msgBox.DialogHide [YES] (L167) → delete() L164-184: 확인 "삭제하시겠습니까?" → GridDeleteData(ast.Ast16_NonDeductTax.delete)
  const remove = useCallback((ids: number[]) => astApi.deleteNonDeductTaxes(ids), []);
  // insertRow() L156-162: purTrId만 채운 새 행
  const newRow = useCallback((): Partial<AstNonDeductTax> => ({ purTrId: purTrIdRef.current as number }), []);

  const crud = useGridCrud<AstNonDeductTax>({
    idField: 'nonDeductTaxId', search, save, remove, newRow, firstEditField: 'applyDate',
    deleteConfirm: '삭제하시겠습니까?',
  });
  const { retrieve } = crud;

  // [E0] 화면 열림 (생성자 L61-76) → show(), setting() L78-115 → retrieve() — 열 때마다 새로 읽는다
  useEffect(() => { if (open) void retrieve(); }, [target]);  // eslint-disable-line react-hooks/exhaustive-deps

  // buildGrid() L117-127: MultiGrid(체크), 편집 열
  const columnDefs = useMemo(() => [
    gb.date('applyDate', 120, '적용일자', { editor: 'date' }),                              // L122 MyDateField
    gb.long('applyNonDeductTax', 120, '불공제세액<br>(추가분)', { editor: 'number' }),       // L123 LongField
    gb.text('note', 350, '비고', { editor: 'text' }),                                       // L124 TextField
  ], []);

  return (
    <LookupModal open={open} title={target?.title ?? ''} width={780} maskClosable={false} onCancel={onClose} destroyOnHidden
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0, textAlign: 'center' },
      }}
      footer={[
        /* [E3] updateButton[저장].Select (L91) → update() */ <Button key="save" type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>,
        /* [E1] cancleButton[닫기].Select (L79) → hide() */ <Button key="close" type="close" onClick={onClose}>닫기</Button>,
      ]}
    >
      <div style={{ height: 300, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {/* [E2] retrieveButton[조회].Select (L85) → retrieve() */}
          <Button type="search" onClick={() => retrieve()}>조회</Button>
          {/* [E4] insertRowButton[등록].Select (L97) → insertRow() */}
          <Button type="register" onClick={crud.addRow}>등록</Button>
          {/* [E5] deleteButton[삭제].Select (L103) → delete() */}
          <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<AstNonDeductTax> crud={crud} columnDefs={columnDefs} />
        </div>
      </div>
    </LookupModal>
  );
};
