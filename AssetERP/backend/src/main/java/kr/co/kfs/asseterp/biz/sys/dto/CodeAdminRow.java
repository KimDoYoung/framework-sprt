package kr.co.kfs.asseterp.biz.sys.dto;

import java.time.LocalDate;

/** sys09_code 저장용 (회사는 서버가 정한 값) */
public record CodeAdminRow(Long codeId, Long codeKindId, Long companyId, String code, String name, String seq,
                           String closeYn, LocalDate applyDate, LocalDate closeDate, String note) {
}
