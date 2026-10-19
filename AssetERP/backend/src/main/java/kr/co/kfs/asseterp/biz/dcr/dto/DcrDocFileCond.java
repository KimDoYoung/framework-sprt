package kr.co.kfs.asseterp.biz.dcr.dto;

import java.time.LocalDate;

/**
 * dcr00_doc_list.getFile 조건 (F08 문서별 첨부파일 검색). admin은 'true'/'false' 문자열(AS-IS LoginUser.getIsManager()),
 * searchText는 LIKE 패턴, typeCode는 분류 트리 범위('%' = 문서구분 포함)
 */
public record DcrDocFileCond(Long companyId, Long classTreeId, Long orgId, Long empId, String admin, LocalDate startDate, LocalDate endDate,
                             String searchText, String typeCode) {
}
