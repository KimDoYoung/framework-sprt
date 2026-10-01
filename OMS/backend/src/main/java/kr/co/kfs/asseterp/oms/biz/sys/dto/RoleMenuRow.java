package kr.co.kfs.asseterp.oms.biz.sys.dto;

/** sys07_role_menu INSERT/UPDATE 파라미터 (useYn: 'true'/'false') */
public record RoleMenuRow(Long roleMenuId, Long roleId, Long menuId, String useYn) {
}
