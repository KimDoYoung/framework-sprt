package kr.co.kfs.asseterp.biz.sch.dto;

import java.time.LocalDate;

/** 작성그룹의 공유 한 행 (AS-IS Sch02_ShareModel, sch02_share.selectByInfoId2): 구분(직원/부서)·작성부서·작성자·적용기간 */
public record Sch02ShareRes(Long shareId, Long infoId, String shareCode, String shareName, Long personId, String personName,
                            Long orgId, String orgName, Long companyId, LocalDate startDate, LocalDate closeDate) {
}
