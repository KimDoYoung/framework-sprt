/**
 * AssetERP 사용료청구 수정창 (EE23) — Biz55_Tab_ErpFeeCharge의 행 [수정] 아이콘이 연다
 * AS-IS: myApp/client/vi/biz/Biz55_Lookup_ErpFeeCharge.java (545줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * edit(model, callback) L102-131: 모달 560×710 "수정", getEditor() L285-377 라벨 폭 130, 다섯 구역 — ① 계약사(읽기 전용) · 청구일자 / 사용시작일 · 사용종료일
 *   ② 시스템 사용료 · DATA 사용료 ③ 안내줄 + 문자 사용량·추가요금 / 서버 사용량·추가요금 / 사용 인원·사용자 추가요금 ④ 기타금액 / 기타금액내용 ⑤ 사용료 합계·부가세 / 청구금액
 *   확정된 행이면 [닫기]만, 아니면 [저장][닫기]
 * EditModal 규격(11 §4a): 머리 아래 선·푸터 위 선·라벨 오른쪽 정렬. 구역 구분은 선 대신 연한 배경(12 화면우선원칙 Page 2) — AS-IS는 구역마다 테두리
 * 스타일: MF (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useEffect, useRef, useState } from 'react';
import { DatePicker, Input, InputNumber, message, Modal, Space } from 'antd';
import dayjs from 'dayjs';
import { bizErpFeeChargeApi } from '@/api/bizErp';
import { errorMessage } from '@/api/client';
import { BizErpFeeCharge, BizErpFeeDefault } from '@/types/bizErp';
import { Button } from '@/components/button';

interface Props {
  /** 값이 있으면 열린다 (그리드 행) */
  target: BizErpFeeCharge | null;
  onClose: () => void;
  /** callback.execute() — 저장한 뒤 (부르는 쪽이 다시 조회) */
  onSaved: () => void;
}

type Num = number | null;

interface Form {
  corpNm: string;
  chargeDate: string | null;
  startDate: string | null;
  closeDate: string | null;
  erpFee: Num;
  dataFee: Num;
  smsCount: Num;
  addSmsFee: Num;
  serverUsage: Num;
  addServerFee: Num;
  userCount: Num;
  addUserFee: Num;
  etcAmt: Num;
  etcDesc: string;
  totalAmt: Num;
  totalVat: Num;
  chargeAmt: Num;
}

/** calculation()의 type — 어느 칸을 바꿨나 */
type CalcType = 'default' | 'startDate' | 'closeDate' | 'smsCount' | 'serverUsage' | 'userCount' | 'other';

const money = {
  formatter: (v?: string | number) => (v == null || v === '' ? '' : String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ',')),
  parser: (v?: string) => (v ? v.replace(/,/g, '') : ''),
};
const n0 = (v: Num) => v ?? 0;
/** numberFormat(Long) L526-535: 값이 없으면 "- " */
const fmt = (v: Num | undefined) => (v == null ? '- ' : v.toLocaleString('en-US'));

/** 라벨 폭 130 (form.setLabelWidth(130)) */
const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
    <span style={{ width: 130, flex: 'none', textAlign: 'right', paddingRight: 10 }}>{label}</span>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);
const Row: React.FC<{ children: React.ReactNode }> = ({ children }) => <div style={{ display: 'flex', gap: 8 }}>{children}</div>;
const Section: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ background: '#f5f5f5', padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
);

