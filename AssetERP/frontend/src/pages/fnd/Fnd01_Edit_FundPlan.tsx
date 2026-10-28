/**
 * 신규기획펀드 편집 폼 (P01) — Fnd01_Tab_FundPlan 아래(South 310)에 붙는 폼
 * AS-IS: myApp/client/vi/fnd/Fnd01_Edit_FundPlan.java (368줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L188-289: 라벨 폭 105, 줄마다 칸 350(여백 오른쪽 50), 필수 라벨은 파란색(0069B4). 줄 사이 여백 20·20·17·20. 아래 가운데 [저장](버튼줄 높이 60)
 * 선택한 행이 없으면 폼 전체 비활성(Tab의 editFundCodeForm.setEnabled)
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, message } from 'antd';
import dayjs from 'dayjs';
import { fndApi } from '@/api/fnd';
import { errorMessage } from '@/api/client';
import { FundLookup, FundPlan } from '@/types/fnd';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Fnd00_Lookup_FundCode } from '@/components/lookup/Fnd00_Lookup_FundCode';

const FORMAT = 'YYYY-MM-DD';
const BLUE = '#0069B4';

/** 칸 하나: 라벨(폭 105) + 입력. 줄 안에서 폭 350(2칸짜리는 700), 오른쪽 여백 50 */
const Cell: React.FC<{ label: string; required?: boolean; width?: number; align?: 'center' | 'flex-start'; children: React.ReactNode }> = ({
  label, required, width = 350, align = 'center', children,
}) => (
  <div style={{ width, marginRight: 50, display: 'flex', alignItems: align, flexShrink: 0 }}>
    <label style={{ width: 105, flexShrink: 0, textAlign: 'right', paddingRight: 8, color: required ? BLUE : undefined }}>{label}</label>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

const Row: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'flex', margin: '8px 20px 8px 20px' }}>{children}</div>
);

interface Props {
  /** 목록에서 고른 행 (editDriver.edit(fundModel)). null이면 폼 비활성 */
  model: FundPlan | null;
  /** updateRow() 성공: 서버가 돌려준 행 — 부르는 쪽이 목록의 그 행을 바꾼다 */
  onSaved: (oldId: number, saved: FundPlan) => void;
}

