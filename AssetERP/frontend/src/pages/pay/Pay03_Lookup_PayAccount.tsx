/**
 * 급여출금계좌 (S18) — Pay10_Tab_List의 [급여출금계좌]가 연다.
 * AS-IS: myApp/client/vi/pay/Pay03_Lookup_PayAccount.java (219줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L63-116: 툴바 50 = [조회][등록][저장][삭제], 단일 체크 셀 편집 그리드(출금시작일 120(날짜) · 계좌연결 150(조회창 트리거) · 은행명 150(콤보 BankCode)
 *   · 계좌번호 200 · 예금주명 150 · 비고 250) + 아래 [닫기]. 열 때 retrieve() L166-170 (pay.Pay03_Account.selectByCompanyId).
 * 1단계: 계좌연결 칸의 Ast01_Lookup_Info.gridInsert("1")(자산 조회창, 다른 도메인 ast)은 다음 단계 — 누르면 안내만 한다
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Button as AntButton, message, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { payApi } from '@/api/pay';
import { sysApi } from '@/api/sys';
import { PayAccount } from '@/types/pay';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<PayAccount>();
// setChecked(SINGLE) — 체크한 행이 삭제 대상이라 행 클릭 선택은 쓰지 않는다
const SINGLE_SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: false } as const;

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Pay03_Lookup_PayAccount: React.FC<Props> = ({ open, onClose }) => {
  const [banks, setBanks] = useState<Code[]>([]);

  const crud = useGridCrud<PayAccount>({
    idField: 'accountId',
    // retrieve() L166-170: companyId → pay.Pay03_Account.selectByCompanyId
    search: payApi.searchAccounts,
    // update() L173-176: GridUpdate → pay.Pay03_Account.update
    save: payApi.saveAccounts,
    // deleteRow() L187-208: 확인 "선택한 정보를 삭제하시겠습니까?"(400) → pay.Pay03_Account.delete
    remove: payApi.deleteAccounts,
    deleteConfirm: '선택한 정보를 삭제하시겠습니까?',
    // insertRow() L179-184: companyId만 채운 새 행 (회사는 서버가 로그인 사용자로 넣는다)
    newRow: () => ({}),
    firstEditField: 'startDate',
  });
  const { retrieve } = crud;

  // [E0] 화면 열림 (생성자 L63-116) → show(), retrieve(). 콤보는 buildGrid()의 ComboBoxField("BankCode")
  useEffect(() => {
    if (!open) return;
    void retrieve();
    sysApi.searchCodes('BankCode').then(setBanks).catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // buildGrid(): 출금시작일 120(날짜) · 계좌연결 150 · 은행명 150(콤보, [E7] Collapse → bankCd) · 계좌번호 200 · 예금주명 150 · 비고 250
  const columnDefs = useMemo(() => [
    gb.date('startDate', 120, '출금시작일', { editor: 'date' }),
    // [E6] lookupAst.TriggerClick (L123) → lookupAst() L151-164: Ast01_Lookup_Info.gridInsert("1") — 다음 단계
    gb.text('astClassTreeName', 150, '계좌연결', {
      cellStyle: { color: '#1677ff' },
      cellRenderer: (p: { value?: string | null }) => (
        <>
          <AntButton
            type="text"
            size="small"
            icon={<SearchOutlined />}
            onClick={e => { e.stopPropagation(); message.info('자산 조회창(Ast01_Lookup_Info)은 다음 단계에서 제공됩니다.'); }}
          />
          {p.value}
        </>
      ),
    }),
    gb.text('bankName', 150, '은행명', {
      editor: 'select',
      values: banks.map(c => c.name),
      valueSetter: p => {
        const d = p.data as unknown as Record<string, unknown>;
        d.bankName = p.newValue;
        d.bankCd = banks.find(c => c.name === p.newValue)?.code ?? null;
        return true;
      },
    }),
    gb.text('accountNo', 200, '계좌번호', { editor: 'text' }),
    gb.text('accountName', 150, '예금주명', { editor: 'text' }),
    gb.text('note', 250, '비고', { editor: 'text' }),
  ], [banks]);

  return (
    <LookupModal
      open={open}
      title="급여출금계좌"
      width={1010}
      maskClosable={false}
      onCancel={onClose}
      footer={(
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E5] cancleButton[닫기].Select (L94) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      )}
    >
      <div style={{ height: 380, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* [E1] retrieveButton[조회].Select (L70) → retrieve() */}
          <Button type="search" onClick={crud.retrieve}>조회</Button>
          {/* [E2] insertButton[등록].Select (L76) → insertRow() — 항상 맨 아래(03 원칙 17) */}
          <Button type="register" onClick={() => crud.addRow()}>등록</Button>
          {/* [E4] updateButton[저장].Select (L88) → update() */}
          <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
          {/* [E3] deleteButton[삭제].Select (L82) → deleteRow() → [E8] msgBox YES → pay.Pay03_Account.delete */}
          <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<PayAccount> crud={crud} columnDefs={columnDefs} rowSelection={SINGLE_SELECTION} />
        </div>
      </div>
    </LookupModal>
  );
};
