import { useCallback, useEffect, useState } from 'react';
import { loadCodes } from '../components/common/CodeSelect';
import { Code } from '../types/sys';

/**
 * 공통코드 목록 + 코드→이름 (그리드 콤보 컬럼용). AG Grid `agSelectCellEditor`의 values는 `codes.map(c => c.code)`,
 * 표시는 `valueFormatter: p => nameOf(p.value)`.
 */
export function useCodes(kindCd: string) {
  const [codes, setCodes] = useState<Code[]>([]);

  useEffect(() => {
    let alive = true;
    loadCodes(kindCd).then(c => alive && setCodes(c)).catch(() => undefined);
    return () => { alive = false; };
  }, [kindCd]);

  const nameOf = useCallback((code?: string | null) => (code ? codes.find(c => c.code === code)?.name ?? code : ''), [codes]);
  return { codes, nameOf };
}
