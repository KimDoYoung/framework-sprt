package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** 문서작성 목록 조회 조건 (AS-IS gridToolBar.addParam 묶음). LIKE 글자(%…%)는 서비스가 만든다 */
public record AprDcrWriteCond(Long companyId, Long personId, LocalDate startDate, LocalDate closeDate, String typeCode,
                              String searchText, String receiveName, Long classTreeId, long limit, long offset) {
}
