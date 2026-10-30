/** 권한그룹 (GET /api/v1/sys/roles, AS-IS Sys04_RoleModel) */
export interface Role {
  roleId: number;
  companyId?: number;
  roleNm: string;
  seq?: string;
  note?: string;
  /** DB 값 'true'/'false' 문자열 */
  defaultRole?: string | null;
  adminYn?: string | null;
  companyNm?: string;
}

/** 고객(회사) 목록 행 (GET /api/v1/sys/companies, AS-IS Sys01_CompanyModel). Y/N은 'true'/'false' 문자열 */
export interface Company {
  companyId: number;
  companyNm: string;
  locNm?: string | null;
  bizNo?: string | null;
  loginSecureYn?: string;
  icamCompanyCd?: string | null;
  icamAdvisCompanyCd?: string | null;
  useYn?: string;
  note?: string | null;
  empInfo?: string | null;
  mobileTelNo?: string | null;
  officeTelNo?: string | null;
  fullAddress?: string | null;
  companyRepNm?: string | null;
  mailInfo?: string | null;
  mailLogYn?: string;
  apprStepLockYn?: string;
  dcrNumberingNm?: string | null;
  dcrDetailUseYn?: string;
  aprManagerInfoYn?: string;
  leaveMonthNm?: string | null;
  leaveYn?: string;
  leaveCompulsionRt?: number;
  icsCheckCycleNm?: string | null;
  icsComplyCycleNm?: string | null;
  taxTypeNm?: string | null;
  accountCloseMonthNm?: string | null;
  ownerCapitalApplyNm?: string | null;
  astManagerAutoYn?: string;
  icsGuideYn?: string;
  noticeDate?: string | null;
  startDate?: string | null;
}

/** 신규고객사 등록 (POST /api/v1/sys/companies, AS-IS Sys01_Edit_Company) */
export interface CompanyCreateReq {
  companyNm: string;
  locNm: string;
  emgrcyPasswd: string;
  /** YYYY-MM-DD */
  startDate: string;
  mailInfo?: string;
  bizNo: string;
  leaveMonthCd?: string;
  taxType?: string;
  accountCloseMonth?: string;
}

/** 공통코드 콤보 항목 (GET /api/v1/sys/codes?kindCd=) */
export interface Code {
  code: string;
  name: string;
}

/** 관리정보 탭 행 (GET /api/v1/sys/companies/{id}/manage, AS-IS Sys01_TabPage_Info01). Y/N은 DB 값 그대로('true'/'false'/null) */
export interface CompanyManage {
  companyId: number;
  loginSecureYn?: string | boolean | null;
  companyNm: string;
  locNm?: string | null;
  mailInfo?: string | null;
  emgrcyPasswd?: string | null;
  erpProductCd?: string | null;
  erpProductNm?: string | null;
  contType?: string | null;
  noticeDate?: string | null;
  closeDate?: string | null;
  icamCompanyCd?: string | null;
  icamAdvisCompanyCd?: string | null;
  assetYn?: string | boolean | null;
  advisYn?: string | boolean | null;
  pbsYn?: string | boolean | null;
  useYn?: string | boolean | null;
  note?: string | null;
  bizNo?: string | null;
}

/** 기본정보 탭 행 (GET /api/v1/sys/companies/{id}/basic, AS-IS Sys01_TabPage_Info02). 법인등록번호는 복호화한 값 */
export interface CompanyBasic {
  companyId: number;
  startDate?: string | null;
  bizNo?: string | null;
  decCorpRegNo?: string | null;
  empInfo?: string | null;
  mobileTelNo?: string | null;
  officeTelNo?: string | null;
  officeFaxNo?: string | null;
  emailAddr?: string | null;
  zipCd?: string | null;
  zipAddr?: string | null;
  zipDetail?: string | null;
}

