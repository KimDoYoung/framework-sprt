import React from 'react';
import { message } from 'antd';
import { openMenuByNo } from '@/utils/tempData';

// Flt00_Tab_Info (client/vi/flt/Flt00_Tab_Info.java, IDMS-IC) — 임직원매매 화면사용순서 안내. 조회·저장 없음, HTML 안내문 + 링크.
// 스타일: IN (견본 — docs/page-style.md)

const LINK_COLOR = '#0070C0';  // link() L264
const SP = '    ';  // space = &nbsp; ×4

// 링크 id → 열 메뉴 번호 (생성자 L156-240 클릭 핸들러). 팝업을 여는 링크는 null
const MENU_NO: Record<string, string | null> = {
  link01: null,  // Flt02_Lookup_Emp (다음 단계)
  link02: null,  // Flt02_Lookup_Emp (다음 단계)
  link03: '1125',
  link04: '1126',
  link05: '1127',
  'link06-1': '1371',
  'link06-2': '1372',
  link07: '1142',
  link08: '1144',
  link09: null,  // Flt13_Lookup_BookInit (다음 단계)
  link10: '1143',
};

const POPUP_NAME: Record<string, string> = {
  link01: '임직원매매 설정(Flt02_Lookup_Emp)',
  link02: '임직원매매 설정(Flt02_Lookup_Emp)',
  link09: '최초원장등록(Flt13_Lookup_BookInit)',
};

const sp = (n: number) => SP.repeat(n);

