/**
 * 법인카드 현황 (U17) — 자금관리 > 30. 법인카드관리 > 법인카드 현황 #1333
 * AS-IS: myApp/client/vi/biz/Biz01_Tab_CardReport.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L74-192: north(여백 20/20/0/20) = 툴바(기준년월 [yyyy 45] [월 콤보 60] [관리자|실사용자 콤보 80 — 회사가 실사용자 관리를 쓸 때만] [조회] [항목별 계정연결]),
 *   center = RD 영역(Biz01_Rd_CardReport), south(높이 70) = 테두리 칸(문서분류 800 · 상신상태 250 · [상신] 120 · [문서보기] 120)
 * 함께: Biz01_Rd_CardReport(RD 영역), Biz03_Lookup_AccountMap(항목별 계정연결), Dcr30_Move_DcrClass(문서분류, 기존)
 * 1단계(다른 U 화면과 같은 사유): 상신·문서보기가 여는 전자결재 편집창 `Apr01_Edit_ApprDoc`(apr 도메인)은 다음 단계 — [상신]은 AS-IS 점검까지 하고 편집창 자리에 안내만 띄운다
 * 스타일: SR (견본 Emp01_Tab_InoutState — docs/page-style.md) + 아래 문서분류·상신상태 줄은 SG처럼 flex none 70 한 줄
 * UX보강(10): 툴바 = SearchBar(UX-01·04, 조건이 3개이나 버튼이 둘이라 UX-02 초기화는 뺀다)
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Input, message, Select } from 'antd';
import dayjs from 'dayjs';
import { bizCardManagementApi, bizCardReportApi, bizPromoApi, bizRelateApprApi } from '@/api/biz';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Dcr30_Move_DcrClass, Dcr30ClassResult } from '@/components/lookup/Dcr30_Move_DcrClass';
import { Biz01_Rd_CardReport, CardReportRdHandle } from './Biz01_Rd_CardReport';
import { Biz03_Lookup_AccountMap } from './Biz03_Lookup_AccountMap';

/** AS-IS 링크코드 A35 = 법인카드 현황 */
const LINK_CODE = 'A35';

/** 상신 상태 (apprChk() L368-417) */
interface ApprState {
  code: string;
  name: string;
  apprId: number | null;
  apprEnabled: boolean;
  viewEnabled: boolean;
}
const NOT_SUBMITTED: ApprState = { code: '00', name: '미상신', apprId: null, apprEnabled: true, viewEnabled: false };

