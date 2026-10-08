package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 일반발령 저장 행. transId가 0 이하(화면의 임시 행)면 등록, 아니면 수정 */
public record TransSaveReq(
        Long transId,
        Long personId,
        LocalDate transDate,
        String transCd,
        String kindCd,
        Long orgCodeId,
        String titleCd,
        String posCd,
        String duty,
        LocalDate expiryDate,
        String transReason
) {
}
