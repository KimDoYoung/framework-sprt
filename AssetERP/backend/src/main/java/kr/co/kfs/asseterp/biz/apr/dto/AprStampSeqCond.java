package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** AS-IS apr01_appr.selectByApprDate 조건 (G06 Apr01_Tab_StampSeq). stampId가 null이면 모든 인감 (AS-IS 서버가 0을 null로 바꿈) */
public record AprStampSeqCond(Long companyId, LocalDate startDate, LocalDate endDate, Long stampId) {
}
