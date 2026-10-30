/**
 * 자금집행일 및 출금계좌 일괄저장 창 (U07) — Pay50_Tab_ExpensePayWrite의 [일괄저장]이 연다
 * AS-IS: myApp/client/vi/pay/Pay50_Lookup_UpdateDeposit.java (172줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L55-77: 모달 400×210 "자금집행일 및 출금계좌 일괄저장", 자금집행일(250)·출금계좌(350, 조회 트리거) + [저장][닫기], 라벨 폭 100
 * open(callback) L79-82 → settings() L84-108: 자금집행일 = 오늘
 * UX보강(10): 조회창(UX-05)
 */
import React, { useState } from 'react';
import { DatePicker, Input, message, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Ast01_Lookup_CorpAccount } from '@/pages/ast/Ast01_Lookup_CorpAccount';

const FORMAT = 'YYYY-MM-DD';
const LABEL: React.CSSProperties = { width: 100, textAlign: 'right', paddingRight: 10, flex: 'none' };

interface Props {
  open: boolean;
  /** 고른(체크한) 지출결의서 ID들 (AS-IS grid.getSelectionModel().getSelectedItems()) */
  expenseIds: number[];
  /** callback.execute(): 저장이 끝난 뒤 (부르는 쪽이 다시 조회한다) */
  onSaved: () => void;
  onClose: () => void;
}

export const Pay50_Lookup_UpdateDeposit: React.FC<Props> = ({ open, expenseIds, onSaved, onClose }) => {
  const [settleDate, setSettleDate] = useState<Dayjs | null>(dayjs());
  const [depositId, setDepositId] = useState<number | null>(null);
  const [depositName, setDepositName] = useState<string | null>(null);
  const [lookupOpen, setLookupOpen] = useState(false);

  // [E0] 화면 열림 (생성자 L55-77) → show() / open() L79-82 → settings() L84-108: 열 때마다 자금집행일 = 오늘, 출금계좌 비움
  const reset = (opened: boolean) => {
    if (!opened) return;
    setSettleDate(dayjs());
    setDepositId(null);
    setDepositName(null);
  };

  // [E1] depositName[출금계좌].TriggerClick (L88) → lookupDeposit() L110-130: 자금집행일이 없으면 "자금집행일을 선택하세요", Ast01_Lookup_CorpAccount.open(자금집행일, "NOT", callback)
  const lookupDeposit = () => {
    if (settleDate == null) { message.warning('자금집행일을 선택하세요'); return; }
    setLookupOpen(true);
  };

  // [E2] updateButton[저장].Select (L95) → update() L132-163: pay.Pay50_Expense.updateDeposit(settleDate, depositId, 목록) → "저장이 완료되었습니다" → callback, hide()
  const update = async () => {
    if (settleDate == null) { message.warning('자금집행일을 선택하세요'); return; }
    if (depositId == null) { message.warning('출금계좌를 선택하세요'); return; }
    try {
      await payApi.updateExpenseDeposit(expenseIds, settleDate.format(FORMAT), depositId);
      message.info('저장이 완료되었습니다');
      onSaved();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <>
      <LookupModal open={open} title="자금집행일 및 출금계좌 일괄저장" width={400} maskClosable={false} onCancel={onClose} destroyOnHidden afterOpenChange={reset}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="save" onClick={update}>저장</Button>
              {/* [E3] closeButton[닫기].Select (L102) → hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={LABEL}>자금집행일</span>
            <DatePicker style={{ width: 250 }} allowClear={false} value={settleDate} format={FORMAT} onChange={d => setSettleDate(d)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={LABEL}>출금계좌</span>
            <Input readOnly style={{ width: 250, cursor: 'pointer' }} value={depositName ?? ''} suffix={<SearchOutlined />} onClick={lookupDeposit} />
          </div>
        </div>
      </LookupModal>
      {/* callback.execute(result): null([선택안함])이면 출금계좌를 비운다 */}
      <Ast01_Lookup_CorpAccount open={lookupOpen} stdDate={settleDate ?? dayjs()} mode="NOT"
        onResult={row => { setDepositId(row?.classTreeId ?? null); setDepositName(row?.classTreeName ?? null); setLookupOpen(false); }}
        onClose={() => setLookupOpen(false)} />
    </>
  );
};
