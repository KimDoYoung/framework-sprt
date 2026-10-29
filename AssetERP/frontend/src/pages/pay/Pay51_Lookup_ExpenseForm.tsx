/**
 * 양식 창 (U03) — Pay50_Tab_ExpenseManager의 [양식관리]가 연다 (지출요청 상세양식 편집)
 * AS-IS: myApp/client/vi/pay/Pay51_Lookup_ExpenseForm.java (193줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L57-84: 모달 958×700 "양식"(크기 고정), West 그리드(220: 양식명 155) + Center HTML 편집기(428), [저장][닫기]
 * open(callback) L50-55: 열 때 formCheck()(새 코드의 빈 양식을 만든다) → retrieve(). 양식을 고르기 전에는 편집기를 가린다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { PayExpenseForm } from '@/types/pay';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SingleGrid, gbFor } from '@/components/grid';
import { HtmlEditor } from '@/components/form/HtmlEditor';

const gb = gbFor<PayExpenseForm>();

/** setChecked 없음 → 단일 선택. 상수로 넘긴다(11 §1 함정) */
const SINGLE = { mode: 'singleRow', enableClickSelection: true } as const;

/** buildGrid() L121-125: 양식명 한 열 */
const buildGrid = () => [gb.text('formName', 155, '양식명')];

interface Props {
  open: boolean;
  /** [닫기]: callback.execute() 뒤 hide() */
  onClose: () => void;
}

export const Pay51_Lookup_ExpenseForm: React.FC<Props> = ({ open, onClose }) => {
  const gridRef = useRef<AgGridReact<PayExpenseForm>>(null);
  const [rows, setRows] = useState<PayExpenseForm[]>([]);
  const [selected, setSelected] = useState<PayExpenseForm | null>(null);
  const [html, setHtml] = useState('');
  const [nonce, setNonce] = useState(0);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L127-136: pay.Pay51_ExpenseForm.selectByCompanyId
  const retrieve = useCallback(async () => {
    try {
      setRows(await payApi.searchExpenseForms());
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (생성자 L57-84, open L50-55) → formCheck() L138-150: pay.Pay51_ExpenseForm.formCheck → retrieve()
  useEffect(() => {
    if (!open) return;
    setSelected(null);
    setHtml('');
    setRows([]);
    payApi.checkExpenseForms().then(retrieve).catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [open, retrieve]);

  // [E1] grid.RowClick (L88-105): 고른 양식의 내용을 편집기에 넣는다(고른 게 없으면 편집기를 가린다)
  const pick = (row: PayExpenseForm | null) => {
    setSelected(row);
    setHtml(row?.content ?? '');
    setNonce(n => n + 1);
  };

  // [E2] updateButton[저장].Select (L106) → modelUpdate() L152-174: 양식을 고르지 않았으면 "양식을 선택 후 저장 가능합니다."
  const modelUpdate = async () => {
    if (!selected) {
      message.warning('양식을 선택 후 저장 가능합니다.');
      return;
    }
    try {
      await payApi.updateExpenseFormContent(selected.expenseFormId, html);
      message.success('저장이 완료되었습니다.');
      const id = selected.expenseFormId;
      const list = await payApi.searchExpenseForms();
      setRows(list);
      // 다시 조회하면 선택이 풀리므로 AS-IS처럼 편집기는 그대로 두고 목록만 새로 읽는다
      setSelected(list.find(r => r.expenseFormId === id) ?? null);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <LookupModal open={open} title="양식" width={958} maskClosable={false} onCancel={onClose} destroyOnHidden focusFirst={false}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={() => void modelUpdate()}>저장</Button>
            {/* [E3] cancleButton[닫기].Select (L112) → callback(), hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 540, display: 'flex' }}>
        <div style={{ width: 220, flex: 'none', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
          <SingleGrid<PayExpenseForm>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.expenseFormId)}
            rowSelection={SINGLE}
            onRowClicked={e => pick(e.data ?? null)}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0, marginLeft: -2, border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 8, overflow: 'auto', background: selected ? '#fff' : '#f5f5f5' }}>
          {selected && <HtmlEditor key={nonce} value={selected.content} onChange={setHtml} height={510} />}
        </div>
      </div>
    </LookupModal>
  );
};
