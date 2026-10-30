/**
 * 일괄 결제등록 창 (U11) — Pay50_Tab_ExpenseSettle의 [일괄 결제등록]에서 연다
 * AS-IS: myApp/client/vi/ast/Ast07_Lookup_SettleMulti.java (219줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L50-66: 모달 500×230 "미수/미지급 결제등록", getEditor() L112-123: 라벨 폭 120, 결제일자(250, 오늘) · 예금계좌(350, 조회 트리거), 아래 가운데 [저장][닫기]
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, Modal, Space, Typography, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { actApi } from '@/api/act';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstCorpAccount } from '@/types/ast';
import { SettleAccrued } from '@/types/ast';
import { Button } from '@/components/button';
import { Ast01_Lookup_CorpAccount } from './Ast01_Lookup_CorpAccount';

const FORMAT = 'YYYY-MM-DD';

/** 라벨 폭 120 (form.setLabelWidth(120)) */
const Field: React.FC<{ label: string; width: number; children: React.ReactNode }> = ({ label, width, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', width }}>
    <Typography.Text style={{ width: 120, flex: 'none', textAlign: 'right', paddingRight: 10 }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

interface Props {
  /** 고른 위 그리드 행 — null이면 닫힘 */
  rows: SettleAccrued[] | null;
  /** callback.execute() — 저장이 끝난 뒤 부모가 retrieve() */
  onDone: () => void;
  onClose: () => void;
}

export const Ast07_Lookup_SettleMulti: React.FC<Props> = ({ rows, onDone, onClose }) => {
  // [E0] 화면 열림 (생성자 L50-66) → setting(), getEditor(), show()
  // setting() L73-110: 결제일자 = 오늘(폭 100), 예금계좌는 읽기 전용 트리거
  const [settleDate, setSettleDate] = useState<Dayjs | null>(dayjs());
  const [depositId, setDepositId] = useState<number | null>(null);
  const [depositName, setDepositName] = useState('');
  const [lookupOpen, setLookupOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (rows) { setSettleDate(dayjs()); setDepositId(null); setDepositName(''); } }, [rows]);
  if (!rows) return null;

  // [E2] updateButton[저장].Select (L98) → preUpdate() L125-152: 필수 검사 → act.Act04_GenLedger.checkClose(결제일) → update() L154-181 → updateDepositBook() L183-210
  const preUpdate = async () => {
    if (!settleDate) { message.info('결제일자는 필수입력 항목입니다'); return; }
    if (depositId == null) { message.info('예금계좌는 필수선택 항목입니다.'); return; }
    const d = settleDate.format(FORMAT);
    setSaving(true);
    try {
      await actApi.checkLedgerClose(d);
      await astApi.createSettleMulti(d, depositId, rows);
      await astApi.cleanDepositBook(d);   // ast.Ast06_Tr.updateDeposit — 실패하면 메시지만 띄우고 창은 둔다
    } catch (err) {
      message.info(errorMessage(err, '저장 실패'));
      setSaving(false);
      return;
    }
    setSaving(false);
    message.info('저장이 완료되었습니다');
    onDone();
    onClose();
  };

  return (
    <Modal
      open
      title="미수/미지급 결제등록"
      width={500}
      maskClosable={false}
      onCancel={onClose}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={preUpdate} loading={saving}>저장</Button>
            {/* [E3] closeButton[닫기].Select (L104) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 15, padding: '12px 2px' }}>
        <Field label="결제일자" width={250}>
          <DatePicker style={{ width: 130 }} allowClear={false} value={settleDate} format={FORMAT} onChange={d => setSettleDate(d)} />
        </Field>
        <Field label="예금계좌" width={350}>
          {/* [E1] depositName[예금계좌].TriggerClick [result == null] (L78) → Ast01_Lookup_CorpAccount.open(결제일자, "NOT"): 결과가 없으면 지우고, 있으면 계좌 ID·이름 */}
          <Input readOnly value={depositName} suffix={<SearchOutlined />} style={{ cursor: 'pointer' }} onClick={() => setLookupOpen(true)} />
        </Field>
      </div>
      <Ast01_Lookup_CorpAccount open={lookupOpen} stdDate={settleDate ?? dayjs()} mode="NOT"
        onResult={(row: AstCorpAccount | null) => { setDepositId(row ? row.classTreeId : null); setDepositName(row ? row.classTreeName ?? '' : ''); setLookupOpen(false); }}
        onClose={() => setLookupOpen(false)} />
    </Modal>
  );
};
