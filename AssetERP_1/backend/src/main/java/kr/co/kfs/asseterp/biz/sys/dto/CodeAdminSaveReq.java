package kr.co.kfs.asseterp.biz.sys.dto;

import java.time.LocalDate;

/** 코드 저장 한 행 (codeId가 null/0 이하면 신규). 화면이 바꾸는 컬럼: 코드·코드명·조회순서·미사용·시작/종료일자·상세설명 */
public record CodeAdminSaveReq(Long codeId, Long codeKindId, Long companyId, String code, String name, String seq,
                               String closeYn, LocalDate applyDate, LocalDate closeDate, String note) {
}
