import React, { useEffect, useMemo, useState } from 'react';
import { Select, SelectProps } from 'antd';
import { sysApi } from '@/api/sys';
import { Code } from '@/types/sys';

/**
 * 시스템공통코드 콤보 — AS-IS myApp/client/grid/ComboBoxField.java (B14, 옛 이름 CodeSelect).
 * 종류코드(sys08_kind_cd)만 주면 로그인 회사의 sys09 코드를 sys09_seq 순으로 보여 준다(시스템 코드는 회사 0).
 * 값은 코드, onChange 두 번째 인자로 이름도 받는다 (AS-IS getCode() / 표시값).
 *
 *   <SystemCodeComboBox kindCd="MonthsCode" value={v} onChange={setV} />
 *
 * AS-IS ↔ prop
 * - new ComboBoxField(kind)                        → kindCd (만들 때 조회 = retrieve())
 * - ComboBoxField(kind, code, codeName) / setAltCode → altCode — 맨 앞 항목, 있으면 지우기(X) 없음
 * - retrieve(applyDate) / setCodeList(applyDate)     → applyDate('YYYY-MM-DD') — 바뀌면 다시 조회. 없으면 서버가 오늘
 * - setAddCode(code, name)                          → addCodes — 목록 끝에
 * - removeCode(name)                                → removeNames — 이름으로 뺀다
 * - ComboBoxField(kind, callback)                   → onLoad(목록) — 조회가 끝나면
 * - getServiceResult L163-193: 코드명이 같은 항목은 처음 것만 넣는다 — 여기서도 같게
 */
export interface SystemCodeComboBoxProps extends Omit<SelectProps<string>, 'options' | 'onChange'> {
  kindCd: string;
  altCode?: [string, string];
  applyDate?: string;
  addCodes?: [string, string][];
  removeNames?: string[];
  onLoad?: (codes: Code[]) => void;
  onChange?: (code: string | undefined, name?: string) => void;
}

export const SystemCodeComboBox: React.FC<SystemCodeComboBoxProps> = ({
  kindCd, altCode, applyDate, addCodes, removeNames, onLoad, onChange, ...rest
}) => {
  const [codes, setCodes] = useState<Code[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    sysApi.searchCodes(kindCd, applyDate || undefined)
      .then(list => { if (alive) { setCodes(list); onLoad?.(list); } })
      .catch(() => { if (alive) setCodes([]); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [kindCd, applyDate]);  // eslint-disable-line react-hooks/exhaustive-deps

  const all = useMemo(() => {
    const byName = new Map<string, Code>();
    const push = (c: Code) => { if (!byName.has(c.name)) byName.set(c.name, c); };
    if (altCode) push({ code: altCode[0], name: altCode[1] } as Code);
    codes.forEach(push);
    addCodes?.forEach(([code, name]) => push({ code, name } as Code));
    removeNames?.forEach(name => byName.delete(name));
    return [...byName.values()];
  }, [codes, altCode, addCodes, removeNames]);

  return (
    <Select<string>
      allowClear={!altCode}
      loading={loading}
      options={all.map(c => ({ value: c.code, label: c.name }))}
      onChange={v => onChange?.(v, all.find(c => c.code === v)?.name)}
      {...rest}
    />
  );
};
