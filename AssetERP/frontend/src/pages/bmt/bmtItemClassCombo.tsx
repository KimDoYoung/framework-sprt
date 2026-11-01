/**
 * 구분 콤보 (W18) — AS-IS CommonComboBoxField("sys.Sys00_Common.selectByKindCode", {kindCode "ItemSClassCode", code "5%"}, "%", "전체")
 * Bmt10_Tab_Info·Bmt10_Lookup_InfoList가 같이 쓴다. 코드가 5로 시작하는 항목만 보이고, 비우면 "전체"(itemClassCode '%')
 */
import React, { useState } from 'react';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';

interface Props {
  /** 고른 코드 — 없으면 전체 */
  value?: string;
  width?: number;
  onChange: (code: string | undefined) => void;
}

export const BmtItemClassCombo: React.FC<Props> = ({ value, width = 150, onChange }) => {
  const [hidden, setHidden] = useState<string[]>([]);
  return (
    <SystemCodeComboBox
      kindCd="ItemSClassCode"
      style={{ width }}
      placeholder="전체"
      value={value}
      removeNames={hidden}
      onLoad={list => setHidden(list.filter(c => !c.code.startsWith('5')).map(c => c.name))}
      onChange={code => onChange(code)}
    />
  );
};
