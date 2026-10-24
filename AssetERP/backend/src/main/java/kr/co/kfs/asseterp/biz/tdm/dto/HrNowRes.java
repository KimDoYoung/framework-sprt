package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/** 현재 인사 상태 (AS-IS emp00_trans_info.selectGetPersonByPersonId → Emp00_TransInfoModel) */
public record HrNowRes(
        Long personId,
        String korName,
        String empNo,
        String posCode,
        String posName,
        String titleCode,
        String titleName,
        LocalDate hireDate,
        LocalDate retireDate,
        LocalDate transDate,
        Long orgCodeId,
        String orgCodeName,
        String orgHeadName
) {
}