/** 전자결재·내부통제 탭 행 (GET /api/v1/sys/companies/{id}/approval, AS-IS Sys01_TabPage_Info03). Y/N은 'true'/'false' */
export interface CompanyApproval {
  companyId: number;
  apprStepLockYn?: string | boolean | null;
  companyRepNm?: string | null;
  aprManagerInfoYn?: string | boolean | null;
  dcrNumberingCd?: string | null;
  dcrNumberingNm?: string | null;
  dcrDetailUseYn?: string | boolean | null;
  icsCheckCycleType?: string | null;
  icsCheckCycleNm?: string | null;
  icsComplyCycleType?: string | null;
  icsComplyCycleNm?: string | null;
  icsNonStayYn?: string | boolean | null;
  fltOnlyCurrYn?: string | boolean | null;
  icsGuideYn?: string | boolean | null;
}

/** 경영·회계 탭 행 (GET /api/v1/sys/companies/{id}/account, AS-IS Sys01_TabPage_Info04). Y/N은 'true'/'false' */
export interface CompanyAccount {
  companyId: number;
  leaveMonthCd?: string | null;
  leaveMonthNm?: string | null;
  leaveYn?: string | boolean | null;
  leaveCompulsionRt?: number | null;
  taxType?: string | null;
  taxTypeNm?: string | null;
  cardRealUserYn?: string | boolean | null;
  incomeTaxFilingCd?: string | null;
  incomeTaxFilingNm?: string | null;
  accountCloseMonth?: string | null;
  accountCloseMonthNm?: string | null;
  ownerCapitalApplyCd?: string | null;
  ownerCapitalApplyNm?: string | null;
  astManagerAutoYn?: string | boolean | null;
  astEvalCycleCd?: string | null;
  astEvalCycleNm?: string | null;
  empEvalCycleCd?: string | null;
  empEvalCycleNm?: string | null;
  empEvalMonthCd?: string | null;
  empEvalMonthNm?: string | null;
}

/** 공인IP (GET /api/v1/sys/companies/{id}/login-secures, AS-IS Sys29_LoginSecureModel) */
export interface LoginSecure {
  loginSecureId: number;
  companyId?: number;
  startDate?: string | null;
  closeDate?: string | null;
  publicIp?: string | null;
  note?: string | null;
}

/** 고객별 관리자 (GET /api/v1/sys/companies/{id}/users, AS-IS Sys02_UserModel) */
export interface AdminUser {
  userId: number;
  companyId?: number;
  korNm?: string | null;
  loginId?: string | null;
  decPasswd?: string | null;
  email?: string | null;
  tel1?: string | null;
  tel2?: string | null;
  note?: string | null;
  adminYn?: string | boolean | null;
}

/** 관리자별 메뉴 권한 트리 행 (GET /api/v1/sys/admin-users/{userId}/menus) — 전위 순서, depth로 들여쓰기 */
export interface AdminUserMenu {
  menuId: number;
  parentId: number;
  depth: number;
  menuNm: string;
  seq?: string | null;
  note?: string | null;
  adminUserMenuId?: number | null;
  /** 'true'/'false'/null(설정 없음) */
  useYn?: string | null;
}

/** 회사별 메뉴맵핑 트리 행 (GET /api/v1/sys/menus/companies/{companyId}) — 전위 순서, depth로 들여쓰기 */
export interface CompanyMenuNode {
  menuId: number;
  parentId: number;
  depth: number;
  menuNm: string;
  seq?: string | null;
  note?: string | null;
  companyMenuId?: number | null;
  /** sys03_use_yn: 'true'/'false'/null(연결 없음) */
  useYn?: string | null;
}

/** 권한그룹별 메뉴 맵핑 트리 행 (GET /api/v1/sys/roles/{roleId}/menus) — 전위 순서, depth로 들여쓰기 */
export interface RoleMenuNode {
  menuId: number;
  parentId: number;
  depth: number;
  /** 메뉴번호 + ' ' + 메뉴명 (번호 없으면 메뉴명) */
  menuNoPlusNm: string;
  /** 메뉴명(번호 없이) — A07 트리 */
  menuNm?: string;
  seq?: string | null;
  note?: string | null;
  roleMenuId?: number | null;
  /** sys07_use_yn: 'true'/'false'/null(연결 없음) */
  useYn?: string | null;
}

