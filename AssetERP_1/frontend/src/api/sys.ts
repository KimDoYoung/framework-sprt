import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { MenuLevel_1 } from '../types';
import { Role } from '../types/sys';

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

/** 프레임 메뉴(B06) + 화면 API(A 작업마다 추가) */
export const sysApi = {
  /** 로그인 사용자의 메뉴 트리 (회사관리자: 회사 메뉴 전체, 사원: 권한그룹 메뉴) */
  getMenus: async (): Promise<MenuLevel_1[]> => {
    const res = await apiClient.get<ApiResponse<MenuLevel_1Res[]>>('v1/sys/menus');
    return (res.data.data ?? []).map((m, i) => ({ ...m, iconName: LEVEL_1_ICONS[i % LEVEL_1_ICONS.length] }));
  },

  // ── A01 권한그룹 관리 (Sys04_Tab_Role) ──

  /** AS-IS sys.Sys04_Role.selectByName: 권한명 LIKE + 로그인 회사 */
  searchRoles: async (roleNm?: string): Promise<Role[]> => {
    const res = await apiClient.get<ApiResponse<Role[]>>('v1/sys/roles', { params: { roleNm } });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys04_Role.update: 추가·변경 행 → 저장된 행(요청 순서) */
  updateRoles: async (rows: Role[]): Promise<Role[]> => {
    const body = rows.map(({ roleId, roleNm, seq, note }) => ({ roleId, roleNm, seq, note }));
    const res = await apiClient.put<ApiResponse<Role[]>>('v1/sys/roles', body);
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys04_Role.delete → 지운 건수 */
  deleteRoles: async (roleIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/sys/roles', { data: roleIds });
    return res.data.data ?? 0;
  },
};
