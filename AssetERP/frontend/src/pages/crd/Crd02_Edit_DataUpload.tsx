/**
 * 법인카드 내역 편집 폼 (U14) — Crd02_Tab_DataUpload 아래(310)에 붙는 폼
 * AS-IS: myApp/client/vi/crd/Crd02_Edit_DataUpload.java (314줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L128-193: 라벨 100, 칸 250(한 칸)/500(두 칸), 줄마다 여백 15 — 기준년월+카드회사+카드번호(500) / 승인일+승인시간+승인금액+부가세 /
 *   결제방법+할부개월수+승인번호+승인상태 / (빈 줄) / 가맹점번호+가맹점명(500)+가맹점상태 / 사업자번호+주소(500)+업종명 / 대표자명+전화번호, 아래 가운데 [저장]
 *   파란 라벨(0069B4)은 필수 항목. 부서번호·부서명·이용자명·과세유형·승인구분·승인방식은 줄에서 빠져(주석) 그려지지 않는다 → 만들지 않는다(값은 그대로 보존)
 * 선택한 내역이 없으면 폼 전체 비활성(Tab의 editForm.setEnabled)
 * UX보강(10): 저장 버튼 중복 클릭 방지(UX-01)
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, InputNumber, Modal, message } from 'antd';
import dayjs from 'dayjs';
import { crdApi } from '@/api/crd';
import { errorMessage } from '@/api/client';
import { CrdData } from '@/types/crd';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';

const FORMAT = 'YYYY-MM-DD';
const REQUIRED = '#0069B4';

/** 칸 하나: 라벨(폭 100) + 입력. 폭 250(한 칸) 또는 500(두 칸), 오른쪽 여백 20 */
const Cell: React.FC<{ label: string; required?: boolean; width?: number; children: React.ReactNode }> = ({ label, required, width = 250, children }) => (
  <div style={{ width, display: 'flex', alignItems: 'center', flexShrink: 0, marginRight: 20 }}>
    <label style={{ width: 100, flexShrink: 0, textAlign: 'right', paddingRight: 8, color: required ? REQUIRED : undefined }}>{label}</label>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

const Row: React.FC<{ top?: number; children?: React.ReactNode }> = ({ top = 15, children }) => (
  <div style={{ display: 'flex', margin: `${top}px 15px 15px 15px`, minHeight: 24 }}>{children}</div>
);

interface Props {
  /** 목록에서 고른 내역 (retrieve(dataModel) → editDriver.edit). null이면 폼 비활성 */
  model: CrdData | null;
  /** updateRow() 성공: 서버가 돌려준 내역 — 부르는 쪽이 목록의 그 행을 바꾼다 */
  onSaved: (oldId: number, saved: CrdData) => void;
}

export const Crd02_Edit_DataUpload: React.FC<Props> = ({ model, onSaved }) => {
  const [draft, setDraft] = useState<CrdData | null>(model);
  const [saving, setSaving] = useState(false);

  // [E0] 화면 열림 (생성자 L93-113) → getEditor() / retrieve(dataModel) L196-202: editDriver.edit(dataModel), 없으면 initialize
  useEffect(() => { setDraft(model ? { ...model } : null); }, [model]);

  const patch = (p: Partial<CrdData>) => setDraft(prev => (prev ? { ...prev, ...p } : prev));
  const disabled = draft == null;
  const text = (key: keyof CrdData, props?: { placeholder?: string }) => (
    <Input value={(draft?.[key] as string | null | undefined) ?? ''} placeholder={props?.placeholder} onChange={e => patch({ [key]: e.target.value || null })} />
  );
  const number = (key: 'monthlyPayments' | 'approvalAmount' | 'surtax', money: boolean) => (
    <InputNumber<number> style={{ width: '100%' }} precision={0} controls={false}
      formatter={money ? v => (v == null ? '' : `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')) : undefined}
      parser={money ? v => Number((v ?? '').replace(/,/g, '')) : undefined}
      value={draft?.[key] ?? null} onChange={v => patch({ [key]: v })} />
  );

  // [E1] updateButton[저장].Select (L100) → updateCheck() L204-252: biz.Biz01_Promo.targetListCheck(checkType "4") — 마감이면 메시지, 확정내역이 있으면 확인창(YES → updateRow), 그 밖은 updateRow
  const updateCheck = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const r = await crdApi.dataListCheck('4', draft.dataId > 0 ? [draft.dataId] : []);
      if (r.status === 1) {
        // [E3] msgBox.DialogHide [YES] (L223) → updateRow()
        Modal.confirm({ title: '확인', content: r.message, width: 500, okText: '예', cancelText: '아니오', onOk: () => updateRow(draft) });
      } else if (r.status === -1) {
        message.warning(r.message ?? '');
      } else {
        await updateRow(draft);
      }
    } catch (err) {
      message.warning(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  // updateRow() L254-304: 필수 검사 → crd.Crd02_Data.update → 성공이면 "저장이 완료되었습니다." (실패는 확인창에 서버 메시지)
  const updateRow = async (row: CrdData) => {
    const empty = (v: unknown) => v == null || v === '';
    const need: [unknown, string][] = [
      [row.dataBankCode, '카드회사는 필수선택항목입니다'],
      [row.approvalDt, '승인일은 필수입력항목입니다'],
      [row.cardNo, '카드번호는 필수입력항목입니다'],
      [row.franchiseName, '가맹점명은 필수입력항목입니다'],
      [row.approvalAmount, '승인금액은 필수입력항목입니다'],
      [row.surtax, '부가세는 필수입력항목입니다'],
      [row.stateName, '승인상태는 필수입력항목입니다'],
      [row.merchantNo, '가맹점번호는 필수입력항목입니다'],
      [row.bizLicenseNo, '사업자번호는 필수입력항목입니다'],
    ];
    for (const [v, msg] of need) {
      if (empty(v)) {
        message.warning(msg);
        return;
      }
    }
    try {
      const saved = await crdApi.saveData(row);
      onSaved(row.dataId, saved);
      setDraft({ ...saved });
      message.success('저장이 완료되었습니다.');
    } catch (err) {
      message.warning(errorMessage(err, '저장 실패'));  // new SimpleMessage("확인", serviceResult.getMessage())
    }
  };

  return (
    <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', opacity: disabled ? 0.6 : 1 }}>
      <fieldset disabled={disabled || saving} style={{ flex: 1, minHeight: 0, overflow: 'auto', border: 0, margin: 0, padding: 0 }}>
        <Row top={30}>
          <Cell label="기준년월" required>{text('dataYm', { placeholder: 'YYYY.MM' })}</Cell>
          <Cell label="카드회사" required>
            {/* [E2] dataBankName[카드회사].Collapse (L121) → dataBankCode.setValue(dataBankName.getCode()) */}
            <SystemCodeComboBox kindCd="CreditCardCompany" style={{ width: '100%' }} value={draft?.dataBankCode || undefined}
              onChange={(c, n) => patch({ dataBankCode: c ?? null, dataBankName: n ?? null })} />
          </Cell>
          <Cell label="카드번호" required width={500}>{text('cardNo')}</Cell>
        </Row>
        <Row>
          <Cell label="승인일" required>
            <DatePicker style={{ width: '100%' }} format={FORMAT} value={draft?.approvalDt ? dayjs(draft.approvalDt) : null}
              onChange={(_, s) => patch({ approvalDt: (s as string) || null })} />
          </Cell>
          <Cell label="승인시간">{text('approvalTime')}</Cell>
          <Cell label="승인금액" required>{number('approvalAmount', true)}</Cell>
          <Cell label="부가세" required>{number('surtax', true)}</Cell>
        </Row>
        <Row>
          <Cell label="결제방법">{text('paymentMethod')}</Cell>
          <Cell label="할부개월수">{number('monthlyPayments', false)}</Cell>
          <Cell label="승인번호">{text('approvalNo')}</Cell>
          <Cell label="승인상태" required>{text('stateName')}</Cell>
        </Row>
        <Row />
        <Row>
          <Cell label="가맹점번호" required>{text('merchantNo')}</Cell>
          <Cell label="가맹점명" required width={500}>{text('franchiseName')}</Cell>
          <Cell label="가맹점상태">{text('merchantStatus')}</Cell>
        </Row>
        <Row>
          <Cell label="사업자번호" required>{text('bizLicenseNo')}</Cell>
          <Cell label="주소" width={500}>{text('merchantAddr')}</Cell>
          <Cell label="업종명">{text('sectorName')}</Cell>
        </Row>
        <Row>
          <Cell label="대표자명">{text('representativeName')}</Cell>
          <Cell label="전화번호">{text('merchantPhone')}</Cell>
        </Row>
      </fieldset>
      <div style={{ height: 50, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <Button type="save" disabled={disabled} onClick={updateCheck}>저장</Button>
      </div>
    </div>
  );
};