/** 메뉴별 그룹권한(View) 메뉴 트리 행 (GET /api/v1/sys/menus/view, AS-IS Sys06_MenuModel ← sys06_menu.selectByCompanyId) */
export interface MenuViewNode {
  menuId: number;
  /** 루트는 0 */
  parentId: number;
  depth: number;
  /** 메뉴번호 + ' ' + 메뉴명 (번호 없으면 메뉴명) */
  menuNoPlusNm: string;
}

/** 사원별 메뉴 트리 행 (GET /api/v1/sys/persons/{personId}/menus, C04) — 전위 순서, 루트는 parentId null·depth 0 */
export interface PersonMenuNode {
  menuId: number;
  parentId: number | null;
  depth: number;
  /** 메뉴번호 + ' ' + 메뉴명 (번호 없으면 메뉴명) */
  menuNoPlusNm: string;
}

/** 권한그룹별 메뉴권한 복사 (POST /api/v1/sys/role-menus/copy-role|copy-menu). inCompanyId = 출발지, companyIds = 목적지 */
export interface RoleMenuCopyReq {
  inCompanyId: number;
  roleName: string;
  menuId?: number;
  companyIds: number[];
}

/** 권한그룹별 사원 (GET /api/v1/sys/roles/{roleId}/user-roles, AS-IS Sys05_UserRoleModel) */
export interface UserRole {
  userRoleId: number;
  userId: number;
  roleId: number;
  authOrgId?: number | null;
  authOrgNm?: string | null;
  orgNm?: string | null;
  titleNm?: string | null;
  empNo?: string | null;
  korNm?: string | null;
  /** 사원 조직의 상위 전체명 (AS-IS "권한조직" 칸이 보여 주는 값) */
  parentFullNm?: string | null;
}

/** 사원별 권한그룹 (GET /api/v1/sys/persons/{userId}/roles, AS-IS Sys04_RoleModel ← sys04_role.selectByUserId) */
export interface PersonRole {
  roleId: number;
  roleNm?: string | null;
  seq?: string | null;
  note?: string | null;
  /** 'true' | 'false' (gb.boolean 편집) */
  userRoleYn: string;
  /** 연결이 있을 때만 — 해제 저장 때 삭제 키 */
  userRoleId?: number | null;
}

// ── A09 메뉴 관리 (Sys06_Tab_Menu) ──

/** 메뉴 관리 트리 행 (AS-IS Sys06_MenuModel). 전위 순서, Y/N은 'true'/'false' */
export interface MenuNode {
  menuId: number;
  parentId: number;
  depth: number;
  menuNm: string;
  seq?: string | null;
  note?: string | null;
  useYn: string;
  classNm?: string | null;
  menualUrl?: string | null;
  addTitleUseYn: string;
  mobiUseYn: string;
  mobiClassNm?: string | null;
  menuNo?: string | null;
}

/** 매뉴 편집 저장 (menuId 없으면 등록) */
export type MenuSaveReq = Omit<MenuNode, 'depth' | 'menuId'> & { menuId?: number };

/** 일괄복사 매뉴 목록 (getAllMenuList) */
export interface MenuCopy {
  menuId: number;
  parentPathNm?: string | null;
  menuNoPlusNm?: string | null;
}

/** 일괄복사 고객사 목록 (selectByCopyList) */
export interface CompanyCopy {
  companyId: number;
  companyNm: string;
  erpProductCd?: string | null;
  assetYn?: string | null;
  advisYn?: string | null;
  icamCompanyCd?: string | null;
}

/** 메뉴를 쓰는 회사 (Sys01_Grid_CompanyMenu, selectByCode). 같은 회사가 두 줄일 수 있어 화면 행 ID = companyId + companyMenuId */
export interface CompanyMenuYn extends CompanyCopy {
  menuYn: string;
  companyMenuId?: number | null;
}