export const Biz55_Lookup_ErpFeeCharge: React.FC<Props> = ({ target, onClose, onSaved }) => {
  const [f, setF] = useState<Form | null>(null);
  const [base, setBase] = useState<BizErpFeeDefault | null>(null);
  const baseRef = useRef<BizErpFeeDefault | null>(null);
  const [saving, setSaving] = useState(false);

  const fixed = target?.fixYn === 'true';

  // calculation(actionType) L463-524: 추가요금은 시작일·종료일·default 이거나 그 사용량 칸을 바꿀 때만 다시 계산, 합계·부가세·청구금액은 항상 다시 계산
  const calculation = (cur: Form, type: CalcType): Form => {
    const b = baseRef.current;
    if (!b) return cur;
    const next = { ...cur };
    const all = type === 'default' || type === 'startDate' || type === 'closeDate';
    if (all || type === 'smsCount') {
      next.addSmsFee = b.addFeeSmsYn === false || n0(b.smsBaseCount) >= n0(next.smsCount) ? 0 : (n0(next.smsCount) - n0(b.smsBaseCount)) * n0(b.smsAddPrice);
    }
    if (all || type === 'serverUsage') {
      next.addServerFee = b.addFeeServerYn === false || n0(b.serverBaseUsage) >= n0(next.serverUsage)
        ? 0 : Math.trunc(((n0(next.serverUsage) - n0(b.serverBaseUsage)) + n0(b.serverAddUnit) - 1) / n0(b.serverAddUnit)) * n0(b.serverAddPrice);
    }
    if (all || type === 'userCount') {
      next.addUserFee = b.addFeeUserYn === false || n0(b.userBaseCount) >= n0(next.userCount) ? 0 : (n0(next.userCount) - n0(b.userBaseCount)) * n0(b.userAddPrice);
    }
    next.totalAmt = n0(next.erpFee) + n0(next.dataFee) + n0(next.addSmsFee) + n0(next.addServerFee) + n0(next.addUserFee) + n0(next.etcAmt);
    next.totalVat = b.vatCd === '1' ? Math.trunc(next.totalAmt * 0.1) : 0;
    next.chargeAmt = next.totalAmt + next.totalVat;
    return next;
  };

  // defaultSetup(erpContCorpId, companyId, startDate, closeDate, actionType) L405-453
  const defaultSetup = async (cur: Form, actionType: 'default' | 'defaultSetting') => {
    if (!target || !cur.startDate || !cur.closeDate) return;
    try {
      const d = await bizErpFeeChargeApi.defaultData(target.erpContCorpId, target.companyId, cur.startDate, cur.closeDate);
      if (!d) { message.warning('자동계산불가 관리자에게 문의'); return; }
      baseRef.current = d;
      setBase(d);
      if (actionType === 'defaultSetting') {
        // 기간의 시스템·DATA 사용료와 문자 건수·서버 사용량·사용 인원으로 바꾸고 calculation("default")
        setF(prev => prev && calculation({ ...prev, erpFee: d.erpFee, dataFee: d.dataFee, smsCount: d.smsTotalCount, serverUsage: d.serverUsage, userCount: d.userTotalCount }, 'default'));
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E0] 화면 열림 — edit(model) L102-131: 행 값을 칸에 넣고 defaultSetup(…, "default")
  useEffect(() => {
    if (!target) { setF(null); setBase(null); baseRef.current = null; return; }
    const init: Form = {
      corpNm: target.corpNm ?? '', chargeDate: target.chargeDate, startDate: target.startDate, closeDate: target.closeDate,
      erpFee: target.erpFee, dataFee: target.dataFee, smsCount: target.smsCount, addSmsFee: target.addSmsFee, serverUsage: target.serverUsage,
      addServerFee: target.addServerFee, userCount: target.userCount, addUserFee: target.addUserFee, etcAmt: target.etcAmt, etcDesc: target.etcDesc ?? '',
      totalAmt: target.totalAmt, totalVat: target.totalVat, chargeAmt: target.chargeAmt,
    };
    baseRef.current = null;
    setBase(null);
    setF(init);
    void defaultSetup(init, 'default');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  if (!target || !f) return null;

  /** 숫자 칸 하나를 바꾸고 calculation(type) — 칸 KeyUp [E6]~[E16] */
  const setNum = (key: keyof Form, type: CalcType) => (v: number | string | null) => {
    setF(prev => prev && calculation({ ...prev, [key]: v == null || v === '' ? null : Number(v) }, type));
  };
  const setDate = (key: 'startDate' | 'closeDate') => (d: dayjs.Dayjs | null) => {
    const next = { ...f, [key]: d ? d.format('YYYY-MM-DD') : null };
    setF(next);
    // [E2] startDate.ValueChange (L162) · [E3] closeDate.ValueChange (L168) → defaultSetup(…, "defaultSetting")
    void defaultSetup(next, 'defaultSetting');
  };

  // [E4] updateButton[저장].Select (L174) → update() L379-403
  const update = async () => {
    if (!f.corpNm) { message.warning('계약사는 필수입력 항목입니다'); return; }
    if (!f.startDate || !f.closeDate) { message.warning('사용기간은 필수입력 항목입니다'); return; }
    setSaving(true);
    try {
      await bizErpFeeChargeApi.save({
        erpFeeChargeId: target.erpFeeChargeId, erpContCorpId: target.erpContCorpId, corpNm: f.corpNm, chargeDate: f.chargeDate,
        startDate: f.startDate, closeDate: f.closeDate, erpFee: f.erpFee, dataFee: f.dataFee, smsCount: f.smsCount, addSmsFee: f.addSmsFee,
        serverUsage: f.serverUsage, addServerFee: f.addServerFee, userCount: f.userCount, addUserFee: f.addUserFee, etcAmt: f.etcAmt,
        etcDesc: f.etcDesc === '' ? null : f.etcDesc, totalAmt: f.totalAmt, totalVat: f.totalVat, chargeAmt: f.chargeAmt,
      });
      message.success('저장이 완료되었습니다.');
      onSaved();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  const numInput = (key: keyof Form, type: CalcType) => (
    <InputNumber style={{ width: '100%' }} precision={0} {...money} value={f[key] as Num} onChange={setNum(key, type)} />
  );

  return (
    <Modal
      open
      title="수정"
      width={620}
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
            {!fixed && <Button type="save" onClick={update} loading={saving}>저장</Button>}
            {/* [E5] closeButton[닫기].Select (L180) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 2px' }}>
        <Section>
          <Row><Field label="계약사"><Input disabled value={f.corpNm} /></Field></Row>
          <Row>
            <Field label="청구일자">
              <DatePicker style={{ width: '100%' }} allowClear={false} value={f.chargeDate ? dayjs(f.chargeDate) : null}
                onChange={d => setF(prev => prev && { ...prev, chargeDate: d ? d.format('YYYY-MM-DD') : prev.chargeDate })} />
            </Field>
            <div style={{ flex: 1 }} />
          </Row>
          <Row>
            <Field label="사용시작일">
              <DatePicker style={{ width: '100%' }} value={f.startDate ? dayjs(f.startDate) : null} onChange={setDate('startDate')} />
            </Field>
            <Field label="사용종료일">
              <DatePicker style={{ width: '100%' }} value={f.closeDate ? dayjs(f.closeDate) : null} onChange={setDate('closeDate')} />
            </Field>
          </Row>
        </Section>
        <Section>
          <Row>
            <Field label="시스템 사용료">{numInput('erpFee', 'other')}</Field>
            <Field label="DATA 사용료">{numInput('dataFee', 'other')}</Field>
          </Row>
        </Section>
        <Section>
          {/* createLabelHtml() L455-461 */}
          <div style={{ color: '#4472C4', fontSize: 12, fontWeight: 'bold', textAlign: 'left', lineHeight: '18px' }}>
            기본 제공: 문자 {fmt(base?.smsBaseCount)}건, 서버 {fmt(base?.serverBaseUsage)}GB, 사용자 {fmt(base?.userBaseCount)}명
            <br />
            추가 이용: 문자 {fmt(base?.smsAddPrice)}원/건, 서버 {fmt(base?.serverAddUnit)}GB당 {fmt(base?.serverAddPrice)}원, 사용자(1명당) {fmt(base?.userAddPrice)}원
          </div>
          <Row>
            <Field label="문자 사용량(건)">{numInput('smsCount', 'smsCount')}</Field>
            <Field label="문자 추가요금">{numInput('addSmsFee', 'other')}</Field>
          </Row>
          <Row>
            <Field label="서버 사용량(GB)">{numInput('serverUsage', 'serverUsage')}</Field>
            <Field label="서버 추가요금">{numInput('addServerFee', 'other')}</Field>
          </Row>
          <Row>
            <Field label="사용 인원">{numInput('userCount', 'userCount')}</Field>
            <Field label="사용자 추가요금">{numInput('addUserFee', 'other')}</Field>
          </Row>
        </Section>
        <Section>
          <Row><Field label="기타금액">{numInput('etcAmt', 'other')}</Field><div style={{ flex: 1 }} /></Row>
          <Row>
            <Field label="기타금액내용">
              <Input value={f.etcDesc} onChange={e => setF(prev => prev && { ...prev, etcDesc: e.target.value })} />
            </Field>
          </Row>
        </Section>
        <Section>
          <Row>
            <Field label="사용료 합계">{numInput('totalAmt', 'other')}</Field>
            <Field label="부가세">{numInput('totalVat', 'other')}</Field>
          </Row>
          <Row><Field label="청구금액">{numInput('chargeAmt', 'other')}</Field><div style={{ flex: 1 }} /></Row>
        </Section>
      </div>
    </Modal>
  );
};
