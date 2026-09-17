import { MenuLevel_1, EmployeeStatus, ScheduleItem, DayListItem, ApprovalItem, ComplianceItem, LargeAssetItem } from '../types';
 
export const menuLevel_1_List: MenuLevel_1[] = [
  {
    id: 'doc',
    title: '문서작성',
    iconName: 'FileTextOutlined',
    groups: [
      {
        groupCode: '00',
        groupTitle: '00. 문서기안',
        items: [
          { code: '1101', title: '일반 기안서 작성' },
          { code: '1102', title: '비용 품의서 작성' },
          { code: '1103', title: '자산 취득 품의서' },
        ],
      },
      {
        groupCode: '01',
        groupTitle: '01. 문서보관함',
        items: [
          { code: '1110', title: '결재 진행 문서함' },
          { code: '1111', title: '완료 문서함' },
          { code: '1112', title: '반려 문서함' },
        ],
      },
    ],
  },
  {
    id: 'duty',
    title: '책무',
    iconName: 'AuditOutlined',
    groups: [
      {
        groupCode: '00',
        groupTitle: '00. 대시보드',
        items: [
          { code: '1495', title: '책무점검 현황' },
          { code: '1496', title: '책무진행 상태' },
          { code: '1497', title: '책무마감 검증' },
        ],
      },
      {
        groupCode: '01',
        groupTitle: '01. 기본정보',
        items: [
          { code: '1411', title: '임원 등록' },
          { code: '1412', title: '책무 등록' },
          { code: '1413', title: '관리의무 등록' },
          { code: '1415', title: '회의체 등록' },
          { code: '1414', title: '직책 등록' },
          { code: '1454', title: '책무담당자 등록' },
          { code: '1463', title: '직책별 부서승인선 등록' },
        ],
      },
      {
        groupCode: '02',
        groupTitle: '02. 책무구조도',
        items: [
          { code: '1417', title: '임원별 직책배정' },
          { code: '1418', title: '임원별 책무기술서' },
          { code: '1419', title: '책무체계도' },
          { code: '1480', title: '책무구조도 제출' },
        ],
      },
      {
        groupCode: '03',
        groupTitle: '03. 부서책무매뉴얼',
        items: [
          { code: '1420', title: '매뉴얼 작업대상 선정' },
          { code: '1421', title: '매뉴얼 부서지정' },
          { code: '1422', title: '매뉴얼(점검항목) 작성' },
          { code: '1423', title: '매뉴얼 보고(부서별)' },
          { code: '1424', title: '매뉴얼 관리(관리자)' },
        ],
      },
    ],
  },
  {
    id: 'compliance',
    title: '준법감시',
    iconName: 'SafetyCertificateOutlined',
    groups: [
      {
        groupCode: '00',
        groupTitle: '00. 컴플라이언스 현황',
        items: [
          { code: '1501', title: '준법통제 점검현황' },
          { code: '1502', title: '법규준수 평가보고' },
        ],
      },
      {
        groupCode: '01',
        groupTitle: '01. 내부통제 점검',
        items: [
          { code: '1511', title: '상시모니터링 항목' },
          { code: '1512', title: '점검결과 조치내역' },
        ],
      },
    ],
  },
  {
    id: 'schedule',
    title: '스케줄',
    iconName: 'CalendarOutlined',
    groups: [
      {
        groupCode: '00',
        groupTitle: '00. 일정 관리',
        items: [
          { code: '1601', title: '전사 공유 캘린더' },
          { code: '1602', title: '부서별 업무 스케줄' },
          { code: '1603', title: '회의실 및 자원 예약' },
        ],
      },
    ],
  },
  {
    id: 'management',
    title: '경영관리',
    iconName: 'IdcardOutlined',
    groups: [
      {
        groupCode: '00',
        groupTitle: '00. 자산 관리 (AgGrid 대용량)',
        items: [
          { code: '1701', title: '대용량 자산 마스터 (AgGrid 10,000건+)', badge: '대용량' },
          { code: '1702', title: '자산 취득 및 이동 관리' },
          { code: '1703', title: '정기 재물조사 현황' },
        ],
      },
      {
        groupCode: '01',
        groupTitle: '01. 인사/조직',
        items: [
          { code: '1711', title: '임직원 마스터 정보' },
          { code: '1712', title: '부서 및 조직도 개편' },
        ],
      },
    ],
  },
  {
    id: 'request',
    title: '신청',
    iconName: 'FormOutlined',
    groups: [
      {
        groupCode: '00',
        groupTitle: '00. 행정 신청',
        items: [
          { code: '1801', title: '연차 및 근태 신청' },
          { code: '1802', title: '출장 및 여비 정산' },
          { code: '1803', title: 'IT장비/소프트웨어 신청' },
        ],
      },
    ],
  },
  {
    id: 'community',
    title: '커뮤니티',
    iconName: 'TeamOutlined',
    groups: [
      {
        groupCode: '00',
        groupTitle: '00. 사내 소통',
        items: [
          { code: '1901', title: '사내 공지사항' },
          { code: '1902', title: '자유게시판' },
          { code: '1903', title: '사내 제안마당' },
        ],
      },
    ],
  },
  {
    id: 'kfs',
    title: 'KFS',
    iconName: 'AppstoreOutlined',
    groups: [
      {
        groupCode: '00',
        groupTitle: '00. KFS 금융시스템',
        items: [
          { code: '2001', title: '금융자산 평가 현황' },
          { code: '2002', title: '펀드/신탁 포트폴리오' },
          { code: '2003', title: '대용량 거래내역 (AgGrid)', badge: '대용량' },
        ],
      },
    ],
  },
];

