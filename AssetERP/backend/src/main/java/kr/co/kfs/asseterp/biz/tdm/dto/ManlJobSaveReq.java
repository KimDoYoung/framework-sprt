package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/** 매뉴얼 작업대상 저장 한 행 (AS-IS tdm.Tdm40_ManlJob.update 가 바꾸는 열, N15). manlJobId ≤ 0이면 등록 */
public record ManlJobSaveReq(Long manlJobId, LocalDate regDate, String jobName, LocalDate manlApplyStartDate,
                             Long roleId, Long orgId, String jobReason, LocalDate startDate, LocalDate endDate) {
}
