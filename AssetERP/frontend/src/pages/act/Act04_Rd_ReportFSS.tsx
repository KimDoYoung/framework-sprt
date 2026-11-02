/**
 * 금감원보고용 재무제표 RD 보고서 영역 (X22) — Act04_Tab_ReportFSS의 아래쪽
 * AS-IS: myApp/client/vi/act/Act04_Rd_ReportFSS.java (53줄, 새 원본 IDMS-IC) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 생성자 L24-26: RD 영역만. retrieve(param, rdGroupId) L29-31 → setRd L34-51: mrd Act04_Rd_ReportFSS, rv = rdGroupId·companyId·personId·stdDate·code
 */
import { forwardRef, useImperativeHandle, useState } from 'react';
import { message } from 'antd';
import { errorMessage } from '@/api/client';
import { rdApi } from '@/api/rd';
import { useLoginUser } from '@/hooks/useLoginUser';

export interface ReportFssRdHandle {
  retrieve: (param: { stdDate: string; code: string }, rdGroupId: string) => Promise<void>;
}

// [E0] 화면 열림 (생성자 L24-26) → RD 영역만 만든다 — 조회는 탭이 retrieve(param, rdGroupId)를 부를 때
export const Act04_Rd_ReportFSS = forwardRef<ReportFssRdHandle>((_, ref) => {
  const user = useLoginUser();
  const [url, setUrl] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    // retrieve(Map, String) L29-31 → setRd L34-51
    retrieve: async ({ stdDate, code }, rdGroupId) => {
      try {
        const res = await rdApi.buildUrl({
          kind: 'viewer', mrd: 'Act04_Rd_ReportFSS', options: '/rhtmlimportopt [2]',
          rv: { rdGroupId, companyId: String(user.companyId), personId: String(user.userId), stdDate, code },
        });
        setUrl(res.url);
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
    },
  }));

  return url ? <iframe title="Act04_Rd_ReportFSS" src={url} style={{ width: '100%', height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box' }} /> : null;
});
Act04_Rd_ReportFSS.displayName = 'Act04_Rd_ReportFSS';
