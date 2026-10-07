package kr.co.kfs.asseterp.biz.sys.dto;

/** AS-IS selectByName 파라미터: roleName은 '%입력값%' */
public record RoleSearchParam(
        Long companyId,
        String roleName
) {
}