/** 코드구분 한 행 (A13, AS-IS Sys08_CodeKindModel). sysYn은 DB 값 그대로('true'/'false') — 시스템 체크박스 */
export interface CodeKind {
  codeKindId: number;
  kindCd: string;
  kindNm: string;
  sysYn: string;
  note?: string | null;
}

/** 코드 관리 한 행 (A13, AS-IS Sys09_CodeModel). 날짜는 'yyyy-MM-dd', closeYn은 'true'/'false' */
export interface CodeAdmin {
  codeId: number;
  codeKindId: number;
  companyId: number;
  code: string;
  name: string;
  seq?: string | null;
  closeYn?: string | null;
  applyDate?: string | null;
  closeDate?: string | null;
  note?: string | null;
  lastDate?: string | null;
}

/** 코드 그룹 한 행 (A13, AS-IS Sys13_CodeGroupModel). codeId 0 = 그룹 헤더, 아니면 소속 코드(code·name) */
export interface CodeGroup {
  codeGroupId: number;
  kindGroupCd: string;
  kindGroupNm: string;
  codeKindId: number;
  codeId: number;
  code?: string | null;
  name?: string | null;
}

/** 특정화면 사용요청 한 행 (A27, AS-IS Sys53_SpecificMenuRequestModel). specificMenuRequestId ≤ 0 = 새 행. 날짜는 'YYYY-MM-DD' */
export interface SpecificMenuRequest {
  specificMenuRequestId: number;
  companyId?: number | null;
  personId?: number | null;
  personNm?: string | null;
  regDate?: string | null;
  stateCd?: string | null;
  stateNm?: string | null;
  specificWorkCd?: string | null;
  specificWorkNm?: string | null;
  apprId?: number | null;
  /** 결재문서 상태 코드 (AprStatusCode: 10·20·30 진행중, 40·99 종결) */
  aprStatusCd?: string | null;
  aprStatusNm?: string | null;
  confirmNm?: string | null;
}

/** 고객별 특정화면 관리 한 행 (A28, AS-IS Sys53_SpecificMenuRequestModel 관리자 조회). 날짜는 'YYYY-MM-DD' */
export interface SpecificMenuRequestAdmin extends SpecificMenuRequest {
  companyNm?: string | null;
  confirmDate?: string | null;
}

/** 특정매뉴 권한 한 행 (A15-4, AS-IS Sys50_SpecificMenuModel). specificMenuId ≤ 0 = 새 행 */
export interface SpecificMenu {
  specificMenuId: number;
  companyId?: number;
  specificWorkCd?: string | null;
  specificWorkNm?: string | null;
  menuId?: number | null;
  menuNm?: string | null;
  note?: string | null;
}

/** 특정매뉴 사원권한 한 행 (A15-4, AS-IS Sys51_SpecificMenuPersonModel). useYn은 'true'/'false' */
export interface SpecificMenuPerson {
  specificMenuPersonId: number;
  specificMenuId?: number;
  personId?: number;
  personNm?: string | null;
  useYn?: string | null;
  note?: string | null;
  specificWorkCd?: string | null;
}

/** 특정매뉴 문서권한(Link) 한 행 (A15-4, AS-IS Sys52_SpecificMenuLinkModel) */
export interface SpecificMenuLink {
  specificMenuLinkId: number;
  companyId?: number;
  specificWorkCd?: string | null;
  linkCd?: string | null;
  linkNm?: string | null;
  note?: string | null;
}

/** 특정매뉴 요청이력 한 행 (A15-4, AS-IS Sys54_SpecificMenuHistoryModel). 날짜는 'yyyy-MM-dd' */
export interface SpecificMenuHistory {
  specificMenuHistoryId: number;
  companyId?: number;
  regDate?: string | null;
  confirmDate?: string | null;
  confirmNm?: string | null;
  note?: string | null;
  fileNm?: string | null;
  noteYnStr?: string | null;
}

