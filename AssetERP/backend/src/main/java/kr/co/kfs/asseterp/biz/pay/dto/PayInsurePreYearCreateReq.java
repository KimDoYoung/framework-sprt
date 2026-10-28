package kr.co.kfs.asseterp.biz.pay.dto;

/** 전년도분 보수총액 등록 창의 [생성] — AS-IS pay.Pay31_InsureApply.insert3. 전체생성이면 personId 없음 */
public record PayInsurePreYearCreateReq(
        Long personId,
        boolean allYn,
        String year
) {
}
