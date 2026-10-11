/**
 * 급여계좌관리 탭 (C01-3) — C01 사원정보 관리 하위.
 * AS-IS: myApp/client/vi/emp/Emp14_TabPage_Account.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * CellEditGrid(단일 체크, 체크박스 없음): 시작일·은행·계좌번호
 */
import React, { useCallback, useEffect, useMemo } from 'react';
import { Space } from 'antd';
import { empApi } from '@/api/emp';
import { sysApi } from '@/api/sys';
import { Account } from '@/types/emp';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { TransInfoTabProps } from './Emp00_Tab_TransInfo';

const gb = gbFor<Account>();

// [E5] bankCodeComboBox[BankCode].Collapse → 은행 이름 선택 시 bankCd 동기화 (valueSetter)
const buildGrid = (bankCodes: Code[]) => [
  gb.date('startDate', 100, '시작일', { editor: 'date' }),                    // addDate + IsField
  gb.text('bankName', 150, '은행', {                                           // addText + select editor
    editor: 'select',
    values: bankCodes.map(c => c.name),
    valueSetter: p => {
      p.data.bankName = p.newValue;
      p.data.bankCd = bankCodes.find(c => c.name === p.newValue)?.code ?? p.data.bankCd;
      return true;
    },
  }),
  gb.text('accountNoDec', 200, '계좌번호', { editor: 'text' }),               // addText + IsField
];

export const Emp14_TabPage_Account: React.FC<TransInfoTabProps> = ({ row }) => {
  const personId = row?.personId;
  const [bankCodes, setBankCodes] = React.useState<Code[]>([]);
  const columnDefs = useMemo(() => buildGrid(bankCodes), [bankCodes]);

  const search = useCallback(async () => {
    if (!personId) return [];
    return empApi.getAccounts(personId);
  }, [personId]);

  const save = useCallback((changed: Account[]) => empApi.updateAccounts(changed), []);

  const remove = useCallback((ids: number[]) => empApi.deleteAccounts(ids), []);

  const newRow = useCallback((): Partial<Account> => ({
    personId,
    bankCd: '001',
  }), [personId]);

  const crud = useGridCrud<Account>({
    idField: 'accountId',
    search,
    save,
    remove,
    newRow,
    firstEditField: 'startDate',
    deleteConfirm: '선택한 정보를 삭제하시겠습니까?',
  });

  const { retrieve } = crud;

  // [E0] 생성자 초기화: 코드 로드
  useEffect(() => {
    sysApi.searchCodes('BankCode').then(setBankCodes).catch(() => {});
  }, []);

  // [E1] searchBarBuilder[조회].Retrieve (L57) → retrieve() L99-105
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (personId) void retrieve(); else crud.clear(); }, [personId]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 4, padding: '8px 12px' }}>
      <Space>
        {/* [E1] */}
        <Button type="search" onClick={retrieve}>조회</Button>
        {/* [E2] searchBarBuilder[등록].Insert (L58) → insertRow() */}
        <Button type="register" onClick={crud.addRow} disabled={!row}>등록</Button>
        {/* [E3] searchBarBuilder[삭제].Delete (L59) → deleteRow() L133-155 */}
        <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
        {/* [E4] searchBarBuilder[저장].Update (L60) → update() L106-119 */}
        <Button type="save" onClick={crud.saveRows}>저장</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<Account>
          crud={crud}
          columnDefs={columnDefs}
          rowSelection={{ mode: 'singleRow', checkboxes: false }}
        />
      </div>
    </div>
  );
};
