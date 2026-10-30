/**
 * 법인카드 현황 RD 보고서 영역 (U17) — Biz01_Tab_CardReport의 가운데
 * AS-IS: myApp/client/vi/biz/Biz01_Rd_CardReport.java (82줄, 새 원본 IDMS-IC) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 생성자 L31-35: RD 영역만 만들고 안내문을 보인다. retrieve(param, g1, g2, g3) L38-45: param이 없으면 안내문(showGuideMessage L47-56),
 *   있으면 setRd L59-81: mrd Biz01_Rd_CardReport, rv = companyId·personId(서버가 채움)·rdGroupId·rdGroupId2·rdGroupId3·startDate·closeDate·year·month
 */
import { forwardRef, useImperativeHandle, useState } from 'react';
import { message } from 'antd';
import { errorMessage } from '@/api/client';
import { rdApi } from '@/api/rd';

export interface CardReportRdParam {
  startDate: string;
  closeDate: string;
  year: string;
  month: string;
}

export interface CardReportRdHandle {
  /** param이 null이면 안내문 (AS-IS retrieve(null, …)) */
  retrieve: (param: CardReportRdParam | null, rdGroupId?: string, rdGroupId2?: string, rdGroupId3?: string) => Promise<void>;
}

// [E0] 화면 열림 (생성자 L31-35) → RD 영역만 만들고 안내문을 보인다 — 조회는 탭이 retrieve(param, …)을 부를 때
export const Biz01_Rd_CardReport = forwardRef<CardReportRdHandle>((_, ref) => {
  const [url, setUrl] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    retrieve: async (param, rdGroupId, rdGroupId2, rdGroupId3) => {
      if (param == null) {
        setUrl(null);
        return;
      }
      try {
        const res = await rdApi.buildUrl({
          kind: 'viewer',
          mrd: 'Biz01_Rd_CardReport',
          options: '/rhtmlimportopt [2]',
          rv: {
            rdGroupId: rdGroupId ?? '',
            rdGroupId2: rdGroupId2 ?? '',
            rdGroupId3: rdGroupId3 ?? '',
            startDate: param.startDate,
            closeDate: param.closeDate,
            year: param.year,
            month: param.month,
          },
        });
        setUrl(res.url);
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
    },
  }));

  if (url) {
    return <iframe title="Biz01_Rd_CardReport" src={url} style={{ width: '100%', height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box' }} />;
  }
  // showGuideMessage() L47-56 / RDTemplate L20-27
  return (
    <div style={{ height: '100%', boxSizing: 'border-box', border: '1px solid #d9d9d9', lineHeight: '24px', textAlign: 'left', color: '#1F4D83', fontWeight: 'bold', fontSize: 14 }}>
      <br /><br />
      <span style={{ paddingLeft: 66 }}>미리보기 상단 [조회]버튼을 클릭해주세요.</span>
    </div>
  );
});
Biz01_Rd_CardReport.displayName = 'Biz01_Rd_CardReport';
