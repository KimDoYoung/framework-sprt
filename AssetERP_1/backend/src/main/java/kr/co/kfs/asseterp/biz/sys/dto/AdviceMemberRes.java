package kr.co.kfs.asseterp.biz.sys.dto;

/** AssetERP 자문위원 한 행 (AS-IS Sys91_AdviceMemberModel / sys91_advice_member) */
public record AdviceMemberRes(
        Long adviceMemberId,
        Long companyId,
        String field,
        String companyNm,
        String memberNm,
        String career,
        String homepage,
        String telno,
        String email,
        String address,
        String note
) {
}
