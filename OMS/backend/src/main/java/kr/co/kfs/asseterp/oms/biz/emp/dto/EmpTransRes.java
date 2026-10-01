package kr.co.kfs.asseterp.oms.biz.emp.dto;

import java.time.LocalDate;

/** 사원 발령 (AS-IS Emp03_TransModel, emp03_trans.selectByPersonId) */
public record EmpTransRes(
        Long transId,
        Long personId,
        LocalDate transDate,
        String transCd,
        String transNm,
        String kindCd,
        String kindNm,
        Long orgCodeId,
        String orgNm,
        String titleCd,
        String titleNm,
        String posCd,
        String posNm,
        String gradeCd,
        String gradeNm,
        String transReason,
        boolean orgHeadYn
) {
}
