/**
 * 이관정보 변경 편집창 (X28) — Ast33_Tab_OfficeMngFundTrans의 [수정] 아이콘이 연다 (actionName "MODI"만 — NEW는 openNew()가 있으나 부르는 곳이 없어 만들지 않는다)
 * AS-IS: myApp/client/vi/ast/Ast33_Lookup_OfficeMngFundTrans.java (385줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(model, "MODI", callback) L105-148: 모달 600×550 "이관정보 변경", 이관구분 비활성. 이관(출)(1)이면 펀드코드 읽기 전용·통화/외화/원화 활성, 이관(입)이면 펀드코드 활성·통화/외화/원화 비활성
 * getEditor() L253-308: 라벨 폭 120, 이관구분 · 이관일자 · 운용사(코드 210 + 이름 300) · 펀드(코드 210 + 이름 300) · 통화 · 외화미수보수 · 원화미수보수 · 적요(높이 50) · 파란 안내 · 빨간 경고, 아래 가운데 저장·닫기
 * EditModal 규격(11 §4a): 머리 아래 선·푸터 위 선·라벨 오른쪽 정렬
 * [E1] fundTransName.Collapse (L156) — MODI에서는 이관구분 콤보가 비활성이라 일어나지 않아 만들지 않는다
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, InputNumber, message, Modal, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { FundTrans, PreHoldFee } from '@/types/ast';
import { Corp } from '@/types/sys';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Sys15_Lookup_Corp } from '@/components/lookup/Sys15_Lookup_Corp';
import { Ast30_Lookup_HoldFee } from './Ast30_Lookup_HoldFee';

const FORMAT = 'YYYY-MM-DD';

interface Props {
  /** 고칠 이관 행 — null이면 닫힘 */
  model: FundTrans | null;
  onClose: () => void;
  /** callback.execute(fundTransModel): 저장한 행 (닫기는 호출하지 않는다 — 원본은 callback(model)이지만 바뀐 게 없다) */
  onDone: (saved: FundTrans) => void;
}

