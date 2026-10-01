package kr.co.kfs.asseterp.oms.biz.emp.dto;

import java.time.LocalDate;

/** 발령 저장 행 (일반발령 탭). transId가 없거나 0 이하면 신규 */
public record EmpTransSaveReq(Long transId, Long personId, LocalDate transDate, String transCd, String kindCd, Long orgCodeId,
                              String titleCd, String posCd, String transReason, boolean orgHeadYn) {

    public boolean isNew() {
        return transId == null || transId <= 0;
    }
}
