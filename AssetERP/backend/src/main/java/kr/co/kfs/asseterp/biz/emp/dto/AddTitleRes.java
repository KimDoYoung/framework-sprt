package kr.co.kfs.asseterp.biz.emp.dto;

/** 겸직발령 행 (AS-IS Emp04_AddTitleModel — emp04 + 겸직사원 emp03_trans) */
public record AddTitleRes(
        Long addTitleId,
        Long personId,
        Long addPersonId,
        Long orgCodeId,
        String startDate,
        String closeDate,
        String orgNm,
        String titleCd,
        String titleNm,
        String transReason,
        String empNo,
        /* transModel.* (@Path) */
        Long transPersonId,
        String posCd,
        String posNm,
        String orgHeadYn
) {}
