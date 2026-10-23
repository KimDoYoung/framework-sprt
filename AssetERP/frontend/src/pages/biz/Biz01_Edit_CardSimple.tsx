/**
 * 이익제공(수령) 내용 편집 간이판 (L09) — Biz01_Tab_CardSimple 오른쪽(east 420) 전체
 * AS-IS: myApp/client/vi/biz/Biz01_Edit_CardSimple.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * getEditor L183-200: 헤더 없음, 폼(라벨 120) = 제공목적(300, 파란 라벨) · 제공내역(300, 파란 라벨) · 계정과목(400) · 거래상대방(400, 조회창) · 인원(300) · 비고(400×100, 여러 줄),
 *   창 아래 가운데 [저장][증빙자료(n건)]. 고른 내역이 없으면 통째로 비활성(setEnabled(false)), 마감이면 콤보 3개만 잠근다(setButtonVisible(false)).
 *   L02 `Biz01_Edit_Card`와 달리 거래상대방·인원 칸이 있고 제공내역을 고른 뒤 직원 자동등록(insertEmp)은 없다
 */
import React, { useCallback, useEffect, useState } from 'react';
import { Input, InputNumber, message, Select, Space } from 'antd';
import { bizPromoApi, bizRelateApprApi } from '@/api/biz';
import { errorMessage } from '@/api/client';
import { BizPromoCard } from '@/types/biz';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Biz05_Lookup_RelateAppr } from './Biz05_Lookup_RelateAppr';
import { Biz01_Lookup_ProvideCompany } from './Biz01_Lookup_ProvideCompany';
import { useProvideCombos } from './useProvideCombos';

const BLUE = '#0069B4';

interface Props {
  /** editModel(selectModel, callback) L78-85 — 고른 내역. 없으면 setEnabled(false) */
  promo: BizPromoCard | null;
  /** setButtonVisible(!closeYn)의 반대: 마감이면 true */
  closed: boolean;
  /** callback.execute() — 본 화면 조회 */
  onSaved: () => void;
}

