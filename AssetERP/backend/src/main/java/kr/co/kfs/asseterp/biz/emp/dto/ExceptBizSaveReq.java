package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** Emp33_Lookup_ExceptBiz 저장 (AS-IS emp.Emp33_ExceptBiz.update): exceptBizId가 없거나 ≤ 0 이면 새 행. 회사는 서버가 로그인 회사로 채운다 */
public record ExceptBizSaveReq(Long exceptBizId, Long personId, String exceptBizCode, LocalDate startDate, LocalDate closeDate,
                               String reason, String unvisibleYn) {
}
