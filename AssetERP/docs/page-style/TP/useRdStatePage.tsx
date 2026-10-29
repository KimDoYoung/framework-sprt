/**
 * 대외보고서(금감원) RD 보고서 탭 페이지 6개의 공통 처리 (T17)
 * AS-IS: Org02_Rd_OrgState·Sys01_Rd_CompanyState·Emp01_Rd_PersonState·Emp01_Rd_OfficerState·Emp01_Rd_ProPersonState·Emp01_Rd_FinanceProState —
 *        여섯 클래스가 같은 틀이다(새 원본 IDMS-IC). 화면(툴바·이벤트 주석)은 클래스마다 자기 파일에 둔다.
 * 공통 메서드: getCloseDate()(기준년월 말일 yyyy-MM-dd), writeGuide(), rdRetrieve(), retrieve(Map)
 * 다른 점: 조직기구현황만 [조회]가 먼저 출력 자료를 만든다(sys.Sys99_Print.insertRdOrgState → rdGroupId, 기준일 = 말일),
 *         일반현황(Emp01_Rd_PersonState)은 RD 인자에 yyyyMM(기준년월 글자)도 함께 보낸다.
 */
import { useImperativeHandle, useState, type Ref } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import { errorMessage } from '@/api/client';
import { orgStateApi } from '@/api/org';
import { rdApi } from '@/api/rd';
import { rptApi } from '@/api/rpt';
import { RptWriteGuide } from '@/types/rpt';

/** 탭 페이지 핸들 — AS-IS InterfaceTabPage.retrieve(null) */
export interface RdStatePageHandle {
  retrieve: () => void;
}

export interface RdStatePageOptions {
  /** RD 양식 이름(mrd) — 원본 그대로(소문자 시작 emp01_Rd_OfficerState 포함) */
  mrd: string;
  /** 작성요령 보고서코드(GA140 …) */
  reportCode: string;
  /** 조직기구현황: 먼저 출력 자료를 만들고 rdGroupId를 RD 인자로 넘긴다 */
  printFirst?: boolean;
  /** 일반현황: RD 인자에 기준년월 글자(yyyyMM)도 넘긴다 */
  withYyyyMM?: boolean;
}

/** AS-IS getCloseDate()/getCloseDate1(): 기준년월 말일. 형식이 틀리면 null */
const closeDateOf = (yyyyMM: string): string | null => {
  const d = dayjs(yyyyMM.replace(/[-.]/g, '-') + '-01');
  return d.isValid() ? d.add(1, 'month').subtract(1, 'day').format('YYYY-MM-DD') : null;
};

export const useRdStatePage = (ref: Ref<RdStatePageHandle>, { mrd, reportCode, printFirst, withYyyyMM }: RdStatePageOptions) => {
  // 기준년월 기본값 = 이번 달 (생성자: closeDate를 이번 달 1일로 → "yyyy.MM")
  const [yyyyMM, setYyyyMM] = useState(() => dayjs().format('YYYY.MM'));
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [guide, setGuide] = useState<RptWriteGuide | null>(null);

  /** retrieve(Map) L169-188 → rdRetrieve(rdGroupId) L92-117 */
  const retrieve = async () => {
    const closeDate = closeDateOf(yyyyMM);
    if (closeDate == null) { message.error('기준년월을 확인해 주세요.'); return; }
    setLoading(true);
    try {
      const rv: Record<string, string> = { transDate: closeDate };
      if (printFirst) rv.rdGroupId = String(await orgStateApi.rdPrint(closeDate));
      if (withYyyyMM) rv.yyyyMM = yyyyMM;
      const res = await rdApi.buildUrl({ kind: 'viewer', mrd, options: '/rhtmlimportopt [2]', rv });
      setUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({ retrieve: () => void retrieve() }));

  /** writeGuide() L123-141: rpt.Rpt10_FssSubmit.selectByReportCode → Rpt10_Lookup_WriteGuide */
  const writeGuide = async () => {
    try {
      setGuide(await rptApi.getWriteGuide(reportCode));
    } catch (err) {
      message.error(errorMessage(err, '작성요령 조회 실패'));
    }
  };

  return { yyyyMM, setYyyyMM, url, loading, guide, closeGuide: () => setGuide(null), retrieve, writeGuide };
};
