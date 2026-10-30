/**
 * 계정과목 일괄저장 창 (U09) — Pay50_Lookup_ExpenseUnJournal의 [일괄저장]이 연다
 * AS-IS: myApp/client/vi/pay/Pay50_Lookup_UpdateAccount.java (151줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L49-71: 모달 380×210 "계정과목 일괄저장", 계정과목(300, 조회 트리거)·계정과목명(300, 비활성) + [저장][닫기], 라벨 폭 100
 * UX보강(10): 조회창(UX-05)
 */
import React, { useState } from 'react';
import { Input, message, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { PayExpenseNew } from '@/types/pay';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Act01_Lookup_AccountCode } from '@/components/lookup/Act01_Lookup_AccountCode';

const LABEL: React.CSSProperties = { width: 100, textAlign: 'right', paddingRight: 10, flex: 'none' };

interface Props {
  open: boolean;
  /** 고른(체크한) 회계처리 대상 내역 (AS-IS grid.getSelectionModel().getSelectedItems()) */
  rows: PayExpenseNew[];
  /** callback.execute(): 저장이 끝난 뒤 (부르는 쪽이 다시 조회한다) */
  onSaved: () => void;
  onClose: () => void;
}

export const Pay50_Lookup_UpdateAccount: React.FC<Props> = ({ open, rows, onSaved, onClose }) => {
  const user = useLoginUser();
  const [accountCode, setAccountCode] = useState<string | null>(null);
  const [accountName, setAccountName] = useState<string | null>(null);
  const [lookupOpen, setLookupOpen] = useState(false);

  // [E0] 화면 열림 (생성자 L49-71) → show() / open() L73-76 — 열 때마다 비운다
  const reset = (opened: boolean) => {
    if (!opened) return;
    setAccountCode(null);
    setAccountName(null);
  };

  // [E1] accountCode[계정과목].TriggerClick (L82) → lookupAccount() L104-114: Act01_Lookup_AccountCode.openCompanyId(로그인 회사, "비용", callback)
  // [E2] updateButton[저장].Select (L89) → update() L116-142: 계정과목이 없으면 "계정과목을 선택하세요", pay.Pay50_Expense.updateAccountCode(accountCode, 목록) → "저장이 완료되었습니다" → callback, hide()
  const update = async () => {
    if (accountCode == null || accountCode === '') { message.warning('계정과목을 선택하세요'); return; }
    try {
      await payApi.updateExpenseAccountCodes(rows, accountCode);
      message.info('저장이 완료되었습니다');
      onSaved();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <>
      <LookupModal open={open} title="계정과목 일괄저장" width={380} maskClosable={false} onCancel={onClose} destroyOnHidden afterOpenChange={reset}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="save" onClick={update}>저장</Button>
              {/* [E3] closeButton[닫기].Select (L96) → hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={LABEL}>계정과목</span>
            <Input readOnly style={{ width: 220, cursor: 'pointer' }} value={accountCode ?? ''} suffix={<SearchOutlined />} onClick={() => setLookupOpen(true)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={LABEL}>계정과목명</span>
            <Input disabled style={{ width: 220 }} value={accountName ?? ''} />
          </div>
        </div>
      </LookupModal>
      <Act01_Lookup_AccountCode open={lookupOpen} companyId={user.companyId} searchText="비용"
        onResult={row => { setAccountCode(row.accountCode); setAccountName(row.accountName); setLookupOpen(false); }}
        onClose={() => setLookupOpen(false)} />
    </>
  );
};
