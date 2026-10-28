/**
 * 급여공제 기본설정 창 (S28) — Emp35_Tab_DeductPerson의 [기본설정]이 연다
 * AS-IS: myApp/client/vi/pay/pay30_Popup_BasicSetup.java (244줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L58-120: 모달 350×250 "급여공제 기본설정", getEditor() L122-147: 라벨 폭 110, 원천징수비율 · 건강보험(납부구분+분할회차) · 고용보험(납부구분+분할회차), 아래 가운데 저장·닫기
 * EditModal 규격(11 §4a): 머리말·푸터 선, 본문 12 간격, 라벨 오른쪽 정렬
 */
import React, { useEffect, useState } from 'react';
import { message, Modal, Select, Space, Typography } from 'antd';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';

interface Props {
  open: boolean;
  onClose: () => void;
}

/** withHoldRateComboBox L65-67 */
const WITH_HOLD_RATES = [80, 100, 120];
/** hiMaxDivComboBox L71-80 (1회~10회), eiMaxDivComboBox L84-85 (1회~2회) */
const maxDivOptions = (max: number) => Array.from({ length: max }, (_, i) => ({ value: i + 1, label: `${i + 1}회` }));
const HI_MAX_DIV = maxDivOptions(10);
const EI_MAX_DIV = maxDivOptions(2);

/** 라벨 폭 110 (form.setLabelWidth(110)) */
const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Typography.Text style={{ width: 110, flex: 'none', textAlign: 'right', paddingRight: 10 }}>{label}</Typography.Text>
    {children}
  </div>
);

/** AS-IS 클래스 이름은 소문자 `pay30_Popup_BasicSetup`이지만 JSX 태그는 대문자로 시작해야 해서 첫 글자만 키웠다 */
export const Pay30_Popup_BasicSetup: React.FC<Props> = ({ open, onClose }) => {
  const [basicSetupId, setBasicSetupId] = useState<number | null>(null);
  const [withHoldRate, setWithHoldRate] = useState<number | null>(null);
  const [hiDivPayCode, setHiDivPayCode] = useState<string | null>(null);
  const [hiMaxDiv, setHiMaxDiv] = useState<number | null>(null);
  const [eiDivPayCode, setEiDivPayCode] = useState<string | null>(null);
  const [eiMaxDiv, setEiMaxDiv] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  // [E0] 화면 열림 (생성자 L58-120) → open() L51-56 → retrieve() L149-171: pay.Pay30_BasicSetup.selectByCompanyId
  useEffect(() => {
    if (!open) return;
    setBasicSetupId(null);
    setWithHoldRate(null); setHiDivPayCode(null); setHiMaxDiv(null); setEiDivPayCode(null); setEiMaxDiv(null);
    payApi.getBasicSetup()
      .then(m => {
        if (!m) return;
        setBasicSetupId(m.basicSetupId);
        setWithHoldRate(m.withHoldRate ?? null);
        setHiDivPayCode(m.hiDivPayCode ?? null);
        setHiMaxDiv(m.hiMaxDiv ?? null);
        setEiDivPayCode(m.eiDivPayCode ?? null);
        setEiMaxDiv(m.eiMaxDiv ?? null);
      })
      .catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [open]);

  // [E1] hiDivPayComboBox[건강보험].Collapse (L89) → hiMaxDivOpen() L218-226: 1(일시납)이면 분할회차를 비우고 끈다
  const onHiDivPay = (code: string | undefined) => {
    setHiDivPayCode(code ?? null);
    if (code === '1') setHiMaxDiv(null);
  };
  // [E2] eiDivPayComboBox[고용보험].Collapse (L96) → eiMaxDivOpen() L228-236
  const onEiDivPay = (code: string | undefined) => {
    setEiDivPayCode(code ?? null);
    if (code === '1') setEiMaxDiv(null);
  };

  // [E3] updateButton[저장].Select (L103) → update() L173-216
  const update = async () => {
    if (withHoldRate == null) { message.warning('원천징수비율은 필수 선택사항입니다'); return; }
    if (hiDivPayCode == null) { message.warning('건강보험은 필수 선택사항입니다'); return; }
    if (eiDivPayCode == null) { message.warning('고용보험은 필수 선택사항입니다'); return; }
    setSaving(true);
    try {
      await payApi.saveBasicSetup({ basicSetupId, withHoldRate, hiDivPayCode, hiMaxDiv, eiDivPayCode, eiMaxDiv });
      onClose();   // callBack.execute()는 빈 본문, hide()
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      title="급여공제 기본설정"
      width={420}
      maskClosable={false}
      onCancel={onClose}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update} loading={saving}>저장</Button>
            {/* [E4] closeButton[닫기].Select (L109) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '12px 2px' }}>
        <Field label="원천징수비율">
          <Select<number> style={{ width: 200 }} value={withHoldRate ?? undefined} onChange={setWithHoldRate}
            options={WITH_HOLD_RATES.map(v => ({ value: v, label: `${v}%` }))} />
        </Field>
        <Field label="건강보험">
          <Space size={10}>
            <SystemCodeComboBox kindCd="DivPayCode" style={{ width: 200 }} allowClear={false} value={hiDivPayCode ?? undefined} onChange={onHiDivPay} />
            <Select<number> style={{ width: 80 }} disabled={hiDivPayCode === '1'} value={hiMaxDiv ?? undefined} onChange={setHiMaxDiv} options={HI_MAX_DIV} />
          </Space>
        </Field>
        <Field label="고용보험">
          <Space size={10}>
            <SystemCodeComboBox kindCd="DivPayCode" style={{ width: 200 }} allowClear={false} value={eiDivPayCode ?? undefined} onChange={onEiDivPay} />
            <Select<number> style={{ width: 80 }} disabled={eiDivPayCode === '1'} value={eiMaxDiv ?? undefined} onChange={setEiMaxDiv} options={EI_MAX_DIV} />
          </Space>
        </Field>
      </div>
    </Modal>
  );
};
