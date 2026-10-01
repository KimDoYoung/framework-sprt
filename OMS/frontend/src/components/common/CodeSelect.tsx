import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import type { SelectProps } from 'antd';
import { sysApi } from '../../api/sys';
import { Code } from '../../types/sys';

// 코드종류별 조회 결과 캐시 (화면을 열 때마다 같은 코드를 다시 읽지 않도록). 코드 관리 화면에서 바꾼 값은 새로고침 후 반영
const cache = new Map<string, Promise<Code[]>>();

/** 공통코드 목록 (캐시). 화면에서 코드 → 이름 표시에도 쓴다 */
export const loadCodes = (kindCd: string): Promise<Code[]> => {
  let p = cache.get(kindCd);
  if (!p) {
    p = sysApi.searchCodesByKind(kindCd).catch(err => { cache.delete(kindCd); throw err; });
    cache.set(kindCd, p);
  }
  return p;
};

interface CodeSelectProps extends Omit<SelectProps<string>, 'options'> {
  /** 코드종류 코드값 (sys08_kind_cd, 예: OrgLevelCode) */
  kindCd: string;
}

/** 공통코드 콤보 (AS-IS ComboBoxField(kindCode)). value는 코드값(sys09_code), 표시는 코드명 */
export const CodeSelect: React.FC<CodeSelectProps> = ({ kindCd, ...props }) => {
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    let alive = true;
    loadCodes(kindCd).then(codes => alive && setOptions(codes.map(c => ({ label: c.name, value: c.code })))).catch(() => undefined);
    return () => { alive = false; };
  }, [kindCd]);

  return <Select showSearch optionFilterProp="label" {...props} options={options} />;
};
