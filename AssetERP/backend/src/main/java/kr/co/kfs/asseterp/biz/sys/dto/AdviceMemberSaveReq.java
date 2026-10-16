package kr.co.kfs.asseterp.biz.sys.dto;

/** 자문위원 저장 열 (AS-IS update). adviceMemberId ≤ 0이면 신규, companyId는 신규일 때만 쓴다(AS-IS insertRow가 1을 넣음) */
public record AdviceMemberSaveReq(
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
