package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/** 책무배분일 한 건의 회사·임원·책무배분일 (책무기술서 미리보기·tdm35 재생성이 쓴다) */
public record RoleAllcDetailKey(
        Long companyId,
        Long personId,
        LocalDate roleAllcDate) {
}
