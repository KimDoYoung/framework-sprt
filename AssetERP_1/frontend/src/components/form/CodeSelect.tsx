import React, { useEffect, useState } from 'react';
import { Select, SelectProps } from 'antd';
import { sysApi } from '@/api/sys';
import { Code } from '@/types/sys';

/**
 * 공통코드 콤보 (AS-IS ComboBoxField("종류코드")). 로그인 회사의 sys09 코드를 sys09_seq 순으로 보여 준다.
 * 값은 코드, onChange 두 번째 인자로 이름도 받을 수 있다 (AS-IS getCode() / 표시값).
 *   <CodeSelect kindCd="MonthsCode" value={v} onChange={setV} />
 */
export interface CodeSelectProps extends Omit<SelectProps<string>, 'options' | 'onChange'> {
  kindCd: string;
  /** AS-IS ComboBoxField(kind, code, codeName)의 setAltCode — 맨 앞에 넣는 항목(예: ['%', '전체']) */
  altCode?: [string, string];
  onChange?: (code: string | undefined, name?: string) => void;
}

export const CodeSelect: React.FC<CodeSelectProps> = ({ kindCd, altCode, onChange, ...rest }) => {
  const [codes, setCodes] = useState<Code[]>([]);

  useEffect(() => {
    let alive = true;
    sysApi.searchCodes(kindCd).then(list => alive && setCodes(list)).catch(() => alive && setCodes([]));
    return () => { alive = false; };
  }, [kindCd]);

  const all = altCode ? [{ code: altCode[0], name: altCode[1] } as Code, ...codes] : codes;

  return (
    <Select<string>
      allowClear={!altCode}
      options={all.map(c => ({ value: c.code, label: c.name }))}
      onChange={v => onChange?.(v, all.find(c => c.code === v)?.name)}
      {...rest}
    />
  );
};
