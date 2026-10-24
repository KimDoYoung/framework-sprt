package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/** 인사정보(인사변동사항 반영정보) 한 행 (AS-IS tdm02_hr_record.selectByCompanyId, Tdm02_HrRecordModel) */
public record HrRecordRes(
        Long hrRecordId,
        LocalDate regDate,
        String regTypeNm,
        String personNm,
        String changeData,
        /** 0 미적용 / 1 적용완료 / 9 해당없음 */
        String applyCode,
        String note,
        String updNm,
        String updDateStr) {
}
