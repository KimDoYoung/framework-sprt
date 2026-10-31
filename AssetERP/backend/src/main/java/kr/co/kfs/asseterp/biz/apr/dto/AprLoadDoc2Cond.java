package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

public record AprLoadDoc2Cond(Long companyId, Long orgId, Long empId, Long classTreeId, LocalDate regDate, LocalDate endRegDate, String searchText) {
}