export const Fnd01_Edit_FundPlan: React.FC<Props> = ({ model, onSaved }) => {
  // [E0] 화면 열림 (생성자 L135-186) → getEditor() L188-289: 금액 칸 서식은 화면에 없는 칸(보수율)이라 해당 없음
  const [draft, setDraft] = useState<FundPlan | null>(model);
  const [saving, setSaving] = useState(false);
  const [lookupOpen, setLookupOpen] = useState(false);

  // retrieve(fundModel) L305-311: editDriver.edit(fundModel) / null이면 initialize
  useEffect(() => { setDraft(model ? { ...model } : null); }, [model]);

  const patch = (p: Partial<FundPlan>) => setDraft(prev => (prev ? { ...prev, ...p } : prev));
  const disabled = draft == null;
  const dateValue = (v?: string | null) => (v ? dayjs(v) : null);

  // [E1] updateButton[저장].Select (L146) → updateRow() L313-343: fnd.Fnd01_FundCode.update
  const updateRow = async () => {
    if (!draft) return;
    if (!draft.fundCode) { message.warning('펀드코드는 필수입력 항목입니다'); return; }
    if (!draft.fundName) { message.warning('펀드명은 필수입력 항목입니다'); return; }
    if (!draft.kofiaFundTypeCode) { message.warning('펀드유형은 필수선택 항목입니다'); return; }
    if (!draft.closeYn) { message.warning('펀드상태는 필수선택 항목입니다'); return; }
    setSaving(true);
    try {
      const saved = await fndApi.saveFundPlan(draft.fundCodeId > 0 ? draft : { ...draft, fundCodeId: 0 });
      onSaved(draft.fundCodeId, saved);
      setDraft({ ...saved });
      message.success('1건 저장되었습니다.');
    } catch (err) {
      message.warning(errorMessage(err, '저장 실패'));  // new SimpleMessage("확인", serviceResult.getMessage())
    } finally {
      setSaving(false);
    }
  };

  // [E2] checkOverlap[중복확인].Select (L160): fnd.Fnd01_FundCode.selectByOverlap(fundCode)
  const checkOverlap = async () => {
    const code = (draft?.fundCode ?? '').trim();
    if (!code) { message.warning('먼저 코드를 입력해주세요'); return; }
    try {
      if (await fndApi.existsFundPlanCode(code)) message.warning('이미 사용 중 인 코드입니다');
      else message.info('사용 가능한 임시코드입니다');
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E3] realFundName[확정펀드].TriggerClick (L195) → openLookupFundCode() L291-303
  const onLookupResult = (f: FundLookup) => {
    patch({ realFundName: f.fundName ?? null, realFundId: f.fundId, closeYn: 'true', closeName: '종료펀드' });
  };

  // [E4] realFundName[확정펀드].Change (L219-229) — 비우면 확정펀드를 지우고 (가)펀드 상태로
  const clearRealFund = () => {
    patch({ realFundName: null, realFundId: null, realFundCode: null, closeYn: 'false', closeName: '(가)펀드' });
  };

  return (
    <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', opacity: disabled ? 0.6 : 1 }}>
      <fieldset disabled={disabled || saving} style={{ flex: 1, minHeight: 0, overflow: 'auto', border: 0, margin: 0, padding: 0 }}>
        <Row>
          <Cell label="임시펀드코드" required width={300}>
            <Input value={draft?.fundCode ?? ''} onChange={e => patch({ fundCode: e.target.value })} />
          </Cell>
          <div style={{ width: 80, marginRight: 5 }}>
            <Button type="save" onClick={() => void checkOverlap()}>중복확인</Button>
          </div>
          <div style={{ width: 320, marginRight: 50 }} />
          {/* 운용부서: 원본은 LookupTriggerField지만 조회창 연결(openLookupOrg)이 주석 처리돼 값을 보기만 한다 */}
          <Cell label="운용부서">
            <Input readOnly value={draft?.orgCodeName ?? ''} />
          </Cell>
        </Row>
        <Row>
          <Cell label="임시펀드명" required>
            <Input value={draft?.fundName ?? ''} onChange={e => patch({ fundName: e.target.value })} />
          </Cell>
          <Cell label="펀드유형" required>
            <SystemCodeComboBox kindCd="IcamFundType" style={{ width: '100%' }} value={draft?.kofiaFundTypeCode || undefined}
              onChange={(c, n) => patch({ kofiaFundTypeCode: c ?? null, kofiaFundTypeName: n ?? null })} />
          </Cell>
          <Cell label="운용역1">
            <Input value={draft?.operator1 ?? ''} onChange={e => patch({ operator1: e.target.value })} />
          </Cell>
          <Cell label="운용역2">
            <Input value={draft?.operator2 ?? ''} onChange={e => patch({ operator2: e.target.value })} />
          </Cell>
        </Row>
        <Row>
          <Cell label="신탁구분">
            <SystemCodeComboBox kindCd="IcamTrustCode" style={{ width: '100%' }} value={draft?.kofiaTrustCode || undefined}
              onChange={(c, n) => patch({ kofiaTrustCode: c ?? null, kofiaTrustName: n ?? null })} />
          </Cell>
          <Cell label="공모여부">
            <SystemCodeComboBox kindCd="IcamPublicCode" style={{ width: '100%' }} value={draft?.kofiaPublicCode || undefined}
              onChange={(c, n) => patch({ kofiaPublicCode: c ?? null, kofiaPublicName: n ?? null })} />
          </Cell>
          <Cell label="투자자정보" width={700}>
            <Input value={draft?.planInvestorDscr ?? ''} onChange={e => patch({ planInvestorDscr: e.target.value })} />
          </Cell>
        </Row>
        <Row>
          <Cell label="등록일" align="flex-start">
            <DatePicker style={{ width: '100%' }} format={FORMAT} value={dateValue(draft?.startDate)}
              onChange={(_, s) => patch({ startDate: (s as string) || null })} />
          </Cell>
          <Cell label="예정일" align="flex-start">
            <DatePicker style={{ width: '100%' }} format={FORMAT} value={dateValue(draft?.endDate)}
              onChange={(_, s) => patch({ endDate: (s as string) || null })} />
          </Cell>
          <Cell label="펀드개요" width={700} align="flex-start">
            <Input.TextArea style={{ height: 60 }} value={draft?.planNote ?? ''} onChange={e => patch({ planNote: e.target.value })} />
          </Cell>
        </Row>
        <Row>
          <div style={{ width: 350, marginRight: 50 }} />
        </Row>
        <Row>
          <Cell label="확정펀드" align="flex-start">
            {/* 값이 있으면 x = 비우기(realFundName Change L219) */}
            <LookupInput width={245} value={draft?.realFundName ?? ''} placeholder="펀드로 확정된 상품만 등록합니다."
              disabled={disabled} onOpen={() => setLookupOpen(true)} onClear={clearRealFund} />
          </Cell>
          <Cell label="펀드상태" align="flex-start">
            <SystemCodeComboBox kindCd="PlnClosedFundCode" style={{ width: '100%' }} value={draft?.closeYn || undefined}
              onChange={(c, n) => patch({ closeYn: c ?? '', closeName: n ?? null })} />
          </Cell>
          <Cell label="비고" width={700} align="flex-start">
            <Input.TextArea style={{ height: 45 }} value={draft?.note ?? ''} onChange={e => patch({ note: e.target.value })} />
          </Cell>
        </Row>
      </fieldset>
      <div style={{ height: 60, flexShrink: 0, display: 'flex', boxSizing: 'border-box', borderTop: '1px solid #d9d9d9', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <Button type="save" disabled={disabled} onClick={updateRow}>저장</Button>
      </div>
      <Fnd00_Lookup_FundCode open={lookupOpen} onResult={onLookupResult} onClose={() => setLookupOpen(false)} />
    </div>
  );
};