/** 라벨 폭 120 (form.setLabelWidth(120)) */
const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
    <Typography.Text style={{ width: 120, flex: 'none', lineHeight: '32px', textAlign: 'right', paddingRight: 10 }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

export const Ast33_Lookup_OfficeMngFundTrans: React.FC<Props> = ({ model, onClose, onDone }) => {
  const [f, setF] = useState<FundTrans | null>(model);
  const [saving, setSaving] = useState(false);
  const [corpOpen, setCorpOpen] = useState(false);
  const [holdOpen, setHoldOpen] = useState(false);
  // [E0] 화면 열림 (생성자 L87-89, open() L105-148) → editDriver.edit(model)
  useEffect(() => setF(model), [model]);
  if (!f) return null;
  const set = (patch: Partial<FundTrans>) => setF(prev => prev && { ...prev, ...patch });
  /** 이관구분 1 = 이관(출) */
  const out = f.fundTransCode === '1';
  const corpLabel = f.corpCode ?? '';

  // [E2] corpCode.TriggerClick (L177) → 이관(출)이면 보유원장(Ast30_Lookup_HoldFee) 팝업, 이관(입)이면 운용사 팝업
  const openCorp = () => {
    if (out) {
      if (!f.date) { message.warning('해지일자(이관일자)는 필수입력 항목입니다'); return; }
      setHoldOpen(true);
    } else {
      setCorpOpen(true);
    }
  };
  const onHold = (rows: PreHoldFee[]) => {
    const r = rows[0];
    setHoldOpen(false);
    if (!r) return;
    set({ corpId: r.corpId, corpCode: r.corpCode, corpName: r.corpName, fundCode: r.fundCode, fundName: r.fundName, forFee: r.forFee, fee: r.fee, curCode: r.curCode });
  };
  const onCorp = (corp: Corp | null) => {
    setCorpOpen(false);
    if (!corp) return;
    set({ corpId: corp.corpId, corpCode: corp.corpCode, corpName: corp.corpName, fundCode: null, fundName: null, forFee: null, fee: null, curCode: 'KRW' });
  };

  // [E4] updateButton[저장].Select (L233) → preUpdate() L310-343 → update() L345-375 (회계마감 검사는 서버가 먼저 한다)
  const update = async () => {
    if (!f.date) return message.warning('해지일자(이관일자)는 필수입력 항목입니다');
    if (f.corpId == null) return message.warning('운용사는 필수선택 항목입니다');
    if (!f.fundCode) return message.warning('펀드코드는 필수입력 항목입니다');
    setSaving(true);
    try {
      const saved = await astApi.saveFundTrans([f]);
      message.success('저장이 완료되었습니다.');
      onClose();
      if (saved[0]) onDone(saved[0]);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      title="이관정보 변경"
      width={600}
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
            {/* [E5] closeButton[닫기].Select (L239) → MODI: callback.execute(fundTransModel) 뒤 hide() — 바뀐 것이 없으니 닫기만 */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
        <Field label="이관구분">
          <SystemCodeComboBox kindCd="FundTransCode" style={{ width: 260 }} disabled value={f.fundTransCode ?? undefined} />
        </Field>
        <Field label="이관일자">
          <DatePicker style={{ width: 260 }} allowClear={false} format={FORMAT} value={f.date ? dayjs(f.date) : null} onChange={d => set({ date: d ? d.format(FORMAT) : null })} />
        </Field>
        <Field label="운용사">
          <Space.Compact style={{ width: '100%' }}>
            <LookupInput value={corpLabel} width={210} onOpen={openCorp} />
            <Input readOnly value={f.corpName ?? ''} />
          </Space.Compact>
        </Field>
        <Field label="펀드">
          <Space.Compact style={{ width: '100%' }}>
            <Input style={{ width: 210 }} readOnly={out} value={f.fundCode ?? ''} onChange={e => set({ fundCode: e.target.value })} />
            <Input readOnly value={f.fundName ?? ''} />
          </Space.Compact>
        </Field>
        <Field label="통화">
          <SystemCodeComboBox kindCd="CurCode" style={{ width: 260 }} disabled={!out} value={f.curCode ?? undefined} onChange={code => set({ curCode: code ?? null })} />
        </Field>
        <Field label="외화미수보수">
          <InputNumber style={{ width: 260 }} disabled={!out} controls={false} formatter={v => (v == null ? '' : `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','))} parser={v => Number((v ?? '').replace(/,/g, ''))}
            value={f.forFee} onChange={v => set({ forFee: v == null ? null : Number(v) })} />
        </Field>
        <Field label="원화미수보수">
          {/* [E3] fee[원화미수보수].ValueChange (L224) → 통화가 KRW면 외화미수보수 = 원화미수보수 */}
          <InputNumber style={{ width: 260 }} disabled={!out} controls={false} precision={0} formatter={v => (v == null ? '' : `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','))} parser={v => Number((v ?? '').replace(/,/g, ''))}
            value={f.fee} onChange={v => set(f.curCode === 'KRW' ? { fee: v == null ? null : Number(v), forFee: v == null ? null : Number(v) } : { fee: v == null ? null : Number(v) })} />
        </Field>
        <Field label="적요">
          <Input.TextArea rows={2} value={f.note ?? ''} onChange={e => set({ note: e.target.value })} />
        </Field>
        <div style={{ paddingLeft: 20, fontSize: 13, fontWeight: 'bold', color: '#456EA6', lineHeight: 1.6 }}>
          ※ 처리전 ICAM운용보수 발생내역을 확인하여 이관일의 보수인출 금액을 정리하세요<br />
          ※ 이관일자 : 이관(입) 등록시 최초 보수발생일 / 이관(출) 등록시 최종 보수발생 다음일
        </div>
        <div style={{ paddingLeft: 20, fontSize: 13, fontWeight: 'bold', color: '#DD5E5E' }}>
          ※ 저장시 기존내역을 삭제 후 재처리합니다. (미수결제등 관련 거래가 재생성됩니다)
        </div>
      </div>
      <Sys15_Lookup_Corp open={corpOpen} corpTypeName="운용사" regYn onResult={onCorp} onClose={() => setCorpOpen(false)} />
      <Ast30_Lookup_HoldFee open={holdOpen} stdDate={f.date ?? ''} onResult={onHold} onClose={() => setHoldOpen(false)} />
    </Modal>
  );
};
