/**
 * 인력현황 RD 보고서 영역 (T19) — Emp01_Tab_DueDiligence의 아래쪽
 * AS-IS: myApp/client/vi/emp/Emp01_Rd_DueDiligence.java (66줄, 새 원본 IDMS-IC) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 생성자 L24-26: RD 영역만. retrieve(param) L29-45: mrd Emp01_Rd_DueDiligence, rv = companyId·personId(서버가 채움)·stdDate
 */
import { forwardRef, useImperativeHandle, useState } from 'react';
import { message } from 'antd';
import { errorMessage } from '@/api/client';
import { rdApi } from '@/api/rd';

export interface DueDiligenceRdHandle {
  retrieve: (param: { stdDate: string }) => Promise<void>;
  rdClear: () => void;
}

// [E0] 화면 열림 (생성자 L24-26) → RD 영역만 만든다 — 조회는 탭이 retrieve(param)을 부를 때
export const Emp01_Rd_DueDiligence = forwardRef<DueDiligenceRdHandle>((_, ref) => {
  const [url, setUrl] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    // retrieve(Map) L29-45
    retrieve: async ({ stdDate }) => {
      try {
        const res = await rdApi.buildUrl({ kind: 'viewer', mrd: 'Emp01_Rd_DueDiligence', options: '/rhtmlimportopt [2]', rv: { stdDate } });
        setUrl(res.url);
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
    },
    // rdClear() L47-49
    rdClear: () => setUrl(null),
  }));

  return url ? <iframe title="Emp01_Rd_DueDiligence" src={url} style={{ width: '100%', height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box' }} /> : null;
});
Emp01_Rd_DueDiligence.displayName = 'Emp01_Rd_DueDiligence';