/** 첨부 파일 한 행 (B10, AS-IS Sys10_FileModel / sys10_file). regDate는 ISO 일시 */
export interface FileInfo {
  fileId: number;
  parentId: number;
  fileNm: string;
  regDate?: string | null;
  size?: number | null;
  note?: string | null;
  fileExt?: string | null;
  fileYn?: string | null;
  titleYn?: string | null;
  seq?: string | null;
  /** 미사용 파일조회(A17)만: 서버 저장 폴더 */
  serverPath?: string | null;
}

/** AS-IS sys.Sys10_File.selectByParentId2 (Act80_LookupGrid_RelateFile, W05) — 파일 한 행 + 잠김(정산·결의서에서 따라온 파일이라 지울 수 없음) */
export interface FileLock extends FileInfo {
  lockYn: boolean;
}

/** 개선사항 및 오류 통보 한 행 (A30, AS-IS Sys90_AfterServiceModel / sys90_after_service). 날짜는 'YYYY-MM-DD', confirmYn은 'true'/'false' */
export interface AfterService {
  afterServiceId: number;
  companyId?: number | null;
  companyNm?: string | null;
  happenDate?: string | null;
  regEmpNm?: string | null;
  typeYn?: string | null;
  afterServiceNm?: string | null;
  happenReason?: string | null;
  organizeHappenReason?: string | null;
  happenRemedy?: string | null;
  stateCd?: string | null;
  afterStateNm?: string | null;
  worker?: string | null;
  dueDate?: string | null;
  remarks?: string | null;
  confirmYn?: string | null;
}

/** 로그인 Mac 주소 신청 한 행 (A21, AS-IS Sys27_LoginManageModel / sys27_login_manage). 일시는 'YYYY-MM-DD HH24:MI:SS', confirmYn은 'true'/'false' */
export interface LoginManage {
  loginManageId: number;
  companyId: number;
  personId: number;
  companyNm?: string | null;
  personNm?: string | null;
  openDateString?: string | null;
  placeCd?: string | null;
  placeNm?: string | null;
  macAddress?: string | null;
  reason?: string | null;
  confirmYn?: string | null;
  confirmDateString?: string | null;
}

/** 로그인 내역 한 행 (A20, AS-IS Sys26_LoginModel / sys26_login). 일시는 'YYYY-MM-DD HH24:MI:SS' */
export interface LoginHistory {
  loginId: number;
  openDateString?: string | null;
  companyNm?: string | null;
  personNm?: string | null;
  statusNm?: string | null;
  loginModeNm?: string | null;
  ipAddress?: string | null;
  os?: string | null;
  browser?: string | null;
}

/** 매뉴찾기 조회창 한 행 (A15-4, AS-IS Sys06_Lookup_SelectMulti → Sys06_MenuModel) */
export interface MenuLookup {
  menuId: number;
  parentPathNm: string;
  menuNm: string;
  menuFullNm: string;
  /** sys06_class_nm (A35 열람 로그 조회 조건) */
  className?: string | null;
}

/** 고객별 서버사용량 한 행 (A16, AS-IS Sys10_FileModel — selectByTotalSize). 용량은 MB */
export interface FileTotal {
  fileId: number;
  companyNm: string;
  locNm: string;
  totalSize: number | null;
  runningTotalSize: number | null;
}

/** 서브도메인의 연도별 사용용량 (A16, selectByTotalSizeYear) */
export interface FileTotalYear {
  fileId: number;
  year: string;
  totalSize: number | null;
}

/** 서브도메인·연도의 월별 사용용량 (A16, selectByTotalSizeMonth) */
export interface FileTotalMonth {
  fileId: number;
  month: string;
  totalSize: number | null;
}

