/**
 * 최저보수청구 편집 창 (EE21) — Biz20_Tab_FeeCharge의 [등록]·행의 [수정] 아이콘이 연다
 * AS-IS: myApp/client/vi/biz/Biz20_Edit_FeeCharge.java (260줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L64-82(신규, 청구일자를 받음)·L84-118(수정, 행을 받음): 모달 450×450 "최저보수청구 신규/수정/수정(확정)", getEditor() L159-196: 라벨 폭 110,
 *   청구일자 · 운용사명(조회창 트리거) · 발생보수 · 청구보수 · 세금(###,###,###) · 비고(높이 150), 아래 가운데 [저장][닫기]
 * 수정이면 청구일자·운용사명을 못 고치고, 확정(fixYn)이면 발생보수·청구보수·세금도 못 고친다. 당분기 청구가 없는 행(realFeeChargeId 없음)은 새 번호를 받는다
 * EditModal 규격(11 §4a): 머리 아래 선·푸터 위 선·라벨 오른쪽 정렬
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, InputNumber, message, Modal, Space } from 'antd';
import dayjs from 'dayjs';
import { bizFeeChargeApi } from '@/api/bizFee';
import { errorMessage } from '@/api/client';
import { BizFeeCharge } from '@/types/bizFee';
import { BizWithCorp } from '@/types/biz';
import { Button } from '@/components/button';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Biz13_Lookup_WithCorp } from '@/components/lookup/Biz13_Lookup_WithCorp';

/** 열 때 받는 값 — 신규(청구일자만) 또는 수정(그리드 행) */
export type BizFeeChargeEditTarget = { mode: 'new'; chargeDate: string } | { mode: 'edit'; row: BizFeeCharge };

interface Props {
  /** 값이 있으면 열린다 */
  target: BizFeeChargeEditTarget | null;
  onClose: () => void;
  /** callback.execute() — 저장한 뒤 (부르는 쪽이 다시 조회) */
  onSaved: () => void;
}

interface Form {
  feeChargeId: number | null;
  chargeDate: string;
  corpId: number | null;
  contCorpId: number | null;
  corpNm: string;
  occFee: number | null;
  chargeFee: number | null;
  tax: number | null;
  note: string;
}

const money = {
  formatter: (v?: string | number) => (v == null || v === '' ? '' : String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ',')),
  parser: (v?: string) => (v ? v.replace(/,/g, '') : ''),
};

