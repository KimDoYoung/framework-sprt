// ── Menu Hierarchy Types ──
export interface MenuLevel_3 {
  code: string;
  title: string;
  group?: string;
  badge?: string;
}

export interface MenuLevel_2 {
  groupCode: string;
  groupTitle: string;
  items: MenuLevel_3[];
}

export interface MenuLevel_1 {
  id: string;
  title: string;
  iconName: string;
  groups: MenuLevel_2[];
}

// Backward-compatible aliases
export type MenuItem = MenuLevel_3;
export type MenuGroup = MenuLevel_2;
export type FirstLevelMenu = MenuLevel_1;

export interface EmployeeStatus {
  id: string;
  name: string;
  position: string;
  status: 'online' | 'busy' | 'away' | 'offline';
  dept?: string;
}

export interface ScheduleItem {
  id: string;
  category: string;
  title: string;
  registrant: string;
  dueDate: string;
  processedDate: string;
  detail: string;
}

export interface DayListItem {
  id: string;
  workType: string;
  regDueDate: string;
  title: string;
  completedDate: string;
  manager: string;
  detail: string;
}

export interface ApprovalItem {
  id: string;
  status: string;
  regDate: string;
  title: string;
  applicant: string;
  detail: string;
}

export interface ComplianceItem {
  id: string;
  category: string;
  dueDate: string;
  title: string;
  detail: string;
}

export interface LargeAssetItem {
  id: number;
  assetNo: string;
  name: string;
  category: string;
  dept: string;
  manager: string;
  status: '정상' | '수리중' | '폐기예정' | '대여중';
  acquireDate: string;
  price: number;
  location: string;
  complianceChecked: boolean;
}

// ── 1101 일반기안서 작성 타입 ──
export interface DraftDocItem {
  id: string;
  docNo: string;
  draftDate: string;
  category: string;
  title: string;
  dept: string;
  drafter: string;
  status: '임시저장' | '결재대기' | '진행중' | '승인완료' | '반려';
  approvalDate: string;
  isUrgent: boolean;
  retentionPeriod: string;
  content?: string;
}

// ── 1102 비용품의서 작성 타입 ──
export interface ExpenseDocItem {
  id: string;
  expenseDate: string;
  accountName: string;
  description: string;
  merchant: string;
  supplyAmount: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: '법인카드' | '세금계산서' | '개인카드' | '현금영수증';
  evidenceStatus: '첨부완료' | '미첨부';
  dept: string;
  isDirty?: boolean;
}

// ── 1103 자산취득품의서 마스터/디테일 타입 ──
export interface AssetAcqMasterItem {
  id: string;
  docNo: string;
  reqDate: string;
  title: string;
  dept: string;
  requester: string;
  totalBudget: number;
  itemCount: number;
  status: '작성중' | '결재대기' | '승인완료' | '집행완료';
}

export interface AssetAcqDetailItem {
  id: string;
  masterId: string;
  assetCode: string;
  category: string;
  name: string;
  spec: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  location: string;
  targetUser: string;
  note?: string;
}

