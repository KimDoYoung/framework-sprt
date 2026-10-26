/**
 * 펀드 등록 및 변경 편집 폼 (P05) — Fnd01_Tab_FundCode 아래(South 360)에 붙는 폼
 * AS-IS: myApp/client/vi/fnd/Fnd01_Edit_FundCode.java (461줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L225-330: 라벨 폭 120, 줄마다 여백 20·20·17·20, 칸 300(보수율 260 + "(bp)" 50), 아래 가운데 [저장](버튼줄 60)
 * 선택한 행이 없으면 폼 전체 비활성(Tab의 editFundCodeForm.setEnabled)
 * deleteRow() L439-448은 버튼·이벤트에 붙어 있지 않아 도달 불가 → 만들지 않는다
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, InputNumber, message } from 'antd';
import dayjs from 'dayjs';
import { fndApi } from '@/api/fnd';
import { errorMessage } from '@/api/client';
import { Consignment, FundDetail, OfficeWork, TrustBank } from '@/types/fnd';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Fnd03_Lookup_Consignment } from '@/components/lookup/Fnd03_Lookup_Consignment';
import { Fnd06_Lookup_OfficeWork } from '@/components/lookup/Fnd06_Lookup_OfficeWork';
import { Fnd09_Lookup_TrustBank } from '@/components/lookup/Fnd09_Lookup_TrustBank';

const FORMAT = 'YYYY-MM-DD';
/** NumberFormat "#,###" (설정액·순자산) */
const fmtLong = (v: string | number | undefined) => (v == null || v === '' ? '' : `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
/** NumberFormat "#,###.######" (보수율) — 정수부만 천 단위 쉼표 */
const fmtRate = (v: string | number | undefined) => {
  if (v == null || v === '') return '';
  const [i, d] = `${v}`.split('.');
  return `${i.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${d != null ? `.${d.slice(0, 6)}` : ''}`;
};
const parseNum = (v: string | undefined) => (v ?? '').replace(/,/g, '');

/** 칸 하나: 라벨(폭 120) + 입력. 줄 안에서 폭 300 */
const Cell: React.FC<{ label: string; width?: number; align?: 'center' | 'flex-start'; children: React.ReactNode }> = ({
  label, width = 300, align = 'center', children,
}) => (
  <div style={{ width, display: 'flex', alignItems: align, flexShrink: 0 }}>
    <label style={{ width: 120, flexShrink: 0 }}>{label}</label>
    <div style={{ flex: 1, minWidth: 0, paddingRight: 10 }}>{children}</div>
  </div>
);

/** 보수율 칸: 칸 260 + "(bp)" 50 (rowLayout3 + LabelToolItem) */
const RateCell: React.FC<{ label: string; value?: number | null; onChange: (v: number | null) => void }> = ({ label, value, onChange }) => (
  <>
    <Cell label={label} width={260}>
      <InputNumber style={{ width: '100%' }} controls={false} stringMode={false} formatter={fmtRate} parser={parseNum as never}
        value={value ?? null} onChange={v => onChange(v == null ? null : Number(v))} />
    </Cell>
    <div style={{ width: 50, marginLeft: -3, display: 'flex', alignItems: 'center' }}>(bp)</div>
  </>
);

const Row: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'flex', margin: '20px 20px 17px 20px' }}>{children}</div>
);

interface Props {
  /** 목록에서 고른 행 (editDriver.edit(fundCodeModel)). null이면 폼 비활성 */
  model: FundDetail | null;
  /** updateRow() 성공: 서버가 돌려준 행 — 부르는 쪽이 목록의 그 행을 바꾼다 */
  onSaved: (oldId: number, saved: FundDetail) => void;
}

export const Fnd01_Edit_FundCode: React.FC<Props> = ({ model, onSaved }) => {
  // [E0] 화면 열림 (생성자 L198-223) → getEditor() L225-330: 숫자 서식(#,### / #,###.######), 수탁사·수탁은행·사무수탁사 칸은 읽기 전용 + 조회창 트리거
  const [draft, setDraft] = useState<FundDetail | null>(model);
  const [saving, setSaving] = useState(false);
  const [lookup, setLookup] = useState<'consignment' | 'officeWork' | 'trustBank' | null>(null);

  // retrieve(param) L368-376: editDriver.edit(fundCodeModel) / null이면 initialize
  useEffect(() => { setDraft(model ? { ...model } : null); }, [model]);

  const patch = (p: Partial<FundDetail>) => setDraft(prev => (prev ? { ...prev, ...p } : prev));
  const disabled = draft == null;
  const text = (key: keyof FundDetail) => (
    <Input value={(draft?.[key] as string | null | undefined) ?? ''} onChange={e => patch({ [key]: e.target.value } as Partial<FundDetail>)} />
  );
  const date = (key: keyof FundDetail) => (
    <DatePicker style={{ width: '100%' }} format={FORMAT} value={draft?.[key] ? dayjs(draft[key] as string) : null}
      onChange={(_, s) => patch({ [key]: (s as string) || null } as Partial<FundDetail>)} />
  );
  const code = (kindCd: string, codeKey: keyof FundDetail, nameKey: keyof FundDetail) => (
    <SystemCodeComboBox kindCd={kindCd} style={{ width: '100%' }} value={(draft?.[codeKey] as string | null | undefined) || undefined}
      onChange={(c, n) => patch({ [codeKey]: c ?? null, [nameKey]: n ?? null } as Partial<FundDetail>)} />
  );
  const amount = (key: 'seoljAek' | 'sunjasanAek') => (
    <InputNumber style={{ width: '100%' }} controls={false} precision={0} formatter={fmtLong} parser={parseNum as never}
      value={draft?.[key] ?? null} onChange={v => patch({ [key]: v == null ? null : Number(v) })} />
  );

  // [E1] updateButton[저장].Select (L204) → updateRow() L378-437: 펀드유형·클래스구분 필수 → ICAM관리 펀드면 fnd.Fnd01_FundCode.noteUpdate(비고만), 아니면 fnd.Fnd01_FundCode.update
  const updateRow = async () => {
    if (!draft) return;
    if (!draft.kofiaFundTypeCode) { message.warning('펀드유형은 필수입력항목입니다'); return; }
    if (!draft.kofiaClassTypeCode) { message.warning('클래스구분은 필수입력항목입니다'); return; }
    setSaving(true);
    try {
      const saved = await fndApi.saveFund(draft);
      onSaved(draft.fundCodeId, saved);
      setDraft({ ...saved });
      if (saved.icamYn === 'true') message.info('ICAM관리 펀드입니다. 비고만 저장됩니다.');
      else message.success('1건 저장되었습니다.');
    } catch (err) {
      message.warning(errorMessage(err, '저장 실패'));  // new SimpleMessage("확인", serviceResult.getMessage())
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', opacity: disabled ? 0.6 : 1 }}>
      <fieldset disabled={disabled || saving} style={{ flex: 1, minHeight: 0, overflow: 'auto', border: 0, margin: 0, padding: 0 }}>
        <Row>
          <Cell label="펀드코드">{text('fundCode')}</Cell>
          <Cell label="펀드명/약명" width={540}>{text('fundFullName')}</Cell>
          <div style={{ width: 360, marginLeft: 5, flexShrink: 0 }}>{text('fundName')}</div>
          <Cell label="신탁구분">{code('IcamTrustCode', 'kofiaTrustCode', 'kofiaTrustName')}</Cell>
        </Row>
        <Row>
          <Cell label="협회펀드코드">{text('kofiaFundCode')}</Cell>
          <Cell label="설정일자" align="flex-start">{date('startDate')}</Cell>
          <Cell label="운용부서">{text('orgCodeName')}</Cell>
          <Cell label="펀드유형">{code('IcamFundType', 'kofiaFundTypeCode', 'kofiaFundTypeName')}</Cell>
          <Cell label="특성분류">{code('IcamCharClassCode', 'kofiaCharClassCode', 'kofiaCharClassName')}</Cell>
        </Row>
        <Row>
          <Cell label="예탁원펀드코드">{text('ksdFundCode')}</Cell>
          <Cell label="다음결산일" align="flex-start">{date('nextCloseDate')}</Cell>
          <Cell label="주운용역">{text('operator1')}</Cell>
          <Cell label="공모/사모">{code('IcamPublicCode', 'kofiaPublicCode', 'kofiaPublicName')}</Cell>
          <RateCell label="운용보수율" value={draft?.managementRate} onChange={v => patch({ managementRate: v })} />
        </Row>
        <Row>
          <Cell label="예탁원종목코드">{text('ksdItemCode')}</Cell>
          <Cell label="다음보수인출일" align="flex-start">{date('nextFeeDate')}</Cell>
          <Cell label="부운용역">{text('operator2')}</Cell>
          <Cell label="모자구분">{code('IcamParentCode', 'kofiaParentCode', 'kofiaParentName')}</Cell>
          <RateCell label="판매보수율" value={draft?.salesRate} onChange={v => patch({ salesRate: v })} />
        </Row>
        <Row>
          <Cell label="기준통화">{text('cur')}</Cell>
          <Cell label="만기예정일" align="flex-start">{date('endExpectDate')}</Cell>
          <Cell label="수탁사">
            {/* [E2] consignmentName[수탁사].TriggerClick (L237) → openLookupConsignment() L332-342 */}
            <LookupInput width={190} value={draft?.consignmentName ?? ''} disabled={disabled} onOpen={() => setLookup('consignment')} />
          </Cell>
          <Cell label="클래스구분">{code('IcamClassType', 'kofiaClassTypeCode', 'kofiaClassTypeName')}</Cell>
          <RateCell label="수탁보수율" value={draft?.consignmentRate} onChange={v => patch({ consignmentRate: v })} />
        </Row>
        <Row>
          <Cell label="설정액">{amount('seoljAek')}</Cell>
          <Cell label="해지일자" align="flex-start">{date('endDate')}</Cell>
          <Cell label="수탁은행">
            {/* [E4] trustBankName[수탁은행].TriggerClick (L249) → openLookupTrustBank() L356-366 */}
            <LookupInput width={190} value={draft?.trustBankName ?? ''} disabled={disabled} onOpen={() => setLookup('trustBank')} />
          </Cell>
          <Cell label="단위구분">{code('IcamFundUnitCode', 'kofiaFundUnitCode', 'kofiaFundUnitName')}</Cell>
          <RateCell label="사무수탁보수율" value={draft?.officeWorkRate} onChange={v => patch({ officeWorkRate: v })} />
        </Row>
        <Row>
          <Cell label="순자산">{amount('sunjasanAek')}</Cell>
          <Cell label="해지구분">{code('ClosedFundCode', 'closeYn', 'closeName')}</Cell>
          <Cell label="사무수탁사">
            {/* [E3] officeWorkName[사무수탁사].TriggerClick (L243) → openLookupOfficeWork() L344-354 */}
            <LookupInput width={190} value={draft?.officeWorkName ?? ''} disabled={disabled} onOpen={() => setLookup('officeWork')} />
          </Cell>
          <Cell label="비고" width={600} align="flex-start">
            <Input.TextArea style={{ height: 60 }} value={draft?.note ?? ''} onChange={e => patch({ note: e.target.value })} />
          </Cell>
        </Row>
      </fieldset>
      <div style={{ height: 60, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <Button type="save" disabled={disabled} onClick={updateRow}>저장</Button>
      </div>
      <Fnd03_Lookup_Consignment open={lookup === 'consignment'} onClose={() => setLookup(null)}
        onResult={(c: Consignment) => patch({ consignmentCode: c.consignmentCode ?? null, consignmentName: c.consignmentName ?? null })} />
      <Fnd06_Lookup_OfficeWork open={lookup === 'officeWork'} onClose={() => setLookup(null)}
        onResult={(o: OfficeWork) => patch({ officeWorkCode: o.officeWorkCode ?? null, officeWorkName: o.officeWorkName ?? null })} />
      <Fnd09_Lookup_TrustBank open={lookup === 'trustBank'} onClose={() => setLookup(null)}
        onResult={(t: TrustBank) => patch({ trustBankCode: t.trustBankCode ?? null, trustBankName: t.trustBankName ?? null })} />
    </div>
  );
};
