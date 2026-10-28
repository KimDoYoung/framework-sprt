/**
 * 자격취득 등록 창 (S26) — Pay31_TabPage_InsureApply1 [등록]이 연다. 편집창 규격(11 §4a, 03 원칙 16)
 * AS-IS: myApp/client/vi/pay/Pay31_Lookup_Insert1.java (321줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L76-99: 600×280 모달 "자격취득 등록", 라벨 폭 90 — 사원(조회창 칸 "선택") · 신고일 / 신청대상(전체·국민연금·건강보험·고용보험 체크) /
 *   신고구분(InsureApplyCode001 콤보 "선택") · 취득일 / 보수월액 · 국민연금 입사월 납부여부 체크 + 아래 가운데 [생성][닫기]
 * [E7] insertButton[생성].Select → insert() L260-312: 필수 검사 6개 → pay.Pay31_InsureApply.insert1 → 끝나면 callback.execute() + hide() (성공 여부를 보지 않는다)
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Checkbox, InputNumber, message, Modal, Space, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';

interface Props {
  /** open(callback) — true면 열린다 */
  open: boolean;
  /** 생성이 끝난 뒤(AS-IS callback.execute()) */
  onCreated: () => void;
  onClose: () => void;
}

const FORMAT = 'YYYY-MM-DD';