export const Biz01_Tab_CardReport: React.FC = () => {
  const rdRef = useRef<CardReportRdHandle>(null);
  // 생성자 L89-99: 기준 = 지난달. yyyy 45, 월 콤보(MonthsCode) 60, 사용자 구분 콤보 "관리자"
  const [year, setYear] = useState(() => dayjs().subtract(1, 'month').format('YYYY'));
  const [month, setMonth] = useState<string | undefined>(() => dayjs().subtract(1, 'month').format('MM'));
  const [cardRealUserType, setCardRealUserType] = useState('관리자');
  const [realUser, setRealUser] = useState(false);
  const [defaultDoc, setDefaultDoc] = useState<Dcr30ClassResult | null>(null);
  const [classTree, setClassTree] = useState<Dcr30ClassResult | null>(null);
  const [docOpen, setDocOpen] = useState(false);
  const [appr, setAppr] = useState<ApprState>(NOT_SUBMITTED);
  const [mappingOpen, setMappingOpen] = useState(false);
  const cond = useRef({ year, month });
  cond.current = { year, month };

  // getStartDateStr()·getCloseDateStr() L425-449: 그 달 1일 ~ 말일 ('yyyy-MM-dd')
  const dates = () => {
    const first = dayjs(`${cond.current.year}-${cond.current.month}-01`);
    return { startDate: first.format('YYYY-MM-DD'), closeDate: first.add(1, 'month').subtract(1, 'day').format('YYYY-MM-DD') };
  };
  const validCond = () => {
    if (!/^\d{4}$/.test(cond.current.year.trim()) || !cond.current.month) {
      message.warning('기준년월을 확인해주세요');
      return false;
    }
    return true;
  };

  // apprChk() L368-417: 서비스 biz.Biz05_RelateAppr.selectByDataYm(companyId, yyyy + "." + 월, linkCode A35) — 한 건이면 그 상태(없으면 미상신, 40 반려면 [상신] 다시 가능), 아니면 미상신
  const apprChk = useCallback(async () => {
    const { year: y, month: m } = cond.current;
    if (!/^\d{4}$/.test(y.trim()) || !m) return;
    try {
      const r = await bizRelateApprApi.getByDataYm(`${y.trim()}.${m}`, LINK_CODE);
      if (!r || r.statusCode == null) setAppr(NOT_SUBMITTED);
      else if (r.statusCode === '40') setAppr({ code: r.statusCode, name: r.statusName ?? '', apprId: r.apprId, apprEnabled: true, viewEnabled: true });
      else setAppr({ code: r.statusCode, name: r.statusName ?? '', apprId: r.apprId, apprEnabled: false, viewEnabled: true });
    } catch (err) {
      message.error(errorMessage(err, '상신 상태 조회 실패'));
    }
  }, []);

  // [E1] retrieveButton[조회].Select (L108) → retrieve() L194-270: 세 보고서의 출력 자료를 차례로 만들고(sys.Sys99_Print.insertCardReport·2·3)
  //   → rdForm.retrieve(param, rdGroupId1·2·3) → apprChk()
  const retrieve = async () => {
    if (!validCond()) return;
    const { startDate, closeDate } = dates();
    try {
      const g = await bizCardReportApi.print(cond.current.year.trim(), cond.current.month as string, realUser ? cardRealUserType : '관리자');
      await rdRef.current?.retrieve({ startDate, closeDate, year: cond.current.year.trim(), month: cond.current.month as string }, g.groupId1, g.groupId2, g.groupId3);
      await apprChk();
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // defaultName() L293-313: 서비스 dcr.Dcr30_Link.selectByLinkCode(companyId, "A35") — 한 건이면 그 분류, 아니면 안내 문구 → apprChk()
  // [E0] 화면 열림 (생성자 L74-192) → rdForm.retrieve(null, …)(안내문), defaultName()
  useEffect(() => {
    void rdRef.current?.retrieve(null);
    bizCardManagementApi.getCardRealUser().then(setRealUser).catch(() => undefined);
    bizPromoApi.getDocClass(LINK_CODE)
      .then(d => {
        const model = d ? { classTreeId: d.classTreeId, classTreeFullName: d.classTreeFullName } : null;
        setDefaultDoc(model);
        setClassTree(model);
      })
      .catch(() => undefined)
      .finally(() => { void apprChk(); });
  }, [apprChk]);

  // [E3] apprButton[상신].Select (L120) → insertLinkApproval() L315-348: 문서분류가 없으면 "문서분류를 선택해주세요."
  //   → Apr01_Edit_ApprDoc.insertLinkApproval(분류, "A35", 출력 자료(년·월·rdGroupId1·2·시작·종료일·사용자·도메인)) → updateApprId() L350-366 (biz.Biz05_RelateAppr.insert, "정상적으로 상신이 완료되었습니다") — 전자결재 편집창은 다음 단계
  const insertLinkApproval = () => {
    if (classTree?.classTreeId == null) {
      message.warning('문서분류를 선택해주세요.');
      return;
    }
    message.info('전자결재 작성 창은 다음 단계에서 연결됩니다');
  };

  // [E4] apprViewButton[문서보기].Select (L126) → 서비스 apr.Apr01_Appr.selectById(apprId) → Apr01_Edit_ApprDoc.retrieveApproval(…, callback → apprChk()) — 전자결재 편집창은 다음 단계
  const apprView = () => { message.info('전자결재 문서 보기 창은 다음 단계에서 연결됩니다'); };

  const docText = classTree?.classTreeFullName ?? '';
  const docPlaceholder = defaultDoc?.classTreeFullName ?? '문서분류가 미지정 상태입니다. 관리자에게 문의해주세요';

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20, background: '#fff', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <SearchBar
        onSearch={retrieve}
        extra={
          // [E2] mappingButton[항목별 계정연결].Select (L114) → lookupMapping() L272-279: Biz03_Lookup_AccountMap.open(callback → retrieve())
          <Button type="save" onClick={() => setMappingOpen(true)}>항목별 계정연결</Button>
        }
      >
        <SearchBar.Field label="기준년월">
          <SearchBar.Input style={{ width: 70 }} maxLength={4} value={year} onChange={e => setYear(e.target.value)} />
          <SystemCodeComboBox kindCd="MonthsCode" style={{ width: 80, marginLeft: 8 }} allowClear={false} value={month} onChange={code => setMonth(code)} />
          {realUser && (
            <Select<string> style={{ width: 100, marginLeft: 8 }} value={cardRealUserType} onChange={setCardRealUserType}
              options={[{ value: '관리자', label: '관리자' }, { value: '실사용자', label: '실사용자' }]} />
          )}
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Biz01_Rd_CardReport ref={rdRef} />
      </div>
      {/* [E5] classTreeFullName[문서분류].TriggerClick (L151) → openLookupDoc() L282-291: Dcr30_Move_DcrClass.open(callback) → 고른 분류를 칸에 넣는다 */}
      <div style={{ flex: 'none', height: 70, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 10, padding: '0 10px', border: '1px solid #d9d9d9', background: '#fff' }}>
        <span style={{ fontWeight: 'bold' }}>문서분류</span>
        <LookupInput value={docText} placeholder={docPlaceholder} width={500} onOpen={() => setDocOpen(true)} />
        <span style={{ fontWeight: 'bold' }}>상신상태</span>
        <Input style={{ width: 150 }} readOnly value={appr.name} />
        <Button type="register" disabled={!appr.apprEnabled} onClick={insertLinkApproval}>상신</Button>
        <Button type="search" disabled={!appr.viewEnabled} onClick={apprView}>문서보기</Button>
      </div>
      <Dcr30_Move_DcrClass open={docOpen} onResult={r => { setDocOpen(false); setClassTree(r); }} onClose={() => setDocOpen(false)} />
      <Biz03_Lookup_AccountMap open={mappingOpen} onClose={() => { setMappingOpen(false); void retrieve(); }} />
    </div>
  );
};
