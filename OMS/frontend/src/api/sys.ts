import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { MenuLevel_1 } from '../types';

/** GET /api/v1/sys/menus 응답 (1차 메뉴에는 아이콘이 없다 - sys06_menu에 아이콘 컬럼이 없음) */
type MenuLevel_1Res = Omit<MenuLevel_1, 'iconName'>;

// 1차 메뉴 아이콘: DB에 없으므로 순서대로 돌려 쓴다 (LeftMenuBar.renderIcon이 아는 이름)
const LEVEL_1_ICONS = [
  'FileTextOutlined',
  'AuditOutlined',
  'SafetyCertificateOutlined',
  'CalendarOutlined',
  'IdcardOutlined',
  'FormOutlined',
  'TeamOutlined',
  'AppstoreOutlined',
];

export const sysApi = {
  /** 로그인 사용자의 메뉴 트리 (회사관리자: 회사 메뉴 전체, 사원: 권한그룹 메뉴) */
  getMenus: async (): Promise<MenuLevel_1[]> => {
    const res = await apiClient.get<ApiResponse<MenuLevel_1Res[]>>('v1/sys/menus');
    return (res.data.data ?? []).map((m, i) => ({ ...m, iconName: LEVEL_1_ICONS[i % LEVEL_1_ICONS.length] }));
  },
};
