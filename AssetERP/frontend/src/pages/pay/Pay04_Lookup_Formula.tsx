/**
 * 임금계산방법 창 (S16) — Pay11_TabPage_MonthItem의 [임금계산방법]이 연다.
 * AS-IS: myApp/client/vi/pay/Pay04_Lookup_Formula.java (300줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L69-160: 1000×500 모달 "임금계산방법", 위 툴바(왼쪽 77% [조회][생성][삭제] · 오른쪽 23% [행 추가][행 삭제]),
 *   왼쪽 200 기준 적용일 단일 선택 그리드(150) | 가운데 산출식 체크 다중 셀 편집 그리드(구분 150 · 산출식 또는 산출방법 입력 320 · 비고 200), 아래 가운데 [저장][닫기]
 * 열 때 retrieve(): 로그인 회사의 적용일을 읽고 첫 행을 고른다 → 고른 적용일의 산출식(retrieveForm).
 * 같은 데이터·API를 쓰는 탭 화면 Pay04_TabPage_Formula(E22)와 달리 모든 회사가 자기 회사 산출식을 고친다(쓰기 권한은 로그인 회사 행만 — 사용자 결정 2026-10-28)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { PayFormula, PayFormulaDate } from '@/types/pay';
import { Button } from '@/components/button';
import { CellEditGrid, SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Pay04_Lookup_Insert } from './Pay04_Lookup_Insert';
import { Pay20_Lookup_ItemList } from './Pay20_Lookup_ItemList';

const dateGb = gbFor<PayFormulaDate>();
const gb = gbFor<PayFormula>();

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Pay04_Lookup_Formula: React.FC<Props> = ({ open, onClose }) => {
  const dateGridRef = useRef<AgGridReact<PayFormulaDate>>(null);
  const [dates, setDates] = useState<PayFormulaDate[]>([]);
  const [selectedDate, setSelectedDate] = useState<PayFormulaDate>();
  const [formTick, setFormTick] = useState(0);
  const [insertOpen, setInsertOpen] = useState(false);
  const [itemOpen, setItemOpen] = useState(false);

  // buildGrid(): 기준 적용일 150 / buildFormGrid(): 구분 150 · 산출식 320 · 비고 200
  const dateColumnDefs = useMemo(() => [dateGb.date('startDate', 150, '기준 적용일')], []);
  const formColumnDefs = useMemo(() => [
    gb.text('itemName', 150, '구분'),
    gb.text('formulaForm', 320, '산출식 또는 산출방법 입력', { editor: 'text' }),
    gb.text('note', 200, '비고', { editor: 'text' }),
  ], []);

  const crud = useGridCrud<PayFormula>({
    idField: 'formulaId',
    // retrieveForm() L251-261: 로그인 회사(서버) · 고른 적용일 → pay.Pay04_Formula.selectByDate
    search: useCallback(() => (selectedDate ? payApi.searchFormulas(selectedDate.startDate) : Promise.resolve([])), [selectedDate]),
    save: payApi.saveFormulas,
    remove: payApi.deleteFormulas,
    newRow: useCallback(() => ({}), []),
    firstEditField: 'formulaForm',
    deleteConfirm: false,  // deleteRow() L291-295: GridDeleteData, 확인창 없음
    reloadAfterSave: true,  // update() L178-188: 저장 뒤 고른 적용일 retrieveForm()
  });

  // [E0] 화면 열림 (생성자 L69-160) → show()
  // retrieve() L238-249: 로그인 회사의 적용일을 읽고 있으면 첫 행을 고른다
  const retrieve = useCallback(async () => {
    try {
      setDates(await payApi.searchFormulaDates());
      setFormTick(t => t + 1);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    setSelectedDate(undefined);
    crud.clear();
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    const t = setTimeout(() => dateGridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true, true), 50);
    return () => clearTimeout(t);
  }, [dates]);

  // [E1] grid.SelectionChanged [선택>0] (L76) → retrieveForm(고른 적용일). 조회마다(formTick) 같은 적용일이어도 다시 읽는다
  useEffect(() => {
    if (!open) return;
    if (selectedDate) void crud.retrieve();
    else crud.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate?.startDate, formTick]);

  // [E3] insertButton[생성].Select (L92) → insert() L228-236: Pay04_Lookup_Insert.open(callback{retrieve})
  // [E4] deleteButton[삭제].Select (L98) → delete() L190-226: 적용일을 안 골랐으면 알리고, 확인 → [E9] msgBox.DialogHide [YES] (L198) → pay.Pay04_Formula.deleteByDate → retrieve(), 산출식 그리드 비움
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

  // [E5] insertRowButton[행 추가].Select (L104) → insertRow() L263-289: Pay20_Lookup_ItemList에서 고른 급여항목마다 (항목코드·적용일·회사) 행 + 항목명을 변경으로 표시
  const insertRow = () => {
    if (!selectedDate) {
      message.warning('기준 적용일을 선택해주세요');
      return;
    }
    setItemOpen(true);
  };

  return (
    <>
      <LookupModal
        open={open}
        title="임금계산방법"
        width={1000}
        maskClosable={false}
        onCancel={onClose}
        footer={(
          <div style={{ textAlign: 'center' }}>
            <Space>
              {/* [E7] updateButton[저장].Select (L117) → update() L178-188: 변경 행 저장 → "정상적으로 저장되었습니다" → 고른 적용일 retrieveForm() */}
              <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
              {/* [E8] cancleButton[닫기].Select (L123) → hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        )}
      >
        <div style={{ height: 380, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ flex: 'none', display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <Space wrap>
              {/* [E2] retrieveButton[조회].Select (L86) → retrieve() */}
              <Button type="search" onClick={retrieve}>조회</Button>
              <Button type="generate" onClick={() => setInsertOpen(true)}>생성</Button>
              <Button type="delete" onClick={deleteDate}>삭제</Button>
            </Space>
            <Space wrap>
              <Button type="addRow" onClick={insertRow}>행 추가</Button>
              {/* [E6] deleteRowButton[행 삭제].Select (L110) → deleteRow() L291-295 */}
              <Button type="removeRow" onClick={crud.deleteChecked}>행 삭제</Button>
            </Space>
          </div>
          <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
            <div style={{ flex: '0 0 200px', minWidth: 0 }}>
              <SingleGrid<PayFormulaDate>
                gridRef={dateGridRef}
                rowData={dates}
                columnDefs={dateColumnDefs}
                getRowId={p => String(p.data.formulaId)}
                onSelect={setSelectedDate}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <CellEditGrid<PayFormula> crud={crud} columnDefs={formColumnDefs} />
            </div>
          </div>
        </div>
      </LookupModal>
      <Pay04_Lookup_Insert open={insertOpen} onCreated={retrieve} onClose={() => setInsertOpen(false)} />
      <Pay20_Lookup_ItemList open={itemOpen}
        onResult={items => {
          setItemOpen(false);
          if (!selectedDate) return;
          crud.addRows(items.map(it => ({ itemCd: it.itemCd, itemName: it.itemName, startDate: selectedDate.startDate })), true);
        }}
        onClose={() => setItemOpen(false)} />
    </>
  );
};