export const firstLevelMenus = menuLevel_1_List;

export const employeeList: EmployeeStatus[] = [
  { id: '1', name: '박동진', position: '사장', status: 'busy', dept: '경영진' },
  { id: '2', name: '배주한', position: '상무', status: 'busy', dept: '금융영업본부' },
  { id: '3', name: '정영주', position: '상무', status: 'busy', dept: '리스크관리본부' },
  { id: '4', name: '김상환', position: '상무', status: 'online', dept: '자산운용본부' },
  { id: '5', name: '이용희', position: '전무', status: 'online', dept: '기획조정실' },
  { id: '6', name: '김대정', position: '상무', status: 'online', dept: '준법감시실' },
  { id: '7', name: '김득수', position: '이사', status: 'online', dept: 'IT정보전략실' },
  { id: '8', name: '나필순', position: '상무', status: 'online', dept: '재무회계본부' },
  { id: '9', name: '천영임', position: '부장', status: 'online', dept: '자산수탁팀' },
  { id: '10', name: '한송이', position: '차장', status: 'busy', dept: '컴플라이언스팀' },
  { id: '11', name: '김승주', position: '차장', status: 'online', dept: 'IT개발실' },
  { id: '12', name: '정가해', position: '과장', status: 'busy', dept: '인사총무팀' },
  { id: '13', name: '김도영', position: '이사', status: 'online', dept: 'IT개발실' },
];

export const mockScheduleList: ScheduleItem[] = [
  {
    id: 's1',
    category: '부서일정',
    title: '[책무구조도] 3분기 임원별 관리의무 및 직책배정 최종 검증',
    registrant: '김도영',
    dueDate: '2026-09-16 18:00',
    processedDate: '진행중',
    detail: '보기',
  },
  {
    id: 's2',
    category: '부서일정',
    title: 'IT 인프라 자산 실사 및 라이선스 갱신 품의',
    registrant: '김승주',
    dueDate: '2026-09-18 15:00',
    processedDate: '대기',
    detail: '보기',
  },
  {
    id: 's3',
    category: '자리비움',
    title: '금융감독원 업무보고 세미나 참석',
    registrant: '김도영',
    dueDate: '2026-09-16 17:00',
    processedDate: '완료',
    detail: '보기',
  },
];

