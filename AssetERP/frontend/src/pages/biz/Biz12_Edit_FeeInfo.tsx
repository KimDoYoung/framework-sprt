/**
 * 최저보수 관리 편집창 (EE20) — Biz11_Edit_ContHistory의 "최저보수" 칸(조회창 트리거)이 연다
 * AS-IS: myApp/client/vi/biz/Biz12_Edit_FeeInfo.java (287줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L74-80: 모달 400×450 "최저보수 관리", getEditor() L222-260: 라벨 폭 130 — 최저보수(있음/없음) · 박스(운용최저보수(연) · 자문최저보수(연) · 일임최저보수(연) · 청구구분)
 *   · 병행보수(처리함/처리안함) · 박스(병행보수(연)), 아래 가운데 [저장][닫기]
 * 편집창 규격(11 §4a): 머리 아래 선·푸터 위 선·라벨 오른쪽 정렬
 */
import React, { useEffect, useState } from 'react';
import { InputNumber, message, Modal, Select, Space } from 'antd';
import { bizContCorpApi } from '@/api/bizCont';
import { errorMessage } from '@/api/client';
import { BizContFeeInfo } from '@/types/bizCont';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';

/** 열 때 받는 값 — open(updateModel) L82-120: 보수정보와 그 이력 ID */
export interface BizFeeEditModel {
  contHistoryId: number;
  feeInfoId: number | null;
  minFeeYn: string | null;
  manageMinFee: number | null;
  advMinFee: number | null;
  discrMinFee: number | null;
  feeChargeType: string | null;
  withYn: string | null;
  withFee: number | null;
}

interface Props {
  /** 값이 있으면 열린다 */
  model: BizFeeEditModel | null;
  /** callback.execute(result) L267-272: 저장한 보수정보 (닫는 것은 이 창이 스스로) */
  onResult: (fee: BizContFeeInfo) => void;
  onClose: () => void;
}

/** 라벨 폭 130 (form.setLabelWidth(130)) */
const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <span style={{ width: 130, flex: 'none', textAlign: 'right', paddingRight: 10, fontSize: 12, fontWeight: 'bold' }}>{label}</span>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

const money = {
  formatter: (v?: string | number) => (v == null || v === '' ? '' : String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ',')),
  parser: (v?: string) => (v ? v.replace(/,/g, '') : ''),
};

export const Biz12_Edit_FeeInfo: React.FC<Props> = ({ model, onResult, onClose }) => {
  // [E0] 화면 열림 (생성자 L74-80) → open(updateModel, callback) L82-120
  const [f, setF] = useState<BizFeeEditModel | null>(model);
  /** minFeeYn·withYn — 콤보 있음/없음, 처리함/처리안함 */
  const [minOn, setMinOn] = useState(false);
  const [withOn, setWithOn] = useState(false);
  /** vlc1(최저보수 박스)·vlc2(병행보수 박스) 읽기 전용 */
  const [lock1, setLock1] = useState(true);
  const [lock2, setLock2] = useState(true);
  const [saving, setSaving] = useState(false);

  // open(updateModel) L82-120: 최저보수가 없으면 "없음"·readOnlyAll(true) 뒤 병행보수 상태를 모델 값으로 다시 정한다(없으면 readOnlyVlc2(true), 있으면 readOnlyVlc2(false))
  useEffect(() => {
    setF(model);
    if (!model) return;
    const min = model.minFeeYn === 'true';
    const wi = model.withYn === 'true';
    setMinOn(min);
    setLock1(!min);
    setWithOn(wi);
    setLock2(!wi);
  }, [model]);

  if (!f) return null;
  const set = <K extends keyof BizFeeEditModel>(k: K, v: BizFeeEditModel[K]) => setF(prev => prev && { ...prev, [k]: v });

  // [E2] minFeeName[최저보수].ValueChange (L154) → readOnlyVlc1(), readOnlyAll(): 있음이면 readOnlyVlc1(false), 없음이면 병행보수를 "처리안함"으로 두고 readOnlyAll(true)
  const onMinChange = (v: string) => {
    if (v === '있음') {
      setMinOn(true);
      setLock1(false);
    } else {
      setMinOn(false);
      setWithOn(false);
      setLock1(true);
      setLock2(true);
    }
  };
  // [E3] withName[병행보수].ValueChange (L168) → readOnlyVlc2()
  const onWithChange = (v: string) => {
    if (v === '처리함') {
      setWithOn(true);
      setLock2(false);
    } else {
      setWithOn(false);
      setLock2(true);
    }
  };

  // [E4] updateButton[저장].Select (L180) → update() L262-278: 서비스 biz.Biz12_FeeInfo.modelUpdate → callback.execute(결과 모델) → hide()
  const update = async () => {
    setSaving(true);
    try {
      const saved = await bizContCorpApi.saveFeeInfo({
        feeInfoId: f.feeInfoId, contHistoryId: f.contHistoryId, minFeeYn: String(minOn), manageMinFee: f.manageMinFee, advMinFee: f.advMinFee,
        discrMinFee: f.discrMinFee, feeChargeType: f.feeChargeType, withYn: String(withOn), withFee: f.withFee,
      });
      onResult(saved);
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  const boxStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 10, padding: 12, background: '#fafafa', borderRadius: 4 };
  const numInput = (key: 'manageMinFee' | 'advMinFee' | 'discrMinFee' | 'withFee', readOnly: boolean) => (
    <InputNumber style={{ width: '100%' }} precision={0} {...money} readOnly={readOnly} disabled={readOnly}
      value={f[key]} onChange={v => set(key, v == null ? null : Number(v))} />
  );

  return (
    <Modal
      open
      title="최저보수 관리"
      width={420}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update} loading={saving}>저장</Button>
            {/* [E5] closeButton[닫기].Select (L186) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
        <Field label="최저보수">
          <Select style={{ width: 100 }} value={minOn ? '있음' : '없음'} options={[{ value: '있음' }, { value: '없음' }]} onChange={onMinChange} />
        </Field>
        <div style={boxStyle}>
          <Field label="운용최저보수(연)">{numInput('manageMinFee', lock1)}</Field>
          <Field label="자문최저보수(연)">{numInput('advMinFee', lock1)}</Field>
          <Field label="일임최저보수(연)">{numInput('discrMinFee', lock1)}</Field>
          <Field label="청구구분">
            {/* [E1] feeChargeTypeName[청구구분].Collapse (L148) → feeChargeType = feeChargeTypeName.getCode() */}
            <SystemCodeComboBox kindCd="FundFeeChargeType" style={{ width: '100%' }} placeholder="선택" disabled={lock1}
              value={f.feeChargeType ?? undefined} onChange={c => set('feeChargeType', c ?? null)} />
          </Field>
        </div>
        <Field label="병행보수">
          <Select style={{ width: 100 }} value={withOn ? '처리함' : '처리안함'} options={[{ value: '처리함' }, { value: '처리안함' }]} onChange={onWithChange} />
        </Field>
        <div style={boxStyle}>
          <Field label="병행보수(연)">{numInput('withFee', lock2)}</Field>
        </div>
      </div>
    </Modal>
  );
};