/** 라벨 폭 90 (form.setLabelWidth(90)) */
const Field: React.FC<{ label: string; width: number | string; children: React.ReactNode }> = ({ label, width, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', width }}>
    <Typography.Text style={{ width: 90, flex: 'none', textAlign: 'right', paddingRight: 10 }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

export const Pay31_Lookup_Insert1: React.FC<Props> = ({ open, onCreated, onClose }) => {
  const [person, setPerson] = useState<{ id: number; name: string } | null>(null);
  const [personOpen, setPersonOpen] = useState(false);
  const [applyDate, setApplyDate] = useState<Dayjs | null>(null);
  const [ch00, setCh00] = useState(false);
  const [ch01, setCh01] = useState(false);
  const [ch02, setCh02] = useState(false);
  const [ch03, setCh03] = useState(false);
  const [ch04, setCh04] = useState(false);
  const [applyCode, setApplyCode] = useState<string | undefined>(undefined);
  const [initDate, setInitDate] = useState<Dayjs | null>(null);
  const [applyMonthPay, setApplyMonthPay] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  // [E0] 화면 열림 (생성자 L76-99) → settings(): 취득일은 신고구분을 고르기 전까지 비활성, 모든 칸이 비어 있다
  useEffect(() => {
    if (open) {
      setPerson(null); setApplyDate(null); setCh00(false); setCh01(false); setCh02(false); setCh03(false); setCh04(false);
      setApplyCode(undefined); setInitDate(null); setApplyMonthPay(null);
    }
  }, [open]);

  // [E1] ch00[신청대상].ValueChange (L119): 전체 → 세 보험을 같이 켜고 끈다, 끄면 입사월 납부여부도 끈다
  const onCh00 = (v: boolean) => { setCh00(v); setCh01(v); setCh02(v); setCh03(v); if (!v) setCh04(false); };
  // [E2] ch01.ValueChange (L134): 끄면 전체·입사월 납부여부를 끄고, 켰을 때 나머지 둘이 켜져 있으면 전체를 켠다
  const onCh01 = (v: boolean) => { setCh01(v); if (!v) { setCh00(false); setCh04(false); } else if (ch02 && ch03) setCh00(true); };
  // [E3] ch02.ValueChange (L149)
  const onCh02 = (v: boolean) => { setCh02(v); if (!v) setCh00(false); else if (ch01 && ch03) setCh00(true); };
  // [E4] ch03.ValueChange (L163)
  const onCh03 = (v: boolean) => { setCh03(v); if (!v) setCh00(false); else if (ch01 && ch02) setCh00(true); };

  // [E6] insureApplyName[신고구분].ValueChange (L195): 신고구분 1이면 취득일 사용, 2·3이면 취득일을 비우고 막는다
  const onApplyCode = (code: string | undefined) => {
    setApplyCode(code);
    if (code === '2' || code === '3') setInitDate(null);
  };
  const initDateEnabled = applyCode === '1';

  // [E7] insertButton[생성].Select (L210) → insert() L260-312
  const insert = async () => {
    if (person == null) return message.warning('사원은 필수선택항목입니다');
    if (applyDate == null) return message.warning('신고일은 필수선택항목입니다');
    if (!ch01 && !ch02 && !ch03) return message.warning('신청대상은 필수선택항목입니다');
    if (applyCode == null) return message.warning('신고구분은 필수선택항목입니다');
    if (initDate == null) return message.warning('취득일은 필수선택항목입니다');
    if (applyMonthPay == null) return message.warning('보수월액은 필수입력항목입니다');
    setSaving(true);
    try {
      await payApi.createInsureApplies({
        personId: person.id, ch01, ch02, ch03, npsInitPayYn: ch04, insureApplyCode: applyCode,
        applyDate: applyDate.format(FORMAT), initDate: initDate.format(FORMAT), applyMonthPay, applyMonth: null,
      });
    } catch (err) {
      message.error(errorMessage(err, '생성 실패'));
    } finally {
      setSaving(false);
    }
    onCreated();
    onClose();
  };

  // [E5] personName[사원].TriggerClick (L179) → Emp00_Lookup_SelectSingle.open(new Date(), true, cb): 고른 사원의 ID·이름
  const onPersonPicked = (row: TransInfo | null) => {
    setPersonOpen(false);
    if (row) setPerson({ id: row.personId, name: row.korNm ?? '' });
  };

  return (
    <Modal
      open={open}
      title="자격취득 등록"
      width={600}
      maskClosable={false}
      destroyOnHidden
      onCancel={onClose}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="generate" onClick={insert} loading={saving}>생성</Button>
            {/* [E8] closeButton[닫기].Select (L216) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
        <Space size={0}>
          <Field label="사원" width={270}>
            <LookupInput value={person?.name ?? ''} placeholder="선택" width={150} onOpen={() => setPersonOpen(true)} />
          </Field>
          <Field label="신고일" width={270}>
            <DatePicker style={{ width: 150 }} allowClear={false} value={applyDate} format={FORMAT} onChange={d => setApplyDate(d)} />
          </Field>
        </Space>
        <Field label="신청대상" width="100%">
          <Space size={20}>
            <Checkbox checked={ch00} onChange={e => onCh00(e.target.checked)}><b>전체</b></Checkbox>
            <Checkbox checked={ch01} onChange={e => onCh01(e.target.checked)}><b>국민연금</b></Checkbox>
            <Checkbox checked={ch02} onChange={e => onCh02(e.target.checked)}><b>건강보험</b></Checkbox>
            <Checkbox checked={ch03} onChange={e => onCh03(e.target.checked)}><b>고용보험</b></Checkbox>
          </Space>
        </Field>
        <Space size={0}>
          <Field label="신고구분" width={270}>
            <SystemCodeComboBox kindGroupCd="InsureApplyCode001" style={{ width: 150 }} placeholder="선택" value={applyCode}
              onChange={code => onApplyCode(code)} />
          </Field>
          <Field label="취득일" width={270}>
            <DatePicker style={{ width: 150 }} allowClear={false} disabled={!initDateEnabled} value={initDate} format={FORMAT} onChange={d => setInitDate(d)} />
          </Field>
        </Space>
        <Space size={0}>
          <Field label="보수월액" width={270}>
            <InputNumber style={{ width: 150 }} precision={0} value={applyMonthPay}
              formatter={v => (v == null ? '' : String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ','))}
              parser={v => Number(String(v ?? '').replace(/,/g, '')) as unknown as number}
              onChange={v => setApplyMonthPay(v == null ? null : Number(v))} />
          </Field>
          <Checkbox checked={ch04} onChange={e => setCh04(e.target.checked)}><b>국민연금 입사월 납부여부</b></Checkbox>
        </Space>
      </div>
      <Emp00_Lookup_SelectSingle open={personOpen} separateAddTitle transDate={dayjs().format(FORMAT)} onResult={onPersonPicked} onClose={() => setPersonOpen(false)} />
    </Modal>
  );
};
