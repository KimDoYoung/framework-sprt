/**
 * 선택내역 관리정보 일괄반영 창 (L02) — Biz01_Tab_Card의 [일괄저장]에서 연다 (L03 `Biz01_Tab_Other`도 같은 창을 menuName만 달리해 쓴다)
 * AS-IS: myApp/client/vi/biz/Biz01_Lookup_CardManagement.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L60-98: 모달 500×360(크기 고정, 닫기 X 없음), 제목 "선택내역 관리정보 일괄반영"(파란 굵은 글씨), 폼(라벨 100) = 제공목적(300) · 제공내역(300) · 계정과목(450)
 *   · (menuName이 Biz01_Tab_Card가 아니면) 과세구분(300) · 비고(450×80), 창 아래 가운데 [저장][닫기]
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Select, Space } from 'antd';
import { bizPersonApi, bizPromoApi } from '@/api/biz';
import { errorMessage } from '@/api/client';
import { BizPromoCard } from '@/types/biz';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupModal } from '@/components/lookup/LookupModal';
import { useProvideCombos } from './useProvideCombos';

const BLUE = '#0069B4';
const CARD_MENU = 'Biz01_Tab_Card';

interface Props {
  open: boolean;
  /** open(list, …) — 화면에서 체크한 내역들 */
  rows: BizPromoCard[];
  /** open(…, menuName, …) — Biz01_Tab_Card면 과세구분 없이 저장하고 직원 자동등록까지 한다 */
  menuName: string;
  /** callback.execute() — 저장이 끝난 뒤 부르는 쪽이 다시 조회 */
  onSaved: () => void;
  onClose: () => void;
}

const FieldRow: React.FC<{ label: React.ReactNode; marginTop?: number; children: React.ReactNode }> = ({ label, marginTop = 5, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', margin: `${marginTop}px 10px 5px 10px` }}>
    <div style={{ width: 100, flex: 'none', paddingTop: 5 }}>{label}</div>
    {children}
  </div>
);

export const Biz01_Lookup_CardManagement: React.FC<Props> = ({ open, rows, menuName, onSaved, onClose }) => {
  const combos = useProvideCombos();
  const [taxType, setTaxType] = useState<string | undefined>();
  const [note, setNote] = useState('');
  const isCard = menuName === CARD_MENU;

  // 열릴 때마다 빈 값으로 (생성자 L60-98: 새 필드)
  useEffect(() => {
    if (!open) return;
    combos.reset();
    setTaxType(undefined);
    setNote('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // insertEmp() L233-263: 서비스 biz.Biz04_ProvideSetup.selectByProvideContentCode → 자동등록이면 biz.Biz02_Person.insertEmpId(로그인 사원, 고른 내역들) → "저장이 완료되었습니다." → callback.execute(), hide()
  const insertEmp = async () => {
    if (await bizPersonApi.getEmpSet(combos.value.provideContentCode ?? '')) {
      await bizPersonApi.autoRegister(rows.map(r => r.promoId));
    }
    message.success('저장이 완료되었습니다.');
    onSaved();
    onClose();
  };

  // [E3] updateButton[저장].Select (L174) → update() L188-231: 필수 검사 → 서비스 biz.Biz01_Promo.updateAccount(목적·내역·계정·과세·비고, 고른 내역들, menuName)
  const update = async () => {
    if (!combos.value.providePurCode) { message.warning('제공목적은 필수선택 항목입니다'); return; }
    if (!combos.value.provideContentCode) { message.warning('제공내역은 필수선택 항목입니다'); return; }
    if (!isCard && !taxType) { message.warning('과세구분은 필수선택 항목입니다'); return; }
    try {
      await bizPromoApi.updateAccounts({
        promoIds: rows.map(r => r.promoId),
        providePurCode: combos.value.providePurCode,
        provideContentCode: combos.value.provideContentCode,
        accountId: combos.value.accountCodeId,
        taxType: taxType ?? null,
        note,
        withTax: !isCard,
      });
      if (isCard) {
        await insertEmp();
      } else {
        message.success('저장이 완료되었습니다.');
        onSaved();
        onClose();
      }
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <LookupModal
      open={open}
      title={<span style={{ color: BLUE, fontWeight: 'bold' }}>선택내역 관리정보 일괄반영</span>}
      width={500}
      closable={false}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update}>저장</Button>
            {/* [E4] closeButton[닫기].Select (L180) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ minHeight: 230 }}>
        {/* [E1] providePurName[제공목적].Collapse [preValue == null] (L108) → 내역·계정과목을 비우고 서비스 sys.Sys09_Code.selectByKindCode(ProvideContentCode, 목적코드%) */}
        <FieldRow label={<span style={{ color: BLUE }}>제공목적 </span>} marginTop={30}>
          <SystemCodeComboBox
            kindGroupCd="ProvidePurCode002"
            style={{ width: 300 }}
            placeholder="선택"
            allowClear={false}
            value={combos.value.providePurCode ?? undefined}
            onChange={code => { void combos.changePurpose(code); }}
          />
        </FieldRow>
        {/* [E2] provideContentName[제공내역].Collapse [preValue == null] (L137) → 계정과목을 비우고 서비스 sys.Sys00_Common.selectByProvideContentCode, 첫 항목을 고른다 */}
        <FieldRow label={<span style={{ color: BLUE }}>제공내역 </span>}>
          <Select<string>
            style={{ width: 300 }}
            placeholder="선택"
            value={combos.value.provideContentCode ?? undefined}
            options={combos.contents.map(c => ({ value: c.code, label: c.name }))}
            onChange={code => { void combos.changeContent(code); }}
          />
        </FieldRow>
        <FieldRow label="계정과목 ">
          <Select<number>
            style={{ width: 450 }}
            placeholder="선택"
            value={combos.value.accountCodeId ?? undefined}
            options={combos.accounts.map(a => ({ value: a.accountCodeId, label: a.accountName }))}
            onChange={id => combos.changeAccount(id)}
          />
        </FieldRow>
        {!isCard && (
          <FieldRow label={<span style={{ color: BLUE }}>과세구분 </span>}>
            <SystemCodeComboBox kindCd="TaxType" style={{ width: 300 }} placeholder="선택" allowClear={false} value={taxType} onChange={code => setTaxType(code)} />
          </FieldRow>
        )}
        <FieldRow label="비고 ">
          <Input.TextArea style={{ width: 450, height: 80, resize: 'none' }} value={note} onChange={e => setNote(e.target.value)} />
        </FieldRow>
      </div>
    </LookupModal>
  );
};
