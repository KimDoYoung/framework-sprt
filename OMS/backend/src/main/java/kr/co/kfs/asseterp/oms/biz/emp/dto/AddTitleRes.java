package kr.co.kfs.asseterp.oms.biz.emp.dto;

import java.time.LocalDate;

/**
 * 겸직발령 (AS-IS Emp04_AddTitleModel, emp04_add_title.selectByPersonId). 겸직마다 파생 사원(addPersonId, 사번-PTn)과 겸직 발령(800)이 있다
 *
 * @param empNo 파생 사원 사번
 */
public record AddTitleRes(
        Long addTitleId,
        Long personId,
        Long addPersonId,
        String empNo,
        LocalDate startDate,
        LocalDate closeDate,
        Long orgCodeId,
        String orgNm,
        String titleCd,
        String titleNm,
        String posCd,
        String posNm,
        boolean orgHeadYn,
        String transReason
) {
}
