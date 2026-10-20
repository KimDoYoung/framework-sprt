/**
 * 법규 대분류 콤보 (H04) — 월별 법규조회의 대분류 칸. 다른 도메인(sch)도 쓰는 공통 컴포넌트
 * AS-IS: myApp/client/vi/ics/IcsComboBoxField.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 목록 = 맨 앞 "전체"(생성자 L24, id 없음) + 최상위 분류(parent 0)의 이름들. 이름이 같은 항목은 처음 것만(getServiceResult L63-92). 직접 입력 못 한다(L30)
 *   <IcsComboBoxField value={name} onChange={(name, id) => …} />   // 전체는 id null
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Select } from 'antd';
import { icsApi } from '@/api/ics';
import { IcsClassTreeItem } from '@/types/ics';

export const ALL_LABEL = '전체';

interface Props {
  /** 고른 이름 (getClassTreeName L42-50). "전체"면 조건 없음 */
  value: string;
  /** 고른 이름과 그 분류 id (getClassTreeId L52-60) — "전체"는 id null */
  onChange: (name: string, classTreeId: number | null) => void;
  width?: number;
}

export const IcsComboBoxField: React.FC<Props> = ({ value, onChange, width = 150 }) => {
  const [items, setItems] = useState<IcsClassTreeItem[]>([]);

  // [E0] 화면 열림 (생성자 L23-26) → makeComboBoxField() L28-32 → retrieve() L34-40: selectByParentTreeId(parentTreeId 0)
  useEffect(() => {
    let alive = true;
    icsApi.searchClassTreeItems(0)
      .then(list => { if (alive) setItems(list); })
      .catch(() => { if (alive) setItems([]); });
    return () => { alive = false; };
  }, []);

  const byName = useMemo(() => {
    const map = new Map<string, IcsClassTreeItem>();
    items.forEach(it => { if (it.classTreeName && !map.has(it.classTreeName)) map.set(it.classTreeName, it); });
    return map;
  }, [items]);

  return (
    <Select<string>
      style={{ width }}
      value={value}
      options={[ALL_LABEL, ...byName.keys()].map(name => ({ value: name, label: name }))}
      onChange={name => onChange(name, name === ALL_LABEL ? null : byName.get(name)?.classTreeId ?? null)}
    />
  );
};
