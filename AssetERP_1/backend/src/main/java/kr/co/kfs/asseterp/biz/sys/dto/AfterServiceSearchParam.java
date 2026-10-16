package kr.co.kfs.asseterp.biz.sys.dto;

import java.time.LocalDate;

/** 개선사항 및 오류 통보 관리자 조회 조건 (AS-IS retrieve() L188-241 — 문자열은 LIKE 패턴으로 만들어 넘긴다) */
public record AfterServiceSearchParam(
        LocalDate happenStartDate,
        LocalDate happenEndDate,
        String companyText,
        String typeYn,
        String stateCd,
        String confirmYn,
        String searchText
) {
}
