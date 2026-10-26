/**
 * 일임계좌 등록 편집 폼 (Q01) — Adv02_Tab_Account 아래(South 150)에 붙는 폼
 * AS-IS: myApp/client/vi/adv/Adv02_Edit_Account.java (228줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L101-147: 라벨 폭 120, 줄마다 여백 20·20·17·20. 1줄 관리코드·계좌명(칸 280)·계좌번호(560), 2줄 증권사명(조회창 트리거)·최조설정일·해지일(칸 280)
 * 증권사코드 칸은 레이아웃에서 빠져 있고(L131 주석) 증권사를 골라도 코드는 바꾸지 않는다(L112 주석) — 원본 그대로
 * 선택한 행이 없으면 폼 전체 비활성(Tab의 tabPage.setEnabled). 아래 가운데 [저장](버튼줄 60)
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, message } from 'antd';
import dayjs from 'dayjs';
import { advApi } from '@/api/adv';
import { errorMessage } from '@/api/client';
import { AdvAccount } from '@/types/adv';
import { Button } from '@/components/button';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Sys15_Lookup_Corp } from '@/components/lookup/Sys15_Lookup_Corp';

const FORMAT = 'YYYY-MM-DD';

/** 칸 하나: 라벨(폭 120) + 입력. 줄 안에서 폭 280(계좌번호는 560) */
const Cell: React.FC<{ label: string; width?: number; children: React.ReactNode }> = ({ label, width = 280, children }) => (
  <div style={{ width, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
    <label style={{ width: 120, flexShrink: 0 }}>{label}</label>
    <div style={{ flex: 1, minWidth: 0, paddingRight: 10 }}>{children}</div>
  </div>
);

const Row: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'flex', margin: '20px 20px 17px 20px' }}>{children}</div>
);

interface Props {
  /** 목록에서 고른 행 (editDriver.edit(accountModel)). null이면 폼 비활성 */
  model: AdvAccount | null;
  /** updateRow() 성공: 서버가 돌려준 행 — 부르는 쪽이 목록의 그 행을 바꾼다 */
  onSaved: (oldId: number, saved: AdvAccount) => void;
}

export const Adv02_Edit_Account: React.FC<Props> = ({ model, onSaved }) => {
  // [E0] 화면 열림 (생성자 L64-85) → settings() L87-99(빈칸 글자 "자동입력"·"증권사를 선택해주세요"), getEditor() L101-147
  const [draft, setDraft] = useState<AdvAccount | null>(model);
  const [saving, setSaving] = useState(false);
  const [lookupOpen, setLookupOpen] = useState(false);

  // retrieve(param) L149-157: editDriver.edit(accountModel) / null이면 initialize
  useEffect(() => { setDraft(model ? { ...model } : null); }, [model]);

  const patch = (p: Partial<AdvAccount>) => setDraft(prev => (prev ? { ...prev, ...p } : prev));
  const disabled = draft == null;
  const text = (key: 'manageCode' | 'manageName' | 'accountNoDec') => (
    <Input value={draft?.[key] ?? ''} onChange={e => patch({ [key]: e.target.value })} />
  );
  const date = (key: 'startDate' | 'closeDate') => (
    <DatePicker style={{ width: '100%' }} format={FORMAT} value={draft?.[key] ? dayjs(draft[key] as string) : null}
      onChange={(_, s) => patch({ [key]: (s as string) || null })} />
  );

  // [E1] updateButton[저장].Select (L93) → updateRow() L159-207: 필수 검사 → adv.Adv02_Account.update
  const updateRow = async () => {
    if (!draft) return;
    if (!draft.manageCode) { message.warning('관리코드는 필수입력 항목입니다'); return; }
    if (!draft.manageName) { message.warning('계좌명은 필수입력 항목입니다'); return; }
    if (!draft.accountNoDec) { message.warning('계좌번호는 필수입력 항목입니다'); return; }
    if (!draft.trCorpName) { message.warning('증권사명은 필수선택 항목입니다'); return; }
    if (!draft.startDate) { message.warning('최조설정일은 필수선택 항목입니다'); return; }
    setSaving(true);  // updateButton.setVisible(false) + mask("loading")
    try {
      const saved = await advApi.saveAccount(draft);
      onSaved(draft.accountId, saved);
      setDraft({ ...saved });
      message.success('1건 저장되었습니다.');
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
          <Cell label="관리코드">{text('manageCode')}</Cell>
          <Cell label="계좌명">{text('manageName')}</Cell>
          <Cell label="계좌번호" width={560}>{text('accountNoDec')}</Cell>
        </Row>
        <Row>
          <Cell label="증권사명">
            {/* [E2] trCorpName[증권사명].TriggerClick [result != null] (L102) → Sys15_Lookup_Corp.open("증권회사", true, cb): 결과가 있으면 증권사명, 없으면(선택안함) 비움 */}
            <LookupInput value={draft?.trCorpName ?? ''} placeholder="증권사를 선택해주세요" width={270} disabled={disabled || saving}
              onOpen={() => setLookupOpen(true)} onClear={() => patch({ trCorpName: null })} />
          </Cell>
          <Cell label="최조설정일">{date('startDate')}</Cell>
          <Cell label="해지일">{date('closeDate')}</Cell>
        </Row>
      </fieldset>
      {/* ButtonBar 높이 60, 가운데 [저장] — 저장 중에는 숨긴다(updateButton.setVisible(false)) */}
      <div style={{ height: 60, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        {!saving && <Button type="save" disabled={disabled} onClick={updateRow}>저장</Button>}
      </div>
      <Sys15_Lookup_Corp
        open={lookupOpen}
        regYn
        corpTypeName="증권회사"
        onResult={corp => { patch({ trCorpName: corp?.corpName ?? null }); setLookupOpen(false); }}
        onClose={() => setLookupOpen(false)}
      />
    </div>
  );
};