/** 고객사 정보 한 행 (C06, AS-IS Sys85_ClientInfoModel — 문자발송 기타고객사). moblieTelno는 원본 모델 이름(오타) 그대로. 새 행은 임시 음수 ID */
export interface ClientInfo {
  clientInfoId: number;
  companyName: string | null;
  orgName: string | null;
  posName: string | null;
  clientName: string | null;
  moblieTelno: string | null;
}

/** 고객별 매뉴 열람 로그 한 행 (A35, AS-IS Sys96_OpenMenuLogModel). openMenuLogId는 18자리라 문자열 */
export interface OpenMenuLog {
  openMenuLogId: string;
  companyNm?: string | null;
  personInfo?: string | null;
  menuNm?: string | null;
  className?: string | null;
  dateStr?: string | null;
  second?: number | null;
  loginInfo?: string | null;
}

/** Admin 사용자 한 행 (A22, AS-IS Sys80_AdminUserListModel). 새 행은 임시 음수 ID */
export interface AdminUserList {
  adminUserListId: number;
  userPhone: string | null;
  userName: string | null;
  note: string | null;
}

/** Admin 로그인내역 한 행 (A23, AS-IS Sys81_AdminUserHistoryModel). regDate 'YYYY-MM-DD', regTime 'HH:mm' */
export interface AdminUserHistory {
  adminUserHistoryId: number;
  regDate: string | null;
  regTime: string | null;
  user: string | null;
  smsContent: string | null;
}

/** 화면안내 한 행 (A12, AS-IS Sys06_MenuModel 중 화면안내 열). menuFullName = 1차 > 2차 > 3차 메뉴 경로 */
export interface MenuGuide {
  menuId: number;
  menuFullName: string | null;
  menuName: string | null;
  note: string | null;
}

/** 일자 한 행 (A18, AS-IS Sys12_CalendarModel). day 'YYYY-MM-DD', workingYn 'true'/'false'(영업일 체크박스), companyName은 고객사반영 조회창만 */
export interface Calendar {
  calendarId: number;
  companyId: number;
  companyName?: string | null;
  day: string;
  weekday: string;
  workingYn: string;
  offReason: string | null;
  note: string | null;
}

/** 휴일 한 행 (A18, AS-IS Sys14_HolidayModel). day 'YYYY-MM-DD'. 새 행은 임시 음수 ID */
export interface Holiday {
  holidayId: number;
  companyId: number;
  day: string | null;
  holidayName: string | null;
  note: string | null;
}

/** 비밀번호 초기화 대상 사원 한 행 (A19, AS-IS Emp03_TransModel 중 화면 열). lockYn 'true'/'false' */
export interface PasswordPerson {
  personId: number;
  empNo: string | null;
  orgName: string | null;
  empKorName: string | null;
  lockYn: string | null;
}

/** 접속 중인 사원 한 행 (A24, AS-IS Emp01_PersonModel 중 화면 열) */
export interface WebsocketPerson {
  personId: number;
  companyName: string | null;
  korName: string | null;
  empNo: string | null;
  posName: string | null;
  officeTelno: string | null;
  mobileTelno: string | null;
}

/** 알림 전송·강제 로그아웃 결과: 처리한(접속 중이던) 사원 수와 오프라인이라 건너뛴 사원 이름 */
export interface WebsocketResult {
  processed: number;
  offlineNames: string[];
}

/** 거래처 한 행 (A25, AS-IS Sys15_CorpModel). useYn 'true'/'false'. 새 행은 임시 음수 ID */
export interface Corp {
  corpId: number;
  companyId: number | null;
  corpType: string | null;
  corpTypeName: string | null;
  corpName: string | null;
  bizNo: string | null;
  corpCode: string | null;
  seq: number | null;
  useYn: string | null;
  note: string | null;
  tel: string | null;
  addr: string | null;
  issCorpCode: string | null;
  corpAccountCnt: string | null;
}

/** 거래처 계좌 한 행 (A25, AS-IS Sys17_CorpAccountModel). mainAccountYn 'true'/'false'. 새 행은 임시 음수 ID */
export interface CorpAccount {
  corpAccountId: number;
  corpId: number;
  bankCode: string | null;
  bankName: string | null;
  accountNoDec: string | null;
  accountName: string | null;
  mainAccountYn: string | null;
}

