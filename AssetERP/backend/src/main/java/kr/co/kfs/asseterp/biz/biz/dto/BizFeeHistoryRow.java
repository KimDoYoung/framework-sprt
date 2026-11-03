package kr.co.kfs.asseterp.biz.biz.dto;

/** biz11_cont_history.selectByStartDate·selectByDate — 구간 시작일에 유효한 계약 이력과 보수정보 (자료생성 내부용) */
public record BizFeeHistoryRow(
        String contStatusCd,
        String minFeeYn,
        Long manageMinFee,
        Long advMinFee,
        Long discrMinFee,
        String withYn,
        Long withFee
) {
}