export const Flt00_Tab_Info: React.FC = () => {
  // [E1] html.Click (L156) → 링크 id에 따라 팝업 또는 메뉴 탭 열기
  const click = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const menuNo = MENU_NO[id];
    if (menuNo == null) {
      // [E1 다음 단계] Flt02_Lookup_Emp / Flt13_Lookup_BookInit 조회창은 아직 없다
      message.info(`${POPUP_NAME[id]} 조회창은 다음 단계에서 연결합니다.`);
      return;
    }
    if (!openMenuByNo(menuNo)) message.warning('화면을 열 수 없습니다. 메뉴 권한을 확인해주세요.');
  };

  const link = (id: string, text: string) => (
    <a href="#" id={id} onClick={click(id)} style={{ color: LINK_COLOR, textDecoration: 'none' }}>{text}</a>
  );
  const row = (n: number, text: React.ReactNode, key: string) => <div key={key}>{sp(n)}{text}</div>;
  const gap = (key: string) => <div key={key}>&nbsp;</div>;

  // [E0] 화면 열림 (생성자 L30-262) → link() — 안내문(htmlContent)을 만든다
  const content: React.ReactNode[] = [
    <div key="t1"><b>1. 임직원 금융투자상품 매매 {link('link01', '법규준수서약서 작성')} 및 {link('link01', '보고주기 설정')}</b></div>,
    row(1, '1) 법규준수서약서 작성 : 상신을 클릭하여 서약서를 준법감시인에게 제출', 'a1'),
    row(1, '2) 연간투자한도 및 보고주기 설정', 'a2'),
    row(2, '- 적용시작일자 : 입사일 또는 변경일을 입력', 'a3'),
    row(2, '- 연간추가 투자한도 : 성과급을 포함한 연봉한도(세금차감전) 이내에서 본인이 직접 한도를 등록하여 관리', 'a4'),
    row(2, '- 보고주기 :  월별 또는 분기별 선택', 'a5'),
    row(3, '* 운용부서 임직원은 월별, 매월 말일을 기준으로 다음달 말일까지 "월별"신고', 'a6'),
    row(3, '* 운용부서 외의 임직원 및 운용부서의 가족계좌는 분기종료일을 기준으로 다음달 말일까지 "분기별" 신고', 'a7'),
    gap('g1'),

    <div key="t2"><b>2. {link('link02', '가족 금융거래정보 이용동의서')} 파일 업로드</b></div>,
    row(1, '기업금융, 고유재산 및 집합투자재산운용, 조사분석부서 등에 근무하는 임직원은 가족명의 계좌도', 'b1'),
    row(1, '계좌개설 및 매매 명세서 신고의무가 있으나, 금융거래 정보 수집 및 이용 등 관련 법상 필요한 동의를 득하여야 함', 'b2'),
    gap('g2'),

    <div key="t3"><b>3. {link('link03', '계좌신고')} : 계좌개설시 지체 없이 준법감시인에게 신고</b></div>,
    row(1, '1) 계좌 등록 후 주 계좌 설정 (예외적인 경우 외에는 하나의 자기명의 계좌를 통하여 거래)', 'c1'),
    row(1, '2) 최초원장 등록 : 입사전 보유종목을 사전에 등록 (최초 1회에 한함)', 'c2'),
    row(1, '3) 신고대상 계좌를 모두 선택한 후 상신 버튼을 클릭하여 준법감시인에게 제출', 'c3'),
    row(1, '4) 계좌폐쇄', 'c4'),
    row(2, '- 계좌를 폐쇄한 경우 해당 계좌를 선택한 후 계좌폐쇄 버튼을 클릭', 'c5'),
    row(2, '- 폐쇄대상 계좌를 선택한 후 상신 버튼을 클릭하여 준법감시인에게 제출', 'c6'),
    gap('g3'),

    <div key="t4"><b>4. {link('link04', '매수 사전신고')} 및 승인 </b> : 상장 지분증권 매수 시 준법감시인 사전승인 필수</div>,
    row(1, '1) 기준일자 : 사전신고일', 'd1'),
    row(1, '2) 계좌 선택', 'd2'),
    row(1, '3) 투자한도 확인 : 연간투자금액, 총누적투자금액, 월간매매회전율, 월간매수주문횟수, 일간매수주문횟수 확인', 'd3'),
    row(1, '4) 등록 : 종목유형, 종목명, 주문수량, 주문총액 입력한 후 저장', 'd4'),
    row(1, '5) 승인신청 : 등록한 매수대상 종목을 모두 선택한 후 승인신청 버튼을 클릭하여 준법감시인에게 사전승인 신청', 'd5'),
    row(2, '- 매수제한종목, 펀드보유종목 해당여부 확인', 'd6'),
    row(2, '- 승인신청 자동알림 발송 : 준법감시인에게 일 2회(메일 또는 문자) 발송 (오전 10시 30분, 오후 2시 30분)', 'd7'),
    row(1, '6) 준법감시인 : 펀드보유종목, 투자제한종목, 월간매수주문횟수, 일간매수주문횟수 등 판단한 후 승인', 'd8'),
    gap('g4'),

    <div key="t5"><b>5. {link('link05', '매도 사전신고')} 및 승인 </b> : 상장 지분증권 매도 시 준법감시인 사전승인 필수</div>,
    row(1, '1) 기준일자 : 사전신고일', 'e1'),
    row(1, '2) 계좌 선택', 'e2'),
    row(1, '3) 등록 : 매도할 종목을 보유내역에서 선택하고 주문수량, 주문총액 입력한 후 저장', 'e3'),
    row(2, '* 보유내역 팝업에 종목이 나타나지 않은 경우에는 "임직원매매 보유내역" 화면에서 "보유원장 정리" 버튼을 클릭하여 원장 정리를 해주세요', 'e4'),
    row(1, '4) 승인신청 : 등록한 매도대상 종목을 모두 선택한 후 승인신청 버튼을 클릭하여 준법감시인에게 사전승인 신청', 'e5'),
    row(2, '- 펀드보유종목 해당여부 확인', 'e6'),
    row(2, '- 승인신청 자동알림 발송 : 준법감시인에게 일 2회(메일 또는 문자) 발송 (오전 10시 30분, 오후 2시 30분)', 'e7'),
    row(1, '5) 준법감시인 : 의무보유기간, 선행매매, 종목수익 하락률(10%) 등 판단한 후 승인', 'e8'),
    gap('g5'),

    <div key="t6"><b>6. 기타입력 </b> : 정기보고서(매월 또는 분기)의 보유내역에 반영</div>,
    row(1, <>1) 임직원매매 <b>{link('link06-1', '계좌대체')}</b> : 보유종목을 다른계좌로 현물 이동하는 경우 사용</>, 'f1'),
    row(1, <>2) 임직원매매 <b>{link('link06-2', '권리행사')}</b> : 전환권행사, 신주인수권행사, 유무상증자, 감자 등의 경우 사용</>, 'f2'),
    gap('g6'),

    <div key="t7"><b>7. 매매내역 {link('link07', '정기보고')}</b> : 매매명세(월간 또는 분기거래내역)를 준법감시인에게 보고</div>,
    row(1, '1) 등록 : 월 또는 분기별로 "사전승인내역"을 확인하고 "실거래내역"을 입력', 'h1'),
    row(1, '2) 월말 평가금액 입력', 'h2'),
    row(2, '- 상장주식 : 상장주식 평가처리 버튼 클릭', 'h3'),
    row(2, '- 상장주식 외 : 잔고증명서상의 평가금액을 입력한 후 저장 버튼 클릭', 'h4'),
    row(1, '3) 정기보고서 작성 및 문서상신 : 실거래내역을 모두 선택한 후 "정기보고서 작성" 버튼을 클릭하여 준법감시인에게 상신', 'h5'),
    gap('g7'),

    <div key="t8"><b>8. {link('link08', '매매내역 조회')}</b> : 본인의 매매내역을 확인</div>,
    gap('g8'),

    <div key="t9"><b>9. {link('link09', '보유내역 조회')}</b> : 본인의 보유내역을 확인</div>,
    row(1, '- 입사전에 보유한 종목은 최초원장등록에서 사전에 등록 (최초 1회에 한함)', 'i1'),
    gap('g9'),

    <div key="t10"><b>10. {link('link10', '위반내역 조회')}</b> : 본인의 위반내역을 확인</div>,
    ...Array.from({ length: 9 }, (_, i) => gap(`tail${i}`)),  // 끝의 <br> 여백
  ];

  // 레이아웃 getEditor() L1-267: north(40, 여백 10,0,0,5) 안내 문구 + center(테두리, 여백 15) 스크롤 영역
  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <div style={{ margin: '10px 0 0 5px', height: 40, fontSize: 12, color: '#404040', fontWeight: 'bold' }}>
        {' '}(항목 위에서 마우스 클릭시 팝업OPEN 또는 처리 화면으로 이동합니다.){' '}
      </div>
      <div style={{ flex: 1, minHeight: 0, border: '1px solid #d9d9d9', padding: 15, boxSizing: 'border-box', overflow: 'auto' }}>
        <span style={{ display: 'block', color: '#000000', fontSize: 14, lineHeight: 2.0 }}>
          {content}
        </span>
      </div>
    </div>
  );
};