/** 연차휴가 결산기준 왼쪽 그리드 한 행 (A26, AS-IS Sys01_CompanyModel 중 휴가 열). leaveYn 'true'/'false'(없으면 null) */
export interface LeaveSetting {
  companyId: number;
  leaveYn: string | null;
  leaveMonthCode: string | null;
  leaveMonthName: string | null;
}

/** 근속연수별 연차개수 한 행 (A26, AS-IS Sys30_LeaveYearModel). 새 행은 임시 음수 ID */
export interface LeaveYear {
  leaveYearId: number;
  companyId: number | null;
  year: string | null;
  leaveDays: string | null;
}


/** 파일보안정책 한 행 (A36, AS-IS Sys60_FilePolicyModel). 새 행은 임시 음수 ID */
export interface FilePolicy {
  filePolicyId: number;
  ext: string | null;
  mimeType: string | null;
  note: string | null;
}

/** AssetERP 자문위원 한 행 (A31, AS-IS Sys91_AdviceMemberModel). 새 행은 임시 음수 ID, companyId는 신규일 때 1 */
export interface AdviceMember {
  adviceMemberId: number;
  companyId: number | null;
  field: string | null;
  companyNm: string | null;
  memberNm: string | null;
  career: string | null;
  homepage: string | null;
  telno: string | null;
  email: string | null;
  address: string | null;
  note: string | null;
}

/** AssetERP 관리팀 한 행 (A32, AS-IS Sys92_ManagementTeamModel). 새 행은 임시 음수 ID, companyId는 신규일 때 1. 사원 정보(성명·직위·내선·이메일)는 조회로만 온다 */
export interface ManagementTeam {
  managementTeamId: number;
  companyId: number | null;
  personId: number | null;
  personNm: string | null;
  posNm: string | null;
  officeTelNo: string | null;
  emailAddr: string | null;
  chargePart: string | null;
  workYear: string | null;
  mainCareer: string | null;
  note?: string | null;
}

/** AssetERP 매뉴얼 한 건 (A33, AS-IS Sys95_ManualModel). regDate는 YYYY-MM-DD */
export interface Manual {
  manualId: number;
  regDate: string;
  manualType?: string | null;
  manualTypeNm?: string | null;
  fileId: number;
  fileNm: string;
  fileExt?: string | null;
  /** 공개 체크박스 (A34 관리 그리드). 'true'/'false' */
  publicYn?: string | null;
  note?: string | null;
}

/** 화면 찾기 한 행 (AS-IS Sys06_MenuModel, Sys06_Lookup_SearchMenu). bookmark는 이 사용자의 북마크 ID — 관리자용 조회에는 bookmark·parentPathNm이 없다 */
export interface MenuSearch {
  menuId: number;
  bookmark?: number | null;
  parentPathNm?: string | null;
  menuNm: string;
  menuNo?: string | null;
  note?: string | null;
  className?: string | null;
  menuFullNm?: string | null;
}

/** 북마크 한 행 (AS-IS Sys40_BookmarkModel, Sys40_Lookup_Bookmark) */
export interface Bookmark {
  bookmarkId: number;
  companyId?: number | null;
  personId?: number | null;
  menuId?: number | null;
  menuNm?: string | null;
  parentTitleNm?: string | null;
  seq?: string | null;
}

/** S06 휴가기준관리 한 행 (Sys31_LeaveCompanyModel). 저장된 행이 없는 기준은 임시 번호가 ID */
export interface LeaveCompany {
  leaveCompanyId: number;
  leaveCode: string;
  leaveName: string | null;
  spcLeaveCode: string | null;
  spcLeaveName: string | null;
  days: number | null;
  calcCode: string | null;
  calcName: string | null;
  unUseYn: boolean;
  note: string | null;
}
