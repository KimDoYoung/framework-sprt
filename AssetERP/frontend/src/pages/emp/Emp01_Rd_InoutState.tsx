/**
 * 기간별 입퇴사현황 RD 보고서 영역 (T18) — Emp01_Tab_InoutState의 아래쪽
 * AS-IS: myApp/client/vi/emp/Emp01_Rd_InoutState.java (44줄, 새 원본 IDMS-IC) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 생성자 L16-18: RD 영역만. retrieve(param) L21-38: mrd Emp01_Rd_InOutState(O 대문자), rv = companyId·personId(서버가 채움)·startDate·closeDate
 */
import { forwardRef, useImperativeHandle, useState } from 'react';
import { message } from 'antd';
import { errorMessage } from '@/api/client';
import { rdApi } from '@/api/rd';

export interface InoutStateRdHandle {
  retrieve: (param: { startDate: string; closeDate: string }) => Promise<void>;
  rdClear: () => void;
}

// [E0] 화면 열림 (생성자 L16-18) → RD 영역만 만든다 — 조회는 탭이 retrieve(param)을 부를 때
export const Emp01_Rd_InoutState = forwardRef<InoutStateRdHandle>((_, ref) => {
  const [url, setUrl] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    // retrieve(Map) L21-38
    retrieve: async ({ startDate, closeDate }) => {
      try {
        const res = await rdApi.buildUrl({ kind: 'viewer', mrd: 'Emp01_Rd_InOutState', options: '/rhtmlimportopt [2]', rv: { startDate, closeDate } });
        setUrl(res.url);
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
    },
    // rdClear() L40-42
    rdClear: () => setUrl(null),
  }));

  return url ? <iframe title="Emp01_Rd_InOutState" src={url} style={{ width: '100%', height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box' }} /> : null;
});
Emp01_Rd_InoutState.displayName = 'Emp01_Rd_InoutState';