/** 라벨 폭 110 (form.setLabelWidth(110)) */
const Field: React.FC<{ label: string; width?: number | string; children: React.ReactNode }> = ({ label, width = '100%', children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', width }}>
    <span style={{ width: 110, flex: 'none', lineHeight: '32px', textAlign: 'right', paddingRight: 10 }}>{label}</span>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

export const Biz20_Edit_FeeCharge: React.FC<Props> = ({ target, onClose, onSaved }) => {
  const [f, setF] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);
  const [lookupOpen, setLookupOpen] = useState(false);

  const edit = target?.mode === 'edit';
  const fixed = target?.mode === 'edit' && target.row.fixYn === 'true';
  const title = !target ? '' : target.mode === 'new' ? '최저보수청구 신규' : fixed ? '최저보수청구 수정(확정)' : '최저보수청구 수정';

  // [E0] 화면 열림 — 신규(L64-82): getSeq 로 번호를 받아 회사·번호·청구일자를 정한다. 수정(L84-118): 당분기 청구가 없으면(realFeeChargeId 없음) 새 번호, 있으면 그 번호
  useEffect(() => {
    if (!target) { setF(null); return; }
    let alive = true;
    void (async () => {
      try {
        if (target.mode === 'new') {
          const id = await bizFeeChargeApi.nextId();
          if (alive) setF({ feeChargeId: id, chargeDate: target.chargeDate, corpId: null, contCorpId: null, corpNm: '', occFee: null, chargeFee: null, tax: null, note: '' });
        } else {
          const r = target.row;
          const id = r.realFeeChargeId ?? await bizFeeChargeApi.nextId();
          if (alive) setF({
            feeChargeId: id, chargeDate: r.chargeDate, corpId: r.corpId, contCorpId: r.contCorpId, corpNm: r.corpNm ?? '',
            occFee: r.occFee, chargeFee: r.chargeFee, tax: r.tax, note: r.note ?? '',
          });
        }
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
        onClose();
      }
    })();
    return () => { alive = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  if (!target || !f) return null;
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF(prev => prev && { ...prev, [k]: v });

  // [E3] corpName[운용사명].TriggerClick (L161) → Biz13_Lookup_WithCorp.open(): corpId·contCorpId·corpName 을 채운다
  const onCorpResult = (row: BizWithCorp) => {
    setF(prev => prev && { ...prev, corpId: row.corpId ?? null, contCorpId: row.contCorpId ?? null, corpNm: row.corpNm ?? '' });
  };

  // [E1] updateButton[저장].Select (L141) → updateCheck() L198-223: 운용사가 없으면 "운용사는 필수선택 항목입니다",
  //   biz.Biz20_FeeCharge.updateCheck(feeChargeId, chargeDate, corpId, companyId) 건수가 0이면 update(), 아니면 "이미 생성되어있는 운용(일임/자문)사 입니다"
  const updateCheck = async () => {
    if (f.corpId == null) { message.warning('운용사는 필수선택 항목입니다'); return; }
    setSaving(true);
    try {
      const cnt = await bizFeeChargeApi.sameCorpCount(f.feeChargeId!, f.corpId, f.chargeDate);
      if (cnt === 0) await update();
      else message.warning('이미 생성되어있는 운용(일임/자문)사 입니다');
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };
  // update() L225-251: 계약사관리ID 가 null 이면 "계약사관리ID가 null입니다. 전산팀에 문의하세요", 아니면 biz.Biz20_FeeCharge.modelUpdate → callback.execute(), hide()
  const update = async () => {
    if (f.contCorpId == null) { message.warning('계약사관리ID가 null입니다. 전산팀에 문의하세요'); return; }
    await bizFeeChargeApi.save({
      feeChargeId: f.feeChargeId!, chargeDate: f.chargeDate, corpId: f.corpId, contCorpId: f.contCorpId,
      occFee: f.occFee, chargeFee: f.chargeFee, tax: f.tax, note: f.note === '' ? null : f.note,
    });
    onSaved();
    onClose();
  };

  return (
    <>
      <Modal
        open
        title={title}
        width={450}
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
              <Button type="save" onClick={updateCheck} loading={saving}>저장</Button>
              {/* [E2] closeButton[닫기].Select (L147) → hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
          <Field label="청구일자">
            <DatePicker style={{ width: 130 }} allowClear={false} disabled={edit} value={f.chargeDate ? dayjs(f.chargeDate) : null}
              onChange={d => set('chargeDate', d ? d.format('YYYY-MM-DD') : f.chargeDate)} />
          </Field>
          <Field label="운용사명">
            <LookupInput value={f.corpNm} width={260} disabled={edit} onOpen={() => setLookupOpen(true)} />
          </Field>
          <Field label="발생보수">
            <InputNumber style={{ width: '100%' }} precision={0} {...money} disabled={fixed} value={f.occFee} onChange={v => set('occFee', v == null ? null : Number(v))} />
          </Field>
          <Field label="청구보수">
            <InputNumber style={{ width: '100%' }} precision={0} {...money} disabled={fixed} value={f.chargeFee} onChange={v => set('chargeFee', v == null ? null : Number(v))} />
          </Field>
          <Field label="세금">
            <InputNumber style={{ width: '100%' }} precision={0} {...money} disabled={fixed} value={f.tax} onChange={v => set('tax', v == null ? null : Number(v))} />
          </Field>
          <Field label="비고">
            <Input.TextArea rows={4} maxLength={200} value={f.note} onChange={e => set('note', e.target.value)} />
          </Field>
        </div>
      </Modal>
      <Biz13_Lookup_WithCorp open={lookupOpen} onResult={onCorpResult} onClose={() => setLookupOpen(false)} />
    </>
  );
};
