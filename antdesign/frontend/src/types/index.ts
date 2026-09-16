export interface MenuItem {
  code: string;
  title: string;
  group?: string;
  badge?: string;
}

export interface MenuGroup {
  groupCode: string;
  groupTitle: string;
  items: MenuItem[];
}

export interface FirstLevelMenu {
  id: string;
  title: string;
  iconName: string;
  groups: MenuGroup[];
}

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
