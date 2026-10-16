package kr.co.kfs.asseterp.biz.sys.dto;

/** 권한그룹 저장 행. roleId가 0 이하(화면의 임시 행)면 등록, 아니면 수정 */
public record RoleSaveReq(
        Long roleId,
        String roleNm,
        String seq,
        String note
) {
}
