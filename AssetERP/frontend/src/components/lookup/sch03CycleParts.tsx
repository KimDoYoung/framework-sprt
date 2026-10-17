/**
 * Sch03_TabPage_* 공통 조각 (E01-1) — AS-IS 각 탭 페이지가 되풀이해 쓰는 `Radio`·`ComboBoxField`·`LongField`·`ButtonBar` 한 줄.
 * 탭 페이지는 ref로 `getModel()`을 내놓는다: AS-IS `getModel()`이 들고 있던 모델에 값을 덮어쓰듯, 여기서는 덮어쓸 값(patch)만 돌려주고
 * 부르는 쪽(Sch03_Lookup_Cycle·Short)이 읽어 온 기한(없으면 빈 기한) 위에 얹는다.
 */
import React, { useCallback, useState } from 'react';
import { InputNumber, Radio } from 'antd';
import { Code } from '@/types/sys';
import { Sch03Deadline } from '@/types/sch';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';

/** 탭 페이지가 ref로 내놓는 것 (AS-IS getModel()) */
export interface Sch03TabHandle {
  getModel: () => Partial<Sch03Deadline>;
}

/** 탭 페이지 공통 prop (AS-IS setModel(gridModel)): 읽어 온 기한이 이 탭의 주기이면 그 값으로 채운다 */
export interface Sch03TabProps {
  model?: Sch03Deadline | null;
}

/** 코드 목록을 들고 코드 → 이름을 찾는다 (AS-IS `ComboBoxField.getText()`로 "직접입력"·"-"를 보던 것) */
export function useCodeNames() {
  const [list, setList] = useState<Code[]>([]);
  const nameOf = useCallback((code?: string | null) => list.find(c => c.code === code)?.name, [list]);
  return { onLoad: setList, nameOf };
}

/** 한 줄(ButtonBar): 라디오 + 칸들. `enabled`가 false면 줄 전체를 끈다 */
export const BarRow: React.FC<{ enabled?: boolean; margin?: string; children: React.ReactNode }> = ({ enabled = true, margin, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap', margin, opacity: enabled ? 1 : 0.55 }}>{children}</div>
);

/** 라디오 한 개 (AS-IS Radio, 글자 없음) */
export const RadioDot: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
  <Radio checked={checked} onChange={onChange} style={{ marginInlineEnd: 0 }} />
);

/** 공통코드 콤보 (AS-IS ComboBoxField(kind, codeField), 폭 100, 빈칸 글자 "선택") */
export const CodeCombo: React.FC<{
  kindCd?: string;
  kindGroupCd?: string;
  value?: string | null;
  disabled?: boolean;
  onChange: (code: string | undefined, name?: string) => void;
  onLoad: (codes: Code[]) => void;
}> = ({ kindCd, kindGroupCd, value, disabled, onChange, onLoad }) => (
  <SystemCodeComboBox kindCd={kindCd} kindGroupCd={kindGroupCd} style={{ width: 100 }} placeholder="선택" disabled={disabled}
    value={value ?? undefined} onChange={onChange} onLoad={onLoad} />
);

/** 숫자 칸 (AS-IS LongField, 폭 50) */
export const NumField: React.FC<{ value?: number | null; disabled?: boolean; onChange: (v: number | null) => void }> = ({ value, disabled, onChange }) => (
  <InputNumber style={{ width: 50 }} controls={false} precision={0} disabled={disabled} value={value ?? null} onChange={v => onChange(v == null ? null : Number(v))} />
);

/** 탭 페이지가 이 주기의 기한이면 그 기한을 돌려준다 (AS-IS setModel이 이 탭에만 불림) */
export const modelFor = (model: Sch03Deadline | null | undefined, cycleCode: string) =>
  model && model.cycleCode === cycleCode ? model : null;