const FieldRow: React.FC<{ label: React.ReactNode; marginTop?: number; children: React.ReactNode }> = ({ label, marginTop = 5, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', margin: `${marginTop}px 10px 5px 10px` }}>
    <div style={{ width: 120, flex: 'none', paddingTop: 5 }}>{label}</div>
    {children}
  </div>
);

export const Biz01_Edit_CardSimple: React.FC<Props> = ({ promo, closed, onSaved }) => {
  const combos = useProvideCombos();
  const [provideCompany, setProvideCompany] = useState('');
  const [pepleCount, setPepleCount] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [fileCount, setFileCount] = useState('0건');
  const [fileOpen, setFileOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const promoId = promo?.promoId ?? null;

  // setFileButtonText() L349-361: 서비스 biz.Biz05_RelateAppr.selectFileCount(promoId) → "증빙자료(n건)"
  const setFileButtonText = useCallback(async () => {
    if (promoId == null) return;
    try {
      setFileCount(await bizRelateApprApi.getFileCount(promoId));
    } catch (err) {
      message.error(errorMessage(err, '증빙자료 건수 조회 실패'));
    }
  }, [promoId]);

  // [E0] 화면 열림 (생성자 L67-76) → setting(), getEditor()
  // editModel() L78-85: editDriver.edit(promoModel), setComboBox() L299-323, setFileButtonText()
  useEffect(() => {
    if (!promo) {
      combos.reset();
      setProvideCompany('');
      setPepleCount(null);
      setNote('');
      setFileCount('0건');
      return;
    }
    setProvideCompany(promo.provideCompany ?? '');
    setPepleCount(promo.pepleCount);
    setNote(promo.note ?? '');
    void combos.load({ providePurCode: promo.providePurCode, provideContentCode: promo.provideContentCode, accountCodeId: promo.accountCodeId });
    void setFileButtonText();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promo]);

  const validate = () => {
    if (!combos.value.providePurCode) { message.warning('제공(수령)목적은 필수선택 항목입니다'); return false; }
    if (!combos.value.provideContentCode) { message.warning('제공(수령)내역은 필수선택 항목입니다'); return false; }
    return true;
  };

  // [E4] updateButton[저장].Select (L161) → closeCheck() L325-346: 서비스 biz.Biz01_Promo.closeCheck([내역]) → 마감이면 updateNote()(L228-250: 비고만, biz.Biz01_Promo.noteUpdate) / 아니면 update()(L202-226: biz.Biz01_Promo.modelUpdate) → callback.execute()
  const save = async () => {
    if (promoId == null) return;
    try {
      const isClosed = await bizPromoApi.hasClosed([promoId]);
      if (!validate()) return;
      if (isClosed) {
        await bizPromoApi.updateNote(promoId, note);
      } else {
        await bizPromoApi.updatePromoSimple(promoId, {
          providePurCode: combos.value.providePurCode,
          provideContentCode: combos.value.provideContentCode,
          accountCodeId: combos.value.accountCodeId,
          provideCompany: provideCompany || null,
          pepleCount,
          note,
        });
      }
      onSaved();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  const disabled = !promo;
  const lock = disabled || closed;

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #d9d9d9', ...(disabled ? { opacity: 0.6, pointerEvents: 'none' } : {}) }}>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        {/* [E1] providePurName[제공목적].Collapse [preValue == null] (L99) → 내역·계정과목을 비우고 서비스 sys.Sys09_Code.selectByKindCode(ProvideContentCode, 목적코드%) */}
        <FieldRow label={<span style={{ color: BLUE }}>제공목적 </span>} marginTop={30}>
          <SystemCodeComboBox
            kindGroupCd="ProvidePurCode002"
            style={{ width: 300 }}
            placeholder="선택"
            allowClear={false}
            disabled={lock}
            value={combos.value.providePurCode ?? undefined}
            onChange={code => { void combos.changePurpose(code); }}
          />
        </FieldRow>
        {/* [E2] provideContentName[제공내역].Collapse [preValue == null] (L123) → 계정과목을 비우고 서비스 sys.Sys00_Common.selectByProvideContentCode, 첫 항목을 고른다 */}
        <FieldRow label={<span style={{ color: BLUE }}>제공내역 </span>}>
          <Select<string>
            style={{ width: 300 }}
            placeholder="선택"
            disabled={lock}
            value={combos.value.provideContentCode ?? undefined}
            options={combos.contents.map(c => ({ value: c.code, label: c.name }))}
            onChange={code => { void combos.changeContent(code); }}
          />
        </FieldRow>
        <FieldRow label="계정과목 ">
          <Select<number>
            style={{ width: 400 }}
            placeholder="선택"
            disabled={lock}
            value={combos.value.accountCodeId ?? undefined}
            options={combos.accounts.map(a => ({ value: a.accountCodeId, label: a.accountName }))}
            onChange={id => combos.changeAccount(id)}
          />
        </FieldRow>
        {/* [E3] provideCompany[거래상대방].TriggerClick [result != null] (L146) → Biz01_Lookup_ProvideCompany.open(callback) → 고른 이름을 칸에 넣는다 */}
        <FieldRow label="거래상대방 ">
          <LookupInput value={provideCompany} width={400} onOpen={() => setCompanyOpen(true)} />
        </FieldRow>
        <FieldRow label="인원 ">
          <InputNumber<number> style={{ width: 300 }} precision={0} controls={false} value={pepleCount} onChange={v => setPepleCount(v)} />
        </FieldRow>
        <FieldRow label="비고(사용내역) ">
          <Input.TextArea style={{ width: 400, height: 100, resize: 'none' }} value={note} onChange={e => setNote(e.target.value)} />
        </FieldRow>
      </div>
      <div style={{ textAlign: 'center', padding: 8 }}>
        <Space>
          <Button type="save" onClick={save}>저장</Button>
          {/* [E5] fileButton[증빙자료(0건)].Select (L169) → Biz05_Lookup_RelateAppr.open("법인카드 증빙자료", promoId, callback → setFileButtonText()) */}
          <Button type="attach" onClick={() => setFileOpen(true)}>{`증빙자료(${fileCount})`}</Button>
        </Space>
      </div>
      <Biz01_Lookup_ProvideCompany open={companyOpen} onResult={setProvideCompany} onClose={() => setCompanyOpen(false)} />
      <Biz05_Lookup_RelateAppr
        open={fileOpen}
        title="법인카드 증빙자료"
        promoId={promoId}
        onClose={() => { setFileOpen(false); void setFileButtonText(); }}
      />
    </div>
  );
};
