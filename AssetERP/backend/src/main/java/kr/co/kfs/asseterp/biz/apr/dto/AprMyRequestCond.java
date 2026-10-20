package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** AS-IS apr01_appr.selectByRequestEmpId 조건 (G02 Apr01_Tab_MyRequestList). status '%'가 전체, aprYn 'true'/'false', searchText는 %…% */
public record AprMyRequestCond(Long companyId, Long regEmpId, LocalDate startDate, LocalDate closeDate, String status, String aprYn,
                               String searchText, Long classTreeId, String typeCode) {
}