export const mockDayList: DayListItem[] = [
  {
    id: 'd1',
    workType: '책무관리',
    regDueDate: '2026-09-17',
    title: '2026년 하반기 내부통제위원회 회의체 안건 등록',
    completedDate: '-',
    manager: '김대정 상무',
    detail: '상세',
  },
  {
    id: 'd2',
    workType: '전산자산',
    regDueDate: '2026-09-17',
    title: 'IDC 노후 스위치 장비 교체 및 자산 불용 처리',
    completedDate: '-',
    manager: '김도영 이사',
    detail: '상세',
  },
  {
    id: 'd3',
    workType: '법규준수',
    regDueDate: '2026-09-17',
    title: '금융소비자보호법 개정안 반영 매뉴얼 점검보고',
    completedDate: '-',
    manager: '한송이 차장',
    detail: '상세',
  },
];

export const mockApprovalList: ApprovalItem[] = [
  {
    id: 'a1',
    status: '결재대기',
    regDate: '2026-09-16',
    title: '[품의] 2026년 차세대 AssetERP 클라우드 서버 증설 요청 건',
    applicant: '김승주 차장',
    detail: '결재',
  },
  {
    id: 'a2',
    status: '검토중',
    regDate: '2026-09-15',
    title: '[보고] 책무구조도 임원별 업무범위 기술서 제출 승인',
    applicant: '김도영 이사',
    detail: '검토',
  },
];

export const mockComplianceList: ComplianceItem[] = [
  {
    id: 'c1',
    category: '외감법공시',
    dueDate: '2026-09-30',
    title: '2026년도 3분기 외부감사인 중간보고 및 내부회계관리제도 점검',
    detail: '열람',
  },
  {
    id: 'c2',
    category: '금융규정',
    dueDate: '2026-10-15',
    title: '지배구조법 개정에 따른 책무구조도 금융위원회 정기 제출 안내',
    detail: '열람',
  },
  {
    id: 'c3',
    category: '보안지침',
    dueDate: '2026-09-25',
    title: '전자금융감독규정 준수를 위한 개인정보 단말기 보안 일제 점검',
    detail: '열람',
  },
];

// 10,000건 이상의 고성능 대용량 데이터 생성기 (AgGrid 가상 스크롤 테스트용)
export function generateLargeAssetData(count: number = 10000): LargeAssetItem[] {
  const categories = ['IT전산장비', '네트워크서버', '사무가구', '업무용차량', '소프트웨어라이선스', '연구개발장비'];
  const depts = ['IT개발실', '자산운용팀', '기획조정실', '컴플라이언스팀', '재무회계팀', '금융영업부', '리스크관리팀'];
  const managers = ['김도영', '김승주', '박동진', '배주한', '정영주', '김상환', '이용희', '천영임', '한송이'];
  const statuses: ('정상' | '수리중' | '폐기예정' | '대여중')[] = ['정상', '정상', '정상', '수리중', '정상', '폐기예정', '대여중'];
  const locations = ['본사 12F 대회의실', '본사 8F IT전산실', 'IDC 가산센터 R-3', '본사 10F 금융사업부', 'IDC 상암센터 Rack-12', '본사 7F'];

  const items: LargeAssetItem[] = new Array(count);
  for (let i = 0; i < count; i++) {
    const num = i + 1;
    const cat = categories[i % categories.length];
    const dept = depts[i % depts.length];
    const manager = managers[i % managers.length];
    const status = statuses[i % statuses.length];
    const loc = locations[i % locations.length];

    const year = 2022 + (i % 5);
    const month = String(1 + (i % 12)).padStart(2, '0');
    const day = String(1 + (i % 28)).padStart(2, '0');
    const price = Math.round((500000 + ((i * 137) % 15000000)) / 10000) * 10000;

    items[i] = {
      id: num,
      assetNo: `AST-${year}-${String(num).padStart(6, '0')}`,
      name: `${cat === 'IT전산장비' ? 'Apple MacBook Pro / ThinkPad X1' : cat === '네트워크서버' ? 'Dell PowerEdge R750 / Cisco Nexus' : cat === '사무가구' ? 'Herman Miller Aeron Chair' : cat === '소프트웨어라이선스' ? 'JetBrains All Products / Oracle DB' : '업무용 법인 자산'} #${num}`,
      category: cat,
      dept,
      manager,
      status,
      acquireDate: `${year}-${month}-${day}`,
      price,
      location: loc,
      complianceChecked: i % 3 === 0,
    };
  }
  return items;
}
